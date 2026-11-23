import React, { useEffect, useRef, useState } from 'react';
import type { SwarmLog } from '../types/grant';
import { Terminal, Filter, Pause, Play, Trash2 } from 'lucide-react';

interface SwarmTerminalProps {
  logs: SwarmLog[];
  onClearLogs?: () => void;
}

export const SwarmTerminal: React.FC<SwarmTerminalProps> = ({ logs, onClearLogs }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (terminalRef.current && !isPaused) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    return log.agent === filter;
  });

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
    <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/[0.08] shadow-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-4 h-4 rounded-full bg-violet-500/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
          </div>
          <div className="flex items-center space-x-1.5">
            <Terminal className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Live Swarm Terminal Feed
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded bg-[#0D111A] text-slate-400 hover:text-white transition cursor-pointer"
            title={isPaused ? 'Resume Stream' : 'Pause Stream'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="p-1 rounded bg-[#0D111A] text-slate-400 hover:text-white transition cursor-pointer"
              title="Clear Logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 mb-2.5 text-[10px] font-mono">
        <Filter className="w-3 h-3 text-slate-400 mr-1" />
        {['ALL', 'SCOUT', 'MATCHER', 'DRAFTER', 'CRITIC'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-0.5 rounded transition cursor-pointer ${
              filter === f
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Terminal log window */}
      <div
        ref={terminalRef}
        className="flex-1 min-h-[250px] max-h-[250px] overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 p-3.5 bg-[#030508]/90 rounded-xl border border-white/[0.05]"
      >
        <div className="text-slate-500">
          // Swarm engine v2.0 initialized. 4 agents registered and listening.
        </div>
        {filteredLogs.map((log) => (
          <div key={log.id} className="leading-relaxed">
            <span className="text-slate-500">[{log.timestamp}]</span>{' '}
            <span className={getAgentColor(log.agent)}>[{log.agent}]</span>{' '}
            <span className="text-slate-300">{log.message}</span>
          </div>
        ))}
      </div>

      {/* 4 Agent Status Cards */}
      <div className="grid grid-cols-4 gap-2 mt-3.5 pt-3.5 border-t border-white/[0.08] text-center font-mono">
        <div className="p-2 rounded-xl bg-[#080B11] border border-white/[0.05]">
          <div className="text-[9px] text-slate-400 uppercase">Agent 1</div>
          <div className="text-xs font-bold text-cyan-400">Scout</div>
        </div>
        <div className="p-2 rounded-xl bg-[#080B11] border border-white/[0.05]">
          <div className="text-[9px] text-slate-400 uppercase">Agent 2</div>
          <div className="text-xs font-bold text-emerald-400">Matcher</div>
        </div>
        <div className="p-2 rounded-xl bg-[#080B11] border border-white/[0.05]">
          <div className="text-[9px] text-slate-400 uppercase">Agent 3</div>
          <div className="text-xs font-bold text-violet-400">Drafter</div>
        </div>
        <div className="p-2 rounded-xl bg-[#080B11] border border-white/[0.05]">
          <div className="text-[9px] text-slate-400 uppercase">Agent 4</div>
          <div className="text-xs font-bold text-amber-400">Critic</div>
        </div>
      </div>
    </div>
  );
};
