import React from 'react';
import { motion } from 'framer-motion';
import { Check, Search, BookOpen, PenTool, MessageSquare, Award } from 'lucide-react';

interface TimelineProps {
  currentStatus: 'idle' | 'searching' | 'reading' | 'writing' | 'critiquing' | 'completed' | 'failed';
}

const STAGES = [
  { id: 'searching', label: 'Search', icon: Search },
  { id: 'reading', label: 'Read', icon: BookOpen },
  { id: 'writing', label: 'Write', icon: PenTool },
  { id: 'critiquing', label: 'Review', icon: MessageSquare },
  { id: 'completed', label: 'Completed', icon: Award },
];

export const Timeline: React.FC<TimelineProps> = ({ currentStatus }) => {
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'idle': return -1;
      case 'searching': return 0;
      case 'reading': return 1;
      case 'writing': return 2;
      case 'critiquing': return 3;
      case 'completed': return 4;
      case 'failed': return -1;
      default: return -1;
    }
  };

  const activeIndex = getStageIndex(currentStatus);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8 relative z-10">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5">
        <div className="relative flex items-center justify-between">
          {/* Timeline background line */}
          <div className="absolute left-0 right-0 h-1 bg-white/5 z-0 top-[22px] rounded-full"></div>
          
          {/* Animated active path line */}
          <div className="absolute left-0 right-0 top-[22px] z-0">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ 
                width: activeIndex >= 0 
                  ? `${(activeIndex / (STAGES.length - 1)) * 100}%` 
                  : '0%' 
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-success rounded-full"
            />
          </div>

          {STAGES.map((stage, idx) => {
            const isCompleted = activeIndex > idx || currentStatus === 'completed';
            const isActive = activeIndex === idx;
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="relative flex flex-col items-center z-10 flex-1">
                {/* Node circle */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ 
                    scale: isActive ? 1.15 : 1,
                    borderColor: isCompleted 
                      ? '#10B981' 
                      : isActive 
                      ? '#3B82F6' 
                      : 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: isCompleted 
                      ? '#10B981' 
                      : isActive 
                      ? '#111827' 
                      : '#09090B'
                  }}
                  className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'shadow-[0_0_15px_rgba(59,130,246,0.5)] border-brand-primary' : ''
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`} />
                  )}
                </motion.div>

                {/* Node Label */}
                <span 
                  className={`text-[10px] sm:text-xs font-semibold mt-3 transition-colors duration-300 tracking-wide uppercase ${
                    isCompleted 
                      ? 'text-emerald-400' 
                      : isActive 
                      ? 'text-brand-primary' 
                      : 'text-gray-500'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
