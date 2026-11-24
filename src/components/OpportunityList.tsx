import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { GrantOpportunity } from '../types/grant';
import { Search, Clock, Filter, X, List, Radar } from 'lucide-react';
import { RadarCanvas } from './RadarCanvas';

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
  const [displayMode, setDisplayMode] = useState<'list' | 'radar'>('list');

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

  const filterTabs = [
    { id: 'all', label: `All (${opportunities.length})` },
    { id: 'high_fit', label: '90%+ Fit' },
    { id: 'dorahacks', label: 'DoraHacks' },
    { id: 'pools', label: 'Pools' },
  ] as const;

  return (
    <div className="relative bg-[#111114]/95 border border-zinc-800/85 rounded-2xl flex flex-col lg:h-[calc(100vh-88px)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden">
      {/* Obsidian UI 1px top specular highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Search & Segmented Filter Header */}
      <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-950/60 space-y-2.5">
        
        {/* Search Input + List/Radar Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Filter grants, sponsors, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs sm:text-[13px] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 text-zinc-500 hover:text-zinc-200 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-zinc-950 text-[10px] text-zinc-500 font-code border border-zinc-800">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* List vs Spatial Radar Switcher */}
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
            <button
              type="button"
              onClick={() => setDisplayMode('list')}
              title="Master List View"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                displayMode === 'list'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('radar')}
              title="Interactive Spatial Radar View"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                displayMode === 'radar'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Radar className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Motion.dev Shared-Layout Segmented Filter */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-xs">
          {filterTabs.map((tab) => {
            const isActive = filterSegment === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterSegment(tab.id)}
                className="relative py-1 px-2 rounded-lg font-medium transition cursor-pointer text-center truncate text-[11.5px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="grant-filter-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-zinc-800 border border-zinc-700/80 shadow-xs"
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive ? 'text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Content Area: Spatial Radar OR Master Feed */}
      {displayMode === 'radar' ? (
        <div className="flex-1 overflow-y-auto p-3 flex flex-col justify-center">
          <RadarCanvas
            opportunities={filtered}
            selectedGrant={selectedGrant}
            onSelectGrant={(g) => {
              onSelectGrant(g);
            }}
            signalMode={filterSegment}
            onSetSignalMode={(mode) => {
              if (mode === 'all' || mode === 'high_fit' || mode === 'dorahacks' || mode === 'pools') {
                setFilterSegment(mode);
              } else {
                setFilterSegment('all');
              }
            }}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
          {filtered.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <Filter className="w-5 h-5 mx-auto mb-2 text-zinc-600" />
              <p className="text-xs font-medium text-zinc-300">No matching grant programs</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Clear your search filter or switch ecosystem tabs.
              </p>
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
                      ? 'bg-zinc-900/90'
                      : 'bg-transparent hover:bg-zinc-900/40'
                  }`}
                >
                  {/* Motion.dev Shared-Layout Active Indicator Bar */}
                  {isSelected && (
                    <motion.span
                      layoutId="active-grant-bar"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-400"
                    />
                  )}

                  {/* Row 1: Sponsor & Deadline */}
                  <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                    <span className="font-code font-semibold text-zinc-400 truncate text-[11px] uppercase tracking-wider">
                      {opp.host}
                    </span>

                    <span className="inline-flex items-center gap-1 text-zinc-500 text-[11px] font-code shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{opp.deadline}</span>
                    </span>
                  </div>

                  {/* Row 2: Grant Title */}
                  <h3
                    className={`text-sm leading-snug mb-1.5 ${
                      isSelected ? 'font-bold text-zinc-50' : 'font-semibold text-zinc-200'
                    }`}
                  >
                    {opp.title}
                  </h3>

                  {/* Row 3: Concise Summary */}
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                    {opp.summary}
                  </p>

                  {/* Row 4: Funding Pool & Cosine Match Bar */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 text-xs">
                    <span className="font-semibold text-zinc-200 font-code text-[12px]">
                      {opp.pool}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isTopMatch ? 'bg-emerald-400' : 'bg-zinc-400'
                          }`}
                          style={{ width: `${opp.fitScore}%` }}
                        />
                      </div>
                      <span
                        className={`font-code font-bold text-[11.5px] ${
                          isTopMatch ? 'text-emerald-400' : 'text-zinc-300'
                        }`}
                      >
                        {opp.fitScore}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};
