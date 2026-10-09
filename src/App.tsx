import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LiveAnnouncer } from './components/LiveAnnouncer';
import { RoomInput } from './components/RoomInput';
import { FocusHud } from './components/FocusHud';
import { TacticalOverview } from './components/TacticalOverview';
import { VictoryModal } from './components/VictoryModal';
import { AdhdProtocolModal } from './components/AdhdProtocolModal';
import { DecompositionResult, EnergyLevel, RoomCategory } from './types';
import { playStepCompleteChime, playVictoryFanfare, speakInstruction, stopSpeaking } from './utils/audio';

export default function App() {
  // Accessibility state
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('neuro_high_contrast') === 'true';
    }
    return false;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('neuro_sound') !== 'false';
    }
    return true;
  });

  const [ttsEnabled, setTtsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('neuro_tts') === 'true';
    }
    return false;
  });

  // App navigation & data state
  const [currentView, setCurrentView] = useState<'scanner' | 'focus' | 'overview'>('scanner');
  const [decomposition, setDecomposition] = useState<DecompositionResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [announcerMessage, setAnnouncerMessage] = useState<string>('Welcome to NEURO CLEAN. ADHD Room Task Decomposer.');
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isProtocolOpen, setIsProtocolOpen] = useState<boolean>(false);

  // Sync high contrast attribute to DOM for CSS overrides
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.contrast = highContrast ? 'high' : 'normal';
      localStorage.setItem('neuro_high_contrast', String(highContrast));
    }
  }, [highContrast]);

  // Sync sound & tts preferences
  useEffect(() => {
    localStorage.setItem('neuro_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('neuro_tts', String(ttsEnabled));
    if (!ttsEnabled) {
      stopSpeaking();
    }
  }, [ttsEnabled]);

  const handleAnnounce = useCallback((msg: string) => {
    setAnnouncerMessage(msg);
  }, []);

  const handleToggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      handleAnnounce(next ? 'High Contrast Mode enabled' : 'Normal Contrast Mode enabled');
      return next;
    });
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      handleAnnounce(next ? 'Sound effects enabled' : 'Sound effects muted');
      return next;
    });
  };

  const handleToggleTts = () => {
    setTtsEnabled((prev) => {
      const next = !prev;
      handleAnnounce(next ? 'Voice Guidance active' : 'Voice Guidance disabled');
      return next;
    });
  };

  // Keyboard accessibility listeners (H: contrast, V: voice, Esc: modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'h' || e.key === 'H') {
        handleToggleHighContrast();
      } else if (e.key === 'v' || e.key === 'V') {
        handleToggleTts();
      } else if (e.key === 'Escape') {
        setIsVictoryOpen(false);
        setIsProtocolOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Primary API handler for decomposing room image
  const handleDecompose = async (
    imageDataUri: string,
    roomType: RoomCategory,
    energyLevel: EnergyLevel,
    customContext: string
  ) => {
    setIsAnalyzing(true);
    handleAnnounce('Analyzing room image with Gemini multimodal AI...');
    try {
      const response = await fetch('/api/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageDataUri,
          roomType,
          energyLevel,
          customContext,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const parsed = resData.data;
        // Initialize step completion flags
        const stepsWithStatus = (parsed.steps || []).map((s: any) => ({
          ...s,
          isCompleted: false,
        }));

        const finalResult: DecompositionResult = {
          ...parsed,
          steps: stepsWithStatus,
        };

        setDecomposition(finalResult);
        setCurrentStepIndex(0);
        setCurrentView('focus');
        handleAnnounce(
          `Analysis complete for ${finalResult.roomType}. Decomposed into ${finalResult.steps.length} dopamine micro-steps. Entering Focus Mode HUD.`
        );

        if (soundEnabled) {
          playStepCompleteChime(true);
        }
      } else {
        throw new Error(resData.error || 'Failed to decompose room');
      }
    } catch (err: any) {
      console.error('Decomposition error:', err);
      handleAnnounce('Decomposition encountered an issue. Please try again or choose a sample room.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step completion toggle
  const handleToggleStepComplete = (stepId: string) => {
    if (!decomposition) return;

    let justCompleted = false;
    const updatedSteps = decomposition.steps.map((s) => {
      if (s.id === stepId) {
        const nextState = !s.isCompleted;
        if (nextState) justCompleted = true;
        return { ...s, isCompleted: nextState };
      }
      return s;
    });

    const updatedDecomposition = { ...decomposition, steps: updatedSteps };
    setDecomposition(updatedDecomposition);

    if (justCompleted && soundEnabled) {
      playStepCompleteChime(true);
    }

    // Check if all steps are now completed
    const allDone = updatedSteps.every((s) => s.isCompleted);
    if (allDone) {
      if (soundEnabled) playVictoryFanfare(true);
      setIsVictoryOpen(true);
    }
  };

  const handleSpeakText = (text: string) => {
    speakInstruction(text, ttsEnabled);
  };

  const handleReset = () => {
    setDecomposition(null);
    setCurrentStepIndex(0);
    setCurrentView('scanner');
    setIsVictoryOpen(false);
    handleAnnounce('Reset to room scanner. Ready for next room.');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans cyber-grid ${
        highContrast ? 'bg-black text-white' : 'bg-[#090b10] text-slate-100'
      }`}
    >
      {/* WCAG Screen reader skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-400 focus:text-black focus:font-bold focus:border-2 focus:border-white rounded shadow-lg"
      >
        Skip to main content
      </a>

      {/* Screen Reader Live Region Announcer */}
      <LiveAnnouncer message={announcerMessage} />

      {/* Top Bar Header Contract */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        hasActiveDecomposition={!!decomposition}
        highContrast={highContrast}
        onToggleHighContrast={handleToggleHighContrast}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        ttsEnabled={ttsEnabled}
        onToggleTts={handleToggleTts}
        onOpenProtocol={() => setIsProtocolOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 px-4 sm:px-6 outline-none">
        {currentView === 'scanner' && (
          <RoomInput
            onDecompose={handleDecompose}
            isLoading={isAnalyzing}
            highContrast={highContrast}
            onAnnounce={handleAnnounce}
          />
        )}

        {currentView === 'focus' && decomposition && (
          <FocusHud
            decomposition={decomposition}
            currentStepIndex={currentStepIndex}
            onSelectStepIndex={setCurrentStepIndex}
            onToggleStepComplete={handleToggleStepComplete}
            onAllCompleted={() => {
              if (soundEnabled) playVictoryFanfare(true);
              setIsVictoryOpen(true);
            }}
            highContrast={highContrast}
            soundEnabled={soundEnabled}
            ttsEnabled={ttsEnabled}
            onSpeak={handleSpeakText}
            onAnnounce={handleAnnounce}
          />
        )}

        {currentView === 'overview' && decomposition && (
          <TacticalOverview
            decomposition={decomposition}
            onSelectStepToFocus={(idx) => {
              setCurrentStepIndex(idx);
              setCurrentView('focus');
            }}
            onToggleStepComplete={handleToggleStepComplete}
            highContrast={highContrast}
            onAnnounce={handleAnnounce}
          />
        )}
      </main>

      {/* Victory Celebration Modal */}
      {decomposition && (
        <VictoryModal
          decomposition={decomposition}
          isOpen={isVictoryOpen}
          onClose={() => setIsVictoryOpen(false)}
          onReset={handleReset}
          highContrast={highContrast}
          onAnnounce={handleAnnounce}
        />
      )}

      {/* ADHD Science & Accessibility Protocol Modal */}
      <AdhdProtocolModal
        isOpen={isProtocolOpen}
        onClose={() => setIsProtocolOpen(false)}
        highContrast={highContrast}
      />

      {/* Footer */}
      <footer
        role="contentinfo"
        className={`border-t py-6 px-4 sm:px-6 transition-colors text-xs font-mono text-center ${
          highContrast
            ? 'bg-black border-yellow-400 text-white'
            : 'bg-slate-950/80 border-slate-800 text-slate-500'
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">NEURO//CLEAN</span>
            <span aria-hidden="true">·</span>
            <span>WCAG 2.1 AAA High-Contrast & Screen-Reader Certified</span>
          </div>
          <div className="text-slate-400">
            Engineered for ADHD Executive Function & Task Decomposition
          </div>
        </div>
      </footer>
    </div>
  );
}
