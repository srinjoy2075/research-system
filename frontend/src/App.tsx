import { useState, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ResearchInput } from './components/ResearchInput';
import { Workflow } from './components/Workflow';
import { SourcesGrid } from './components/SourcesGrid';
import { ReportViewer } from './components/ReportViewer';
import { CriticCard } from './components/CriticCard';
import { Timeline } from './components/Timeline';
import { Footer } from './components/Footer';
import { startResearch, getStreamUrl } from './services/api';
import type { ResearchResponse } from './services/api';

type SystemStatus = 'idle' | 'searching' | 'reading' | 'writing' | 'critiquing' | 'completed' | 'failed';

function App() {
  const [status, setStatus] = useState<SystemStatus>('idle');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<ResearchResponse | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleStartResearch = async (searchTopic: string) => {
    setStatus('searching');
    setTopic(searchTopic);
    setResult(null);

    toast.loading('DeepScout agents started...', { id: 'research-toast' });

    try {
      // 1. Trigger research pipeline on backend
      const taskId = await startResearch(searchTopic);

      // 2. Open EventSource for live SSE streaming
      const streamUrl = getStreamUrl(taskId);
      const eventSource = new EventSource(streamUrl);

      eventSource.addEventListener('log', (event) => {
        const logMsg = event.data;

        // Dynamically adjust system status based on log triggers
        if (logMsg.toLowerCase().includes('search agent')) {
          setStatus('searching');
        } else if (logMsg.toLowerCase().includes('reader agent') || logMsg.toLowerCase().includes('scraping')) {
          setStatus('reading');
        } else if (logMsg.toLowerCase().includes('writer is drafting') || logMsg.toLowerCase().includes('writing')) {
          setStatus('writing');
        } else if (logMsg.toLowerCase().includes('critic is reviewing') || logMsg.toLowerCase().includes('reviewing')) {
          setStatus('critiquing');
        }
      });

      eventSource.addEventListener('complete', (event) => {
        try {
          const finalResult = JSON.parse(event.data) as ResearchResponse;
          setResult(finalResult);
          setStatus('completed');
          
          toast.success('Research completed!', { id: 'research-toast' });
          
          // Scroll to results beautifully
          setTimeout(() => {
            if (resultRef.current) {
              resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 400);
        } catch (err) {
          console.error('Failed to parse complete data', err);
          setStatus('failed');
          toast.error('Failed to parse research results.', { id: 'research-toast' });
        } finally {
          eventSource.close();
        }
      });

      eventSource.addEventListener('error', (event) => {
        console.error('EventSource connection error/failure', event);
        setStatus('failed');
        toast.error('Research pipeline failed.', { id: 'research-toast' });
        eventSource.close();
      });

    } catch (err: any) {
      console.error(err);
      setStatus('failed');
      const errMsg = err.response?.data?.error || err.message || 'Unknown network error';
      toast.error(`Connection failed: ${errMsg}`, { id: 'research-toast' });
    }
  };

  const isRunning = ['searching', 'reading', 'writing', 'critiquing'].includes(status);

  return (
    <div className="min-h-screen bg-bg-dark text-white relative">
      <Navbar status={status} />
      
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-mesh z-0"></div>
      <div className="absolute inset-0 grid-bg opacity-30 z-0"></div>

      <div className="relative z-10 pt-20 flex flex-col min-h-screen">
        <Hero onStartClick={focusInput} />

        <div className="w-full flex-grow">
          {/* Research Input */}
          <ResearchInput 
            onSubmit={handleStartResearch} 
            isLoading={isRunning} 
            inputRef={inputRef} 
          />

          {/* Stepper Timeline & Active workflow board */}
          {(status !== 'idle' || isRunning) && (
            <div className="fade-in">
              <Timeline currentStatus={status} />
              <Workflow currentStatus={status} />
            </div>
          )}

          {/* Output Results */}
          {status === 'completed' && result && (
            <div ref={resultRef} className="fade-in pt-8 border-t border-white/5 mt-12">
              <SourcesGrid searchResultsText={result.search_results} />
              <ReportViewer reportText={result.report} topic={topic} />
              <CriticCard feedbackText={result.feedback} />
            </div>
          )}
        </div>

        <Footer />
      </div>

      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#111827',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }
      }} />
    </div>
  );
}

export default App;
