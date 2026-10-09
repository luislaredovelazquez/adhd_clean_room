import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, CheckCircle2, ChevronRight, ChevronLeft, Volume2, Sparkles, Split, ArrowRight, ShieldCheck } from 'lucide-react';
import { DecompositionResult, DecompositionStep } from '../types';

interface FocusHudProps {
  decomposition: DecompositionResult;
  currentStepIndex: number;
  onSelectStepIndex: (idx: number) => void;
  onToggleStepComplete: (stepId: string) => void;
  onAllCompleted: () => void;
  highContrast: boolean;
  soundEnabled: boolean;
  ttsEnabled: boolean;
  onSpeak: (text: string) => void;
  onAnnounce: (msg: string) => void;
}

export const FocusHud: React.FC<FocusHudProps> = ({
  decomposition,
  currentStepIndex,
  onSelectStepIndex,
  onToggleStepComplete,
  onAllCompleted,
  highContrast,
  soundEnabled,
  ttsEnabled,
  onSpeak,
  onAnnounce,
}) => {
  const step: DecompositionStep | undefined = decomposition.steps[currentStepIndex];
  
  // Timer state (seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeSubsteps, setActiveSubsteps] = useState<string[]>([]);
  const [isSubdividing, setIsSubdividing] = useState<boolean>(false);
  const [substepsCompleted, setSubstepsCompleted] = useState<Record<number, boolean>>({});

  // Reset timer when active step changes
  useEffect(() => {
    if (step) {
      const defaultSeconds = (step.estimatedMinutes || 3) * 60;
      setSecondsRemaining(defaultSeconds);
      setIsTimerRunning(false);
      setActiveSubsteps(step.substeps || []);
      setSubstepsCompleted({});

      // Announce new step to screen reader and voice if TTS enabled
      const announcement = `Step ${currentStepIndex + 1} of ${decomposition.steps.length}: ${step.title}. Estimated time: ${step.estimatedMinutes} minutes.`;
      onAnnounce(announcement);
      if (ttsEnabled) {
        onSpeak(`${step.title}. ${step.instruction}`);
      }
    }
  }, [currentStepIndex, step?.id]);

  // Timer countdown ticker
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            onAnnounce('Timer finished! Fantastic job on this step.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  if (!step) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>No steps found. Please return to the scanner to decompose your room.</p>
      </div>
    );
  }

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    const nextState = !isTimerRunning;
    setIsTimerRunning(nextState);
    onAnnounce(nextState ? `Timer started: ${formatTime(secondsRemaining)} remaining` : 'Timer paused');
  };

  const handleAddMinute = () => {
    setSecondsRemaining((prev) => prev + 60);
    onAnnounce('Added 1 minute to timer');
  };

  const handleResetTimer = () => {
    const defaultSeconds = (step.estimatedMinutes || 3) * 60;
    setSecondsRemaining(defaultSeconds);
    setIsTimerRunning(false);
    onAnnounce('Timer reset');
  };

  const handleCompleteCurrent = () => {
    onToggleStepComplete(step.id);
    onAnnounce(`Completed step ${currentStepIndex + 1}: ${step.title}! Dopamine reward unlocked.`);

    // Check if there is a next step
    if (currentStepIndex < decomposition.steps.length - 1) {
      onSelectStepIndex(currentStepIndex + 1);
    } else {
      // Check if all steps are complete
      onAllCompleted();
    }
  };

  const handleSubdivideFurther = async () => {
    setIsSubdividing(true);
    onAnnounce('Breaking down step into micro-actions...');
    try {
      const res = await fetch('/api/subdivide-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepTitle: step.title,
          stepInstruction: step.instruction,
        }),
      });
      const data = await res.json();
      if (data.substeps && Array.isArray(data.substeps)) {
        setActiveSubsteps(data.substeps);
        setSubstepsCompleted({});
        onAnnounce(`Task split into ${data.substeps.length} ultra-tiny 30-second actions.`);
      }
    } catch (err) {
      console.error('Error subdividing:', err);
      setActiveSubsteps([
        'Look at just 1 item directly in front of you',
        'Move that single item 6 inches towards its home',
        'Put that 1 item away completely',
        'Take a deep breath and smile!',
      ]);
    } finally {
      setIsSubdividing(false);
    }
  };

  const completedCount = decomposition.steps.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / decomposition.steps.length) * 100);

  return (
    <section aria-labelledby="focus-step-heading" className="w-full max-w-4xl mx-auto py-6 sm:py-8">
      {/* Top Breadcrumb & Step Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className={highContrast ? 'text-yellow-400 font-bold' : 'text-cyan-400 font-bold'}>
            STEP {currentStepIndex + 1} OF {decomposition.steps.length}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">ZONE: {step.targetZone}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">{step.estimatedMinutes} MIN TARGET</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Step Back & Forward Navigation */}
          <button
            type="button"
            onClick={() => onSelectStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            aria-label="Previous step"
            className="p-1.5 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          <span className="text-xs font-mono text-slate-400">
            {completedCount}/{decomposition.steps.length} Done ({progressPercent}%)
          </span>

          <button
            type="button"
            onClick={() => onSelectStepIndex(Math.min(decomposition.steps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === decomposition.steps.length - 1}
            aria-label="Next step"
            className="p-1.5 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Progress Bar (Accessible with ARIA) */}
      <div
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Overall room decluttering progress"
        className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-6"
      >
        <div
          className={`h-full transition-all duration-300 ${
            highContrast ? 'bg-yellow-400' : 'bg-cyan-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Single-Step Dopamine Cockpit Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all shadow-2xl relative overflow-hidden ${
          highContrast
            ? 'bg-black border-yellow-400 text-white'
            : 'bg-slate-900/90 border-slate-700 text-slate-100 shadow-[0_0_35px_rgba(0,240,255,0.06)]'
        }`}
      >
        {/* Cyberpunk HUD Frame tabs */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-yellow-400 to-cyan-500 opacity-60" aria-hidden="true" />

        {/* Step Title & Read Aloud action */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider mb-2 border uppercase bg-cyan-950/40 text-cyan-300 border-cyan-800/60">
              ONE THING AT A TIME MODE
            </div>
            <h1
              id="focus-step-heading"
              className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight"
            >
              {step.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => onSpeak(`${step.title}. ${step.instruction}`)}
            aria-label="Read instruction aloud"
            className="self-start sm:self-auto px-3 py-1.5 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <span>Read Aloud</span>
          </button>
        </div>

        {/* Hyper-specific Instruction */}
        <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-6 font-normal">
          {step.instruction}
        </p>

        {/* ADHD Cognitive Anchors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* 1. Physical Anchor (Where to look) */}
          <div
            className={`p-4 rounded-xl border text-xs ${
              highContrast
                ? 'bg-black border-white'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Physical Eye Anchor</span>
            </div>
            <p className="text-slate-300">
              {step.physicalAnchor || 'Focus only on the nearest items in this zone.'}
            </p>
          </div>

          {/* 2. Dopamine Anchor (Why it feels good) */}
          <div
            className={`p-4 rounded-xl border text-xs ${
              highContrast
                ? 'bg-black border-white'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-yellow-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Dopamine Win</span>
            </div>
            <p className="text-slate-300">
              {step.dopamineAnchor || 'Instant visual declutter with zero brain friction.'}
            </p>
          </div>
        </div>

        {/* Interactive Built-in Micro-Timer */}
        <div
          className={`p-5 rounded-xl border mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 ${
            highContrast
              ? 'bg-black border-yellow-400'
              : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`font-mono text-3xl sm:text-4xl font-extrabold tracking-widest tabular-nums ${
                isTimerRunning
                  ? highContrast
                    ? 'text-yellow-400'
                    : 'text-cyan-400'
                  : 'text-slate-300'
              }`}
              aria-live="off"
            >
              {formatTime(secondsRemaining)}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              <div>TARGET: {step.estimatedMinutes} MINS</div>
              <div className="text-[11px] text-slate-500">
                {isTimerRunning ? 'Timer active' : 'Paused'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleToggleTimer}
              aria-label={isTimerRunning ? 'Pause timer' : 'Start timer'}
              className={`px-4 py-2.5 rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 transition-colors min-h-[44px] ${
                isTimerRunning
                  ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                  : highContrast
                  ? 'bg-yellow-400 text-black border border-white hover:bg-yellow-300'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
              <span>{isTimerRunning ? 'PAUSE' : 'START TIMER'}</span>
            </button>

            <button
              type="button"
              onClick={handleAddMinute}
              aria-label="Add 1 minute to timer"
              className="px-3 py-2.5 rounded-lg font-mono text-xs border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 min-h-[44px] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>+1m</span>
            </button>

            <button
              type="button"
              onClick={handleResetTimer}
              aria-label="Reset timer"
              className="p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Micro-actions / Freeze Response Breaker */}
        {activeSubsteps.length > 0 && (
          <div className="mb-8 p-4 rounded-xl border border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                Tiny 30-Second Micro-Actions:
              </span>
              <button
                type="button"
                onClick={handleSubdivideFurther}
                disabled={isSubdividing}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 disabled:opacity-50"
              >
                <Split className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Make Even Smaller</span>
              </button>
            </div>

            <ul className="space-y-2">
              {activeSubsteps.map((sub, idx) => {
                const isChecked = !!substepsCompleted[idx];
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => {
                        setSubstepsCompleted((prev) => ({ ...prev, [idx]: !prev[idx] }));
                        onAnnounce(`Subtask ${idx + 1} marked ${!isChecked ? 'done' : 'incomplete'}`);
                      }}
                      className={`w-full text-left p-2.5 rounded border text-xs flex items-center gap-3 transition-colors ${
                        isChecked
                          ? 'bg-emerald-950/30 border-emerald-800/50 text-slate-400 line-through'
                          : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-slate-600'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
                      </div>
                      <span>{sub}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* PRIMARY ACTION: "I DID THIS!" (Celebration Button) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-mono">
            {step.isCompleted ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                Step marked completed!
              </span>
            ) : (
              <span>Reward upon finishing: {step.microReward || 'Take a victory breath and sip water.'}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCompleteCurrent}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-mono font-extrabold tracking-wider text-base transition-all flex items-center justify-center gap-2 shadow-xl min-h-[52px] ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-white hover:bg-yellow-300'
                : 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-cyan-500/20'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-black" aria-hidden="true" />
            <span>I DID THIS! (NEXT STEP)</span>
            <ArrowRight className="w-5 h-5 text-black" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
