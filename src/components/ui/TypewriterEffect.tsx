import { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface TypewriterEffectProps {
  isActive: boolean;
}

export const TypewriterEffect = ({ isActive }: TypewriterEffectProps) => {
  const { t, language } = useTranslation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const charIndexRef = useRef(0);

  const messages = useMemo(() => {
    const getMessage = (key: string, fallback: string): string => {
      const translation = t(key);
      // Eğer çeviri bulunamazsa (key ile aynıysa veya boşsa), fallback kullan
      if (!translation || translation === key || translation.trim() === '') {
        return fallback;
      }
      return translation;
    };

    const msgs = [
      getMessage('typewriter.analyzing', '🧠 Analyzing project context...'),
      getMessage('typewriter.optimizing', '⚡ Optimizing prompt structure...'),
      getMessage('typewriter.crafting', '🎯 Crafting perfect instructions...'),
      getMessage('typewriter.adding', '✨ Adding technical details...'),
      getMessage('typewriter.finalizing', '🚀 Finalizing AI-ready prompt...'),
    ];
    // Eğer hiç mesaj yoksa, fallback mesajları kullan
    if (msgs.length === 0) {
      return [
        '🧠 Analyzing project context...',
        '⚡ Optimizing prompt structure...',
        '🎯 Crafting perfect instructions...',
        '✨ Adding technical details...',
        '🚀 Finalizing AI-ready prompt...',
      ];
    }
    return msgs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    if (!isActive) {
      setDisplayText('');
      setCurrentMessageIndex(0);
      charIndexRef.current = 0;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    if (messages.length === 0) {
      setDisplayText('Loading...');
      return;
    }

    const currentMessage = messages[currentMessageIndex];
    if (!currentMessage) {
      setDisplayText('Loading...');
      return;
    }

    charIndexRef.current = 0;
    setDisplayText('');

    const typeNextChar = () => {
      if (charIndexRef.current < currentMessage.length) {
        setDisplayText(currentMessage.slice(0, charIndexRef.current + 1));
        charIndexRef.current++;
        timeoutRef.current = setTimeout(typeNextChar, 60);
      } else {
        // Wait before switching to next message
        setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          setDisplayText('');
          charIndexRef.current = 0;
        }, 1500);
      }
    };

    typeNextChar();

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      clearInterval(cursorInterval);
    };
  }, [isActive, currentMessageIndex, messages]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="relative w-full h-full flex items-center justify-center bg-white/50 dark:bg-slate-900/70 backdrop-blur-md rounded-xl">
        {/* Subtle animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 rounded-xl animate-gradient-shift"></div>
        
        {/* Subtle ripple effects - only 2 for performance */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="ripple-circle"></div>
          <div className="ripple-circle delay-400"></div>
        </div>

        {/* Content */}
        <div className="relative z-40 flex flex-col items-center gap-5 px-8 py-10">
          {/* Spinning orb - optimized size */}
          <div className="relative z-30">
            <div className="spinning-orb">
              <div className="orb-core"></div>
              <div className="orb-ring ring-1"></div>
              <div className="orb-ring ring-2"></div>
              <div className="orb-ring ring-3"></div>
            </div>
          </div>

          {/* Typewriter text - Maximum visibility */}
          <div className="text-center min-h-[32px] relative z-[100]">
            <p className="text-base font-bold text-slate-900 dark:text-white tracking-wide drop-shadow-lg">
              {displayText || messages[currentMessageIndex] || 'Processing...'}
              <span 
                className={`inline-block w-0.5 h-5 ml-1.5 bg-indigo-600 dark:bg-indigo-400 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ transition: 'opacity 0.15s ease' }}
              ></span>
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
