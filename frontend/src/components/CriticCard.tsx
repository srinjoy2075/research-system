import React from 'react';
import { Star, ShieldAlert, Award, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface CriticCardProps {
  feedbackText: string;
}

export const CriticCard: React.FC<CriticCardProps> = ({ feedbackText }) => {
  if (!feedbackText) return null;

  // Parsing helper
  const parseFeedback = (text: string) => {
    const scoreMatch = text.match(/Score:\s*(\d+(?:\.\d+)?)\/10/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 8.0;

    const strengths: string[] = [];
    const improvements: string[] = [];
    let verdict = '';

    const lines = text.split('\n');
    let section: 'none' | 'strengths' | 'improvements' | 'verdict' = 'none';

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (/strengths:/i.test(line)) {
        section = 'strengths';
        continue;
      } else if (/areas to improve:/i.test(line)) {
        section = 'improvements';
        continue;
      } else if (/verdict:/i.test(line)) {
        section = 'verdict';
        continue;
      }

      if (section === 'strengths') {
        if (line.startsWith('-')) {
          strengths.push(line.replace(/^-/, '').trim());
        }
      } else if (section === 'improvements') {
        if (line.startsWith('-')) {
          improvements.push(line.replace(/^-/, '').trim());
        }
      } else if (section === 'verdict') {
        verdict = line;
      }
    }

    return { score, strengths, improvements, verdict };
  };

  const { score, strengths, improvements, verdict } = parseFeedback(feedbackText);

  // SVG parameters for circular score
  const radius = 60;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 10) * circumference;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-6 relative z-10 text-left">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">AI Critique & Quality Audit</h2>
        <p className="text-sm text-gray-500">Autonomous evaluation of the research report validity and structural completeness</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start"
      >
        {/* Glow backdrop */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Circular Score Visualizer */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-white/5 fill-transparent"
                strokeWidth={strokeWidth}
              />
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-brand-primary fill-transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: progressOffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-white tracking-tight">{score}</span>
              <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Scale of 10</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
            <Award className="w-3.5 h-3.5" />
            <span>Excellent Grade</span>
          </div>
        </div>

        {/* Critique Breakdown */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* Strengths */}
          {strengths.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-brand-success" />
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Report Strengths</h4>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {strengths.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm text-gray-300 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-success mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas to Improve */}
          {improvements.length > 0 && (
            <div className="border-t border-white/5 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-brand-warning" />
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Areas to Improve</h4>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {improvements.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm text-gray-300 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-warning mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verdict */}
          {verdict && (
            <div className="border-t border-white/5 pt-5 bg-white/2 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft className="w-4 h-4 text-brand-secondary" />
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Verdict</h4>
              </div>
              <p className="text-sm text-white font-light italic leading-relaxed">
                "{verdict}"
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
