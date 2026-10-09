import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Play, Sparkles, ChevronDown, ChevronUp, Layers, Check } from 'lucide-react';
import { DecompositionResult, DecompositionStep } from '../types';

interface TacticalOverviewProps {
  decomposition: DecompositionResult;
  onSelectStepToFocus: (stepIndex: number) => void;
  onToggleStepComplete: (stepId: string) => void;
  highContrast: boolean;
  onAnnounce: (msg: string) => void;
}

export const TacticalOverview: React.FC<TacticalOverviewProps> = ({
  decomposition,
  onSelectStepToFocus,
  onToggleStepComplete,
  highContrast,
  onAnnounce,
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const toggleExpand = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const completedCount = decomposition.steps.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / decomposition.steps.length) * 100);

  return (
    <section aria-labelledby="overview-heading" className="w-full max-w-5xl mx-auto py-6 sm:py-8">
      {/* Overview Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-semibold mb-1">
            <Layers className="w-4 h-4" aria-hidden="true" />
            <span>Tactical Room Wave Breakdown</span>
          </div>
          <h1
            id="overview-heading"
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
          >
            {decomposition.roomType} Mission Plan
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {decomposition.clutterSummary}
          </p>
        </div>

        {/* Total Time & Progress Metric */}
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-4 ${
            highContrast ? 'bg-black border-yellow-400 text-white' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">Estimated Total</div>
            <div className="font-mono text-lg font-bold text-cyan-300">
              ~{decomposition.totalEstimatedMinutes} Mins
            </div>
          </div>
          <div className="h-8 w-px bg-slate-700" aria-hidden="true" />
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">Progress</div>
            <div className="font-mono text-lg font-bold text-emerald-400">
              {progressPercent}% Done
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar (Accessible) */}
      <div
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Room decluttering progress"
        className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden mb-8"
      >
        <div
          className={`h-full transition-all duration-300 ${
            highContrast ? 'bg-yellow-400' : 'bg-cyan-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Encouragement / ADHD Coach Tip */}
      {decomposition.encouragement && (
        <div
          className={`mb-8 p-4 rounded-xl border text-sm leading-relaxed ${
            highContrast
              ? 'bg-black border-yellow-400 text-white'
              : 'bg-cyan-950/30 border-cyan-800/40 text-cyan-200'
          }`}
        >
          <div className="font-mono font-bold text-xs uppercase tracking-wider mb-1 text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            ADHD Coach Tip
          </div>
          <p>{decomposition.encouragement}</p>
        </div>
      )}

      {/* Waves Breakdown */}
      <div className="space-y-8">
        {(decomposition.waves && decomposition.waves.length > 0
          ? decomposition.waves
          : [{ id: 'all', name: 'Decomposed Action Waves', purpose: 'Step-by-step progress' }]
        ).map((wave, waveIdx) => {
          const waveSteps = decomposition.steps.filter(
            (s) => !s.waveId || s.waveId === wave.id || decomposition.waves.length <= 1
          );

          if (waveSteps.length === 0) return null;

          return (
            <div key={wave.id} className="space-y-3">
              {/* Wave Header */}
              <div className="border-b border-slate-800 pb-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                    <span className="text-cyan-400">0{waveIdx + 1}.</span>
                    <span>{wave.name}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{wave.purpose}</p>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  {waveSteps.filter((s) => s.isCompleted).length}/{waveSteps.length} Steps
                </div>
              </div>

              {/* Step Cards List */}
              <div className="space-y-2.5">
                {waveSteps.map((s) => {
                  const stepIndex = decomposition.steps.findIndex((item) => item.id === s.id);
                  const isExpanded = !!expandedSteps[s.id];

                  return (
                    <article
                      key={s.id}
                      className={`rounded-xl border transition-all ${
                        s.isCompleted
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                          : highContrast
                          ? 'bg-black border-yellow-400 text-white'
                          : 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-slate-700'
                      }`}
                    >
                      <div className="p-4 flex items-start justify-between gap-3">
                        {/* Checkbox */}
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={!!s.isCompleted}
                          aria-label={`Mark step ${s.title} as ${s.isCompleted ? 'incomplete' : 'complete'}`}
                          onClick={() => {
                            onToggleStepComplete(s.id);
                            onAnnounce(`Toggled ${s.title}`);
                          }}
                          className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            s.isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-black'
                              : 'border-slate-600 bg-slate-950 hover:border-cyan-400'
                          }`}
                        >
                          {s.isCompleted && <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />}
                        </button>

                        {/* Title and Summary */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-slate-400">
                              Zone: {s.targetZone}
                            </span>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              {s.estimatedMinutes}m
                            </span>
                          </div>

                          <h3
                            className={`text-sm sm:text-base font-bold ${
                              s.isCompleted ? 'line-through text-slate-400' : 'text-white'
                            }`}
                          >
                            {s.title}
                          </h3>

                          {/* Instruction */}
                          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                            {s.instruction}
                          </p>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="font-mono text-cyan-400 block mb-0.5">Where to look:</span>
                                <span className="text-slate-300">{s.physicalAnchor}</span>
                              </div>
                              <div>
                                <span className="font-mono text-yellow-400 block mb-0.5">Dopamine Reward:</span>
                                <span className="text-slate-300">{s.dopamineAnchor}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons: Jump to Focus HUD & Expand */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onSelectStepToFocus(stepIndex)}
                            aria-label={`Enter focus HUD for ${s.title}`}
                            title="Open in Single-Step Focus HUD"
                            className="px-2.5 py-1.5 rounded border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono font-medium flex items-center gap-1 min-h-[38px] transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" aria-hidden="true" />
                            <span className="hidden sm:inline">Focus</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleExpand(s.id)}
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${s.title}`}
                            className="p-2 rounded text-slate-400 hover:text-white"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="w-4 h-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
