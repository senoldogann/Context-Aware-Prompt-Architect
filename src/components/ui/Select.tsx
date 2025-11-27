import { SelectHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-md',
          'text-slate-900 dark:text-slate-100 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500/50',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-600',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

