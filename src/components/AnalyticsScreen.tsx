import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Smartphone, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Activity
} from 'lucide-react';
import { DailyScreenTimeLog, DailyLimit, ReelSession } from '../types';

interface AnalyticsScreenProps {
  logs: DailyScreenTimeLog[];
  limits: DailyLimit[];
  sessions: ReelSession[];
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  logs,
  limits,
  sessions
}) => {
  const [activeMetric, setActiveMetric] = useState<'reels' | 'time'>('reels');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(logs.length - 1);

  const selectedDay = logs[selectedDayIndex] || logs[logs.length - 1];

  // Calculate weekly totals
  const totalReelsWeek = logs.reduce(
    (acc, cur) => acc + cur.instagramReels + cur.youtubeShorts + cur.facebookReels,
    0
  );
  const totalTimeWeek = logs.reduce(
    (acc, cur) => acc + cur.instagramMinutes + cur.youtubeMinutes + cur.facebookMinutes,
    0
  );
  const avgReelsPerDay = Math.round(totalReelsWeek / logs.length);
  const avgTimePerDay = Math.round(totalTimeWeek / logs.length);

  // Maximum value for chart scaling
  const maxMetricVal = Math.max(
    ...logs.map(d =>
      activeMetric === 'reels'
        ? d.instagramReels + d.youtubeShorts + d.facebookReels
        : d.instagramMinutes + d.youtubeMinutes + d.facebookMinutes
    ),
    activeMetric === 'reels' ? 40 : 100
  );

  return (
    <div className="space-y-5 pb-28 max-w-xl mx-auto px-4 pt-2">
      {/* Header & UsageStats API info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Screen Time & Analytics
          </h1>
          <p className="text-xs text-slate-400">
            Android UsageStatsManager & Accessibility Logs
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveMetric('reels')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeMetric === 'reels'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reel Count
          </button>
          <button
            onClick={() => setActiveMetric('time')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeMetric === 'time'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Screen Time
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">7-Day Total</p>
          <p className="text-xl font-extrabold text-white mt-1">
            {activeMetric === 'reels' ? totalReelsWeek : `${Math.floor(totalTimeWeek / 60)}h ${totalTimeWeek % 60}m`}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{activeMetric === 'reels' ? 'reels watched' : 'minutes spent'}</p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Daily Avg</p>
          <p className="text-xl font-extrabold text-purple-400 mt-1">
            {activeMetric === 'reels' ? `${avgReelsPerDay} reels` : `${avgTimePerDay}m`}
          </p>
          <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center justify-center gap-0.5">
            <TrendingDown className="w-3 h-3" /> -42% drop
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Time Saved</p>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">~10.5 hrs</p>
          <p className="text-[10px] text-slate-500 mt-0.5">this week</p>
        </div>
      </div>

      {/* 7-Day Interactive Visual Bar Chart */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-rose-400" />
              Weekly Breakdown
            </h2>
            <p className="text-[11px] text-slate-400">
              Tap any day bar to view per-app distribution
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> IG</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> YT</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> FB</span>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-800">
          {logs.map((log, idx) => {
            const ig = activeMetric === 'reels' ? log.instagramReels : log.instagramMinutes;
            const yt = activeMetric === 'reels' ? log.youtubeShorts : log.youtubeMinutes;
            const fb = activeMetric === 'reels' ? log.facebookReels : log.facebookMinutes;
            const dayTotal = ig + yt + fb;
            const heightPercent = Math.max(8, Math.min(100, (dayTotal / maxMetricVal) * 100));
            const isSelected = selectedDayIndex === idx;

            return (
              <button
                key={log.date}
                onClick={() => setSelectedDayIndex(idx)}
                className="flex-1 flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                {/* Bar Value Tooltip on hover/selected */}
                <span className={`text-[10px] font-mono mb-1 font-semibold transition-opacity ${
                  isSelected ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {dayTotal}
                </span>

                {/* Stacked Bar */}
                <div 
                  className={`w-full max-w-[32px] rounded-t-lg overflow-hidden flex flex-col-reverse transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-rose-400 ring-offset-2 ring-offset-slate-900' : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* IG Segment */}
                  <div
                    className="bg-gradient-to-t from-rose-600 to-pink-500 w-full"
                    style={{ height: `${dayTotal > 0 ? (ig / dayTotal) * 100 : 0}%` }}
                    title={`Instagram: ${ig}`}
                  />
                  {/* YT Segment */}
                  <div
                    className="bg-red-500 w-full"
                    style={{ height: `${dayTotal > 0 ? (yt / dayTotal) * 100 : 0}%` }}
                    title={`YouTube: ${yt}`}
                  />
                  {/* FB Segment */}
                  <div
                    className="bg-blue-600 w-full"
                    style={{ height: `${dayTotal > 0 ? (fb / dayTotal) * 100 : 0}%` }}
                    title={`Facebook: ${fb}`}
                  />
                </div>

                {/* Day Label */}
                <span className={`text-[11px] mt-2 font-medium ${
                  isSelected ? 'text-rose-400 font-bold' : 'text-slate-400'
                }`}>
                  {log.dayLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Breakdown */}
        {selectedDay && (
          <div className="mt-4 pt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Selected: <strong className="text-white">{selectedDay.dayLabel} ({selectedDay.date})</strong>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-rose-400">IG: {activeMetric === 'reels' ? `${selectedDay.instagramReels} reels` : `${selectedDay.instagramMinutes}m`}</span>
              <span className="text-red-400">YT: {activeMetric === 'reels' ? `${selectedDay.youtubeShorts} shorts` : `${selectedDay.youtubeMinutes}m`}</span>
              <span className="text-blue-400">FB: {activeMetric === 'reels' ? `${selectedDay.facebookReels} reels` : `${selectedDay.facebookMinutes}m`}</span>
            </div>
          </div>
        )}
      </div>

      {/* Heuristic Detection Log (AccessibilityService Feed) */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Accessibility Heuristic Stream</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Live Event Listener</span>
        </div>

        <p className="text-[11px] text-slate-400">
          Real-time UI hierarchy inspection logs captured by <code className="text-emerald-400 font-mono">AccessibilityService.onAccessibilityEvent()</code>:
        </p>

        <div className="space-y-2">
          {sessions.map((session, i) => (
            <div
              key={session.id || i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${
                  session.appName === 'instagram' ? 'bg-rose-500' : session.appName === 'youtube' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div>
                  <span className="font-semibold text-white capitalize">{session.appName} Reel</span>
                  <span className="text-slate-400 text-[11px] ml-2">{session.creatorHandle || '@creator'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                <span>{session.durationSeconds}s duration</span>
                <span className="text-slate-500">{session.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
