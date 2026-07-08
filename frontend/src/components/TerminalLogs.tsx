import React, { useEffect, useRef } from 'react';
import { Terminal, Copy, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface TerminalLogsProps {
  logs: string[];
  onClear?: () => void;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ logs, onClear }) => {
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleCopyLogs = () => {
    const text = logs.join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Logs copied to clipboard');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-6 relative z-10">
      <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-black/80 backdrop-blur-xl">
        {/* Terminal Header */}
        <div className="bg-gray-950/80 px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            </div>
            <div className="flex items-center gap-1.5 ml-4 text-xs font-mono text-gray-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>deepscout-agent@system:~</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyLogs}
              className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white transition cursor-pointer"
              title="Copy Terminal Logs"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {onClear && (
              <button 
                onClick={onClear}
                className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-red-400 transition cursor-pointer"
                title="Clear Logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Terminal Screen */}
        <div className="p-5 font-mono text-xs md:text-sm text-emerald-400 h-64 overflow-y-auto flex flex-col gap-2.5 text-left leading-relaxed">
          {logs.length === 0 ? (
            <div className="text-gray-600">
              <span>&gt; System initialized. Waiting for task...</span>
              <span className="inline-block w-2 h-4 bg-emerald-400 ml-1.5 align-middle animate-blink"></span>
            </div>
          ) : (
            <>
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-emerald-600 select-none">&gt;</span>
                  <span className="break-all whitespace-pre-wrap">{log}</span>
                </div>
              ))}
              <div ref={terminalEndRef} className="flex items-center">
                <span className="text-emerald-600 select-none">&gt;</span>
                <span className="inline-block w-2 h-4 bg-emerald-400 ml-2.5 align-middle animate-blink"></span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
