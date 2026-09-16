export type AppId = 'instagram' | 'youtube' | 'facebook';

export type LimitType = 'count' | 'time'; // count = number of reels, time = minutes

export interface AppMetadata {
  id: AppId;
  name: string;
  packageName: string;
  shortLabel: string;
  iconBg: string;
  badgeBg: string;
  textColor: string;
  gradient: string;
  heuristicPattern: string;
}

export interface DailyLimit {
  id: string;
  appName: AppId | 'global';
  limitType: LimitType;
  limitValue: number; // e.g. 30 reels or 25 minutes
  resetTime: string; // e.g. "00:00"
  strictMode: boolean; // if true, disables instant emergency bypass
}

export interface ReelSession {
  id: string;
  appName: AppId;
  timestamp: string;
  durationSeconds: number;
  creatorHandle?: string;
  soundName?: string;
  caption?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  time: string; // "09:00"
  repeatType: 'daily' | 'weekdays' | 'once';
  isDone: boolean;
  linkedToLimit: boolean;
  rewardMinutes: number; // e.g. +10 minutes bonus reel allowance
  notificationEnabled: boolean;
  category: 'focus' | 'health' | 'study' | 'habit';
}

export interface DailyScreenTimeLog {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Mon", "Tue", etc.
  instagramMinutes: number;
  youtubeMinutes: number;
  facebookMinutes: number;
  instagramReels: number;
  youtubeShorts: number;
  facebookReels: number;
  limitBreached: boolean;
}

export interface PermissionState {
  accessibilityService: boolean;
  usageStats: boolean;
  systemAlertWindow: boolean;
  postNotifications: boolean;
  bootReceiver: boolean;
}

export interface AppSettings {
  vibrationOnBlock: boolean;
  audioChimeOnAlarm: boolean;
  frictionCooldownSeconds: number; // e.g. 60 or 300
  activeTheme: 'dark' | 'light';
  onboardingCompleted: boolean;
  dailyStreak: number;
  bonusReelAllowance: number; // extra minutes earned via tasks
}

export interface ReelSimulationItem {
  id: string;
  appName: AppId;
  author: string;
  caption: string;
  sound: string;
  likes: string;
  comments: string;
  duration: number; // seconds
  tags: string[];
  gradientBg: string;
}
