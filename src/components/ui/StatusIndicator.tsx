import { clsx } from 'clsx';

interface StatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'loading';
  label?: string;
}

export const StatusIndicator = ({ status, label }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx('w-2 h-2 rounded-full', {
          'bg-emerald-500': status === 'connected',
          'bg-red-500': status === 'disconnected',
          'bg-amber-500 animate-pulse': status === 'loading',
        })}
      />
      {label && (
        <span className="text-xs text-slate-400 font-medium">
          {label}
        </span>
      )}
    </div>
  );
};

