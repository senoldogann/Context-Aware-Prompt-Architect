import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-md',
          'text-slate-100 placeholder-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-slate-600',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-colors duration-200',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

