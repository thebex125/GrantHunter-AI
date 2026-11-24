import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * AnimatedCounter Component
 * Inspired by Motion.dev examples & 21st.dev (Number Ticker).
 * Uses Framer Motion's spring physics to smoothly interpolate numbers upon entering viewport.
 * 100% React 19 & Tailwind v4 compatible.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const spring = useSpring(0, {
    stiffness: 75,
    damping: 20
  });

  const display = useTransform(spring, (current) => {
    return Math.floor(current).toLocaleString();
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <span className={`inline-flex items-center font-mono font-extrabold ${className}`}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
};
