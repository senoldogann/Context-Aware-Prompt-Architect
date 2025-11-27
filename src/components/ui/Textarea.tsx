import { TextareaHTMLAttributes, forwardRef, useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const [isDark, setIsDark] = useState(() => {
      if (typeof window === 'undefined') return false;
      return document.documentElement.classList.contains('dark');
    });

    useEffect(() => {
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }, []);
    
    return (
      <textarea
        ref={ref}
        className={clsx(
          'w-full px-4 py-3 border rounded-xl',
          isDark 
            ? 'bg-slate-900/50 border-slate-700/50 text-slate-100 placeholder-slate-500'
            : 'bg-white/80 border-slate-300 text-slate-900 placeholder-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'resize-none transition-all duration-300',
          'shadow-sm hover:shadow-md',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

