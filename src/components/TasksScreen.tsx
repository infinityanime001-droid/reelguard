import React, { useState } from 'react';
import { 
  Plus, 
  Bell, 
  BellOff, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  Volume2, 
  Calendar,
  AlertCircle,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskItem } from '../types';
import { soundFx } from '../utils/audio';

interface TasksScreenProps {
  tasks: TaskItem[];
  onAddTask: (task: Omit<TaskItem, 'id' | 'isDone'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (task: TaskItem) => void;
  bonusMinutes: number;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  bonusMinutes
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [alarmRingingTask, setAlarmRingingTask] = useState<TaskItem | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('18:00');
  const [repeatType, setRepeatType] = useState<'daily' | 'weekdays' | 'once'>('daily');
  const [linkedToLimit, setLinkedToLimit] = useState(true);
  const [rewardMinutes, setRewardMinutes] = useState(10);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [category, setCategory] = useState<'focus' | 'health' | 'study' | 'habit'>('focus');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      time,
      repeatType,
      linkedToLimit,
      rewardMinutes: linkedToLimit ? rewardMinutes : 0,
      notificationEnabled,
      category
    });

    // Reset
    setTitle('');
    setIsAdding(false);
  };

  const handleToggleComplete = (task: TaskItem) => {
    if (!task.isDone && task.linkedToLimit) {
      soundFx.playUnlockSuccess();
      try {
        confetti({
          particleCount: 40,
          spread: 55,
          origin: { y: 0.7 }
        });
      } catch (err) {
        console.error(err);
      }
    }
    onToggleTask(task.id);
  };

  const simulateAlarmRinging = (task: TaskItem) => {
    soundFx.playAlarmChime();
    setAlarmRingingTask(task);
  };

  const dismissAlarm = () => {
    setAlarmRingingTask(null);
  };

  const completeAlarmTask = () => {
    if (alarmRingingTask) {
      handleToggleComplete(alarmRingingTask);
      setAlarmRingingTask(null);
    }
  };

  return (
    <div className="space-y-5 pb-28 max-w-xl mx-auto px-4 pt-2">
      {/* Alarm Ringing Simulator Modal (Native Android Alarm Dialog) */}
      {alarmRingingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-purple-500/40 p-6 text-center shadow-2xl shadow-purple-500/20">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 mx-auto flex items-center justify-center animate-bounce mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30">
              Android AlarmManager Triggered
            </span>
            <h3 className="text-xl font-bold text-white mt-2">{alarmRingingTask.title}</h3>
            <p className="text-xs text-slate-400 mt-1">Scheduled for {alarmRingingTask.time} • Daily Reminder</p>

            {alarmRingingTask.linkedToLimit && (
              <div className="mt-4 p-3 rounded-2xl bg-purple-950/40 border border-purple-800/60 text-xs text-purple-300 flex items-center justify-center gap-2">
                <Gift className="w-4 h-4 text-purple-400" />
                <span>Complete this now to earn <strong>+{alarmRingingTask.rewardMinutes}m reels</strong>!</span>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={completeAlarmTask}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Mark Done & Claim Reward
              </button>
              <button
                onClick={dismissAlarm}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                Dismiss / Snooze 5m
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Bonus Allowance */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Daily Tasks & Alarms
          </h1>
          <p className="text-xs text-slate-400">
            Link productive habits to reel limit bonus unlocks
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Bonus earned summary pill */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-800/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-purple-300">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Active Bonus Reel Time:</span>
          <span className="font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
            +{bonusMinutes} mins
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Earned via completed tasks
        </span>
      </div>

      {/* Add Task Form / Drawer */}
      {isAdding && (
        <form 
          onSubmit={handleCreate}
          className="rounded-3xl bg-slate-900 border border-slate-700/80 p-5 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              Create Daily Task & Alarm
            </h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Task Description</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 20-min workout, read book chapter, clean inbox"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-white text-sm placeholder:text-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Scheduled Alarm Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Repeat Frequency</label>
              <select
                value={repeatType}
                onChange={e => setRepeatType(e.target.value as 'daily' | 'weekdays' | 'once')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-white text-sm"
              >
                <option value="daily">Every Day</option>
                <option value="weekdays">Mon - Fri (Weekdays)</option>
                <option value="once">Once</option>
              </select>
            </div>
          </div>

          {/* Reward link toggle */}
          <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-800/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-purple-200">Link to Reel Limit Unlock</span>
              </div>
              <input
                type="checkbox"
                checked={linkedToLimit}
                onChange={e => setLinkedToLimit(e.target.checked)}
                className="rounded accent-purple-500 w-4 h-4 cursor-pointer"
              />
            </div>
            {linkedToLimit && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Bonus minutes granted on completion:</span>
                <select
                  value={rewardMinutes}
                  onChange={e => setRewardMinutes(parseInt(e.target.value, 10))}
                  className="px-2 py-1 rounded-lg bg-purple-900/40 border border-purple-700/60 text-purple-200 text-xs font-bold"
                >
                  <option value={5}>+5 min</option>
                  <option value={10}>+10 min</option>
                  <option value={15}>+15 min</option>
                  <option value={20}>+20 min</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationEnabled}
                onChange={e => setNotificationEnabled(e.target.checked)}
                className="rounded accent-rose-500 w-4 h-4"
              />
              <span>Enable AlarmManager chime notification</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            Save Task & Alarm
          </button>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Today's Scheduled Tasks ({tasks.length})
        </h2>

        {tasks.map(task => (
          <div
            key={task.id}
            className={`rounded-2xl border p-4 transition-all ${
              task.isDone
                ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Checkbox */}
              <button
                onClick={() => handleToggleComplete(task)}
                className="mt-0.5 cursor-pointer flex-shrink-0"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                  task.isDone
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                    : 'border-slate-600 bg-slate-950/60 hover:border-rose-400'
                }`}>
                  {task.isDone && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                </div>
              </button>

              {/* Task Details */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold tracking-tight ${
                  task.isDone ? 'line-through text-slate-500' : 'text-slate-100'
                }`}>
                  {task.title}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {task.time}
                  </span>
                  <span>•</span>
                  <span className="capitalize text-[11px]">{task.repeatType}</span>

                  {task.linkedToLimit && (
                    <>
                      <span>•</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        task.isDone
                          ? 'bg-slate-800 border-slate-700 text-slate-400'
                          : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                        +{task.rewardMinutes}m reels unlock
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {/* Test alarm trigger */}
                <button
                  onClick={() => simulateAlarmRinging(task)}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                  title="Test alarm sound & popup"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* Alarm toggle */}
                <button
                  onClick={() => onUpdateTask({ ...task, notificationEnabled: !task.notificationEnabled })}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    task.notificationEnabled
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-slate-800/80 text-slate-500'
                  }`}
                  title={task.notificationEnabled ? 'Alarm notification active' : 'Alarm muted'}
                >
                  {task.notificationEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-10 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            No tasks scheduled yet. Create one to earn reel limit bonuses!
          </div>
        )}
      </div>

      {/* Android Background Alarm Reliability Note */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-300">Android AlarmManager Architecture</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Uses exact alarms via <code className="text-indigo-300">setExactAndAllowWhileIdle()</code> to guarantee task notifications wake the device even in Android Doze mode.
          </p>
        </div>
      </div>
    </div>
  );
};
