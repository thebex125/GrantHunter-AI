import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  useEffect(() => {
    setName(currentProfile.name);
    setStack(currentProfile.stack);
    setCategory(currentProfile.category);
    setTagline(currentProfile.tagline);
  }, [currentProfile]);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative bg-[#111114] w-full max-w-lg rounded-2xl p-5 sm:p-6 border border-zinc-800 shadow-2xl space-y-4 overflow-hidden"
          >
            {/* Obsidian UI 1px top specular highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 text-emerald-400 border border-zinc-800 flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm sm:text-base">
                    Project Profile & Vector Parameters
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Recalculates cosine fit scores and compiles tailored grant dossiers
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-200 transition p-1 rounded-lg hover:bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preset choices */}
            <div>
              <label className="block text-zinc-400 text-xs font-code uppercase tracking-wider mb-2">
                Architecture Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                      name === p.name
                        ? 'bg-zinc-800/90 text-zinc-100 border-emerald-500/50'
                        : 'bg-zinc-950/70 text-zinc-400 border-zinc-800/80 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <div className="truncate font-semibold text-xs text-zinc-100">{p.name}</div>
                    <div className="text-[10.5px] font-code text-zinc-400 mt-0.5 truncate">{p.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Form */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Tagline / Value Proposition</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={stack}
                  onChange={(e) => setStack(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 text-xs sm:text-sm font-code"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Primary Ecosystem Track</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 text-xs sm:text-sm"
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
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white transition cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Recalculate</span>
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
