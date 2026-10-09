import React, { useEffect, useRef } from 'react';
import { Trophy, Sparkles, CheckCircle2, RotateCcw, X, Share2 } from 'lucide-react';
import { DecompositionResult } from '../types';

interface VictoryModalProps {
  decomposition: DecompositionResult;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  highContrast: boolean;
  onAnnounce: (msg: string) => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  decomposition,
  isOpen,
  onClose,
  onReset,
  highContrast,
  onAnnounce,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      onAnnounce('Victory! All room decluttering steps completed! Dopamine mission cleared.');

      // Check for prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || !canvasRef.current) return;

      // Pure HTML5 Canvas confetti particles (Zero external dependency bloat)
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        rotation: number;
        vRotation: number;
      }> = [];

      const colors = ['#00f0ff', '#f59e0b', '#10b981', '#ec4899', '#ffffff'];

      for (let i = 0; i < 90; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 0.7) * 18,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          vRotation: (Math.random() - 0.5) * 8,
        });
      }

      let animationFrameId: number;
      let frameCount = 0;

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frameCount++;

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // Gravity
          p.rotation += p.vRotation;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        });

        if (frameCount < 160) {
          animationFrameId = requestAnimationFrame(render);
        }
      };

      render();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSteps = decomposition.steps.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      {/* Confetti canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
        aria-hidden="true"
      />

      <div
        className={`relative z-20 w-full max-w-lg p-6 sm:p-8 rounded-2xl border text-center transition-all ${
          highContrast
            ? 'bg-black border-yellow-400 text-white'
            : 'bg-slate-900 border-slate-700 text-slate-100 shadow-[0_0_50px_rgba(0,240,255,0.2)]'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close victory modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
          <Trophy className="w-8 h-8 text-yellow-400" aria-hidden="true" />
        </div>

        <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mb-1">
          EXECUTIVE FUNCTION UNLOCKED
        </div>

        <h2
          id="victory-title"
          className="text-2xl sm:text-3xl font-extrabold text-white mb-2"
        >
          Room Mission Cleared!
        </h2>

        <p className="text-slate-300 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
          You broke through task paralysis, honored your executive bandwidth, and finished all {totalSteps} dopamine micro-steps!
        </p>

        {/* Victory Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
            <div className="text-[11px] font-mono text-slate-400">Micro-Wins Cleared</div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {totalSteps} Tasks (100%)
            </div>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
            <div className="text-[11px] font-mono text-slate-400">Target Time Conquered</div>
            <div className="text-lg font-bold font-mono text-cyan-300">
              ~{decomposition.totalEstimatedMinutes} Minutes
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className={`w-full py-3 px-4 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-2 min-h-[44px] transition-colors ${
              highContrast
                ? 'bg-yellow-400 text-black border border-white hover:bg-yellow-300'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black'
            }`}
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>SCAN ANOTHER ROOM</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-lg font-mono text-xs border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 min-h-[44px]"
          >
            Review Wave List
          </button>
        </div>
      </div>
    </div>
  );
};
