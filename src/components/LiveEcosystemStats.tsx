import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShieldCheck, Zap, Layers } from 'lucide-react';
import { SpotlightCard } from './ui/SpotlightCard';
import { AnimatedCounter } from './ui/AnimatedCounter';

interface MetricItem {
  label: string;
  numValue: number;
  prefix?: string;
  suffix?: string;
  sub: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  spotlightColor: string;
}

export const LiveEcosystemStats: React.FC = () => {
  const metrics: MetricItem[] = [
    {
      label: 'Indexed Non-Dilutive Capital',
      numValue: 136000,
      prefix: '$',
      suffix: '+',
      sub: 'DoraHacks, Gitcoin, Arbitrum, Solana, OP',
      icon: <DollarSign className="w-5 h-5 text-[#00DC82]" />,
      badge: '5 Live Feeds',
      badgeColor: 'bg-[#00DC82]/12 text-[#00DC82] border-[#00DC82]/30',
      spotlightColor: 'rgba(0, 220, 130, 0.18)'
    },
    {
      label: 'Autonomous Agent Chain',
      numValue: 4,
      suffix: ' Agents',
      sub: 'Scout → Matcher → Drafter → Jury Critic',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      badge: 'Anna OS Sandboxed',
      badgeColor: 'bg-cyan-500/12 text-cyan-300 border-cyan-500/30',
      spotlightColor: 'rgba(56, 189, 248, 0.18)'
    },
    {
      label: 'Local Vector Matching',
      numValue: 45,
      prefix: '< ',
      suffix: 'ms Latency',
      sub: 'Deterministic 3-tier weighting matrix',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      badge: 'Client-Side Cosine',
      badgeColor: 'bg-amber-500/12 text-amber-300 border-amber-500/30',
      spotlightColor: 'rgba(245, 158, 11, 0.18)'
    },
    {
      label: 'Privacy & Security Guarantee',
      numValue: 0,
      suffix: '% Data Leakage',
      sub: 'Local-first execution, zero telemetry storage',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      badge: 'Verifiable Sandbox',
      badgeColor: 'bg-purple-500/12 text-purple-300 border-purple-500/30',
      spotlightColor: 'rgba(168, 85, 247, 0.18)'
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
          >
            <SpotlightCard
              spotlightColor={m.spotlightColor}
              className="p-5 h-full flex flex-col justify-between hover:border-white/[0.18]"
            >
              <div>
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                    {m.icon}
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>

                {/* Animated Spring Counter */}
                <div className="text-2xl text-white tracking-tight">
                  <AnimatedCounter
                    value={m.numValue}
                    prefix={m.prefix}
                    suffix={m.suffix}
                    className="text-white font-sans text-2xl"
                  />
                </div>

                {/* Label */}
                <div className="text-xs font-semibold text-slate-300 mt-1">
                  {m.label}
                </div>
              </div>

              {/* Subtext */}
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-white/[0.04] leading-snug line-clamp-1 font-mono">
                {m.sub}
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
