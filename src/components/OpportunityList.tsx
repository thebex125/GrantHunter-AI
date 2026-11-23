import React, { useState } from 'react';
import type { GrantOpportunity } from '../types/grant';
import { Search, Clock, ArrowRight, Award } from 'lucide-react';

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
  const [filterSegment, setFilterSegment] = useState<'all' | 'high_fit' | 'dorahacks' | 'pools'>('all');

  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterSegment === 'dorahacks') return opp.hostCategory === 'dorahacks';
    if (filterSegment === 'high_fit') return opp.fitScore >= 90;
    if (filterSegment === 'pools') return opp.pool.includes('Pool') || opp.pool.includes('Matching');
    return true;
  });

  return (
    <div className="bg-[#0D1016] border border-white/[0.08] rounded-xl flex flex-col h-[calc(100vh-146px)] overflow-hidden">
      
      {/* Search & Filter Header */}
      <div className="p-3.5 border-b border-white/[0.08] space-y-2.5 bg-[#0A0D12]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search grants by keyword, stack, or tag... [/]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#11141A] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00DC82] font-mono"
          />
        </div>

        {/* Filter Segments */}
        <div className="flex items-center space-x-1 text-[11px] font-mono">
          <button
            onClick={() => setFilterSegment('all')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              filterSegment === 'all'
                ? 'bg-[#181D26] text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Grants ({opportunities.length})
          </button>
          <button
            onClick={() => setFilterSegment('high_fit')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              filterSegment === 'high_fit'
                ? 'bg-[#181D26] text-[#00DC82] font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Fit (&gt;90%)
          </button>
          <button
            onClick={() => setFilterSegment('dorahacks')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              filterSegment === 'dorahacks'
                ? 'bg-[#181D26] text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DoraHacks
          </button>
          <button
            onClick={() => setFilterSegment('pools')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              filterSegment === 'pools'
                ? 'bg-[#181D26] text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matching Pools
          </button>
        </div>
      </div>

      {/* Grant Items List */}
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
                  ? 'bg-[#161B24] border-l-[3px] border-l-[#00DC82]'
                  : 'hover:bg-[#11141A] border-l-[3px] border-l-transparent'
              }`}
            >
              <div>
                {/* Meta Strip */}
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="font-bold text-slate-300 uppercase tracking-wider">{opp.host}</span>
                    <span className="text-slate-700">•</span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{opp.deadline}</span>
                    </span>
                  </div>

                  <span
                    className={`font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 ${
                      isHighFit
                        ? 'bg-[#00DC82]/12 text-[#00DC82] border border-[#00DC82]/20'
                        : 'bg-white/[0.05] text-slate-300'
                    }`}
                  >
                    <Award className="w-3 h-3" />
                    <span>{opp.fitScore}% Match</span>
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-white leading-snug mb-1.5">
                  {opp.title}
                </h4>

                {/* Summary */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {opp.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {opp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0D12] border border-white/[0.05] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Pool & Trigger */}
              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/[0.04]">
                <div className="font-mono">
                  <span className="text-slate-500 text-[10px] uppercase block">Grant Pool</span>
                  <span className="text-[#00DC82] font-bold text-sm tracking-tight">{opp.pool}</span>
                </div>

                <span className="text-slate-400 font-mono text-[11px] flex items-center space-x-1 hover:text-white transition">
                  <span>View Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-10 text-center text-xs font-mono text-slate-500">
            No grant opportunities match this filter criteria.
          </div>
        )}
      </div>

    </div>
  );
};
