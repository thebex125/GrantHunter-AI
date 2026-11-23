import React, { useEffect, useRef } from 'react';
import type { SwarmLog } from '../types/grant';

interface SwarmTerminalProps {
  logs: SwarmLog[];
}

export const SwarmTerminal: React.FC<SwarmTerminalProps> = ({ logs }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'SCOUT':
        return 'text-cyan-400 font-bold';
      case 'MATCHER':
        return 'text-emerald-400 font-bold';
      case 'DRAFTER':
        return 'text-violet-400 font-bold';
      case 'CRITIC':
        return 'text-amber-400 font-bold';
      default:
        return 'text-slate-400 font-semibold';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-violet-500/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Live Swarm Execution Log
          </h3>
        </div>
        <div className="flex items-center space-x-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-mono text-slate-400">Stream OK</span>
        </div>
      </div>

      {/* Terminal logs list */}
      <div
        ref={terminalRef}
        className="flex-1 min-h-[260px] max-h-[260px] overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 p-3 bg-[#05070B]/80 rounded-xl border border-white/[0.04]"
      >
        <div className="text-slate-500">
          // Swarm engine initialized. Orchestrator ready.
        </div>
        {logs.map((log) => (
          <div key={log.id} className="leading-relaxed">
            <span className="text-slate-500">[{log.timestamp}]</span>{' '}
            <span className={getAgentColor(log.agent)}>[{log.agent}]</span>{' '}
            <span className="text-slate-300">{log.message}</span>
          </div>
        ))}
      </div>

      {/* 4 Agent Status Strip */}
      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/[0.06] text-center">
        <div className="p-1.5 rounded-lg bg-[#080B11] border border-white/[0.05]">
          <div className="text-[10px] text-slate-400">Agent 1</div>
          <div className="text-xs font-semibold text-cyan-400">Scout</div>
        </div>
        <div className="p-1.5 rounded-lg bg-[#080B11] border border-white/[0.05]">
          <div className="text-[10px] text-slate-400">Agent 2</div>
          <div className="text-xs font-semibold text-emerald-400">Matcher</div>
        </div>
        <div className="p-1.5 rounded-lg bg-[#080B11] border border-white/[0.05]">
          <div className="text-[10px] text-slate-400">Agent 3</div>
          <div className="text-xs font-semibold text-violet-400">Drafter</div>
        </div>
        <div className="p-1.5 rounded-lg bg-[#080B11] border border-white/[0.05]">
          <div className="text-[10px] text-slate-400">Agent 4</div>
          <div className="text-xs font-semibold text-amber-400">Critic</div>
        </div>
      </div>
    </div>
  );
};
