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

  // Quick preset selector
  const presets = [
    {
      name: 'AutoBrief AI',
      tagline: 'Autonomous Meeting Intelligence & Execution Matrix for Modern Engineering Teams',
      stack: 'React 18, TypeScript, Tailwind CSS, Anna AI OS, Framer Motion',
      category: 'AI-Native Productivity',
      stage: 'Working MVP / Production-Ready',
    },
    {
      name: 'GrantHunter Swarm Protocol',
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
    <div className="fixed inset-0 z-50 bg-[#030508]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wide">
              Target Project & Vector Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <label className="block text-slate-400 text-xs font-mono mb-1.5">
            Quick Project Presets:
          </label>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => handleSelectPreset(p)}
                className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                  name === p.name
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 glow-cyan font-bold'
                    : 'bg-[#080B11] text-slate-400 border-white/[0.06] hover:text-white'
                }`}
              >
                <div className="truncate">{p.name}</div>
                <div className="text-[9px] text-slate-500">{p.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Edit Inputs */}
        <div className="space-y-3.5 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Tagline / Mission</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Primary Ecosystem Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 font-sans"
            >
              <option value="AI-Native Productivity">AI-Native Productivity & Workflows</option>
              <option value="Developer Tools">Developer Tools & Infrastructure</option>
              <option value="Web3 & DeFi">Web3 & Decentralized Apps</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0D111A] text-slate-400 hover:text-white text-xs font-mono cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-[#030508] font-bold text-xs font-mono cursor-pointer transition shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Update Vector Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
