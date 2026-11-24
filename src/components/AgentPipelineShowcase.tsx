import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  Network,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  Terminal,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { SpotlightCard } from './ui/SpotlightCard';

interface AgentCard {
  number: string;
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  metrics: string;
  terminalLog: string;
  spotlightColor: string;
}

export interface AgentPipelineShowcaseProps {
  onLaunchStudio?: () => void;
}

export const AgentPipelineShowcase: React.FC<AgentPipelineShowcaseProps> = () => {
  const [activeAgent, setActiveAgent] = useState<number>(0);

  const agents: AgentCard[] = [
    {
      number: '01',
      name: 'Scout Harvester',
      role: 'Multi-Protocol Bounty Discovery',
      description:
        'Continuously tracks and normalizes dynamic grant feeds across DoraHacks, Gitcoin, Arbitrum Foundation, Optimism RetroPGF, and Solana with schema sanitization.',
      icon: <Radar className="w-5 h-5 text-cyan-400" />,
      tags: ['DoraHacks Feed', 'Gitcoin Passport', 'OP Superchain', 'Arbitrum Stylus'],
      metrics: '5 Real-Time Sources • Zero Stale Opportunities',
      terminalLog: '[SCOUT] Ingested 5 protocol feeds. 14 live grants indexed. Cache fresh.',
      spotlightColor: 'rgba(56, 189, 248, 0.22)'
    },
    {
      number: '02',
      name: 'Vector Matcher',
      role: 'Semantic Cosine & Fit Scoring Matrix',
      description:
        'Calculates exact builder-grant alignment using a 3-tier weighting formula: Tech Stack Fit (40%), Ecosystem Mandate (30%), and Milestone Feasibility (30%).',
      icon: <Network className="w-5 h-5 text-purple-400" />,
      tags: ['Cosine Similarity', 'Stack Tokenizer', '40/30/30 Formula', 'Deterministic'],
      metrics: '<45ms Local Computation • Fit Scores 0–100%',
      terminalLog: '[MATCHER] Project vector matches DoraHacks Anna AI App Builder with 96.4% confidence.',
      spotlightColor: 'rgba(168, 85, 247, 0.22)'
    },
    {
      number: '03',
      name: 'Proposal Architect',
      role: 'Autonomous BUIDL Proposal Drafter',
      description:
        'Generates comprehensive, tailored grant proposals following the DoraHacks BUIDL standard: Executive Summary, Quantified Problem, Anna OS Architecture, 3 Milestone Gates, and Itemized Budget.',
      icon: <FileCheck2 className="w-5 h-5 text-[#00DC82]" />,
      tags: ['DoraHacks Standard', '3 Milestone Gates', 'Itemized Budget', 'Markdown Export'],
      metrics: '1-Click Markdown / JSON-LD Export Ready',
      terminalLog: '[DRAFTER] Tailored 5-section proposal compiled. Budget matches $6,000 USD Launch Boost.',
      spotlightColor: 'rgba(0, 220, 130, 0.22)'
    },
    {
      number: '04',
      name: 'Jury Critic',
      role: 'Adversarial Red-Team Rubric Audit',
      description:
        'Simulates an evaluation panel of hackathon judges. Rigorously audits the proposal across 4 official rubrics: Originality (25), Technical Execution (25), Real-World Utility (25), and Design & Polish (25).',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      tags: ['Red-Team Audit', '4 Official Rubrics', 'Grade A+ Threshold', 'Actionable Tips'],
      metrics: 'Pre-Submission Gatekeeper • 96.4 / 100 Score',
      terminalLog: '[CRITIC] Red-team audit passed: 96.4/100 (Grade A+). Zero critical disqualifiers found.',
      spotlightColor: 'rgba(244, 63, 94, 0.22)'
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300 mb-3">
          <Cpu className="w-3.5 h-3.5 text-[#00DC82]" />
          <span>Multi-Agent Swarm Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          4 Autonomous Agents Working as One Swarm
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Each agent operates within an isolated client-side boundary on Anna AI OS, transforming weeks of chaotic grant bureaucracy into a seamless 30-second workflow.
        </p>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent, idx) => {
          const isSelected = activeAgent === idx;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              onClick={() => setActiveAgent(idx)}
              className="cursor-pointer"
            >
              <SpotlightCard
                spotlightColor={agent.spotlightColor}
                className={`p-5 h-full flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#121620] border-[#00DC82]/50 shadow-[0_4px_24px_rgba(0,220,130,0.12)] ring-1 ring-[#00DC82]/30'
                    : 'bg-[#0E121A]/80 border-white/[0.08] hover:bg-[#111622] hover:border-white/[0.18]'
                }`}
              >
                <div>
                  {/* Header with step number and icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                      {agent.icon}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      STAGE {agent.number}
                    </span>
                  </div>

                  {/* Agent Name & Role */}
                  <h3 className="font-bold text-base text-white tracking-tight">
                    {agent.name}
                  </h3>
                  <div className="text-xs text-[#00DC82] font-semibold mt-0.5 mb-2">
                    {agent.role}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {agent.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {agent.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-400 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Metric */}
                <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span className="truncate">{agent.metrics}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00DC82] shrink-0 ml-1" />
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Live Agent Terminal Inspector */}
      <motion.div
        key={activeAgent}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#07090C] border border-white/[0.08] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-300"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center space-x-2 truncate">
            <Terminal className="w-3.5 h-3.5 text-[#00DC82] shrink-0" />
            <span className="text-slate-400">Agent {agents[activeAgent].number} Telemetry:</span>
            <span className="text-[#00DC82] truncate">{agents[activeAgent].terminalLog}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00DC82]" />
          <span>Active in Anna OS Sandbox</span>
        </div>
      </motion.div>
    </section>
  );
};
