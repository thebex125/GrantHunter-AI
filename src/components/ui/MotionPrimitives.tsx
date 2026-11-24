import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';

/**
 * 1. SpotlightCard (21st.dev + Aceternity UI + Obsidian UI)
 * Cursor-tracking radial gradient spotlight with 1px specular top edge highlight.
 */
interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  active?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(16, 185, 129, 0.11)',
  active = false,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl bg-[#111114]/90 border transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${
        active
          ? 'border-emerald-500/50 bg-[#141619]'
          : 'border-zinc-800/85 hover:border-zinc-700/90'
      } ${className}`}
      {...props}
    >
      {/* Obsidian UI 1px Specular Top Edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* 21st.dev Cursor Spotlight Overlay */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 45%)`,
        }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

/**
 * 2. Spatial3DTilt (GetLayers AI 3D Scenes + Motion.dev Spring Physics)
 * Interactive 3D perspective container that tilts smoothly toward cursor position.
 */
interface Spatial3DTiltProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const Spatial3DTilt: React.FC<Spatial3DTiltProps> = ({
  children,
  className = '',
  intensity = 5,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 24 });
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 24 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: '1400px' }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

/**
 * 3. AnimatedCounter (React Bits)
 * Smoothly interpolates numeric values on mount and update.
 */
interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(display, value, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString('en-US');

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

/**
 * 4. BlurTextReveal (React Bits + Superdesign Typography)
 * Staggered word-by-word blur-to-crisp entrance animation.
 */
interface BlurTextRevealProps {
  text: string;
  className?: string;
  delayOffset?: number;
}

export const BlurTextReveal: React.FC<BlurTextRevealProps> = ({
  text,
  className = '',
  delayOffset = 0,
}) => {
  const words = text.split(' ');
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.45,
            delay: delayOffset + idx * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

/**
 * 5. V0ArchitecturalBackground (V0 Backgrounds)
 * Masked architectural grid + subtle top radial beam light.
 */
export const V0ArchitecturalBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Subtle architectural 36px grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:36px_36px]"
        style={{
          maskImage:
            'radial-gradient(ellipse 80% 55% at 50% 0%, #000 60%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 55% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />
      {/* Top atmospheric light beam */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[780px] h-[320px] bg-gradient-to-b from-emerald-500/[0.07] via-zinc-400/[0.03] to-transparent blur-3xl rounded-full" />
    </div>
  );
};
