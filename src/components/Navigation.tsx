import React from 'react';
import { Shield, CheckSquare, BarChart3, Settings, Flame, FileText, Smartphone } from 'lucide-react';

interface NavigationProps {
  currentTab: 'dashboard' | 'tasks' | 'analytics' | 'settings';
  onSelectTab: (tab: 'dashboard' | 'tasks' | 'analytics' | 'settings') => void;
  streakCount: number;
  onOpenSimulator: () => void;
  onOpenPRD: () => void;
  accessibilityActive: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  streakCount,
  onOpenSimulator,
  onOpenPRD,
  accessibilityActive
}) => {
  return (
    <>
      {/* Top Android App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-rose-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  accessibilityActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
                title={accessibilityActive ? 'Accessibility Service active' : 'Accessibility Service paused'}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-100 text-base tracking-tight">ReelGuard</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Android Native
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {accessibilityActive ? 'Monitoring IG, YT & FB' : 'Monitoring Paused'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{streakCount}d streak</span>
            </div>

            {/* Test Simulator Button */}
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-medium shadow-sm shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
              title="Test simulated Reels feed and trigger limit lock"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Test</span> Reels
            </button>

            {/* PRD & Technical Spec */}
            <button
              onClick={onOpenPRD}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
              title="View PRD & Android Kotlin Architecture Specification"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Android Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 py-2 px-4 shadow-xl">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentTab === 'dashboard'
                ? 'text-rose-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <Shield className={`w-5 h-5 mb-0.5 ${currentTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] tracking-tight">Today</span>
          </button>

          <button
            onClick={() => onSelectTab('tasks')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentTab === 'tasks'
                ? 'text-rose-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <CheckSquare className={`w-5 h-5 mb-0.5 ${currentTab === 'tasks' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] tracking-tight">Tasks & Alarm</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentTab === 'analytics'
                ? 'text-rose-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <BarChart3 className={`w-5 h-5 mb-0.5 ${currentTab === 'analytics' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] tracking-tight">Screen Time</span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentTab === 'settings'
                ? 'text-rose-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <Settings className={`w-5 h-5 mb-0.5 ${currentTab === 'settings' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] tracking-tight">Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
};
