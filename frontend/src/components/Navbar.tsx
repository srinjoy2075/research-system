import { Cpu } from 'lucide-react';

interface NavbarProps {
  status: 'idle' | 'searching' | 'reading' | 'writing' | 'critiquing' | 'completed' | 'failed';
}

export const Navbar: React.FC<NavbarProps> = ({ status }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'idle':
        return { label: 'System Idle', color: 'bg-gray-500' };
      case 'searching':
        return { label: 'Search Agent Active', color: 'bg-blue-500 animate-pulse' };
      case 'reading':
        return { label: 'Reader Agent Active', color: 'bg-cyan-500 animate-pulse' };
      case 'writing':
        return { label: 'Writer Agent Active', color: 'bg-purple-500 animate-pulse' };
      case 'critiquing':
        return { label: 'Critic Agent Active', color: 'bg-amber-500 animate-pulse' };
      case 'completed':
        return { label: 'Research Completed', color: 'bg-emerald-500' };
      case 'failed':
        return { label: 'System Alert', color: 'bg-red-500' };
    }
  };

  const currentStatus = getStatusDetails();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-xl tracking-tight text-white">DeepScout<span className="text-brand-primary">AI</span></span>
          <span className="text-[10px] block text-gray-500 uppercase tracking-widest font-semibold">Autonomous Analyst</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-300">
          <span className={`w-2.5 h-2.5 rounded-full ${currentStatus.color}`}></span>
          <span className="font-medium">{currentStatus.label}</span>
        </div>
      </div>
    </nav>
  );
};
