import React, { useState } from 'react';
import type { GrantOpportunity } from '../types/grant';
import { Search, Clock, ArrowRight } from 'lucide-react';

interface OpportunityListProps {
  opportunities: GrantOpportunity[];
  selectedGrant: GrantOpportunity | null;
  onSelectGrant: (grant: GrantOpportunity) => void;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({
  opportunities,
  selectedGrant,
  onSelectGrant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSegment, setFilterSegment] = useState<'all' | 'dorahacks' | 'high_fit' | 'matching'>('all');

  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterSegment === 'dorahacks') return opp.hostCategory === 'dorahacks';
    if (filterSegment === 'high_fit') return opp.fitScore >= 90;
    if (filterSegment === 'matching') return opp.pool.includes('Matching') || opp.pool.includes('Pool');
    return true;
  });

  return (
    <div className="dev-panel rounded-xl flex flex-col h-[calc(100vh-140px)] overflow-hidden">
      
      {/* Top Search & Filter Strip */}
      <div className="p-3.5 border-b border-white/[0.08] space-y-2.5 bg-[#0E1015]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by grant name, stack tag, or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[#13161C] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00DC82] font-mono"
          />
        </div>

        {/* Segmented Filter Pills */}
        <div className="flex items-center space-x-1 text-[11px] font-mono">
          <button
            onClick={() => setFilterSegment('all')}
            className={`px-2.5 py-1 rounded transition cursor-pointer ${
              filterSegment === 'all'
                ? 'bg-[#1C212B] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({opportunities.length})
          </button>
          <button
            onClick={() => setFilterSegment('high_fit')}
            className={`px-2.5 py-1 rounded transition cursor-pointer ${
              filterSegment === 'high_fit'
                ? 'bg-[#1C212B] text-[#00DC82] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Fit (&gt;90%)
          </button>
          <button
            onClick={() => setFilterSegment('dorahacks')}
            className={`px-2.5 py-1 rounded transition cursor-pointer ${
              filterSegment === 'dorahacks'
                ? 'bg-[#1C212B] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DoraHacks
          </button>
          <button
            onClick={() => setFilterSegment('matching')}
            className={`px-2.5 py-1 rounded transition cursor-pointer ${
              filterSegment === 'matching'
                ? 'bg-[#1C212B] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quadratic / Pools
          </button>
        </div>
      </div>

      {/* Grant Rows List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
        {filtered.map((opp) => {
          const isSelected = selectedGrant?.id === opp.id;
          const isHighFit = opp.fitScore >= 90;

          return (
            <div
              key={opp.id}
              onClick={() => onSelectGrant(opp)}
              className={`p-4 cursor-pointer transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#181C24] border-l-2 border-l-[#00DC82]'
                  : 'hover:bg-[#13161C] border-l-2 border-l-transparent'
              }`}
            >
              <div>
                {/* Row Meta */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-300 uppercase tracking-wider">{opp.host}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{opp.deadline}</span>
                    </span>
                  </div>

                  <span
                    className={`font-bold px-1.5 py-0.5 rounded ${
                      isHighFit
                        ? 'bg-[#00DC82]/10 text-[#00DC82]'
                        : 'bg-white/[0.05] text-slate-300'
                    }`}
                  >
                    {opp.fitScore}% Match
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-xs font-semibold text-white leading-snug mb-1">
                  {opp.title}
                </h4>

                {/* Brief Summary */}
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                  {opp.summary}
                </p>

                {/* Tags Strip */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {opp.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1015] border border-white/[0.05] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Pool & Detail Indicator */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.04] font-mono">
                <span className="text-[#00DC82] font-semibold">{opp.pool}</span>
                <span className="text-slate-500 text-[11px] flex items-center space-x-1 group-hover:text-slate-300">
                  <span>Open Proposal</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs font-mono text-slate-500">
            No grants match your filter query.
          </div>
        )}
      </div>

    </div>
  );
};
