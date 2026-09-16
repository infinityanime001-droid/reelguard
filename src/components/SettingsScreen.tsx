import React from 'react';
import { 
  ShieldCheck, 
  Key, 
  Layers, 
  Sliders, 
  Bell, 
  RotateCcw, 
  Smartphone, 
  ExternalLink,
  Lock,
  Moon,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { DailyLimit, PermissionState, AppSettings, AppId } from '../types';

interface SettingsScreenProps {
  limits: DailyLimit[];
  permissions: PermissionState;
  settings: AppSettings;
  onUpdateLimits: (limits: DailyLimit[]) => void;
  onUpdatePermissions: (perms: PermissionState) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetFactoryData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  limits,
  permissions,
  settings,
  onUpdateLimits,
  onUpdatePermissions,
  onUpdateSettings,
  onResetFactoryData
}) => {
  const globalLimit = limits.find(l => l.appName === 'global') || limits[0];

  const handleGlobalLimitChange = (val: number) => {
    const updated = limits.map(l => l.appName === 'global' ? { ...l, limitValue: val } : l);
    onUpdateLimits(updated);
  };

  const handleLimitTypeChange = (type: 'count' | 'time') => {
    const defaultVal = type === 'count' ? 20 : 30; // 20 reels or 30 mins
    const updated = limits.map(l => ({ ...l, limitType: type, limitValue: defaultVal }));
    onUpdateLimits(updated);
  };

  const handleAppLimitChange = (appName: AppId, val: number) => {
    const updated = limits.map(l => l.appName === appName ? { ...l, limitValue: val } : l);
    onUpdateLimits(updated);
  };

  const togglePermission = (key: keyof PermissionState) => {
    onUpdatePermissions({
      ...permissions,
      [key]: !permissions[key]
    });
  };

  return (
    <div className="space-y-6 pb-28 max-w-xl mx-auto px-4 pt-2">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          App Settings & Permissions
        </h1>
        <p className="text-xs text-slate-400">
          Configure reel limits, lock policies, and Android system services
        </p>
      </div>

      {/* Android System Permissions Hub */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold text-white">Android System Permissions</h2>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Required for Tracking
          </span>
        </div>

        <p className="text-xs text-slate-400">
          ReelGuard relies on privileged Android APIs to count reels and lock apps without root:
        </p>

        <div className="space-y-2.5 pt-1">
          {/* BIND_ACCESSIBILITY_SERVICE */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">BIND_ACCESSIBILITY_SERVICE</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Detects reel view hierarchies & blocks vertical scrolls</p>
            </div>
            <button
              onClick={() => togglePermission('accessibilityService')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                permissions.accessibilityService
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {permissions.accessibilityService ? 'Granted' : 'Disabled'}
            </button>
          </div>

          {/* PACKAGE_USAGE_STATS */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">PACKAGE_USAGE_STATS</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Reads app foreground timestamps for screen time graphs</p>
            </div>
            <button
              onClick={() => togglePermission('usageStats')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                permissions.usageStats
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {permissions.usageStats ? 'Granted' : 'Disabled'}
            </button>
          </div>

          {/* SYSTEM_ALERT_WINDOW */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">SYSTEM_ALERT_WINDOW</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Draws full-screen overlay over Instagram/YouTube when limit is reached</p>
            </div>
            <button
              onClick={() => togglePermission('systemAlertWindow')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                permissions.systemAlertWindow
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {permissions.systemAlertWindow ? 'Granted' : 'Disabled'}
            </button>
          </div>

          {/* POST_NOTIFICATIONS */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">POST_NOTIFICATIONS</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Dispatches task reminder alarms and limit warnings</p>
            </div>
            <button
              onClick={() => togglePermission('postNotifications')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                permissions.postNotifications
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {permissions.postNotifications ? 'Granted' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Daily Reel Limits Configuration */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold text-white">Daily Limits Enforcement</h2>
          </div>
        </div>

        {/* Limit Metric Mode Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Limit Mode</label>
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => handleLimitTypeChange('count')}
              className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                globalLimit.limitType === 'count'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Reel Count (e.g. 20 reels)
            </button>
            <button
              onClick={() => handleLimitTypeChange('time')}
              className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                globalLimit.limitType === 'time'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Time Spent (e.g. 25 mins)
            </button>
          </div>
        </div>

        {/* Global Limit Slider */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white">Global Daily Max Limit</span>
            <span className="font-bold text-rose-400 text-sm">
              {globalLimit.limitValue} {globalLimit.limitType === 'count' ? 'reels' : 'mins'}
            </span>
          </div>
          <input
            type="range"
            min={globalLimit.limitType === 'count' ? 5 : 5}
            max={globalLimit.limitType === 'count' ? 60 : 120}
            step={globalLimit.limitType === 'count' ? 1 : 5}
            value={globalLimit.limitValue}
            onChange={e => handleGlobalLimitChange(parseInt(e.target.value, 10))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>{globalLimit.limitType === 'count' ? '5 reels' : '5 mins'}</span>
            <span>{globalLimit.limitType === 'count' ? '60 reels' : '120 mins'}</span>
          </div>
        </div>

        {/* Per-App Limit Overrides */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-slate-300">Per-App Individual Limits</p>

          {(['instagram', 'youtube', 'facebook'] as AppId[]).map(appId => {
            const appLimit = limits.find(l => l.appName === appId) || {
              id: `limit-${appId}`,
              appName: appId,
              limitType: globalLimit.limitType,
              limitValue: 10,
              resetTime: '00:00',
              strictMode: false
            };

            return (
              <div key={appId} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <span className="capitalize font-semibold text-slate-200">
                  {appId === 'instagram' ? 'Instagram Reels' : appId === 'youtube' ? 'YouTube Shorts' : 'Facebook Reels'}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={appLimit.limitValue}
                    onChange={e => handleAppLimitChange(appId, parseInt(e.target.value, 10) || 1)}
                    className="w-16 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-center text-white font-bold text-xs"
                  />
                  <span className="text-slate-400 text-xs">{globalLimit.limitType === 'count' ? 'reels' : 'mins'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strict Mode Toggle */}
        <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between">
          <div className="pr-3">
            <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Strict Lockdown Mode</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hides the emergency cooldown bypass button completely once the limit is hit.
            </p>
          </div>
          <input
            type="checkbox"
            checked={globalLimit.strictMode}
            onChange={e => {
              const updated = limits.map(l => ({ ...l, strictMode: e.target.checked }));
              onUpdateLimits(updated);
            }}
            className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Alarm & Lock Sound Preferences */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-purple-400" />
          Alerts & Feedback
        </h2>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer">
            <span className="text-slate-300">Play tone chime on scheduled task alarms</span>
            <input
              type="checkbox"
              checked={settings.audioChimeOnAlarm}
              onChange={e => onUpdateSettings({ ...settings, audioChimeOnAlarm: e.target.checked })}
              className="w-4 h-4 accent-purple-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer">
            <span className="text-slate-300">Haptic vibration warning on reel limit lock</span>
            <input
              type="checkbox"
              checked={settings.vibrationOnBlock}
              onChange={e => onUpdateSettings({ ...settings, vibrationOnBlock: e.target.checked })}
              className="w-4 h-4 accent-purple-500 rounded"
            />
          </label>
        </div>
      </div>

      {/* Factory Reset */}
      <div className="pt-2">
        <button
          onClick={onResetFactoryData}
          className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs font-semibold border border-slate-800 hover:border-rose-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Factory Seed Data</span>
        </button>
      </div>
    </div>
  );
};
