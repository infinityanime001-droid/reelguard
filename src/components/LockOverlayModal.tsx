import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Home, 
  Sparkles, 
  AlertTriangle,
  Gift,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskItem, AppId } from '../types';
import { soundFx } from '../utils/audio';

interface LockOverlayModalProps {
  appName: AppId;
  reason: string;
  currentValue: number;
  limitValue: number;
  unit: 'reels' | 'minutes';
  strictMode: boolean;
  cooldownSeconds: number;
  tasks: TaskItem[];
  onDismiss: () => void;
  onEmergencyUnlock: (minutes: number) => void;
  onCompleteTaskUnlock: (taskId: string, rewardMinutes: number) => void;
}

export const LockOverlayModal: React.FC<LockOverlayModalProps> = ({
  appName,
  reason,
  currentValue,
  limitValue,
  unit,
  strictMode,
  cooldownSeconds,
  tasks,
  onDismiss,
  onEmergencyUnlock,
  onCompleteTaskUnlock
}) => {
  const [cooldownRunning, setCooldownRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(cooldownSeconds);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    soundFx.playLimitBlocked();
  }, []);

  // Friction cooldown timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && cooldownRunning) {
      soundFx.playUnlockSuccess();
      try {
        confetti({ particleCount: 30, spread: 60 });
      } catch (err) {
        console.error(err);
      }
    }
    return () => clearInterval(timer);
  }, [cooldownRunning, secondsRemaining]);

  const startFrictionCooldown = () => {
    setCooldownRunning(true);
    setSecondsRemaining(cooldownSeconds);
  };

  const pendingLinkedTasks = tasks.filter(t => !t.isDone && t.linkedToLimit);

  const handleTaskUnlock = (task: TaskItem) => {
    soundFx.playUnlockSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    }
    onCompleteTaskUnlock(task.id, task.rewardMinutes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border-2 border-rose-500/50 p-6 shadow-2xl shadow-rose-950/80 text-center relative overflow-hidden">
        {/* Top Android System Alert Window Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold uppercase tracking-wider mb-4">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>SYSTEM_ALERT_WINDOW • ReelGuard Blocker</span>
        </div>

        {/* Lock Graphic */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-rose-600/40 mb-4 animate-pulse">
          <Lock className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">
          Daily Reel Limit Reached!
        </h2>
        <p className="text-xs text-rose-300 font-semibold mt-1">
          {reason}
        </p>

        {/* Stats card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-around text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">App</span>
            <span className="text-white font-bold capitalize">{appName}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Consumed</span>
            <span className="text-rose-400 font-bold">{currentValue} {unit}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Allowed</span>
            <span className="text-emerald-400 font-bold">{limitValue} {unit}</span>
          </div>
        </div>

        {/* Motivational Nudge */}
        <p className="text-xs text-slate-300 mt-4 px-2">
          "Your attention span is your most valuable asset. Take a breath and step away from the dopamine loop."
        </p>

        {/* Unlock Options Section */}
        <div className="mt-5 space-y-3 text-left">
          {/* Option 1: Complete a task to unlock */}
          {pendingLinkedTasks.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-purple-400" />
                  Option A: Complete a Task to Unlock
                </span>
                <span className="text-[10px] text-purple-300">Instant +10m</span>
              </div>
              <div className="space-y-1.5">
                {pendingLinkedTasks.slice(0, 2).map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskUnlock(task)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-purple-900/40 border border-purple-700/40 text-left flex items-center justify-between text-xs transition-all cursor-pointer group"
                  >
                    <span className="text-slate-200 group-hover:text-white truncate pr-2">
                      {task.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[10px] flex items-center gap-1 flex-shrink-0">
                      Claim +{task.rewardMinutes}m <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Option 2: Friction Cooldown or Strict */}
          {!strictMode ? (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Option B: Friction Cooldown
                </span>
                <span className="text-[10px] text-slate-400">{cooldownSeconds}s cooldown</span>
              </div>

              {!cooldownRunning ? (
                <button
                  onClick={startFrictionCooldown}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  Start {cooldownSeconds}s Friction Pause
                </button>
              ) : secondsRemaining > 0 ? (
                <div className="mt-2 text-center py-2 bg-amber-500/10 rounded-xl border border-amber-500/30">
                  <p className="text-amber-300 font-bold text-sm font-mono">
                    Take a deep breath: {secondsRemaining}s
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Bypass locked until timer completes</p>
                </div>
              ) : (
                <button
                  onClick={() => onEmergencyUnlock(10)}
                  className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer animate-pulse"
                >
                  Cooldown Done • Grant 10m Emergency Access
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-[11px] text-rose-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Strict Lockdown mode is active. Cooldown bypass is disabled.</span>
            </div>
          )}
        </div>

        {/* Primary Action: Close & Return to Home */}
        <div className="mt-5">
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Android Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
