import React, { useState } from 'react';
import type { GrantOpportunity } from '../types/grant';
import { Search, Clock, Filter, X } from 'lucide-react';

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

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col lg:h-[calc(100vh-88px)] shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
      
      {/* Search & Segmented Filter Header */}
      <div className="p-3.5 border-b border-slate-200 bg-white space-y-2.5">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Filter grants by name, sponsor, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-1.5 rounded-lg bg-slate-50 border border-slate-200/90 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-400 font-code border border-slate-200">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Segmented Control Filter */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-slate-100/90 text-xs">
          {([
            { id: 'all', label: `All (${opportunities.length})` },
            { id: 'high_fit', label: '90%+ Fit' },
            { id: 'dorahacks', label: 'DoraHacks' },
            { id: 'pools', label: 'Pools' },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSegment(tab.id)}
              className={`py-1 px-2 rounded-md font-medium transition cursor-pointer text-center truncate text-[12px] ${
                filterSegment === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Master List Feed */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <Filter className="w-5 h-5 mx-auto mb-2 text-slate-400" />
            <p className="text-xs font-medium text-slate-700">No matching grant programs</p>
            <p className="text-xs text-slate-400 mt-0.5">Try clearing your search or switching filter tabs.</p>
          </div>
        ) : (
          filtered.map((opp) => {
            const isSelected = selectedGrant?.id === opp.id;
            const isTopMatch = opp.fitScore >= 90;

            return (
              <button
                key={opp.id}
                type="button"
                onClick={() => onSelectGrant(opp)}
                className={`w-full text-left p-4 transition-colors cursor-pointer block relative ${
                  isSelected
                    ? 'bg-slate-50/90'
                    : 'bg-white hover:bg-slate-50/50'
                }`}
              >
                {/* Left selection indicator bar */}
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-900" />
                )}

                {/* Row 1: Sponsor & Deadline */}
                <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-slate-600 truncate text-[11px] uppercase tracking-wider">
                      {opp.host}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-slate-400 text-[11px] shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{opp.deadline}</span>
                  </span>
                </div>

                {/* Row 2: Grant Title */}
                <h3 className={`text-[14px] leading-snug mb-1.5 ${
                  isSelected ? 'font-bold text-slate-950' : 'font-semibold text-slate-800'
                }`}>
                  {opp.title}
                </h3>

                {/* Row 3: Concise Description */}
                <p className="text-[12.5px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {opp.summary}
                </p>

                {/* Row 4: Funding Pool & Match Score */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="font-semibold text-slate-800 font-code text-[12px]">
                    {opp.pool}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isTopMatch ? 'bg-emerald-600' : 'bg-slate-500'
                        }`}
                        style={{ width: `${opp.fitScore}%` }}
                      />
                    </div>
                    <span className={`font-code font-semibold text-[11.5px] ${
                      isTopMatch ? 'text-emerald-700' : 'text-slate-600'
                    }`}>
                      {opp.fitScore}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

    </div>
  );
};
