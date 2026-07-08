import React from 'react';
import { Search, BookOpen, PenTool, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Agent {
  id: 'searching' | 'reading' | 'writing' | 'critiquing';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor: string;
  borderColor: string;
}

interface WorkflowProps {
  currentStatus: 'idle' | 'searching' | 'reading' | 'writing' | 'critiquing' | 'completed' | 'failed';
}

const AGENTS: Agent[] = [
  {
    id: 'searching',
    title: 'Search Agent',
    description: 'Crawls web search index for latest data',
    icon: Search,
    color: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'reading',
    title: 'Reader Agent',
    description: 'Scrapes relevant websites and parses content',
    icon: BookOpen,
    color: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
  },
  {
    id: 'writing',
    title: 'Writer Agent',
    description: 'Synthesizes information and writes markdown draft',
    icon: PenTool,
    color: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
  },
  {
    id: 'critiquing',
    title: 'Critic Agent',
    description: 'Evaluates fact accuracy and suggests improvements',
    icon: MessageSquare,
    color: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
];

export const Workflow: React.FC<WorkflowProps> = ({ currentStatus }) => {
  const getAgentStatus = (agentId: string) => {
    const statusOrder = ['searching', 'reading', 'writing', 'critiquing', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const agentIndex = statusOrder.indexOf(agentId);

    if (currentStatus === 'failed') return { state: 'failed', pct: 0, text: 'Halted' };
    if (currentStatus === 'idle') return { state: 'pending', pct: 0, text: 'Waiting' };

    if (currentIndex > agentIndex) {
      return { state: 'completed', pct: 100, text: 'Completed' };
    } else if (currentIndex === agentIndex) {
      return { state: 'running', pct: 50, text: 'Active' };
    } else {
      return { state: 'pending', pct: 0, text: 'Queued' };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 relative z-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Agent Execution Pipeline</h2>
        <p className="text-sm text-gray-500">Watch the AI pipeline orchestrate research tasks in real time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {AGENTS.map((agent, index) => {
          const status = getAgentStatus(agent.id);
          const Icon = agent.icon;

          return (
            <React.Fragment key={agent.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative rounded-2xl glass-panel p-6 border flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  status.state === 'running' 
                    ? `border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]` 
                    : status.state === 'completed'
                    ? 'border-emerald-500/20'
                    : 'border-white/5 opacity-60'
                }`}
              >
                {/* Glow Backdrop */}
                {status.state === 'running' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-transparent pointer-events-none"></div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${agent.textColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    {/* Status Badge */}
                    <div>
                      {status.state === 'running' && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-brand-primary tracking-wider bg-brand-primary/10 px-2 py-0.5 rounded-full">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Running
                        </span>
                      )}
                      {status.state === 'completed' && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Done
                        </span>
                      )}
                      {status.state === 'pending' && (
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider bg-white/5 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-1">{agent.title}</h3>
                  <p className="text-xs text-gray-400 font-light mb-6 min-h-[32px]">{agent.description}</p>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1.5 font-medium">
                    <span>Task Progress</span>
                    <span className={status.state === 'running' ? 'text-brand-primary' : status.state === 'completed' ? 'text-emerald-400' : 'text-gray-500'}>
                      {status.pct}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${status.pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${
                        status.state === 'completed' 
                          ? 'from-emerald-500 to-teal-400' 
                          : 'from-brand-primary to-brand-secondary'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
