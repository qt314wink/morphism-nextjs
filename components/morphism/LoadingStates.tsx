'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingButtonProps {
  children: React.ReactNode;
  isLoading: boolean;
  isSuccess?: boolean;
  onClick?: () => void;
  className?: string;
  color?: string;
}

export function LoadingButton({
  children,
  isLoading,
  isSuccess,
  onClick,
  className,
  color = '#FF6B9D',
}: LoadingButtonProps) {
  return (
    <motion.button
      layout
      onClick={!isLoading ? onClick : undefined}
      className={cn(
        'relative overflow-hidden rounded-2xl px-6 py-3 font-semibold text-white',
        'border-none outline-none cursor-pointer',
        'transition-colors duration-300',
        isLoading && 'cursor-wait',
        className
      )}
      style={{
        background: isSuccess
          ? 'linear-gradient(145deg, #34D399, color-mix(in srgb, #34D399, black 30%))'
          : `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color}, black 30%))`,
        boxShadow: '0 12px 24px -4px rgba(0,0,0,0.25), inset 0 -4px 8px rgba(0,0,0,0.1), inset 0 4px 8px rgba(255,255,255,0.3)',
      }}
      animate={{
        width: isSuccess ? 56 : isLoading ? 140 : 'auto',
        height: isSuccess ? 56 : 48,
        borderRadius: isSuccess ? 28 : 16,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            className="flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-sm">Loading...</span>
          </motion.div>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  const baseClasses = 'relative overflow-hidden rounded-lg bg-white/5';

  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: '',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
