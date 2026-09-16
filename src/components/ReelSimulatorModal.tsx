import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Share2, 
  Music2, 
  ChevronUp, 
  ChevronDown, 
  Zap, 
  ShieldCheck, 
  Volume2, 
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AppId, DailyLimit, DailyScreenTimeLog } from '../types';
import { SIMULATION_REELS, APPS_DATA } from '../data/mockData';
import { checkLimitBreached } from '../utils/storage';

interface ReelSimulatorModalProps {
  initialAppId?: AppId;
  logs: DailyScreenTimeLog[];
  limits: DailyLimit[];
  bonusMinutes: number;
  onClose: () => void;
  onRecordSession: (appName: AppId, durationSeconds: number) => void;
  onTriggerLock: (appName: AppId, reason: string, current: number, limit: number, unit: 'reels' | 'minutes') => void;
}

export const ReelSimulatorModal: React.FC<ReelSimulatorModalProps> = ({
  initialAppId = 'instagram',
  logs,
  limits,
  bonusMinutes,
  onClose,
  onRecordSession,
  onTriggerLock
}) => {
  const [selectedApp, setSelectedApp] = useState<AppId>(initialAppId);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [watchSeconds, setWatchSeconds] = useState(0);
  const [liked, setLiked] = useState(false);

  // Filter reels or use all reels
  const reels = SIMULATION_REELS;
  const currentReel = reels[currentReelIndex % reels.length];
  const appMeta = APPS_DATA[selectedApp] || APPS_DATA.instagram;

  // Track session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNextReel = () => {
    // Record current reel session
    const duration = Math.max(5, watchSeconds);
    onRecordSession(selectedApp, duration);
    setWatchSeconds(0);
    setLiked(false);

    // Check if limit breached with the new count
    const limitStatus = checkLimitBreached(selectedApp, logs, limits, bonusMinutes);
    if (limitStatus.isBreached) {
      onTriggerLock(
        selectedApp,
        limitStatus.reason,
        limitStatus.current,
        limitStatus.limit,
        limitStatus.unit
      );
      return;
    }

    setCurrentReelIndex(prev => (prev + 1) % reels.length);
  };

  const handlePrevReel = () => {
    setCurrentReelIndex(prev => (prev - 1 + reels.length) % reels.length);
    setWatchSeconds(0);
    setLiked(false);
  };

  // Instant trigger limit for testing
  const handleForceTriggerLimit = () => {
    // Record 5 quick reels to push over limit
    onRecordSession(selectedApp, 15);
    onRecordSession(selectedApp, 20);
    const limit = limits.find(l => l.appName === selectedApp) || limits[0];
    onTriggerLock(
      selectedApp,
      `Daily limit reached for ${selectedApp.toUpperCase()} (Accessibility Service Heuristic Trigger)`,
      limit.limitValue,
      limit.limitValue,
      limit.limitType === 'count' ? 'reels' : 'minutes'
    );
  };

  const today = logs[logs.length - 1];
  const currentAppReelsCount = selectedApp === 'instagram' 
    ? today?.instagramReels || 0 
    : selectedApp === 'youtube' 
    ? today?.youtubeShorts || 0 
    : today?.facebookReels || 0;

  const appLimit = limits.find(l => l.appName === selectedApp)?.limitValue || 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      {/* Mobile Device Mockup Frame */}
      <div className="w-full max-w-sm h-[92vh] max-h-[760px] rounded-[38px] bg-slate-950 border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Android Punch Hole Camera */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-slate-800 z-50 pointer-events-none" />

        {/* Top Floating Accessibility Service HUD */}
        <div className="absolute top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-3 pt-7 pb-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                Accessibility Service Active
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="text-slate-400 font-mono">
              Today: <strong className="text-rose-400">{currentAppReelsCount}</strong> / {appLimit} reels
            </span>
            <span className="text-slate-400 font-mono">
              Watch timer: <strong className="text-white">{watchSeconds}s</strong>
            </span>
          </div>

          {/* App Switcher Tabs inside simulator */}
          <div className="flex items-center gap-1 mt-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {(['instagram', 'youtube', 'facebook'] as AppId[]).map(app => (
              <button
                key={app}
                onClick={() => {
                  setSelectedApp(app);
                  setWatchSeconds(0);
                }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                  selectedApp === app
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {app === 'instagram' ? 'IG Reels' : app === 'youtube' ? 'YT Shorts' : 'FB Reels'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Simulated Reel Content View */}
        <div className={`flex-1 relative bg-gradient-to-br ${currentReel.gradientBg} flex flex-col justify-between p-4 pt-32 pb-6 text-white select-none`}>
          {/* Subtle animated ambient mesh */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(244,63,94,0.3),transparent_70%)] pointer-events-none" />

          {/* Reel Header Info */}
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs">
                {currentReel.author.substring(1, 3).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold tracking-tight">{currentReel.author}</p>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <Music2 className="w-3 h-3 text-rose-400 animate-spin" /> {currentReel.sound}
                </p>
              </div>
            </div>

            {/* Heuristic match tag */}
            <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-mono text-slate-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Accessibility heuristic: {appMeta.heuristicPattern.split('|')[0]}</span>
            </div>
          </div>

          {/* Reel Center Graphic / Simulation Display */}
          <div className="relative z-10 my-auto text-center px-4">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center mb-3">
              <Play className="w-7 h-7 text-white/90 ml-0.5 fill-white/80" />
            </div>
            <p className="text-sm font-semibold leading-snug drop-shadow-md">
              "{currentReel.caption}"
            </p>
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {currentReel.tags.map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-slate-200">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Bar & Social Actions */}
          <div className="relative z-10 flex items-end justify-between">
            {/* Quick Test Trigger Limit button */}
            <button
              onClick={handleForceTriggerLimit}
              className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-[11px] font-bold backdrop-blur-md border border-rose-400/40 shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Hit Limit Now</span>
            </button>

            {/* Right Side Reel Icons */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => setLiked(!liked)}
                className="flex flex-col items-center gap-0.5 cursor-pointer"
              >
                <div className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                  liked ? 'bg-rose-600 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                }`}>
                  <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
                </div>
                <span className="text-[10px] font-semibold">{currentReel.likes}</span>
              </button>

              <div className="flex flex-col items-center gap-0.5">
                <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold">{currentReel.comments}</span>
              </div>

              <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white">
                <Share2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Simulated Swipe / Next Controls */}
        <div className="bg-slate-900 border-t border-slate-800 p-2.5 flex items-center justify-between gap-2 z-40">
          <button
            onClick={handlePrevReel}
            className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={handleNextReel}
            className="flex-[2] py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Next Reel (Scroll)</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
