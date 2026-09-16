import React, { useState, useEffect } from 'react';
import { 
  loadLimits, 
  saveLimits, 
  loadTasks, 
  saveTasks, 
  loadWeeklyLogs, 
  saveWeeklyLogs, 
  loadTodaySessions, 
  saveTodaySessions, 
  loadPermissions, 
  savePermissions, 
  loadSettings, 
  saveSettings, 
  loadBonusMinutes, 
  saveBonusMinutes, 
  loadUnlockedUntil, 
  saveUnlockedUntil,
  checkLimitBreached,
  DEFAULT_PERMISSIONS,
  DEFAULT_SETTINGS
} from './utils/storage';
import { INITIAL_LIMITS, INITIAL_TASKS, INITIAL_WEEKLY_LOGS } from './data/mockData';
import { DailyLimit, DailyScreenTimeLog, PermissionState, AppSettings, TaskItem, ReelSession, AppId } from './types';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TasksScreen } from './components/TasksScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ReelSimulatorModal } from './components/ReelSimulatorModal';
import { LockOverlayModal } from './components/LockOverlayModal';
import { PrdTechnicalModal } from './components/PrdTechnicalModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'tasks' | 'analytics' | 'settings'>('dashboard');

  // Core application state
  const [limits, setLimits] = useState<DailyLimit[]>(loadLimits);
  const [tasks, setTasks] = useState<TaskItem[]>(loadTasks);
  const [logs, setLogs] = useState<DailyScreenTimeLog[]>(loadWeeklyLogs);
  const [sessions, setSessions] = useState<ReelSession[]>(loadTodaySessions);
  const [permissions, setPermissions] = useState<PermissionState>(loadPermissions);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [bonusMinutes, setBonusMinutes] = useState<number>(loadBonusMinutes);
  const [unlockedUntil, setUnlockedUntil] = useState<number>(loadUnlockedUntil);

  // Modals
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulatorApp, setSimulatorApp] = useState<AppId>('instagram');
  const [lockOverlayState, setLockOverlayState] = useState<{
    isOpen: boolean;
    appName: AppId;
    reason: string;
    currentValue: number;
    limitValue: number;
    unit: 'reels' | 'minutes';
  }>({
    isOpen: false,
    appName: 'instagram',
    reason: '',
    currentValue: 0,
    limitValue: 0,
    unit: 'reels'
  });
  const [prdModalOpen, setPrdModalOpen] = useState(false);

  // Persistence side-effects
  useEffect(() => { saveLimits(limits); }, [limits]);
  useEffect(() => { saveTasks(tasks); }, [tasks]);
  useEffect(() => { saveWeeklyLogs(logs); }, [logs]);
  useEffect(() => { saveTodaySessions(sessions); }, [sessions]);
  useEffect(() => { savePermissions(permissions); }, [permissions]);
  useEffect(() => { saveSettings(settings); }, [settings]);
  useEffect(() => { saveBonusMinutes(bonusMinutes); }, [bonusMinutes]);
  useEffect(() => { saveUnlockedUntil(unlockedUntil); }, [unlockedUntil]);

  // Open Simulator
  const handleOpenSimulator = (appId: AppId = 'instagram') => {
    setSimulatorApp(appId);
    setSimulatorOpen(true);
  };

  // Record a reel session from simulator or event
  const handleRecordSession = (appName: AppId, durationSeconds: number) => {
    const newSession: ReelSession = {
      id: `session-${Date.now()}`,
      appName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationSeconds,
      creatorHandle: `@creator_${Math.floor(Math.random() * 900 + 100)}`
    };

    setSessions(prev => [newSession, ...prev]);

    // Update today's log
    setLogs(prev => {
      const copy = [...prev];
      const todayIndex = copy.length - 1;
      if (todayIndex >= 0) {
        const today = { ...copy[todayIndex] };
        if (appName === 'instagram') {
          today.instagramReels += 1;
          today.instagramMinutes += Math.round(durationSeconds / 60) || 1;
        } else if (appName === 'youtube') {
          today.youtubeShorts += 1;
          today.youtubeMinutes += Math.round(durationSeconds / 60) || 1;
        } else {
          today.facebookReels += 1;
          today.facebookMinutes += Math.round(durationSeconds / 60) || 1;
        }
        copy[todayIndex] = today;
      }
      return copy;
    });

    // If unlocked until is still active, don't re-lock immediately
    if (unlockedUntil > Date.now()) {
      return;
    }

    // Check if limit breached
    const limitCheck = checkLimitBreached(appName, logs, limits, bonusMinutes);
    if (limitCheck.isBreached && permissions.accessibilityService && permissions.systemAlertWindow) {
      setLockOverlayState({
        isOpen: true,
        appName,
        reason: limitCheck.reason,
        currentValue: limitCheck.current + 1,
        limitValue: limitCheck.limit,
        unit: limitCheck.unit
      });
    }
  };

  // Trigger lock overlay directly
  const handleTriggerLock = (
    appName: AppId,
    reason: string,
    currentValue: number,
    limitValue: number,
    unit: 'reels' | 'minutes'
  ) => {
    setLockOverlayState({
      isOpen: true,
      appName,
      reason,
      currentValue,
      limitValue,
      unit
    });
  };

  // Task actions
  const handleAddTask = (newTask: Omit<TaskItem, 'id' | 'isDone'>) => {
    const task: TaskItem = {
      ...newTask,
      id: `task-${Date.now()}`,
      isDone: false
    };
    setTasks(prev => [...prev, task]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const willBeDone = !t.isDone;
          if (willBeDone && t.linkedToLimit && t.rewardMinutes > 0) {
            setBonusMinutes(bm => bm + t.rewardMinutes);
          }
          return { ...t, isDone: willBeDone };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleUpdateTask = (updatedTask: TaskItem) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  // Emergency unlock through friction timer
  const handleEmergencyUnlock = (minutes: number) => {
    const expiry = Date.now() + minutes * 60 * 1000;
    setUnlockedUntil(expiry);
    setLockOverlayState(prev => ({ ...prev, isOpen: false }));
  };

  // Unlock by completing a linked task from the lock overlay
  const handleCompleteTaskUnlock = (taskId: string, rewardMins: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isDone: true } : t));
    setBonusMinutes(bm => bm + rewardMins);
    const expiry = Date.now() + rewardMins * 60 * 1000;
    setUnlockedUntil(expiry);
    setLockOverlayState(prev => ({ ...prev, isOpen: false }));
  };

  // Reset to initial seed state
  const handleResetFactoryData = () => {
    if (window.confirm('Reset all limits, screen time logs, and tasks to factory defaults?')) {
      setLimits(INITIAL_LIMITS);
      setTasks(INITIAL_TASKS);
      setLogs(INITIAL_WEEKLY_LOGS);
      setPermissions(DEFAULT_PERMISSIONS);
      setSettings(DEFAULT_SETTINGS);
      setBonusMinutes(0);
      setUnlockedUntil(0);
      localStorage.clear();
    }
  };

  const globalLimit = limits.find(l => l.appName === 'global') || limits[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header & Bottom Nav */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        streakCount={settings.dailyStreak}
        onOpenSimulator={() => handleOpenSimulator('instagram')}
        onOpenPRD={() => setPrdModalOpen(true)}
        accessibilityActive={permissions.accessibilityService}
      />

      {/* Main Tab Screen Area */}
      <main className="flex-1 w-full max-w-xl mx-auto py-4">
        {currentTab === 'dashboard' && (
          <Dashboard
            logs={logs}
            limits={limits}
            tasks={tasks}
            streak={settings.dailyStreak}
            bonusMinutes={bonusMinutes}
            unlockedUntil={unlockedUntil}
            onOpenSimulator={handleOpenSimulator}
            onNavigateTab={setCurrentTab}
            onToggleTask={handleToggleTask}
          />
        )}

        {currentTab === 'tasks' && (
          <TasksScreen
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
            bonusMinutes={bonusMinutes}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsScreen
            logs={logs}
            limits={limits}
            sessions={sessions}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            limits={limits}
            permissions={permissions}
            settings={settings}
            onUpdateLimits={setLimits}
            onUpdatePermissions={setPermissions}
            onUpdateSettings={setSettings}
            onResetFactoryData={handleResetFactoryData}
          />
        )}
      </main>

      {/* Simulated Reels / Shorts Feed Modal */}
      {simulatorOpen && (
        <ReelSimulatorModal
          initialAppId={simulatorApp}
          logs={logs}
          limits={limits}
          bonusMinutes={bonusMinutes}
          onClose={() => setSimulatorOpen(false)}
          onRecordSession={handleRecordSession}
          onTriggerLock={handleTriggerLock}
        />
      )}

      {/* SYSTEM_ALERT_WINDOW Lock Overlay Modal */}
      {lockOverlayState.isOpen && (
        <LockOverlayModal
          appName={lockOverlayState.appName}
          reason={lockOverlayState.reason}
          currentValue={lockOverlayState.currentValue}
          limitValue={lockOverlayState.limitValue}
          unit={lockOverlayState.unit}
          strictMode={globalLimit.strictMode}
          cooldownSeconds={settings.frictionCooldownSeconds}
          tasks={tasks}
          onDismiss={() => {
            setLockOverlayState(prev => ({ ...prev, isOpen: false }));
            setSimulatorOpen(false); // return to home
          }}
          onEmergencyUnlock={handleEmergencyUnlock}
          onCompleteTaskUnlock={handleCompleteTaskUnlock}
        />
      )}

      {/* PRD & Technical Spec Modal */}
      {prdModalOpen && (
        <PrdTechnicalModal onClose={() => setPrdModalOpen(false)} />
      )}
    </div>
  );
}
