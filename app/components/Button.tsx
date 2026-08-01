import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass' | 'ring';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className,
    variant = 'default',
    size = 'md',
    rounded = 'full',
    children,
    loading = false,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
    
    const variantClasses = {
      default: 'bg-white text-black hover:bg-white/90 hover:shadow-lg focus:ring-white/50',
      primary: 'bg-white text-black hover:bg-white/90 hover:shadow-lg focus:ring-white/50',
      secondary: 'bg-black text-white border-2 border-white hover:bg-white hover:text-black focus:ring-white/50',
      outline: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black focus:ring-white/50',
      ghost: 'bg-white/10 text-white hover:bg-white/20 border border-white/20 focus:ring-white/50',
      destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50',
      glass: 'bg-transparent text-white border border-white/20 hover:border-white/40 group-hover:bg-white group-hover:text-black backdrop-blur-sm focus:ring-white/50',
      ring: 'ring-pulse bg-white/[0.04] text-white border border-white/10 hover:bg-white/[0.06] hover:border-white/20 focus:ring-white/30'
    };
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-12 py-6 text-xl'
    };
    
    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    };
    
    // El anillo ya aporta el énfasis del hover; un salto de escala grande compite con él.
    const hoverEffects = variant === 'ring'
      ? 'hover:scale-[1.02] active:scale-[0.96]'
      : 'hover:scale-105 active:scale-95';
    
    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses[rounded],
          hoverEffects,
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 