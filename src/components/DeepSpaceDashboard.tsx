import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Menu,
  Play,
  Sparkles,
  Headphones,
  Eye,
  BrainCircuit,
  Compass,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  ChevronRight,
  BookOpen,
  Send,
  MessageSquare,
} from 'lucide-react';
import { UserProfile, StudentProgress, CompanionType } from '../types/pip';
import { pipAudio } from '../utils/audio';

interface DeepSpaceDashboardProps {
  userProfile: UserProfile;
  progress: StudentProgress;
  onOpenStation: (stationId: 'audio' | 'visual' | 'practical' | 'all') => void;
  onOpenStudyQueue: () => void;
  onOpenTutorDialogue: (prompt?: string) => void;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const DeepSpaceDashboard: React.FC<DeepSpaceDashboardProps> = ({
  userProfile,
  progress,
  onOpenStation,
  onOpenStudyQueue,
  onOpenTutorDialogue,
  activeFilter,
  onSelectFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quickStudyInput, setQuickStudyInput] = useState('');

  const FILTERS = ['All', 'Nebula', 'Space', 'Sirius', 'Polaris', 'Audio', 'Visual', 'Practical'];

  // Stations matching Screen 2 of the reference image
  const STATIONS = [
    {
      id: 'cosmic_journey',
      title: 'Cosmic Journey',
      subtitle: 'Exploring endless universe full of mysteries',
      image: '/assets/images/cosmic_earth_station_1792999984561.jpg',
      category: 'Space',
      type: 'visual',
      tag: 'VISUAL SIMULATION',
      rating: '5.0',
    },
    {
      id: 'stellar_dreams',
      title: 'Stellar Dreams',
      subtitle: 'Drifting Through Distant Cosmic Lights',
      image: '/assets/images/stellar_dreams_galaxy_1793000000067.jpg',
      category: 'Nebula',
      type: 'audio',
      tag: 'SONIC LECTURE',
      rating: '4.9',
    },
    {
      id: 'quantum_lab',
      title: 'Orbital Practical Lab',
      subtitle: 'Diagnostic drills, formula verification & exam tests',
      image: '/assets/images/astronaut_companion_1792999965265.jpg',
      category: 'Sirius',
      type: 'practical',
      tag: 'ACTIVE MASTERY',
      rating: '5.0',
    },
  ];

  const filteredStations = STATIONS.filter((s) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Audio') return s.type === 'audio';
    if (activeFilter === 'Visual') return s.type === 'visual';
    if (activeFilter === 'Practical') return s.type === 'practical';
    return s.category === activeFilter;
  }).filter((s) =>
    searchQuery ? s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const handleStudySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickStudyInput.trim()) return;
    pipAudio.playClick();
    onOpenTutorDialogue(quickStudyInput);
    setQuickStudyInput('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 1. TOP HEADER MATCHING SCREEN 2 */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          {/* Avatar Thumbnail */}
          <div className="w-12 h-12 rounded-2xl bg-[#091124] border border-sky-400/30 overflow-hidden shadow-lg p-0.5">
            <img
              src={
                userProfile.companionType === 'cat'
                  ? '/assets/images/realistic_cat_companion_1793000018848.jpg'
                  : userProfile.companionType === 'dog'
                  ? '/assets/images/realistic_dog_companion_1793000049268.jpg'
                  : userProfile.companionType === 'owl'
                  ? '/assets/images/realistic_owl_companion_1793000067209.jpg'
                  : userProfile.companionType === 'fox'
                  ? '/assets/images/realistic_fox_companion_1793000090793.jpg'
                  : '/assets/images/astronaut_companion_1792999965265.jpg'
              }
              alt={userProfile.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <span className="text-[11px] font-mono text-cyan-300 tracking-wider uppercase font-semibold">
              {userProfile.callsign || 'Nova Rider'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl md:text-2xl font-extrabold text-white">Hello!</span>
              <span className="text-xl">👋</span>
            </div>
            <p className="text-xs text-slate-400">Good to see you</p>
          </div>
        </div>

        {/* Action icons (Bell & Quick Focus) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#080e1e] border border-amber-500/30 text-xs">
            <Flame size={14} className="text-amber-400" />
            <span className="font-bold text-white font-mono">{progress.streakDays}d Streak</span>
          </div>
          <button
            onClick={() => onOpenTutorDialogue()}
            className="p-2.5 rounded-2xl bg-[#080e1e] border border-sky-500/30 text-cyan-300 hover:text-white hover:bg-sky-900/30 transition shadow-sm"
            title="AI Study Coach Dialogue"
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </div>

      {/* 2. PILL FILTER CHIPS MATCHING SCREEN 2 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {FILTERS.map((f) => {
          const isSelected = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => {
                pipAudio.playClick();
                onSelectFilter(f);
              }}
              className={`px-4 py-2 rounded-2xl font-semibold transition whitespace-nowrap border ${
                isSelected
                  ? 'bg-sky-500/25 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-[#060b18]/80 border-white/10 text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH BAR MATCHING SCREEN 2 */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search planets, lecture notes, or concepts..."
            className="w-full bg-[#060b1a]/90 border border-sky-500/25 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
        <button
          onClick={() => onOpenStudyQueue()}
          className="p-3 rounded-2xl bg-[#060b1a] border border-sky-500/25 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 transition"
          title="Filter and To-Do Settings"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* 4. "WHAT DO YOU FEEL LIKE STUDYING TODAY?" - DIRECT AI TRIGGER */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-[#070e22]/95 via-[#050a18]/95 to-[#02050f] border border-sky-400/25 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
                AI COGNITIVE DISPATCH
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">
              What do you feel like studying today?
            </h3>
            <p className="text-xs text-slate-300 max-w-lg">
              Type any topic or exam requirement. Your AI Tutor will formulate immediate Audio, Visual, and Practical learning stations for you.
            </p>
          </div>

          <form onSubmit={handleStudySubmit} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={quickStudyInput}
              onChange={(e) => setQuickStudyInput(e.target.value)}
              placeholder="e.g. Orbital Mechanics, Calculus, Biology..."
              className="bg-[#030612] border border-sky-500/30 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 flex-1 md:w-64"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap"
            >
              <span>Launch</span>
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* 5. EXPLORE PLANETS & LEARNING STATIONS (MATCHING SCREEN 2 CARDS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-wide">
            Explore Planets & Learning Stations
          </h3>
          <button
            onClick={() => onOpenStation('all')}
            className="text-xs font-bold text-cyan-400 hover:text-white transition flex items-center gap-1 font-mono"
          >
            <span>See all</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* 2-Column Grid matching Screen 2 in reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              onClick={() => onOpenStation(station.type as any)}
              className="group cursor-pointer rounded-3xl bg-[#060b18]/85 border border-sky-500/20 hover:border-cyan-400/50 p-4 transition-all duration-300 hover:scale-[1.02] shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              {/* Image Preview matching reference style */}
              <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 border border-white/5">
                <img
                  src={station.image}
                  alt={station.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040816] via-transparent to-transparent opacity-80" />

                {/* Station Tag Pill */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-[#030612]/80 backdrop-blur-md border border-sky-400/20 text-[10px] font-mono font-bold text-cyan-300">
                  {station.tag}
                </div>

                {/* Floating Play / Launch Action Button matching image */}
                <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-cyan-500/30 backdrop-blur-md border border-cyan-400/60 flex items-center justify-center text-white shadow-lg group-hover:bg-cyan-500 group-hover:text-black transition">
                  <Play size={16} fill="currentColor" />
                </div>
              </div>

              {/* Station Details */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                    {station.title}
                  </h4>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">★ {station.rating}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {station.subtitle}
                </p>
              </div>

              {/* Bottom Quick Trigger */}
              <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span>Enter Station</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. LEARNING STATIONS DIRECT ACCESS TRIO (AUDIO, VISUAL, PRACTICAL) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
            Stations for All Kinds of Learners
          </h3>
          <span className="text-xs text-slate-400 font-mono">Multi-Sensory Learning Lab</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Audio Station */}
          <div
            onClick={() => onOpenStation('audio')}
            className="p-5 rounded-3xl bg-[#060b18]/90 border border-sky-500/20 hover:border-cyan-400/50 p-5 cursor-pointer transition hover:scale-[1.01] shadow-lg space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Headphones size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Audio Station</h4>
              <p className="text-xs text-slate-400 mt-1">
                Sonic lectures, podcast explanations, and 432Hz deep space alpha-wave focus streams.
              </p>
            </div>
            <span className="inline-block text-[11px] font-bold text-cyan-400 font-mono">
              Auditory Learning →
            </span>
          </div>

          {/* Visual Station */}
          <div
            onClick={() => onOpenStation('visual')}
            className="p-5 rounded-3xl bg-[#060b18]/90 border border-sky-500/20 hover:border-cyan-400/50 p-5 cursor-pointer transition hover:scale-[1.01] shadow-lg space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <Eye size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Visual Station</h4>
              <p className="text-xs text-slate-400 mt-1">
                3D planetary charts, orbital mechanics diagrams, concept maps, and high-definition infographics.
              </p>
            </div>
            <span className="inline-block text-[11px] font-bold text-blue-400 font-mono">
              Visual Learning →
            </span>
          </div>

          {/* Practical Station */}
          <div
            onClick={() => onOpenStation('practical')}
            className="p-5 rounded-3xl bg-[#060b18]/90 border border-sky-500/20 hover:border-cyan-400/50 p-5 cursor-pointer transition hover:scale-[1.01] shadow-lg space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Practical Lab</h4>
              <p className="text-xs text-slate-400 mt-1">
                Diagnostic practice quizzes, mistake root-cause identification, and auto-generated to-do lists.
              </p>
            </div>
            <span className="inline-block text-[11px] font-bold text-teal-400 font-mono">
              Kinesthetic & Applied →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
