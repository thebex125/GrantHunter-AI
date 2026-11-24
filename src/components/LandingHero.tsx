import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Terminal,
  ExternalLink,
  Award,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface LandingHeroProps {
  onLaunchStudio: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunchStudio }) => {
  return (
    <section className="relative overflow-hidden pt-12 sm:pt-20 pb-12 sm:pb-16 text-center">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#00DC82]/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        
        {/* DoraHacks Official Program Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#121620] border border-white/[0.1] text-xs text-slate-300 shadow-md mb-6 hover:border-[#00DC82]/40 transition group cursor-pointer"
          onClick={onLaunchStudio}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00DC82] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00DC82]" />
          </span>
          <span className="font-semibold text-white">DoraHacks Anna AI App Builder Program</span>
          <span className="text-slate-500">•</span>
          <span className="text-[#00DC82] font-mono group-hover:translate-x-0.5 transition-transform">
            $6,000 Launch Boost + $80k Recurring
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-4xl font-sans"
        >
          Autonomous Grant Discovery & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#00DC82] via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            Proposal Engine for Builders
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-5 text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Replace weeks of grant bureaucracy with an autonomous 4-agent swarm. Discover high-fit bounties, calculate eligibility vectors, and generate submission-ready BUIDL proposals in seconds.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <button
            onClick={onLaunchStudio}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-[#00DC82] hover:bg-[#00c776] text-[#07090C] font-extrabold text-sm sm:text-base transition-all shadow-[0_4px_25px_rgba(0,220,130,0.35)] hover:shadow-[0_6px_30px_rgba(0,220,130,0.5)] cursor-pointer group hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Launch Developer Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="https://dorahacks.io/build"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#141924] hover:bg-[#1C2333] text-slate-200 hover:text-white border border-white/[0.08] hover:border-white/20 font-semibold text-sm sm:text-base transition cursor-pointer"
          >
            <span>DoraHacks BUIDL Portal</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </motion.div>

        {/* Interactive Hero Preview Mock-Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-12 w-full max-w-4xl p-1 rounded-2xl bg-gradient-to-b from-white/[0.12] via-white/[0.05] to-transparent shadow-2xl"
        >
          <div className="bg-[#0B0E14] rounded-2xl p-5 sm:p-7 border border-white/[0.06] text-left space-y-4">
            
            {/* Window bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] text-xs">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-slate-400 font-mono text-[11px] ml-2 hidden sm:inline">
                  granthunter-workstation://anna-os/live-vector-matcher
                </span>
              </div>

              <div className="flex items-center space-x-2 font-mono text-[11px] text-[#00DC82]">
                <Zap className="w-3.5 h-3.5" />
                <span>Deterministic Scoring Engine Active</span>
              </div>
            </div>

            {/* Mock split preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Left: Top Grant Match Card */}
              <div className="md:col-span-6 p-4 rounded-xl bg-[#121620] border border-[#00DC82]/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    DoraHacks • Live Grant
                  </span>
                  <span className="text-xs font-bold text-[#00DC82] flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>96.4% Fit</span>
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm sm:text-base">
                  Anna AI App Builder Program
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  Transforming AI agents and productivity workflows into user-facing apps on Anna AI OS with monthly recurring grants up to $80k.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs font-mono">
                  <span className="text-[#00DC82] font-bold">$6,000 USD Launch Boost</span>
                  <span className="text-slate-400">12 Days Left</span>
                </div>
              </div>

              {/* Right: Real-time 4-Agent Execution Log */}
              <div className="md:col-span-6 p-4 rounded-xl bg-[#07090C] border border-white/[0.06] font-mono text-[11px] space-y-2">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold flex items-center space-x-1.5 pb-1 border-b border-white/[0.06]">
                  <Terminal className="w-3 h-3 text-[#00DC82]" />
                  <span>Swarm Pipeline Trace</span>
                </div>
                <div className="space-y-1.5 text-slate-300 leading-snug">
                  <div className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00DC82] shrink-0 mt-0.5" />
                    <span>[SCOUT] Ingested 5 feeds from DoraHacks & Gitcoin</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>[MATCHER] Tech 38/40 • Eco 29/30 • Feas 29/30</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>[DRAFTER] 3 Milestone Gates & $6,000 Budget Built</span>
                  </div>
                  <div className="flex items-start space-x-1.5 text-[#00DC82] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00DC82] shrink-0 mt-0.5" />
                    <span>[CRITIC] Red-Team Audit: 96.4/100 (Grade A+)</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
