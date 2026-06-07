'use client';

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useId,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  openOnHover?: boolean;
  delay?: number;
}

export function Popover({
  trigger,
  children,
  placement = 'top',
  className,
  openOnHover = true,
  delay = 200,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const panelId = useId();

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current?.getBoundingClientRect();
    const popoverWidth = popoverRect?.width || 200;
    const popoverHeight = popoverRect?.height || 100;

    let x = 0,
      y = 0;

    switch (placement) {
      case 'top':
        x = rect.left + rect.width / 2 - popoverWidth / 2;
        y = rect.top - popoverHeight - 12;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2 - popoverWidth / 2;
        y = rect.bottom + 12;
        break;
      case 'left':
        x = rect.left - popoverWidth - 12;
        y = rect.top + rect.height / 2 - popoverHeight / 2;
        break;
      case 'right':
        x = rect.right + 12;
        y = rect.top + rect.height / 2 - popoverHeight / 2;
        break;
    }

    x = Math.max(12, Math.min(x, window.innerWidth - popoverWidth - 12));
    y = Math.max(12, Math.min(y, window.innerHeight - popoverHeight - 12));

    setPosition({ x, y });
  }, [placement]);

  const open = useCallback(() => {
    clearTimeout(timeoutRef.current);
    calculatePosition();
    setIsOpen(true);
  }, [calculatePosition]);

  const close = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), delay);
  }, [delay]);

  useEffect(() => {
    if (!isOpen) return;

    calculatePosition();
    window.addEventListener('scroll', calculatePosition, true);
    window.addEventListener('resize', calculatePosition);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      if (e.key === 'Tab' && popoverRef.current) {
        const focusable = popoverRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, calculatePosition]);

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-white/10 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-white/10 border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-white/10 border-t-transparent border-b-transparent border-r-transparent',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-white/10 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={openOnHover ? open : undefined}
        onMouseLeave={openOnHover ? close : undefined}
        onClick={!openOnHover ? () => setIsOpen((v) => !v) : undefined}
        className="inline-block"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
      >
        {trigger}
      </div>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            id={panelId}
            className={cn(
              'fixed z-[9999] min-w-[200px]',
              'bg-gradient-to-b from-white/15 to-white/5',
              'backdrop-blur-2xl saturate-150',
              'border border-white/20 rounded-2xl',
              'shadow-2xl shadow-black/20',
              'p-5',
              'transition-all duration-300',
              'animate-in fade-in zoom-in-95 slide-in-from-bottom-2',
              className
            )}
            style={{
              left: position.x,
              top: position.y,
            }}
            onMouseEnter={openOnHover ? () => clearTimeout(timeoutRef.current) : undefined}
            onMouseLeave={openOnHover ? close : undefined}
            role="dialog"
            aria-modal="false"
          >
            <div
              className={cn(
                'absolute w-3 h-3 rotate-45',
                'bg-gradient-to-br from-white/15 to-white/5',
                'border border-white/20',
                arrowClasses[placement]
              )}
            />
            <div className="relative z-10">{children}</div>
          </div>,
          document.body
        )}
    </>
  );
}
