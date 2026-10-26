import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Eye,
  Type,
  Activity,
  Mic,
  Maximize2,
  Minus,
  Sparkles,
  Shield,
  HelpCircle,
  X,
} from 'lucide-react';
import { pipSpeech } from '../utils/speech';

export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';

interface AccessibilityOverlayProps {
  colorBlindMode: ColorBlindMode;
  readingRulerActive: boolean;
  liveCaptionsEnabled: boolean;
  visualAlertActive: boolean;
  highContrast: boolean;
  fontSizeMultiplier: number;
}

export const AccessibilityOverlay: React.FC<AccessibilityOverlayProps> = ({
  colorBlindMode,
  readingRulerActive,
  liveCaptionsEnabled,
  visualAlertActive,
  highContrast,
  fontSizeMultiplier,
}) => {
  const [rulerY, setRulerY] = useState(250);
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Track cursor for reading ruler
  useEffect(() => {
    if (!readingRulerActive) return;
    const handleMove = (e: MouseEvent) => {
      setRulerY(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [readingRulerActive]);

  // Subscribe to live captions from PipSpeech
  useEffect(() => {
    const unsub = pipSpeech.subscribeCaptions((text, speaking) => {
      setCurrentCaption(text);
      setIsSpeaking(speaking);
    });
    return unsub;
  }, []);

  return (
    <>
      {/* SVG Color Blindness Simulation Filters for Protanopia, Deuteranopia, Tritanopia */}
      <svg className="hidden">
        <defs>
          {/* Protanopia (Red-Blind) */}
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0,     0, 0
                      0.558, 0.442, 0,     0, 0
                      0,     0.242, 0.758, 0, 0
                      0,     0,     0,     1, 0"
            />
          </filter>

          {/* Deuteranopia (Green-Blind) */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0,   0, 0
                      0.7,   0.3,   0,   0, 0
                      0,     0.3,   0.7, 0, 0
                      0,     0,     0,   1, 0"
            />
          </filter>

          {/* Tritanopia (Blue-Blind) */}
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05,  0,     0, 0
                      0,    0.433, 0.567, 0, 0
                      0,    0.475, 0.525, 0, 0
                      0,    0,     0,     1, 0"
            />
          </filter>

          {/* Monochrome (Achromatopsia) */}
          <filter id="monochrome-filter">
            <feColorMatrix
              type="matrix"
              values="0.299, 0.587, 0.114, 0, 0
                      0.299, 0.587, 0.114, 0, 0
                      0.299, 0.587, 0.114, 0, 0
                      0,     0,     0,     1, 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Visual Sound Flash Indicator for Deaf / Hard of Hearing */}
      {visualAlertActive && (
        <div className="fixed inset-0 pointer-events-none z-[11000] border-4 border-cyan-400 animate-ping opacity-75" />
      )}

      {/* Dyslexia Reading Ruler Guide Line */}
      {readingRulerActive && (
        <div
          style={{ top: `${rulerY - 24}px` }}
          className="fixed left-0 right-0 h-14 pointer-events-none z-[9998] bg-yellow-300/15 border-y-2 border-yellow-400/50 backdrop-blur-[0.5px] shadow-sm transition-transform duration-75"
        >
          <div className="absolute right-4 top-1 text-[10px] font-mono text-yellow-300 bg-black/60 px-2 py-0.5 rounded">
            Dyslexia Focus Guide
          </div>
        </div>
      )}

      {/* Live Captions HUD for Deaf / Hard of Hearing & Cognitive Clarity */}
      {liveCaptionsEnabled && currentCaption && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[9999] w-11/12 max-w-3xl glass-panel-glow border-2 border-cyan-400/60 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl animate-bubble-pop">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-widest font-mono">
                Pip Live Voice Caption
              </span>
            </div>
            <button
              onClick={() => setCurrentCaption('')}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed font-sans">
            "{currentCaption}"
          </p>
        </div>
      )}
    </>
  );
};
