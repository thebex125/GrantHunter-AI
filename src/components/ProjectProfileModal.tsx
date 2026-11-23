import React, { useState } from 'react';
import type { ProjectProfile } from '../types/grant';
import { FolderGit2, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-[#08090B]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E1015] w-full max-w-lg rounded-xl p-6 border border-white/[0.08] shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-4 h-4 text-[#00DC82]" />
            <h3 className="font-semibold text-white text-sm font-mono">
              Target Project & Tech Stack Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Preset choices */}
        <div>
          <label className="block text-slate-400 text-xs font-mono mb-1.5">
            Quick Project Presets:
          </label>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => handleSelectPreset(p)}
                className={`p-2.5 rounded-lg text-left border transition cursor-pointer ${
                  name === p.name
                    ? 'bg-[#181C24] text-white border-[#00DC82]/50 font-semibold'
                    : 'bg-[#13161C] text-slate-400 border-white/[0.06] hover:text-white'
                }`}
              >
                <div className="truncate font-sans font-medium">{p.name}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{p.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#13161C] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Tagline / Mission</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#13161C] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#13161C] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Primary Ecosystem Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#13161C] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] font-sans"
            >
              <option value="AI-Native Productivity">AI-Native Productivity & Workflows</option>
              <option value="Developer Tools">Developer Tools & Infrastructure</option>
              <option value="Web3 & DeFi">Web3 & Decentralized Apps</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex justify-end space-x-2 text-xs font-mono">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md bg-[#13161C] text-slate-400 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-md bg-[#00DC82] hover:bg-[#00c776] text-[#08090B] font-semibold transition cursor-pointer flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
};
