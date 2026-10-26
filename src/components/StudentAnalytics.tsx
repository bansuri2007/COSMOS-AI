import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Brain,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { StudentProgress } from '../types/pip';
import { PipCharacter } from './PipCharacter';

interface StudentAnalyticsProps {
  progress: StudentProgress;
}

export const StudentAnalytics: React.FC<StudentAnalyticsProps> = ({ progress }) => {
  const SUBJECT_MASTERY = [
    { subject: 'Artificial Intelligence & Neural Nets', mastery: 92, status: 'Mastered', color: 'from-emerald-500 to-teal-400' },
    { subject: 'Calculus & Optimization', mastery: 84, status: 'Strong', color: 'from-purple-500 to-indigo-500' },
    { subject: 'Data Structures & Algorithms', mastery: 78, status: 'Competent', color: 'from-blue-500 to-cyan-400' },
    { subject: 'Operating Systems & Concurrency', mastery: 65, status: 'Needs Review', color: 'from-amber-500 to-orange-400' },
  ];

  const WEEKLY_MINUTES = [
    { day: 'Mon', minutes: 55, target: 45 },
    { day: 'Tue', minutes: 70, target: 45 },
    { day: 'Wed', minutes: 40, target: 45 },
    { day: 'Thu', minutes: 65, target: 45 },
    { day: 'Fri', minutes: 80, target: 45 },
    { day: 'Sat', minutes: 95, target: 60 },
    { day: 'Sun (Today)', minutes: progress.todayMinutes, target: progress.dailyGoalMinutes },
  ];

  const maxMinutes = 100;

  return (
    <div className="space-y-6">
      {/* Header Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Current Streak</span>
            <div className="text-2xl font-extrabold text-white flex items-center gap-1.5 mt-1">
              <Flame size={20} className="text-amber-400" />
              {progress.streakDays} Days
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
            Unbroken
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Mastery XP</span>
            <div className="text-2xl font-extrabold text-purple-300 flex items-center gap-1.5 mt-1">
              <Zap size={20} className="text-purple-400" />
              {progress.totalXp} XP
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
            Level {progress.level}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Average Quiz Score</span>
            <div className="text-2xl font-extrabold text-white flex items-center gap-1.5 mt-1">
              <CheckCircle2 size={20} className="text-emerald-400" />
              {progress.averageScore}%
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
            High Retention
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Today's Study Time</span>
            <div className="text-2xl font-extrabold text-white flex items-center gap-1.5 mt-1">
              <Clock size={20} className="text-blue-400" />
              {progress.todayMinutes}m / {progress.dailyGoalMinutes}m
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
            {Math.round((progress.todayMinutes / progress.dailyGoalMinutes) * 100)}%
          </span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery Radar / Meters */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain size={16} className="text-purple-400" />
                Adaptive Subject Mastery Breakdown
              </h3>
              <p className="text-xs text-slate-400">Synchronized with Cosmos AI performance</p>
            </div>
            <span className="text-xs font-bold text-purple-300">Real Performance</span>
          </div>

          <div className="space-y-4 pt-2">
            {SUBJECT_MASTERY.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{sub.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">{sub.status}</span>
                    <span className="font-bold text-white">{sub.mastery}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${sub.color}`}
                    style={{ width: `${sub.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 mt-4">
            🤖 <strong>Pip Diagnostic:</strong> OS Concurrency is at 65% due to Peterson algorithm boundary traps. Review the 2 remedial flashcards to push mastery above 80%!
          </div>
        </div>

        {/* Weekly Study Time Histogram */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 size={16} className="text-indigo-400" />
                Weekly Study Minutes Distribution
              </h3>
              <p className="text-xs text-slate-400">Total this week: 475 Minutes</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp size={14} />
              +18% vs Last Week
            </span>
          </div>

          {/* Bar Chart */}
          <div className="grid grid-cols-7 gap-2 items-end h-44 pt-4 px-2">
            {WEEKLY_MINUTES.map((item, idx) => {
              const heightPercent = Math.min(100, (item.minutes / maxMinutes) * 100);
              const isTargetMet = item.minutes >= item.target;

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-slate-400 font-mono">{item.minutes}m</span>
                  <div className="w-full bg-slate-950 rounded-t-xl h-full flex items-end overflow-hidden border border-slate-800">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ${
                        isTargetMet
                          ? 'bg-gradient-to-t from-purple-600 to-indigo-500'
                          : 'bg-gradient-to-t from-slate-700 to-slate-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                    {item.day.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              Target Met (&gt;45m)
            </span>
            <span>Consistency: 6/7 Days Met</span>
          </div>
        </div>
      </div>
    </div>
  );
};
