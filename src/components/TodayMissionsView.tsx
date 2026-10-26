import React, { useState } from 'react';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Flame,
  CheckSquare,
  Square,
  Award,
} from 'lucide-react';
import { pipAudio } from '../utils/audio';

export interface MissionTask {
  id: string;
  title: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
  stationType?: 'audio' | 'visual' | 'practical';
}

interface TodayMissionsViewProps {
  tasks: MissionTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: { title: string; time: string; priority: 'high' | 'medium' | 'low' }) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenStation: (station: 'audio' | 'visual' | 'practical') => void;
}

export const TodayMissionsView: React.FC<TodayMissionsViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenStation,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('20 min');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    pipAudio.playClick();
    onAddTask({
      title: newTitle.trim(),
      time: newTime,
      priority: newPriority,
    });
    setNewTitle('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#070e22]/95 via-[#050a18]/95 to-[#02050f] border border-sky-400/25 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300">
              <ListTodo size={16} />
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              MISSION TIMELINE
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Today's Focus & Study Queue</h2>
          <p className="text-xs text-slate-300">
            Formulated dynamically by your AI Tutor based on your study intentions and practical error diagnosis.
          </p>
        </div>

        {/* Progress Circular Strip */}
        <div className="p-4 rounded-2xl bg-[#030612] border border-white/10 flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Progress</span>
            <p className="text-xl font-extrabold text-cyan-300 font-mono">{progressPercent}%</p>
          </div>
          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-xs font-mono text-slate-400">
            {completedCount}/{tasks.length} Done
          </span>
        </div>
      </div>

      {/* Add New Mission Task Form */}
      <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-[#060b18]/80 border border-sky-500/20 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add custom task (e.g. Review Kepler 3rd Law Derivation)..."
          className="flex-1 min-w-[220px] bg-[#030713] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />

        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as any)}
          className="bg-[#030713] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <input
          type="text"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          placeholder="Time (e.g. 20 min)"
          className="w-24 bg-[#030713] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white text-center focus:outline-none focus:border-cyan-400"
        />

        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-extrabold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95"
        >
          <Plus size={14} />
          <span>Add Mission</span>
        </button>
      </form>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => {
              pipAudio.playClick();
              onToggleTask(task.id);
            }}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
              task.done
                ? 'bg-[#030612]/60 border-white/5 opacity-60'
                : 'bg-[#060b18]/90 border-sky-500/20 hover:border-cyan-400/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={`p-1 rounded-lg transition ${
                  task.done ? 'text-cyan-400' : 'text-slate-500 hover:text-white'
                }`}
              >
                {task.done ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>

              <div>
                <p className={`text-xs md:text-sm font-semibold ${task.done ? 'line-through text-slate-400' : 'text-white'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock size={11} />
                    {task.time}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                      task.priority === 'high'
                        ? 'bg-rose-500/20 text-rose-300'
                        : task.priority === 'medium'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                pipAudio.playClick();
                onDeleteTask(task.id);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
