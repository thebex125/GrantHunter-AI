import React, { useState } from 'react';
import type { ProjectProfile } from '../types/grant';
import { FolderGit2, Check, X } from 'lucide-react';

interface ProjectProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ProjectProfile;
  onSaveProfile: (profile: ProjectProfile) => void;
}

export const ProjectProfileModal: React.FC<ProjectProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [stack, setStack] = useState(currentProfile.stack);
  const [category, setCategory] = useState(currentProfile.category);
  const [tagline, setTagline] = useState(currentProfile.tagline);

  const presets = [
    {
      name: 'AutoBrief AI',
      tagline: 'Autonomous Meeting Intelligence & Execution Matrix for Modern Engineering Teams',
      stack: 'React 18, TypeScript, Tailwind CSS, Anna AI OS, Framer Motion',
      category: 'AI-Native Productivity',
      stage: 'Working MVP / Production-Ready',
    },
    {
      name: 'GrantHunter Protocol',
      tagline: 'Decentralized Capital Discovery Engine Powered by Multi-Agent Swarms',
      stack: 'React 19, TypeScript, Web3.js, Anna OS, Stylus Rust',
      category: 'Developer Tools',
      stage: 'Production-Ready',
    },
    {
      name: 'AgentVault Guard',
      tagline: 'Autonomous Spending Limits & Timelock Escrow for AI Agents',
      stack: 'Solidity, Arbitrum Stylus, WASM, TypeScript',
      category: 'Web3 & DeFi',
      stage: 'Testnet Alpha',
    },
  ];

  if (!isOpen) return null;

  const handleSelectPreset = (p: typeof presets[0]) => {
    setName(p.name);
    setStack(p.stack);
    setCategory(p.category);
    setTagline(p.tagline);
  };

  const handleSave = () => {
    onSaveProfile({
      ...currentProfile,
      name,
      stack,
      category,
      tagline,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07090C]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#0E121A] w-full max-w-lg rounded-2xl p-5 sm:p-6 border border-white/[0.1] shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00DC82]/15 text-[#00DC82] border border-[#00DC82]/30 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Target Project & Tech Stack Profile
              </h3>
              <p className="text-xs text-slate-400">
                Customizes matching algorithms and proposal drafts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-white/[0.06] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset choices */}
        <div>
          <label className="block text-slate-300 text-xs font-semibold mb-2">
            Quick Architecture Presets:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => handleSelectPreset(p)}
                className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                  name === p.name
                    ? 'bg-[#18202D] text-white border-[#00DC82]/60 shadow-sm'
                    : 'bg-[#121620] text-slate-400 border-white/[0.06] hover:text-white hover:border-white/[0.15]'
                }`}
              >
                <div className="truncate font-semibold text-xs text-white">{p.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">{p.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Form */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121620] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tagline / Mission Thesis</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121620] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121620] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Primary Ecosystem Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121620] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] text-xs sm:text-sm"
            >
              <option value="AI-Native Productivity">AI-Native Productivity & Workflows</option>
              <option value="Developer Tools">Developer Tools & Infrastructure</option>
              <option value="Web3 & DeFi">Web3 & Decentralized Apps</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end space-x-2.5 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#141924] text-slate-300 hover:text-white transition cursor-pointer font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#00DC82] hover:bg-[#00c776] text-[#07090C] font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-[0_2px_10px_rgba(0,220,130,0.25)]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save & Recalculate</span>
          </button>
        </div>

      </div>
    </div>
  );
};
