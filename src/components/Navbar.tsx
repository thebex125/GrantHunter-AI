import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  RefreshCw,
  ArrowUpRight,
  SlidersHorizontal,
  Layers,
  LayoutGrid,
} from 'lucide-react';
import type { ProjectProfile } from '../types/grant';

interface NavbarProps {
  profile: ProjectProfile;
  currentView?: 'landing' | 'studio';
  onToggleView?: (view: 'landing' | 'studio') => void;
  totalGrants?: number;
  totalPoolFormatted?: string;
  onOpenProfile: () => void;
  onRefreshFeed: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  currentView = 'landing',
  onToggleView,
  totalGrants = 6,
  totalPoolFormatted = '$136,000',
  onOpenProfile,
  onRefreshFeed,
  isRefreshing,
}) => {
  const navTabs = [
    { id: 'landing', label: 'Architecture & Bento', icon: Layers },
    { id: 'studio', label: 'Proposal Workbench', icon: LayoutGrid },
  ] as const;

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-zinc-800/80 bg-[#09090B]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center">
      <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Brand Identity & Project Context Switcher */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => onToggleView?.('landing')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] flex items-center justify-center text-zinc-100 group-hover:border-emerald-500/60 transition-colors">
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-zinc-100">
                GrantHunter
              </span>
              <span className="text-[10px] font-code font-semibold px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                v2.4
              </span>
            </div>
          </button>

          <span className="text-zinc-700 text-sm select-none hidden sm:inline">/</span>

          {/* Active Project Context Pill (Manus / Linear style) */}
          <button
            type="button"
            onClick={onOpenProfile}
            title="Configure active project stack & vector parameters"
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800/80 border border-zinc-800/90 hover:border-zinc-700 transition text-xs cursor-pointer group min-w-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-semibold text-zinc-200 truncate max-w-[140px]">
              {profile.name}
            </span>
            <span className="hidden xl:inline-block px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 font-code text-[10.5px] border border-zinc-800">
              {profile.category}
            </span>
            <SlidersHorizontal className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
          </button>
        </div>

        {/* Center: Motion.dev Shared-Layout Spring Pill Dock (Manus AI inspired) */}
        <nav className="flex items-center p-1 rounded-xl bg-zinc-900/90 border border-zinc-800/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onToggleView?.(tab.id)}
                className="relative px-3 sm:px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 rounded-lg"
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-mode-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-zinc-100 shadow-xs"
                  />
                )}
                <Icon
                  className={`w-3.5 h-3.5 relative z-10 transition-colors ${
                    isActive ? 'text-zinc-950' : 'text-zinc-400'
                  }`}
                />
                <span
                  className={`relative z-10 transition-colors ${
                    isActive ? 'text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: Telemetry Counters & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex items-center gap-2.5 text-xs text-zinc-400 mr-1 font-code">
            <span>
              <strong className="text-zinc-200">{totalGrants}</strong> feeds
            </span>
            <span className="text-zinc-700">•</span>
            <span>
              <strong className="text-emerald-400">{totalPoolFormatted}</strong> pool
            </span>
          </div>

          <button
            type="button"
            onClick={onRefreshFeed}
            disabled={isRefreshing}
            title="Re-run Scout Harvester & Vector Matcher"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{isRefreshing ? 'Syncing' : 'Sync'}</span>
          </button>

          <a
            href="https://dorahacks.io/build"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition shadow-xs"
          >
            <span className="hidden sm:inline">Submit BUIDL</span>
            <span className="sm:hidden">BUIDL</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </header>
  );
};
