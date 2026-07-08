import sys
import os
import json
import uuid
import threading
import queue
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pipeline import run_research_pipeline

app = FastAPI(title="DeepScout AI API Server")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store tasks
tasks = {}

# We want thread-safe/thread-local stdout redirection so that we only capture prints from our research thread
thread_local = threading.local()

class ThreadStdoutRedirector:
    def __init__(self, original_stdout):
        self.original_stdout = original_stdout

    def write(self, message):
        # Print to original stdout so console works normally
        self.original_stdout.write(message)
        # Check if this thread has a queue registered
        if hasattr(thread_local, "queue") and thread_local.queue:
            if message.strip():
                thread_local.queue.put(message.strip())

    def flush(self):
        self.original_stdout.flush()

    def __getattr__(self, name):
        return getattr(self.original_stdout, name)

# Redirect sys.stdout globally to our proxy, which delegates based on thread_local config
sys.stdout = ThreadStdoutRedirector(sys.stdout)

def run_pipeline_thread(topic, task_id, task_queue):
    # Register this queue in the thread local storage
    thread_local.queue = task_queue
    try:
        result = run_research_pipeline(topic)
        tasks[task_id]["result"] = result
        tasks[task_id]["status"] = "completed"
        task_queue.put("__DONE__")
    except Exception as e:
        tasks[task_id]["error"] = str(e)
        tasks[task_id]["status"] = "failed"
        task_queue.put(f"ERROR: {str(e)}")
        task_queue.put("__DONE__")

@app.post("/api/research")
def start_research(payload: dict):
    topic = payload.get("topic")
    if not topic:
        return {"error": "Topic is required"}, 400
    
    task_id = str(uuid.uuid4())
    task_queue = queue.Queue()
    tasks[task_id] = {
        "status": "running",
        "queue": task_queue,
        "result": None,
        "error": None
    }
    
    t = threading.Thread(target=run_pipeline_thread, args=(topic, task_id, task_queue))
    t.start()
    
    return {"task_id": task_id}

@app.get("/api/research/stream/{task_id}")
def stream_research(task_id: str):
    if task_id not in tasks:
        return StreamingResponse(iter(["event: error\ndata: Task not found\n\n"]), media_type="text/event-stream")
        
    task_info = tasks[task_id]
    q = task_info["queue"]
    
    def event_generator():
        while True:
            try:
                # Retrieve from queue.
                msg = q.get(timeout=1.0)
                if msg == "__DONE__":
                    if task_info["status"] == "completed":
                        yield f"event: complete\ndata: {json.dumps(task_info['result'])}\n\n"
                    else:
                        yield f"event: error\ndata: {json.dumps({'error': task_info['error']})}\n\n"
                    break
                yield f"event: log\ndata: {msg}\n\n"
            except queue.Empty:
                if task_info["status"] != "running":
                    break
                yield "event: heartbeat\ndata: ping\n\n"
                
    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
