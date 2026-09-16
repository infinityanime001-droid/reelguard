import { DailyLimit, DailyScreenTimeLog, PermissionState, AppSettings, TaskItem, ReelSession, AppId } from '../types';
import { INITIAL_LIMITS, INITIAL_TASKS, INITIAL_WEEKLY_LOGS } from '../data/mockData';

const STORAGE_KEYS = {
  LIMITS: 'reelguard_limits_v1',
  TASKS: 'reelguard_tasks_v1',
  WEEKLY_LOGS: 'reelguard_weekly_logs_v1',
  TODAY_SESSIONS: 'reelguard_today_sessions_v1',
  PERMISSIONS: 'reelguard_permissions_v1',
  SETTINGS: 'reelguard_settings_v1',
  BONUS_REEL_MINUTES: 'reelguard_bonus_minutes_v1',
  UNLOCKED_UNTIL: 'reelguard_unlocked_until_v1'
};

export const DEFAULT_PERMISSIONS: PermissionState = {
  accessibilityService: true, // BIND_ACCESSIBILITY_SERVICE
  usageStats: true, // PACKAGE_USAGE_STATS
  systemAlertWindow: true, // SYSTEM_ALERT_WINDOW
  postNotifications: true, // POST_NOTIFICATIONS
  bootReceiver: true // RECEIVE_BOOT_COMPLETED
};

export const DEFAULT_SETTINGS: AppSettings = {
  vibrationOnBlock: true,
  audioChimeOnAlarm: true,
  frictionCooldownSeconds: 60, // 60s friction cooldown in demo for instant gratification & testing
  activeTheme: 'dark',
  onboardingCompleted: true,
  dailyStreak: 4,
  bonusReelAllowance: 10
};

export function loadLimits(): DailyLimit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LIMITS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading limits from storage', e);
  }
  return INITIAL_LIMITS;
}

export function saveLimits(limits: DailyLimit[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.LIMITS, JSON.stringify(limits));
  } catch (e) {
    console.error('Error saving limits to storage', e);
  }
}

export function loadTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading tasks from storage', e);
  }
  return INITIAL_TASKS;
}

export function saveTasks(tasks: TaskItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to storage', e);
  }
}

export function loadWeeklyLogs(): DailyScreenTimeLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEEKLY_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading weekly logs from storage', e);
  }
  return INITIAL_WEEKLY_LOGS;
}

export function saveWeeklyLogs(logs: DailyScreenTimeLog[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving weekly logs to storage', e);
  }
}

export function loadTodaySessions(): ReelSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TODAY_SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading sessions from storage', e);
  }
  // Default today initial sessions to match today's log
  return [
    { id: 's-1', appName: 'instagram', timestamp: '10:14 AM', durationSeconds: 45, creatorHandle: '@photographer' },
    { id: 's-2', appName: 'instagram', timestamp: '10:18 AM', durationSeconds: 30, creatorHandle: '@dailyrecipes' },
    { id: 's-3', appName: 'youtube', timestamp: '12:30 PM', durationSeconds: 58, creatorHandle: 'Veritasium' },
    { id: 's-4', appName: 'youtube', timestamp: '12:32 PM', durationSeconds: 42, creatorHandle: 'MKBHD Shorts' },
    { id: 's-5', appName: 'facebook', timestamp: '02:05 PM', durationSeconds: 25, creatorHandle: 'Science Daily' },
  ];
}

export function saveTodaySessions(sessions: ReelSession[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TODAY_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions to storage', e);
  }
}

export function loadPermissions(): PermissionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading permissions from storage', e);
  }
  return DEFAULT_PERMISSIONS;
}

export function savePermissions(perms: PermissionState) {
  try {
    localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(perms));
  } catch (e) {
    console.error('Error saving permissions to storage', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading settings from storage', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to storage', e);
  }
}

export function loadBonusMinutes(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BONUS_REEL_MINUTES);
    if (raw) return parseInt(raw, 10);
  } catch (e) {
    console.error('Error loading bonus minutes', e);
  }
  return 0;
}

export function saveBonusMinutes(mins: number) {
  try {
    localStorage.setItem(STORAGE_KEYS.BONUS_REEL_MINUTES, mins.toString());
  } catch (e) {
    console.error('Error saving bonus minutes', e);
  }
}

export function loadUnlockedUntil(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_UNTIL);
    if (raw) return parseInt(raw, 10);
  } catch (e) {
    console.error('Error loading unlocked timestamp', e);
  }
  return 0;
}

export function saveUnlockedUntil(timestamp: number) {
  try {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_UNTIL, timestamp.toString());
  } catch (e) {
    console.error('Error saving unlocked timestamp', e);
  }
}

/**
 * Check if the user has reached their limit for an app or globally
 */
export function checkLimitBreached(
  appName: AppId,
  logs: DailyScreenTimeLog[],
  limits: DailyLimit[],
  bonusMinutes: number = 0
): { isBreached: boolean; reason: string; current: number; limit: number; unit: 'reels' | 'minutes' } {
  const today = logs[logs.length - 1];
  if (!today) {
    return { isBreached: false, reason: '', current: 0, limit: 0, unit: 'reels' };
  }

  // Count total reels & minutes for this app and global
  const appReels = appName === 'instagram' ? today.instagramReels : appName === 'youtube' ? today.youtubeShorts : today.facebookReels;
  const appMinutes = appName === 'instagram' ? today.instagramMinutes : appName === 'youtube' ? today.youtubeMinutes : today.facebookMinutes;
  const totalReels = today.instagramReels + today.youtubeShorts + today.facebookReels;
  const totalMinutes = today.instagramMinutes + today.youtubeMinutes + today.facebookMinutes;

  // Check specific app limit
  const specificLimit = limits.find(l => l.appName === appName);
  if (specificLimit) {
    if (specificLimit.limitType === 'count') {
      if (appReels >= specificLimit.limitValue) {
        return {
          isBreached: true,
          reason: `Daily limit of ${specificLimit.limitValue} reels reached for ${appName.toUpperCase()}`,
          current: appReels,
          limit: specificLimit.limitValue,
          unit: 'reels'
        };
      }
    } else {
      const allowedMinutes = specificLimit.limitValue + bonusMinutes;
      if (appMinutes >= allowedMinutes) {
        return {
          isBreached: true,
          reason: `Daily limit of ${allowedMinutes}m reached for ${appName.toUpperCase()}`,
          current: appMinutes,
          limit: allowedMinutes,
          unit: 'minutes'
        };
      }
    }
  }

  // Check global limit
  const globalLimit = limits.find(l => l.appName === 'global');
  if (globalLimit) {
    if (globalLimit.limitType === 'count') {
      if (totalReels >= globalLimit.limitValue) {
        return {
          isBreached: true,
          reason: `Global daily limit of ${globalLimit.limitValue} reels reached across all apps`,
          current: totalReels,
          limit: globalLimit.limitValue,
          unit: 'reels'
        };
      }
    } else {
      const allowedMinutes = globalLimit.limitValue + bonusMinutes;
      if (totalMinutes >= allowedMinutes) {
        return {
          isBreached: true,
          reason: `Global daily limit of ${allowedMinutes}m reached across all apps`,
          current: totalMinutes,
          limit: allowedMinutes,
          unit: 'minutes'
        };
      }
    }
  }

  return { isBreached: false, reason: '', current: appReels, limit: specificLimit?.limitValue || 0, unit: 'reels' };
}
