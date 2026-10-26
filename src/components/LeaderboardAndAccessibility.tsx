import React, { useState } from 'react';
import {
  Trophy,
  Sliders,
  Volume2,
  VolumeX,
  Eye,
  Type,
  Activity,
  Mic,
  Palette,
  Shield,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Zap,
  Flame,
  Minus,
  Plus,
  Radio,
} from 'lucide-react';
import { PipSettings, BackgroundTheme, ColorBlindMode } from '../types/pip';
import { pipAudio } from '../utils/audio';
import { pipSpeech } from '../utils/speech';

interface LeaderboardAndAccessibilityProps {
  settings: PipSettings;
  onUpdateSettings: (newSettings: Partial<PipSettings>) => void;
  onTriggerVisualAlert?: () => void;
}

export const LeaderboardAndAccessibility: React.FC<LeaderboardAndAccessibilityProps> = ({
  settings,
  onUpdateSettings,
  onTriggerVisualAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'accessibility' | 'themes' | 'leaderboard'>('accessibility');

  const THEMES: { id: BackgroundTheme; name: string; desc: string; icon: string }[] = [
    {
      id: 'galaxy',
      name: 'Cosmic Milky Way & Moving Galaxy',
      desc: 'Interactive 3D cosmic starfield with swirling violet & cyan nebulae and mouse parallax.',
      icon: '🌌',
    },
    {
      id: 'cybergrid',
      name: 'Cyberpunk Neo-Tokyo Matrix Grid',
      desc: 'Glowing perspective laser horizon with traveling digital data streams.',
      icon: '⚡',
    },
    {
      id: 'quantum_void',
      name: 'Deep Obsidian Quantum Void',
      desc: 'Minimalist dark matter space with pulsing quantum energy waves.',
      icon: '⚛️',
    },
    {
      id: 'solar_flare',
      name: 'Interstellar Solar Flare & Plasma',
      desc: 'Warm cosmic radiation flares and energetic interstellar plasma.',
      icon: '☀️',
    },
    {
      id: 'stealth',
      name: 'Stealth Matte Titanium',
      desc: 'Zero-distraction pure matte dark aesthetic.',
      icon: '🛡️',
    },
  ];

  const LEADERBOARD_STUDENTS = [
    { rank: 1, name: 'Maya Lin', xp: 4120, streak: 14, league: 'Diamond', avatar: '👩‍💻', accuracy: '96%' },
    { rank: 2, name: 'Marcus Chen', xp: 3890, streak: 12, league: 'Diamond', avatar: '👨‍🔬', accuracy: '94%' },
    { rank: 3, name: 'Sara Al-Mansoor', xp: 3410, streak: 9, league: 'Diamond', avatar: '👩‍🎓', accuracy: '91%' },
    { rank: 4, name: 'Alex Rivera (You)', xp: 2840, streak: 7, league: 'Gold', avatar: '🚀', isUser: true, accuracy: '84%' },
    { rank: 5, name: 'Devon Vance', xp: 2650, streak: 8, league: 'Gold', avatar: '⚡', accuracy: '82%' },
    { rank: 6, name: 'Priya Sharma', xp: 2420, streak: 6, league: 'Gold', avatar: '📚', accuracy: '80%' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Nav Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('accessibility');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'accessibility'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Eye size={15} />
          Accessibility Suite (Blind, Deaf, Dyslexic, Colorblind)
        </button>

        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('themes');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'themes'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Palette size={15} />
          Futuristic Moving Background Themes
        </button>

        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('leaderboard');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'leaderboard'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Trophy size={15} />
          Student Leaderboard & Leagues
        </button>
      </div>

      {/* 1. COMPREHENSIVE ACCESSIBILITY SUITE */}
      {activeTab === 'accessibility' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                  Universal Design Architecture
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                  <Shield size={20} className="text-cyan-400" />
                  Inclusive Accessibility Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dedicated perceptual and cognitive assistance for blind, deaf, dyslexic, and colorblind students.
                </p>
              </div>

              <button
                onClick={() => {
                  pipAudio.playGreeting();
                  pipSpeech.speak('Accessibility suite online. All assistive tools are active.');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600 border border-cyan-500/40 text-xs font-bold text-cyan-200 transition flex items-center gap-2"
              >
                <Volume2 size={15} />
                Test Voice Screen Announcer
              </button>
            </div>

            {/* Categorized Accessibility Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SECTION A: BLIND & LOW VISION */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                    <Volume2 size={16} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Blind & Low Vision Assistance
                    </h4>
                    <p className="text-[10px] text-slate-400">Full Audio & Vocal Synthesizer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Screen Voice Reading (TTS)</p>
                      <p className="text-[11px] text-slate-400">Pip narrates questions, explanations, and tips</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.ttsEnabled}
                      onChange={(e) => {
                        pipAudio.playClick();
                        onUpdateSettings({ ttsEnabled: e.target.checked });
                        if (e.target.checked) pipSpeech.speak('Text to speech activated');
                      }}
                      className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Auto-Voice On Startup</p>
                      <p className="text-[11px] text-slate-400">Pip greets you verbally when application opens</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoVoiceOnOpen}
                      onChange={(e) => {
                        pipAudio.playClick();
                        onUpdateSettings({ autoVoiceOnOpen: e.target.checked });
                      }}
                      className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200">
                    ⌨️ <strong>Keyboard Shortcuts:</strong> Alt + S (Toggle Voice), Alt + M (Toggle Mic Hearing), Alt + T (Cycle Background Theme).
                  </div>
                </div>
              </div>

              {/* SECTION B: DEAF & HARD OF HEARING */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                    <Radio size={16} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Deaf & Hard of Hearing Assistance
                    </h4>
                    <p className="text-[10px] text-slate-400">Visual Sound & Live Subtitles</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Live Captions HUD Banner</p>
                      <p className="text-[11px] text-slate-400">Floating real-time transcription subtitles</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.liveCaptions}
                      onChange={(e) => {
                        pipAudio.playClick();
                        onUpdateSettings({ liveCaptions: e.target.checked });
                      }}
                      className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Visual Sound Flash Aura</p>
                      <p className="text-[11px] text-slate-400">Screen perimeter pulses cyan on audio alerts</p>
                    </div>
                    <button
                      onClick={() => {
                        if (onTriggerVisualAlert) onTriggerVisualAlert();
                        pipAudio.playClick();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-600/30 text-cyan-300 text-[11px] font-bold hover:bg-cyan-600 hover:text-white transition"
                    >
                      Test Flash
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION C: DYSLEXIA ASSISTANCE */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                    <Type size={16} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Dyslexia Assistance & Reading Ease
                    </h4>
                    <p className="text-[10px] text-slate-400">Reading Ruler & High-Legibility Font</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Dyslexia-Optimized Typography</p>
                      <p className="text-[11px] text-slate-400">Heavier baseline and expanded letter tracking</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.dyslexicFont}
                      onChange={(e) => {
                        pipAudio.playClick();
                        onUpdateSettings({ dyslexicFont: e.target.checked });
                      }}
                      className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Interactive Reading Ruler Guide</p>
                      <p className="text-[11px] text-slate-400">Follows cursor to highlight current reading row</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.readingRuler}
                      onChange={(e) => {
                        pipAudio.playClick();
                        onUpdateSettings({ readingRuler: e.target.checked });
                      }}
                      className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION D: COLOUR BLINDNESS CORRECTION */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <Palette size={16} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Colour Blindness Filters & Contrast
                    </h4>
                    <p className="text-[10px] text-slate-400">SVG Color Matrix Correction</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Select Vision Filter Preset:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { id: 'none', label: 'Standard Vision' },
                          { id: 'protanopia', label: 'Protanopia (Red-Blind)' },
                          { id: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
                          { id: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
                          { id: 'monochrome', label: 'Achromatopsia (Grayscale)' },
                        ] as const
                      ).map((cb) => (
                        <button
                          key={cb.id}
                          onClick={() => {
                            pipAudio.playClick();
                            onUpdateSettings({ colorBlindMode: cb.id });
                          }}
                          className={`p-2 rounded-xl text-left text-xs font-semibold transition border ${
                            settings.colorBlindMode === cb.id
                              ? 'bg-emerald-600/30 border-emerald-400 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          {cb.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-300">High Contrast Outlines</span>
                    <input
                      type="checkbox"
                      checked={settings.highContrast}
                      onChange={(e) => {
                        pipAudio.playClick();
                        onUpdateSettings({ highContrast: e.target.checked });
                      }}
                      className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FUTURISTIC BACKGROUND THEMES TAB */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest font-mono">
                Interactive Quantum Environments
              </span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                <Palette size={20} className="text-purple-400" />
                Select Live Background Theme
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Rendered on canvas with moving galactic dust, perspective Tron grids, and reactive mouse parallax.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {THEMES.map((th) => (
                <div
                  key={th.id}
                  onClick={() => {
                    pipAudio.playClick();
                    onUpdateSettings({ backgroundTheme: th.id });
                  }}
                  className={`p-5 rounded-3xl border cursor-pointer transition flex flex-col justify-between space-y-4 hover:scale-[1.02] active:scale-95 ${
                    settings.backgroundTheme === th.id
                      ? 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl'
                      : 'bg-slate-950/70 border-slate-800 hover:border-purple-500/50 text-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{th.icon}</span>
                      {settings.backgroundTheme === th.id && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          Active
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">{th.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{th.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                      Apply Theme →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. STUDENT LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="rounded-3xl bg-slate-900/90 border border-purple-500/20 overflow-hidden shadow-2xl">
          <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy size={18} className="text-amber-400" />
                Global Student Mastery Rankings
              </h3>
              <p className="text-xs text-slate-400">Based on verified quiz scores, streaks, and Pomodoro focus</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs">
              Gold Tier
            </span>
          </div>

          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Rank</th>
                <th className="py-3.5 px-4 font-semibold">Student</th>
                <th className="py-3.5 px-4 font-semibold">League</th>
                <th className="py-3.5 px-4 font-semibold">Daily Streak</th>
                <th className="py-3.5 px-4 font-semibold">Accuracy</th>
                <th className="py-3.5 px-4 font-semibold text-right">Mastery XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {LEADERBOARD_STUDENTS.map((st) => (
                <tr
                  key={st.rank}
                  className={`transition hover:bg-slate-800/50 ${
                    st.isUser ? 'bg-purple-950/40 border-l-4 border-l-cyan-400 font-bold text-white' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono">
                    {st.rank === 1 ? '🥇 1' : st.rank === 2 ? '🥈 2' : st.rank === 3 ? '🥉 3' : `#${st.rank}`}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2.5">
                    <span className="text-base">{st.avatar}</span>
                    <span className={st.isUser ? 'text-cyan-300' : 'text-white'}>{st.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {st.league}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Flame size={13} />
                      {st.streak}d
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">{st.accuracy}</td>
                  <td className="py-3 px-4 text-right font-mono text-purple-300 font-bold">{st.xp} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
