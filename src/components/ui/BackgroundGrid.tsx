import React from 'react';

interface BackgroundGridProps {
  children?: React.ReactNode;
  className?: string;
  gridSize?: number;
}

/**
 * BackgroundGrid Component
 * Inspired by Aceternity UI & v0.app templates.
 * 100% compatible with Tailwind CSS v4 and React 19.
 * Uses a pure CSS radial-gradient mask over an SVG grid pattern.
 */
export const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  children,
  className = '',
  gridSize = 32
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background SVG Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`
        }}
      />

      {/* Radial Gradient Vignette Mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0, 220, 130, 0.08), transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(56, 189, 248, 0.05), transparent 70%)'
        }}
      />

      {children}
    </div>
  );
};
