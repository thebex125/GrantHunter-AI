import React, { useState } from 'react';
import type { GrantOpportunity } from '../types/grant';
import { Search, Clock, Award, Sparkles, Filter, ChevronRight, DollarSign } from 'lucide-react';

interface OpportunityListProps {
  opportunities: GrantOpportunity[];
  selectedGrant: GrantOpportunity | null;
  onSelectGrant: (grant: GrantOpportunity) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({
  opportunities,
  selectedGrant,
  onSelectGrant,
  searchInputRef
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

  const getHostBadgeStyle = (category: string) => {
    switch (category) {
      case 'dorahacks':
        return 'bg-purple-500/12 text-purple-300 border-purple-500/25';
      case 'web3':
        return 'bg-cyan-500/12 text-cyan-300 border-cyan-500/25';
      case 'ai':
        return 'bg-emerald-500/12 text-emerald-300 border-emerald-500/25';
      default:
        return 'bg-slate-500/12 text-slate-300 border-slate-500/25';
    }
  };

  return (
    <div className="bg-[#0B0E14] border border-white/[0.08] rounded-2xl flex flex-col lg:h-[calc(100vh-220px)] shadow-xl overflow-hidden transition-all">
      
      {/* Search & Filter Header */}
      <div className="p-4 sm:p-4.5 border-b border-white/[0.08] bg-[#0E121A]/80 backdrop-blur-sm space-y-3">
        
        {/* Search Input Bar with Keyboard Hint */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search grant by title, track, or ecosystem... (Press '/' to focus)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-[#141924] border border-white/[0.08] text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#00DC82] focus:ring-1 focus:ring-[#00DC82]/30 transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1.5">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/[0.08] text-[10px] text-slate-400 font-mono border border-white/[0.1]">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setFilterSegment('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
              filterSegment === 'all'
                ? 'bg-[#00DC82] text-[#07090C] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141924]'
            }`}
          >
            All Grants ({opportunities.length})
          </button>
          <button
            onClick={() => setFilterSegment('high_fit')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap shrink-0 flex items-center space-x-1 ${
              filterSegment === 'high_fit'
                ? 'bg-[#00DC82] text-[#07090C] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141924]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>High Fit (&ge;90%)</span>
          </button>
          <button
            onClick={() => setFilterSegment('dorahacks')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
              filterSegment === 'dorahacks'
                ? 'bg-[#00DC82] text-[#07090C] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141924]'
            }`}
          >
            DoraHacks
          </button>
          <button
            onClick={() => setFilterSegment('pools')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
              filterSegment === 'pools'
                ? 'bg-[#00DC82] text-[#07090C] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141924]'
            }`}
          >
            Matching Pools
          </button>
        </div>

      </div>

      {/* Grant Cards Feed */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] p-2 sm:p-2.5 space-y-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
            <Filter className="w-6 h-6 mx-auto mb-2 text-slate-500 opacity-60" />
            No opportunities matched your search. Try different keywords.
          </div>
        ) : (
          filtered.map((opp) => {
            const isSelected = selectedGrant?.id === opp.id;
            const isTopMatch = opp.fitScore >= 90;

            return (
              <div
                key={opp.id}
                onClick={() => onSelectGrant(opp)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-150 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-[#151B26] border-[#00DC82]/50 shadow-[0_4px_20px_rgba(0,220,130,0.12)] ring-1 ring-[#00DC82]/30'
                    : 'bg-[#0E121A]/60 border-white/[0.05] hover:bg-[#121722] hover:border-white/[0.12]'
                }`}
              >
                <div>
                  {/* Top Meta Strip */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold px-2.5 py-0.5 rounded-md border text-[11px] uppercase tracking-wider ${getHostBadgeStyle(opp.hostCategory)}`}>
                        {opp.host}
                      </span>
                      <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{opp.deadline}</span>
                      </span>
                    </div>

                    {/* Fit Score Badge */}
                    <span
                      className={`font-bold px-2 py-0.5 rounded-lg flex items-center space-x-1 text-xs ${
                        isTopMatch
                          ? 'bg-[#00DC82]/15 text-[#00DC82] border border-[#00DC82]/30'
                          : 'bg-white/[0.06] text-slate-300 border border-white/[0.08]'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{opp.fitScore}% Fit</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug mb-1.5 group-hover:text-[#00DC82]">
                    {opp.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-[13px] text-slate-300 line-clamp-2 leading-relaxed mb-2.5">
                    {opp.summary}
                  </p>

                  {/* Dynamic Match Factor Pills if breakdown exists */}
                  {opp.fitBreakdown && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#101520] text-slate-300 border border-white/[0.06]">
                        Tech: <strong className="text-cyan-400">{opp.fitBreakdown.techStackScore}/40</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#101520] text-slate-300 border border-white/[0.06]">
                        Eco: <strong className="text-purple-400">{opp.fitBreakdown.ecosystemScore}/30</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#101520] text-slate-300 border border-white/[0.06]">
                        Feas: <strong className="text-[#00DC82]">{opp.fitBreakdown.milestoneScore}/30</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Allocation Strip */}
                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.05] text-xs">
                  <div className="flex items-center space-x-1 text-[#00DC82] font-bold">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{opp.pool}</span>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-400 group-hover:text-white transition">
                    <span className="text-[11px] font-medium hidden sm:inline">Inspect & Draft</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
