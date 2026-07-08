import { motion } from 'framer-motion';
import { Search, BookOpen, PenTool, MessageSquare, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section className="relative w-full py-20 px-6 mt-16 overflow-hidden flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto z-10">
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none z-0"></div>

      {/* Left side text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 text-left relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-brand-primary mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping"></span>
          Autonomous Agentic Architecture
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
          Research Smarter with <span className="bg-gradient-to-r from-brand-primary via-indigo-400 to-brand-secondary bg-clip-text text-transparent">Autonomous AI Agents</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl font-light mb-8 max-w-2xl leading-relaxed">
          DeepScout autonomously searches trusted sources, analyzes information, generates comprehensive research reports, and critiques the results using multiple AI agents.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onStartClick}
            className="px-6 py-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary hover:to-brand-primary/90 text-white rounded-xl font-semibold shadow-lg shadow-brand-primary/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            Start Research
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Right side Agent Workflow Animation */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 glass-panel p-8 rounded-3xl border border-white/10 flex flex-col justify-center items-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        
        {/* Animated Connecting Lines */}
        <div className="w-full flex flex-col items-center gap-12 relative py-4">
          {/* Vertical flow line */}
          <div className="absolute w-0.5 h-[calc(100%-80px)] bg-gradient-to-b from-brand-primary via-brand-secondary to-brand-success top-10 z-0">
            {/* Animated dot moving down */}
            <motion.div 
              animate={{ 
                top: ["0%", "100%"] 
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#3B82F6]"
            />
          </div>

          {/* Search Agent Node */}
          <div className="flex items-center gap-4 z-10 bg-gray-900/90 border border-white/10 w-72 p-4 rounded-2xl shadow-xl shadow-black/40 hover:border-brand-primary/40 transition">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
              <Search className="w-6 h-6 text-brand-primary animate-pulse" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Search Agent</h4>
              <p className="text-xs text-gray-500">Crawls trusted webs & docs</p>
            </div>
          </div>

          {/* Reader Agent Node */}
          <div className="flex items-center gap-4 z-10 bg-gray-900/90 border border-white/10 w-72 p-4 rounded-2xl shadow-xl shadow-black/40 hover:border-brand-secondary/40 transition">
            <div className="w-12 h-12 rounded-xl bg-brand-secondary/20 flex items-center justify-center border border-brand-secondary/30">
              <BookOpen className="w-6 h-6 text-brand-secondary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Reader Agent</h4>
              <p className="text-xs text-gray-500">Extracts contents & metadata</p>
            </div>
          </div>

          {/* Writer Agent Node */}
          <div className="flex items-center gap-4 z-10 bg-gray-900/90 border border-white/10 w-72 p-4 rounded-2xl shadow-xl shadow-black/40 hover:border-brand-success/40 transition">
            <div className="w-12 h-12 rounded-xl bg-brand-success/20 flex items-center justify-center border border-brand-success/30">
              <PenTool className="w-6 h-6 text-brand-success" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Writer Agent</h4>
              <p className="text-xs text-gray-500">Drafts comprehensive markdown</p>
            </div>
          </div>

          {/* Critic Agent Node */}
          <div className="flex items-center gap-4 z-10 bg-gray-900/90 border border-white/10 w-72 p-4 rounded-2xl shadow-xl shadow-black/40 hover:border-brand-warning/40 transition">
            <div className="w-12 h-12 rounded-xl bg-brand-warning/20 flex items-center justify-center border border-brand-warning/30">
              <MessageSquare className="w-6 h-6 text-brand-warning" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Critic Agent</h4>
              <p className="text-xs text-gray-500">Verifies facts & reviews gaps</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
