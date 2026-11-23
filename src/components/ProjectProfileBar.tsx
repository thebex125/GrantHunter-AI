import React from 'react';
import type { ProjectProfile } from '../types/grant';
import { Layers, Cpu, Compass } from 'lucide-react';

interface ProjectProfileBarProps {
  profile: ProjectProfile;
  onOpenModal: () => void;
}

export const ProjectProfileBar: React.FC<ProjectProfileBarProps> = ({
  profile,
  onOpenModal,
}) => {
  return (
    <div className="dev-panel rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      
      {/* Left: Project identity */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-slate-300">
          <Layers className="w-3.5 h-3.5 text-[#00DC82]" />
          <span className="text-slate-500">Active Profile:</span>
          <span className="font-bold text-white font-sans">{profile.name}</span>
        </div>

        <span className="text-slate-700 hidden sm:inline">•</span>

        <div className="hidden sm:flex items-center space-x-1.5 text-slate-400">
          <Compass className="w-3.5 h-3.5 text-slate-500" />
          <span>{profile.category}</span>
        </div>
      </div>

      {/* Middle / Right: Tech Stack Badges */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
          <Cpu className="w-3 h-3 text-slate-500" />
          <span className="text-slate-500">Stack:</span>
          <span className="text-slate-300 font-sans truncate max-w-[340px]">
            {profile.stack}
          </span>
        </div>

        <button
          onClick={onOpenModal}
          className="px-2.5 py-1 rounded bg-[#13161C] hover:bg-[#181C24] text-slate-300 hover:text-white border border-white/[0.08] transition text-[11px] cursor-pointer ml-2"
        >
          Change Profile
        </button>
      </div>

    </div>
  );
};
