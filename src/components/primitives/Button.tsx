import React from 'react';
import { cn } from '../../lib/utils/cn';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  default: 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:opacity-90 active:scale-[0.99] transition-all',
  secondary: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/.5)] transition-all',
  outline: 'border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/.3)] transition-all',
  destructive: 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90 transition-all',
  ghost: 'bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/.2)] transition-all',
} as const;

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex cursor-pointer items-center justify-center rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] disabled:pointer-events-none disabled:opacity-50',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
