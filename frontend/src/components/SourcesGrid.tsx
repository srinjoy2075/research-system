import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface Source {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

interface SourcesGridProps {
  searchResultsText: string;
}

export const SourcesGrid: React.FC<SourcesGridProps> = ({ searchResultsText }) => {
  const parseSources = (text: string): Source[] => {
    if (!text) return [];
    
    // Split by the boundary separator
    const blocks = text.split(/\n----\n/);
    const parsed: Source[] = [];

    for (const block of blocks) {
      if (!block.trim()) continue;
      
      const titleMatch = block.match(/Title:\s*(.*)/i);
      const urlMatch = block.match(/URL:\s*(.*)/i);
      const snippetMatch = block.match(/Snippet:\s*([\s\S]*)/i);

      if (urlMatch) {
        const url = urlMatch[1].trim();
        const title = titleMatch ? titleMatch[1].trim() : 'Source Article';
        const snippet = snippetMatch ? snippetMatch[1].trim() : '';
        
        let domain = '';
        try {
          domain = new URL(url).hostname;
        } catch {
          domain = 'external';
        }

        parsed.push({ title, url, snippet, domain });
      }
    }

    return parsed;
  };

  const sources = parseSources(searchResultsText);

  if (sources.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 relative z-10 text-left">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Verified Sources</h2>
        <p className="text-sm text-gray-500">Trusted information crawled and synthesized during research</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((source, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-48"
          >
            <div>
              {/* Card Header with Favicon & Credibility badge */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <img 
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${source.domain}`} 
                    alt={source.domain}
                    className="w-5 h-5 rounded bg-white/10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
                    }}
                  />
                  <span className="text-xs text-gray-500 font-mono font-medium truncate max-w-[120px]">{source.domain}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </div>
              </div>

              {/* Title & snippet */}
              <h4 className="font-semibold text-sm text-white line-clamp-2 mb-2 group-hover:text-brand-primary transition">
                {source.title}
              </h4>
              <p className="text-xs text-gray-400 font-light line-clamp-2">{source.snippet}</p>
            </div>

            {/* Link out */}
            <div className="flex items-center justify-end border-t border-white/5 pt-3 mt-3">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-primary hover:text-white flex items-center gap-1 transition-all"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
