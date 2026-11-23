import React from 'react';
import { Shield, ExternalLink, RefreshCw } from 'lucide-react';
import type { ProjectProfile } from '../types/grant';

interface NavbarProps {
  profile: ProjectProfile;
  onOpenProfile: () => void;
  onRefreshFeed: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenProfile,
  onRefreshFeed,
  isRefreshing,
}) => {
  return (
    <header className="border-b border-white/[0.08] bg-[#0A0D12] px-6 py-3.5 sticky top-0 z-50">
      <div className="max-w-[1520px] mx-auto flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center space-x-2 text-white">
            <div className="w-7 h-7 rounded-lg bg-[#00DC82]/10 border border-[#00DC82]/30 flex items-center justify-center text-[#00DC82]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight">GrantHunter</span>
          </div>

          <span className="text-slate-600 text-xs">/</span>

          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 px-3 py-1 rounded-md bg-[#11141A] border border-white/[0.08] hover:border-white/20 transition cursor-pointer text-xs"
          >
            <span className="text-slate-400 font-mono text-[11px]">project:</span>
            <span className="font-semibold text-slate-100">{profile.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00DC82]" />
          </button>
        </div>

        {/* Center: Real Status Ticker */}
        <div className="hidden md:flex items-center space-x-3 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00DC82]" />
            <span className="text-slate-200 font-medium">DoraHacks BUIDL API Sync Active</span>
          </div>
          <span className="text-slate-700">•</span>
          <span className="text-slate-400">Anna AI Track Verified</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5 text-xs font-mono">
          <button
            onClick={onRefreshFeed}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#11141A] hover:bg-[#161A22] text-slate-300 hover:text-white border border-white/[0.08] transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#00DC82]' : ''}`} />
            <span>{isRefreshing ? 'Scanning...' : 'Sync Grants'}</span>
          </button>

          <a
            href="https://dorahacks.io/build"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-[#00DC82] hover:bg-[#00c776] text-[#07090C] font-semibold transition shadow-sm"
          >
            <span>Submit BUIDL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </header>
  );
};
