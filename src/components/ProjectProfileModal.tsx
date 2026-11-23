import React, { useState } from 'react';
import type { ProjectProfile } from '../types/grant';

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

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      ...currentProfile,
      name,
      stack,
      category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070B]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="font-bold text-white text-sm">Target Project Profile</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Primary Tech Stack</label>
            <input
              type="text"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Core Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="AI-Native Productivity">
                AI-Native Productivity & Workflows
              </option>
              <option value="Developer Tools">Developer Tools & Infrastructure</option>
              <option value="Web3 & DeFi">Web3 & Decentralized Apps</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#0D111A] text-slate-400 text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#05070B] font-bold text-xs cursor-pointer transition"
          >
            Update Profile & Re-Score
          </button>
        </div>
      </div>
    </div>
  );
};
