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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-lg rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Project Profile & Tech Stack
              </h3>
              <p className="text-xs text-slate-500">
                Updates fit scoring and regenerates tailored grant proposals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition p-1 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset choices */}
        <div>
          <label className="block text-slate-600 text-xs font-semibold mb-2">
            Quick Architecture Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => handleSelectPreset(p)}
                className={`p-2.5 rounded-lg text-left border transition cursor-pointer ${
                  name === p.name
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className={`truncate font-semibold text-xs ${name === p.name ? 'text-white' : 'text-slate-900'}`}>
                  {p.name}
                </div>
                <div className={`text-[11px] mt-0.5 truncate ${name === p.name ? 'text-slate-300' : 'text-slate-500'}`}>
                  {p.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Form */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Tagline / Value Proposition</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Tech Stack (comma-separated)</label>
            <input
              type="text"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900 text-xs sm:text-sm font-code"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Primary Ecosystem Track</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900 text-xs sm:text-sm"
            >
              <option value="AI-Native Productivity">AI-Native Productivity & Workflows</option>
              <option value="Developer Tools">Developer Tools & Infrastructure</option>
              <option value="Web3 & DeFi">Web3 & Decentralized Apps</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save & Recalculate</span>
          </button>
        </div>

      </div>
    </div>
  );
};
