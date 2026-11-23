import React, { useEffect, useRef, useState } from 'react';
import type { GrantOpportunity } from '../types/grant';
import { Target, Compass, Sparkles } from 'lucide-react';

interface RadarCanvasProps {
  opportunities: GrantOpportunity[];
  selectedGrant: GrantOpportunity | null;
  onSelectGrant: (grant: GrantOpportunity) => void;
  signalMode: string;
  onSetSignalMode: (mode: string) => void;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  delta: number;
}

export const RadarCanvas: React.FC<RadarCanvasProps> = ({
  opportunities,
  selectedGrant,
  onSelectGrant,
  signalMode,
  onSetSignalMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredGrant, setHoveredGrant] = useState<GrantOpportunity | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const scanAngleRef = useRef(0);
  const starsRef = useRef<Star[]>([]);

  // Initialize random background cosmic dust
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        delta: (Math.random() - 0.5) * 0.01,
      });
    }
    starsRef.current = stars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(cx, cy) - 26;

      // Render Twinkling Cosmic Stars
      starsRef.current.forEach((star) => {
        star.alpha += star.delta;
        if (star.alpha > 0.8 || star.alpha < 0.15) star.delta = -star.delta;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, star.alpha)})`;
        ctx.fill();
      });

      // Concentric Radar Distance Rings
      for (let r = 1; r <= 3; r++) {
        const ringRadius = (maxRadius / 3) * r;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = r === 3 ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.setLineDash(r === 2 ? [3, 3] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ring distance tags
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.fillText(`${r * 33}% Match Ring`, cx + 6, cy - ringRadius + 10);
      }

      // Crosshairs with sub-ticks
      ctx.beginPath();
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.stroke();

      // Sweeping Sonar Beam with trailing falloff
      scanAngleRef.current += 0.022;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(scanAngleRef.current);

      const sweepGrad = ctx.createLinearGradient(0, 0, maxRadius, 0);
      sweepGrad.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
      sweepGrad.addColorStop(0.7, 'rgba(0, 242, 254, 0.15)');
      sweepGrad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius, 0, -Math.PI / 3.5, true);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Bright sweep leading edge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxRadius, 0);
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // Render Satellite Opportunity Nodes
      opportunities.forEach((opp) => {
        const rad = (opp.radarAngle * Math.PI) / 180;
        const dist = (opp.radarDist / 150) * maxRadius;
        const x = cx + Math.cos(rad) * dist;
        const y = cy + Math.sin(rad) * dist;

        const isSelected = selectedGrant && selectedGrant.id === opp.id;
        const isHovered = hoveredGrant && hoveredGrant.id === opp.id;

        // Gravitational Beam to Center
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = isSelected
          ? 'rgba(0, 242, 254, 0.5)'
          : isHovered
          ? 'rgba(139, 92, 246, 0.4)'
          : 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = isSelected ? 1.5 : 1;
        ctx.setLineDash(isSelected ? [4, 4] : [2, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbital Halo on active/hover
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(x, y, 14, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(0, 242, 254, 0.2)' : 'rgba(139, 92, 246, 0.2)';
          ctx.fill();
          ctx.strokeStyle = isSelected ? '#00F2FE' : '#8B5CF6';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(x, y, isSelected ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = opp.fitScore >= 90 ? '#10B981' : '#00F2FE';
        ctx.fill();

        // Node Title & Score Pill
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected ? '#FFFFFF' : '#94A3B8';
        ctx.fillText(`${opp.fitScore}%`, x + 9, y + 3);
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [opportunities, selectedGrant, hoveredGrant]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const maxRadius = Math.min(cx, cy) - 26;

    let found: GrantOpportunity | null = null;

    opportunities.forEach((opp) => {
      const rad = (opp.radarAngle * Math.PI) / 180;
      const dist = (opp.radarDist / 150) * maxRadius;
      const x = cx + Math.cos(rad) * dist;
      const y = cy + Math.sin(rad) * dist;

      const d = Math.hypot(mx - x, my - y);
      if (d < 18) {
        found = opp;
        setTooltipPos({ x, y });
      }
    });

    setHoveredGrant(found);
  };

  const handleClick = () => {
    if (hoveredGrant) {
      onSelectGrant(hoveredGrant);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/[0.08] shadow-2xl">
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-sm font-bold tracking-wide text-white uppercase font-mono">
              Constellation Sonar Radar
            </h2>
            <span className="text-[10px] text-cyan-400/80 font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              Sweep 60 FPS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active real-time vector scan across DoraHacks, Gitcoin, & L2 Foundations
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <div className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1.5">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{opportunities.length} Nodes Locked</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Peak Fit: 96%
          </div>
        </div>
      </div>

      {/* Radar Canvas with Center Node */}
      <div className="relative w-full h-[330px] flex items-center justify-center my-1">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredGrant(null)}
          onClick={handleClick}
          className="w-full h-full cursor-crosshair"
        />

        {/* Center Node (User Core Anchor) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20">
          <div className="w-12 h-12 rounded-full bg-[#030508] border-2 border-cyan-400 flex items-center justify-center glow-cyan">
            <Target className="w-5 h-5 text-cyan-300" />
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-bold mt-1 bg-[#030508]/90 px-2 py-0.5 rounded border border-cyan-500/30">
            TARGET CORE
          </span>
        </div>

        {/* Rich Hover Glass Tooltip */}
        {hoveredGrant && (
          <div
            className="absolute z-30 pointer-events-none glass-panel p-3.5 rounded-xl text-xs border border-cyan-400/50 shadow-2xl transition max-w-[260px]"
            style={{
              left: `${Math.min(tooltipPos.x + 14, 340)}px`,
              top: `${Math.max(tooltipPos.y - 40, 10)}px`,
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                {hoveredGrant.host}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                {hoveredGrant.fitScore}% Fit
              </span>
            </div>
            <div className="font-bold text-white text-xs mb-1 truncate">
              {hoveredGrant.title}
            </div>
            <div className="text-[11px] font-mono text-slate-300 font-semibold mb-2">
              {hoveredGrant.pool}
            </div>
            <div className="space-y-1 text-[10px] font-mono border-t border-white/[0.08] pt-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Tech Stack Synergy:</span>
                <span className="text-cyan-300">96%</span>
              </div>
              <div className="flex justify-between">
                <span>DoraHacks DNA:</span>
                <span className="text-emerald-300">98%</span>
              </div>
            </div>
            <div className="text-[9px] text-cyan-400 mt-2 font-mono flex items-center space-x-1">
              <span>✦</span> <span>Click to focus in proposal studio</span>
            </div>
          </div>
        )}

        {/* Range Legend */}
        <div className="absolute bottom-2 left-4 text-[10px] font-mono text-slate-500 space-y-0.5 pointer-events-none bg-[#030508]/60 p-2 rounded-lg border border-white/[0.04]">
          <div className="text-emerald-400 font-semibold">Tier 1: High Win Vector (&gt;90%)</div>
          <div className="text-cyan-400">Tier 2: Qualified Match (80-90%)</div>
          <div className="text-slate-400">Tier 3: Discovery Range (&lt;80%)</div>
        </div>
      </div>

      {/* Mode Filters & Radar Coordinate Readout */}
      <div className="flex items-center justify-between border-t border-white/[0.08] pt-3 text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 text-[11px] font-mono mr-1">Signal Protocol:</span>
          <button
            onClick={() => onSetSignalMode('all')}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono font-medium transition cursor-pointer ${
              signalMode === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 glow-cyan'
                : 'bg-[#0D111A] text-slate-400 border border-white/[0.06] hover:text-white'
            }`}
          >
            All Feeds
          </button>
          <button
            onClick={() => onSetSignalMode('dorahacks')}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono font-medium transition cursor-pointer ${
              signalMode === 'dorahacks'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 glow-cyan'
                : 'bg-[#0D111A] text-slate-400 border border-white/[0.06] hover:text-white'
            }`}
          >
            DoraHacks Native
          </button>
          <button
            onClick={() => onSetSignalMode('web3')}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono font-medium transition cursor-pointer ${
              signalMode === 'web3'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 glow-cyan'
                : 'bg-[#0D111A] text-slate-400 border border-white/[0.06] hover:text-white'
            }`}
          >
            Gitcoin / Arbitrum
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>Coordinates:</span>
          <span className="text-cyan-400 font-semibold">142.8° / 520 km</span>
        </div>
      </div>
    </div>
  );
};
