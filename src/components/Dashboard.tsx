import React from 'react';
import { 
  Play, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Award
} from 'lucide-react';
import { DailyLimit, DailyScreenTimeLog, TaskItem, AppId } from '../types';
import { APPS_DATA } from '../data/mockData';

interface DashboardProps {
  logs: DailyScreenTimeLog[];
  limits: DailyLimit[];
  tasks: TaskItem[];
  streak: number;
  bonusMinutes: number;
  unlockedUntil: number;
  onOpenSimulator: (appId?: AppId) => void;
  onNavigateTab: (tab: 'dashboard' | 'tasks' | 'analytics' | 'settings') => void;
  onToggleTask: (taskId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  logs,
  limits,
  tasks,
  streak,
  bonusMinutes,
  unlockedUntil,
  onOpenSimulator,
  onNavigateTab,
  onToggleTask
}) => {
  const today = logs[logs.length - 1] || {
    date: '2026-09-16',
    dayLabel: 'Today',
    instagramMinutes: 8,
    youtubeMinutes: 6,
    facebookMinutes: 2,
    instagramReels: 5,
    youtubeShorts: 4,
    facebookReels: 1,
    limitBreached: false
  };

  const totalReelsToday = today.instagramReels + today.youtubeShorts + today.facebookReels;
  const totalScreenTimeMinutes = today.instagramMinutes + today.youtubeMinutes + today.facebookMinutes;

  const globalLimit = limits.find(l => l.appName === 'global') || {
    id: 'limit-global',
    appName: 'global',
    limitType: 'count' as const,
    limitValue: 20,
    resetTime: '00:00',
    strictMode: false
  };

  const isCountLimit = globalLimit.limitType === 'count';
  const limitValue = globalLimit.limitValue;
  const currentValue = isCountLimit ? totalReelsToday : totalScreenTimeMinutes;
  const remainingValue = Math.max(0, limitValue - currentValue);
  const percentageUsed = Math.min(100, Math.round((currentValue / limitValue) * 100));

  const isNearLimit = percentageUsed >= 75 && percentageUsed < 100;
  const isOverLimit = percentageUsed >= 100;

  const isTempUnlocked = unlockedUntil > Date.now();
  const unlockedSecondsLeft = isTempUnlocked ? Math.max(0, Math.round((unlockedUntil - Date.now()) / 1000)) : 0;

  // Pending tasks
  const pendingTasks = tasks.filter(t => !t.isDone);
  const completedTasks = tasks.filter(t => t.isDone);

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto px-4 pt-2">
      {/* Temporary Emergency Unlock Banner */}
      {isTempUnlocked && (
        <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between text-amber-200">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-400 animate-spin" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Emergency Unlock Active</p>
              <p className="text-xs text-amber-200/80">Temporary bypass active for {Math.floor(unlockedSecondsLeft / 60)}m {unlockedSecondsLeft % 60}s</p>
            </div>
          </div>
          <button
            onClick={() => onOpenSimulator()}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
          >
            Open Feed
          </button>
        </div>
      )}

      {/* Main Status Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
        {/* Background glow */}
        <div 
          className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${
            isOverLimit ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-indigo-500'
          }`} 
        />

        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Today's Reel Allowance
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-white">{currentValue}</span>
              <span className="text-slate-400 text-lg font-medium">/ {limitValue} {isCountLimit ? 'reels' : 'mins'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {remainingValue > 0 ? (
                <span className="text-emerald-400 font-medium">{remainingValue} {isCountLimit ? 'reels' : 'minutes'} left today</span>
              ) : (
                <span className="text-rose-400 font-semibold">Limit reached • Blocker active</span>
              )}
              {bonusMinutes > 0 && (
                <span className="text-purple-300 ml-1.5">(+{bonusMinutes}m bonus earned)</span>
              )}
            </p>
          </div>

          {/* Circular Visual Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 72 72">
              <circle
                cx="36"
                cy="36"
                r="30"
                className="stroke-slate-800"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="36"
                cy="36"
                r="30"
                className={`transition-all duration-700 ease-out ${
                  isOverLimit ? 'stroke-rose-500' : isNearLimit ? 'stroke-amber-500' : 'stroke-rose-500'
                }`}
                strokeWidth="6"
                strokeDasharray={188.5}
                strokeDashoffset={188.5 - (188.5 * percentageUsed) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-sm font-bold text-white">{percentageUsed}%</span>
              <span className="text-[9px] text-slate-400">used</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOverLimit
                  ? 'bg-rose-500'
                  : isNearLimit
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-purple-500 to-rose-500'
              }`}
              style={{ width: `${Math.min(100, percentageUsed)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
            <span>Reset at 00:00 Midnight</span>
            <span>Total screen time: <strong className="text-slate-200">{totalScreenTimeMinutes}m</strong></span>
          </div>
        </div>

        {/* Interactive Simulator Trigger button */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-white block">Test Accessibility Blocker</span>
            <span className="text-slate-400 text-[11px]">Simulate scrolling reels until limit triggers lock</span>
          </div>
          <button
            onClick={() => onOpenSimulator()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 active:scale-95 transition-transform cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Feed</span>
          </button>
        </div>
      </div>

      {/* Streak & Time Saved Card */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-1.5">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Clean Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">{streak} Days</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Staying disciplined under limit</p>
        </div>

        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Time Saved</span>
          </div>
          <p className="text-2xl font-bold text-white">~1h 45m</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Reclaimed vs avg 2.5h addiction</p>
        </div>
      </div>

      {/* Per-App Reel Breakdown Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Monitored Apps (Accessibility Service)</h2>
          <button 
            onClick={() => onNavigateTab('settings')}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
          >
            Edit Limits
          </button>
        </div>

        {/* Instagram */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">IG</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-sm">Instagram Reels</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {today.instagramReels} reels watched • {today.instagramMinutes}m total time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenSimulator('instagram')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                title="Test Instagram Reels simulator"
              >
                Simulate
              </button>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-rose-600 h-full rounded-full" 
              style={{ width: `${Math.min(100, (today.instagramReels / 10) * 100)}%` }}
            />
          </div>
        </div>

        {/* YouTube Shorts */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">YT</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-sm">YouTube Shorts</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/10 text-red-300 border border-red-500/20 font-medium">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {today.youtubeShorts} shorts watched • {today.youtubeMinutes}m total time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenSimulator('youtube')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                title="Test YouTube Shorts simulator"
              >
                Simulate
              </button>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-red-500 h-full rounded-full" 
              style={{ width: `${Math.min(100, (today.youtubeShorts / 10) * 100)}%` }}
            />
          </div>
        </div>

        {/* Facebook Reels */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">FB</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-sm">Facebook Reels</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {today.facebookReels} reels watched • {today.facebookMinutes}m total time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenSimulator('facebook')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                title="Test Facebook Reels simulator"
              >
                Simulate
              </button>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full" 
              style={{ width: `${Math.min(100, (today.facebookReels / 5) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task & Alarm System Integration Card */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Daily Tasks & Reel Rewards</h2>
          </div>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            Manage <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Complete daily productive tasks to earn unlock credits when limit is reached.
        </p>

        <div className="space-y-2">
          {tasks.slice(0, 3).map(task => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                task.isDone
                  ? 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  task.isDone 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                    : 'border-slate-600 bg-slate-900'
                }`}>
                  {task.isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <p className={`text-xs font-medium ${task.isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.time}
                  </p>
                </div>
              </div>

              {task.linkedToLimit && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  task.isDone 
                    ? 'bg-slate-800 border-slate-700 text-slate-500' 
                    : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                }`}>
                  +{task.rewardMinutes}m reels
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
