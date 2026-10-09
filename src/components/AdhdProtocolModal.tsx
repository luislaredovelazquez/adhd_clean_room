import React from 'react';
import { X, BookOpen, Brain, Zap, Target, Eye, Keyboard } from 'lucide-react';

interface AdhdProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
}

export const AdhdProtocolModal: React.FC<AdhdProtocolModalProps> = ({
  isOpen,
  onClose,
  highContrast,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="protocol-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className={`relative w-full max-w-2xl my-8 p-6 sm:p-8 rounded-2xl border transition-all max-h-[90vh] overflow-y-auto ${
          highContrast
            ? 'bg-black border-yellow-400 text-white'
            : 'bg-slate-900 border-slate-700 text-slate-100 shadow-2xl'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close ADHD Protocol guide"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
          <Brain className="w-4 h-4" aria-hidden="true" />
          <span>Neurodiversity & Executive Function</span>
        </div>

        <h2
          id="protocol-title"
          className="text-2xl font-extrabold text-white tracking-tight mb-4"
        >
          Why "Clean The Kitchen" Paralyzes ADHD Brains
        </h2>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
            <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" aria-hidden="true" />
              1. The "100 Decisions at Once" Wall
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              When a neurotypical person looks at a messy room, their prefrontal cortex automatically filters background objects. In an ADHD brain, working memory lacks this automatic gatekeeper. Looking at 40 items triggers 40 simultaneous micro-decisions, leading to dopamine exhaustion and the physical freeze response.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
            <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              2. The Task Decomposition Antidote
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              NEURO//CLEAN replaces vague macro-goals with <strong>Zero-Decision Waves</strong>. By telling you: <em>"Pick up ONLY trash; ignore dirty dishes completely,"</em> your brain only has to make one simple classification. Finishing a 3-minute wave provides a quick dopamine release that kickstarts self-sustaining momentum.
            </p>
          </div>

          {/* Section 3: WCAG & Accessibility */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
            <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              3. Built for WCAG 2.1 & Sensory Needs
            </h3>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 list-disc pl-5">
              <li><strong>High Contrast Mode (Level AAA):</strong> Stark 7:1+ contrast to reduce eye fatigue and visual ambiguity.</li>
              <li><strong>Screen Reader Announcements:</strong> Live regions announce each step, timer alerts, and progress states.</li>
              <li><strong>Hands-Free Voice Guidance:</strong> Reads instructions aloud so you can clean without looking back at your phone or screen.</li>
              <li><strong>Reduced Motion Compliance:</strong> Freezes particle bursts and glow pulses for vestibular sensitivity.</li>
            </ul>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
            <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              Keyboard Navigation Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Toggle Contrast</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-yellow-300 font-bold">H</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Start/Pause Timer</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">T</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Voice Guidance</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold">V</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Close Window</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold">ESC</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg font-mono font-bold text-xs ${
              highContrast
                ? 'bg-yellow-400 text-black border border-white'
                : 'bg-cyan-500 text-black hover:bg-cyan-400'
            }`}
          >
            GOT IT, LET'S CLEAN
          </button>
        </div>
      </div>
    </div>
  );
};
