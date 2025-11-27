import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          'transform hover:scale-105 active:scale-95',
          {
            // Variants - Modern gradients
            'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 focus:ring-indigo-500 dark:from-indigo-500 dark:via-purple-500 dark:to-indigo-500 dark:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50': variant === 'primary',
            'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 shadow-md shadow-slate-200/50 hover:shadow-slate-300/70 focus:ring-slate-400 dark:from-slate-800 dark:to-slate-700 dark:text-slate-100 dark:shadow-slate-900/50 dark:hover:shadow-slate-800/70': variant === 'secondary',
            'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50 hover:shadow-red-500/70 focus:ring-red-500': variant === 'danger',
            'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200 focus:ring-slate-400 dark:focus:ring-slate-600': variant === 'ghost',
            // Sizes
            'px-4 py-2 text-sm': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

