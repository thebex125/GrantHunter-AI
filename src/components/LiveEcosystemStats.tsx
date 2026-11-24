import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShieldCheck, Zap, Layers } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
}

export const LiveEcosystemStats: React.FC = () => {
  const metrics: MetricItem[] = [
    {
      label: 'Indexed Non-Dilutive Capital',
      value: '$136,000+',
      sub: 'DoraHacks, Gitcoin, Arbitrum, Solana, OP',
      icon: <DollarSign className="w-5 h-5 text-[#00DC82]" />,
      badge: '5 Live Feeds',
      badgeColor: 'bg-[#00DC82]/12 text-[#00DC82] border-[#00DC82]/30'
    },
    {
      label: 'Autonomous Agent Chain',
      value: '4 Specialized Agents',
      sub: 'Scout → Matcher → Drafter → Jury Critic',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      badge: 'Anna OS Sandboxed',
      badgeColor: 'bg-cyan-500/12 text-cyan-300 border-cyan-500/30'
    },
    {
      label: 'Local Vector Matching',
      value: '< 45ms Latency',
      sub: 'Deterministic 3-tier weighting matrix',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      badge: 'Client-Side Cosine',
      badgeColor: 'bg-amber-500/12 text-amber-300 border-amber-500/30'
    },
    {
      label: 'Privacy & Security Guarantee',
      value: '0% Data Leakage',
      sub: 'Local-first execution, zero telemetry storage',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      badge: 'Verifiable Sandbox',
      badgeColor: 'bg-purple-500/12 text-purple-300 border-purple-500/30'
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="p-5 rounded-2xl bg-[#0E121A]/80 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-200 group relative overflow-hidden backdrop-blur-sm"
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:scale-105 transition-transform">
                {m.icon}
              </div>
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                {m.badge}
              </span>
            </div>

            {/* Value */}
            <div className="font-extrabold text-2xl text-white tracking-tight font-sans">
              {m.value}
            </div>

            {/* Label */}
            <div className="text-xs font-semibold text-slate-300 mt-1">
              {m.label}
            </div>

            {/* Subtext */}
            <div className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-1 font-mono">
              {m.sub}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
