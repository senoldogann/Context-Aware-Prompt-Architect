import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface TypewriterEffectProps {
  isActive: boolean;
}

export const TypewriterEffect = ({ isActive }: TypewriterEffectProps) => {
  const { t } = useTranslation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const messages = useMemo(() => [
    t('typewriter.analyzing') || '🧠 Analyzing project context...',
    t('typewriter.optimizing') || '⚡ Optimizing prompt structure...',
    t('typewriter.crafting') || '🎯 Crafting perfect instructions...',
    t('typewriter.adding') || '✨ Adding technical details...',
    t('typewriter.finalizing') || '🚀 Finalizing AI-ready prompt...',
  ], [t]);

  useEffect(() => {
    if (!isActive) {
      setDisplayText('');
      setCurrentMessageIndex(0);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;
    const currentMessage = messages[currentMessageIndex];

    const typeNextChar = () => {
      if (charIndex < currentMessage.length) {
        setDisplayText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
        timeoutId = setTimeout(typeNextChar, 60);
      } else {
        // Wait before switching to next message
        setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          setDisplayText('');
          charIndex = 0;
        }, 1500);
      }
    };

    typeNextChar();

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(cursorInterval);
    };
  }, [isActive, currentMessageIndex, messages]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="relative w-full h-full flex items-center justify-center bg-white/40 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl">
        {/* Subtle animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 rounded-xl animate-gradient-shift"></div>
        
        {/* Subtle ripple effects - only 2 for performance */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="ripple-circle"></div>
          <div className="ripple-circle delay-400"></div>
        </div>

        {/* Content */}
        <div className="relative z-30 flex flex-col items-center gap-5 px-8 py-10">
          {/* Spinning orb - optimized size */}
          <div className="relative z-20">
            <div className="spinning-orb">
              <div className="orb-core"></div>
              <div className="orb-ring ring-1"></div>
              <div className="orb-ring ring-2"></div>
              <div className="orb-ring ring-3"></div>
            </div>
          </div>

          {/* Typewriter text */}
          <div className="text-center min-h-[24px] relative z-30">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-wide drop-shadow-lg bg-white/30 dark:bg-slate-900/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              {displayText}
              <span className={`inline-block w-0.5 h-4 ml-1 bg-indigo-500 dark:bg-indigo-400 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.15s ease' }}></span>
            </p>
          </div>

          {/* Progress dots - smaller and smoother */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="progress-dot"
                style={{ animationDelay: `${i * 150}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
