import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResearchInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const ResearchInput: React.FC<ResearchInputProps> = ({ onSubmit, isLoading, inputRef }) => {
  const [topic, setTopic] = useState('');

  const examplePrompts = [
    'Future of Quantum Computing',
    'Open Source LLMs',
    'Climate Change Solutions',
    'Nvidia AI Strategy',
  ];

  const handleChipClick = (prompt: string) => {
    if (isLoading) return;
    setTopic(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onSubmit(topic.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-white/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What would you like to research today?"
              disabled={isLoading}
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/40 transition resize-none pr-14 text-lg font-light leading-relaxed"
            />
            <div className="absolute right-4 bottom-4 flex items-center">
              <span className="text-[10px] text-gray-500 mr-2 hidden sm:inline">Press Enter to Search</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full sm:w-auto self-end px-8 py-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Research...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Start Research
              </>
            )}
          </button>
        </form>

        {/* Example prompts */}
        <div className="mt-6 border-t border-white/5 pt-6 text-left relative z-10">
          <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">Example Topics</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleChipClick(prompt)}
                disabled={isLoading}
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3.5 py-1.5 rounded-lg transition hover:border-brand-primary/35 disabled:opacity-50 disabled:hover:bg-white/5 disabled:hover:border-white/10 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
