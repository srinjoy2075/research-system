import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-6 py-12 mt-12 border-t border-white/5 relative z-10 text-gray-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="text-center sm:text-left">
          <span className="font-bold text-sm tracking-tight text-white">DeepScout<span className="text-brand-primary">AI</span></span>
          <p className="text-xs mt-1 font-light">Autonomous Multi-Agent Scientific Research System</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 border-t border-white/5 pt-6 text-[10px] uppercase font-bold tracking-wider">
        <span>© {new Date().getFullYear()} DeepScout AI. All rights reserved.</span>
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Production Ready Stack
        </span>
      </div>
    </footer>
  );
};
