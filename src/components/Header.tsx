import React from 'react';
import { Volume2, VolumeX, Eye, Sparkles, BookOpen, Mic, MicOff } from 'lucide-react';

interface HeaderProps {
  currentView: 'scanner' | 'focus' | 'overview';
  onSelectView: (view: 'scanner' | 'focus' | 'overview') => void;
  hasActiveDecomposition: boolean;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  onOpenProtocol: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  hasActiveDecomposition,
  highContrast,
  onToggleHighContrast,
  soundEnabled,
  onToggleSound,
  ttsEnabled,
  onToggleTts,
  onOpenProtocol,
}) => {
  return (
    <header
      role="banner"
      className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
        highContrast
          ? 'bg-black border-yellow-400 text-white'
          : 'bg-[#090b10]/95 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark in monospace display face) */}
        <button
          onClick={() => onSelectView('scanner')}
          aria-label="NEURO CLEAN, Return to scanner home"
          className="flex items-center gap-2 group text-left whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm"
        >
          <span className="font-mono font-bold tracking-wider text-lg sm:text-xl text-white">
            NEURO<span className={highContrast ? 'text-yellow-300' : 'text-cyan-400'}>//</span>CLEAN
          </span>
          <span className="hidden sm:inline-block text-xs font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
            ADHD HUD
          </span>
        </button>

        {/* Zone 2: Navigation Links (Single-line controls) */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectView('scanner')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentView === 'scanner'
                ? highContrast
                  ? 'border-yellow-400 text-yellow-300 font-bold'
                  : 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            Room Scanner
          </button>

          {hasActiveDecomposition && (
            <>
              <button
                onClick={() => onSelectView('focus')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 flex items-center gap-1.5 ${
                  currentView === 'focus'
                    ? highContrast
                      ? 'border-yellow-400 text-yellow-300 font-bold'
                      : 'border-cyan-400 text-cyan-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Focus Mode HUD
              </button>

              <button
                onClick={() => onSelectView('overview')}
                className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
                  currentView === 'overview'
                    ? highContrast
                      ? 'border-yellow-400 text-yellow-300 font-bold'
                      : 'border-cyan-400 text-cyan-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                Wave Checklist
              </button>
            </>
          )}

          <button
            onClick={onOpenProtocol}
            className="whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 border-transparent text-slate-400 hover:text-slate-100 flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            ADHD Science
          </button>
        </nav>

        {/* Zone 3: Primary Action & Accessibility Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Hands-Free Voice TTS Toggle */}
          <button
            onClick={onToggleTts}
            aria-label={ttsEnabled ? 'Disable Voice Guidance' : 'Enable Voice Guidance (Reads steps aloud)'}
            title={ttsEnabled ? 'Voice Guidance Active' : 'Enable Hands-Free Voice Guidance'}
            className={`p-2 rounded border text-xs flex items-center gap-1 transition-colors min-h-[40px] ${
              ttsEnabled
                ? highContrast
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                  : 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            {ttsEnabled ? <Mic className="w-4 h-4" aria-hidden="true" /> : <MicOff className="w-4 h-4" aria-hidden="true" />}
            <span className="sr-only sm:not-sr-only sm:inline text-xs font-mono">
              {ttsEnabled ? 'Voice: On' : 'Voice'}
            </span>
          </button>

          {/* Dopamine Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute Dopamine Audio Chimes' : 'Unmute Dopamine Audio Chimes'}
            title={soundEnabled ? 'Dopamine Chimes Active' : 'Chimes Muted'}
            className={`p-2 rounded border text-xs flex items-center gap-1 transition-colors min-h-[40px] ${
              soundEnabled
                ? highContrast
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                  : 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" aria-hidden="true" /> : <VolumeX className="w-4 h-4" aria-hidden="true" />}
            <span className="sr-only sm:not-sr-only sm:inline text-xs font-mono">
              {soundEnabled ? 'Audio: On' : 'Audio'}
            </span>
          </button>

          {/* High Contrast Mode Toggle (WCAG 2.1 AAA Compliant) */}
          <button
            onClick={onToggleHighContrast}
            aria-pressed={highContrast}
            aria-label={highContrast ? 'Disable High Contrast Mode' : 'Enable WCAG High Contrast Mode'}
            className={`px-3 py-2 rounded text-xs font-mono font-bold tracking-wide flex items-center gap-1.5 transition-all min-h-[40px] ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-white'
                : 'bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="whitespace-nowrap">
              {highContrast ? 'HIGH CONTRAST [ON]' : 'CONTRAST'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
