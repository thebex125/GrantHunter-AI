import React, { useEffect, useRef, useState } from 'react';
import type { GrantOpportunity } from '../types/grant';

interface RadarCanvasProps {
  opportunities: GrantOpportunity[];
  selectedGrant: GrantOpportunity | null;
  onSelectGrant: (grant: GrantOpportunity) => void;
  signalMode: string;
  onSetSignalMode: (mode: string) => void;
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

      // Handle High DPI displays
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
      const maxRadius = Math.min(cx, cy) - 24;

      // Concentric circles
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (maxRadius / 3) * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.stroke();

      // Sweeping Beam Gradient
      scanAngleRef.current += 0.02;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(scanAngleRef.current);
      const sweepGrad = ctx.createLinearGradient(0, 0, maxRadius, 0);
      sweepGrad.addColorStop(0, 'rgba(0, 242, 254, 0.22)');
      sweepGrad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius, 0, -Math.PI / 4, true);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      // Render Nodes
      opportunities.forEach((opp) => {
        const rad = (opp.radarAngle * Math.PI) / 180;
        const dist = (opp.radarDist / 150) * maxRadius;
        const x = cx + Math.cos(rad) * dist;
        const y = cy + Math.sin(rad) * dist;

        const isSelected = selectedGrant && selectedGrant.id === opp.id;
        const isHovered = hoveredGrant && hoveredGrant.id === opp.id;

        // Outer glow on selected/hovered
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 242, 254, 0.25)';
          ctx.fill();
          ctx.strokeStyle = '#00F2FE';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Connecting dashed line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = isSelected
          ? 'rgba(0, 242, 254, 0.4)'
          : 'rgba(255, 255, 255, 0.04)';
        ctx.setLineDash(isSelected ? [4, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Node Dot
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = opp.fitScore >= 90 ? '#10B981' : '#00F2FE';
        ctx.fill();

        // Node Score Label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected ? '#FFFFFF' : '#94A3B8';
        ctx.fillText(`${opp.fitScore}%`, x + 8, y + 3);
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
    const maxRadius = Math.min(cx, cy) - 24;

    let found: GrantOpportunity | null = null;

    opportunities.forEach((opp) => {
      const rad = (opp.radarAngle * Math.PI) / 180;
      const dist = (opp.radarDist / 150) * maxRadius;
      const x = cx + Math.cos(rad) * dist;
      const y = cy + Math.sin(rad) * dist;

      const d = Math.hypot(mx - x, my - y);
      if (d < 16) {
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
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Opportunity Sonar Radar</span>
            <span className="text-[10px] text-slate-400 font-mono font-normal">
              | Live Global Feed
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Scanning DoraHacks, Gitcoin, Arbitrum, & Web3 Foundation Grants
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {opportunities.length} Grants in Range
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Max Fit: 96%
          </span>
        </div>
      </div>

      {/* Radar Canvas with Center Node */}
      <div className="relative w-full h-[320px] flex items-center justify-center my-1">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredGrant(null)}
          onClick={handleClick}
          className="w-full h-full cursor-crosshair"
        />

        {/* Center Node: User Project */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20">
          <div className="w-10 h-10 rounded-full bg-[#05070B] border-2 border-cyan-400 flex items-center justify-center glow-cyan">
            <span className="text-xs font-bold text-cyan-300">YOU</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-semibold mt-1 bg-[#05070B]/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
            AutoBrief
          </span>
        </div>

        {/* Tooltip on Node Hover */}
        {hoveredGrant && (
          <div
            className="absolute z-30 pointer-events-none glass-panel px-3 py-2 rounded-lg text-xs border border-cyan-500/40 shadow-2xl transition"
            style={{
              left: `${tooltipPos.x + 12}px`,
              top: `${tooltipPos.y - 12}px`,
            }}
          >
            <div className="font-bold text-white">{hoveredGrant.title}</div>
            <div className="text-cyan-400 font-mono text-[11px]">
              {hoveredGrant.pool}
            </div>
            <div className="text-emerald-400 font-mono text-[10px]">
              Fit Score: {hoveredGrant.fitScore}% • Click to Focus
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500 space-y-0.5 pointer-events-none">
          <div>R1: High Synergy (&gt;90%)</div>
          <div>R2: Qualified Match (75-90%)</div>
          <div>R3: Broad Discovery (&lt;75%)</div>
        </div>
      </div>

      {/* Mode Filters */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 text-[11px] mr-1">Signal Mode:</span>
          <button
            onClick={() => onSetSignalMode('all')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
              signalMode === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-[#0D111A] text-slate-400 border border-white/[0.06]'
            }`}
          >
            All Chains
          </button>
          <button
            onClick={() => onSetSignalMode('dorahacks')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
              signalMode === 'dorahacks'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-[#0D111A] text-slate-400 border border-white/[0.06]'
            }`}
          >
            DoraHacks Native
          </button>
          <button
            onClick={() => onSetSignalMode('web3')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
              signalMode === 'web3'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-[#0D111A] text-slate-400 border border-white/[0.06]'
            }`}
          >
            Arbitrum / Gitcoin
          </button>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Radar Coordinates: <span className="text-cyan-400">124.5° / 480km</span>
        </div>
      </div>
    </div>
  );
};
