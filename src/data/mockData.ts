import { AppMetadata, DailyLimit, DailyScreenTimeLog, TaskItem, ReelSimulationItem } from '../types';

export const APPS_DATA: Record<string, AppMetadata> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    packageName: 'com.instagram.android',
    shortLabel: 'IG Reels',
    iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    textColor: 'text-rose-400',
    gradient: 'from-pink-500 to-rose-600',
    heuristicPattern: 'view_id: reels_viewer_container | gesture: swipe_up'
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube Shorts',
    packageName: 'com.google.android.youtube',
    shortLabel: 'YT Shorts',
    iconBg: 'bg-red-600',
    badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20',
    textColor: 'text-red-400',
    gradient: 'from-red-500 to-rose-700',
    heuristicPattern: 'view_id: reel_recycler | pivot_id: shorts_pivot_item'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    packageName: 'com.facebook.katana',
    shortLabel: 'FB Reels',
    iconBg: 'bg-blue-600',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    textColor: 'text-blue-400',
    gradient: 'from-blue-600 to-indigo-700',
    heuristicPattern: 'view_id: fb_reels_fullscreen_fragment'
  }
};

export const INITIAL_LIMITS: DailyLimit[] = [
  {
    id: 'limit-global',
    appName: 'global',
    limitType: 'count',
    limitValue: 20, // 20 reels total today
    resetTime: '00:00',
    strictMode: false
  },
  {
    id: 'limit-instagram',
    appName: 'instagram',
    limitType: 'count',
    limitValue: 10,
    resetTime: '00:00',
    strictMode: false
  },
  {
    id: 'limit-youtube',
    appName: 'youtube',
    limitType: 'count',
    limitValue: 10,
    resetTime: '00:00',
    strictMode: false
  },
  {
    id: 'limit-facebook',
    appName: 'facebook',
    limitType: 'count',
    limitValue: 5,
    resetTime: '00:00',
    strictMode: false
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Read 15 pages of deep-work book',
    time: '18:30',
    repeatType: 'daily',
    isDone: false,
    linkedToLimit: true,
    rewardMinutes: 10,
    notificationEnabled: true,
    category: 'focus'
  },
  {
    id: 'task-2',
    title: '30-minute cardio & outdoor stretch',
    time: '19:45',
    repeatType: 'daily',
    isDone: false,
    linkedToLimit: true,
    rewardMinutes: 15,
    notificationEnabled: true,
    category: 'health'
  },
  {
    id: 'task-3',
    title: 'Complete foreign language lesson',
    time: '21:00',
    repeatType: 'daily',
    isDone: true,
    linkedToLimit: true,
    rewardMinutes: 10,
    notificationEnabled: false,
    category: 'study'
  },
  {
    id: 'task-4',
    title: 'Clear desk & prepare tomorrow’s schedule',
    time: '22:15',
    repeatType: 'weekdays',
    isDone: false,
    linkedToLimit: false,
    rewardMinutes: 0,
    notificationEnabled: true,
    category: 'habit'
  }
];

export const INITIAL_WEEKLY_LOGS: DailyScreenTimeLog[] = [
  {
    date: '2026-09-10',
    dayLabel: 'Thu',
    instagramMinutes: 42,
    youtubeMinutes: 35,
    facebookMinutes: 12,
    instagramReels: 28,
    youtubeShorts: 22,
    facebookReels: 8,
    limitBreached: true
  },
  {
    date: '2026-09-11',
    dayLabel: 'Fri',
    instagramMinutes: 38,
    youtubeMinutes: 29,
    facebookMinutes: 10,
    instagramReels: 24,
    youtubeShorts: 18,
    facebookReels: 5,
    limitBreached: true
  },
  {
    date: '2026-09-12',
    dayLabel: 'Sat',
    instagramMinutes: 18,
    youtubeMinutes: 15,
    facebookMinutes: 4,
    instagramReels: 10,
    youtubeShorts: 9,
    facebookReels: 1,
    limitBreached: false // Under limit!
  },
  {
    date: '2026-09-13',
    dayLabel: 'Sun',
    instagramMinutes: 14,
    youtubeMinutes: 12,
    facebookMinutes: 3,
    instagramReels: 8,
    youtubeShorts: 7,
    facebookReels: 2,
    limitBreached: false // Under limit!
  },
  {
    date: '2026-09-14',
    dayLabel: 'Mon',
    instagramMinutes: 16,
    youtubeMinutes: 10,
    facebookMinutes: 2,
    instagramReels: 9,
    youtubeShorts: 6,
    facebookReels: 1,
    limitBreached: false // Under limit!
  },
  {
    date: '2026-09-15',
    dayLabel: 'Tue',
    instagramMinutes: 12,
    youtubeMinutes: 8,
    facebookMinutes: 0,
    instagramReels: 7,
    youtubeShorts: 4,
    facebookReels: 0,
    limitBreached: false // Under limit!
  },
  {
    date: '2026-09-16',
    dayLabel: 'Today',
    instagramMinutes: 8,
    youtubeMinutes: 6,
    facebookMinutes: 2,
    instagramReels: 5,
    youtubeShorts: 4,
    facebookReels: 1,
    limitBreached: false
  }
];

export const SIMULATION_REELS: ReelSimulationItem[] = [
  {
    id: 'reel-1',
    appName: 'instagram',
    author: '@marcus.dev',
    caption: 'Why 10x engineers actually avoid scrolling short-form video in the mornings ⚡ #focus #developer',
    sound: 'Original audio - Marcus Flow',
    likes: '42.8K',
    comments: '1,204',
    duration: 18,
    tags: ['Tech', 'Coding', 'Mindset'],
    gradientBg: 'from-violet-950 via-slate-900 to-indigo-950'
  },
  {
    id: 'reel-2',
    appName: 'youtube',
    author: 'Veritasium Shorts',
    caption: 'The optical illusion that tricks your brain into seeing motion where none exists! 🧠🔬',
    sound: 'Veritasium - Science Bites',
    likes: '189K',
    comments: '4,512',
    duration: 25,
    tags: ['Science', 'Physics', 'Brain'],
    gradientBg: 'from-red-950 via-zinc-900 to-rose-950'
  },
  {
    id: 'reel-3',
    appName: 'instagram',
    author: '@chef_marco',
    caption: 'Crispy Garlic Butter Smashed Potatoes with rosemary dip 🥔🔥 You need this recipe tonight.',
    sound: 'Cooking Beats Vol. 4',
    likes: '84.2K',
    comments: '890',
    duration: 15,
    tags: ['Food', 'QuickRecipes'],
    gradientBg: 'from-amber-950 via-neutral-900 to-stone-900'
  },
  {
    id: 'reel-4',
    appName: 'facebook',
    author: 'World Nature Odyssey',
    caption: 'Rare footage of bioluminescent ocean waves in the Maldives at midnight 🌊✨',
    sound: 'Ethereal Ambient Wave',
    likes: '29.1K',
    comments: '412',
    duration: 20,
    tags: ['Nature', 'Ocean', 'Travel'],
    gradientBg: 'from-blue-950 via-cyan-950 to-slate-900'
  },
  {
    id: 'reel-5',
    appName: 'youtube',
    author: 'Productivity Hacker',
    caption: 'The 20-minute dopamine reset rule: How to reclaim your attention span before noon.',
    sound: 'Lo-Fi Chill Study Beat',
    likes: '51.3K',
    comments: '882',
    duration: 22,
    tags: ['Dopamine', 'Habits'],
    gradientBg: 'from-emerald-950 via-slate-900 to-teal-950'
  },
  {
    id: 'reel-6',
    appName: 'instagram',
    author: '@arch_digest',
    caption: 'Minimalist Scandinavian cabin hidden inside a pine forest in Norway 🌲🏡',
    sound: 'Acoustic Morning Rain',
    likes: '93.5K',
    comments: '1,429',
    duration: 16,
    tags: ['Architecture', 'Design'],
    gradientBg: 'from-neutral-900 via-slate-900 to-zinc-900'
  },
  {
    id: 'reel-7',
    appName: 'youtube',
    author: 'Daily Stoic Wisdom',
    caption: 'Marcus Aurelius on why letting entertainment dictate your impulses destroys quiet focus.',
    sound: 'Meditative Strings',
    likes: '112K',
    comments: '2,100',
    duration: 30,
    tags: ['Philosophy', 'Stoicism'],
    gradientBg: 'from-stone-950 via-stone-900 to-amber-950'
  }
];
