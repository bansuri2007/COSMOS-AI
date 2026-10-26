import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Headphones,
  Eye,
  BrainCircuit,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  Square,
  RotateCcw,
  Sliders,
  ChevronRight,
  ExternalLink,
  Layers,
  Award,
} from 'lucide-react';
import { UserProfile, StudentProgress } from '../types/pip';
import { pipAudio } from '../utils/audio';
import { pipSpeech } from '../utils/speech';
import { UploadAndChapterNotesModule } from './UploadAndChapterNotesModule';

interface LearningStationsViewProps {
  userProfile: UserProfile;
  progress: StudentProgress;
  onBack: () => void;
  initialStation?: 'audio' | 'visual' | 'practical' | 'all';
  onQuizScoreRecorded: (score: number, total: number, topic: string) => void;
}

export const LearningStationsView: React.FC<LearningStationsViewProps> = ({
  userProfile,
  progress,
  onBack,
  initialStation = 'all',
  onQuizScoreRecorded,
}) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'visual' | 'practical'>(
    initialStation === 'all' ? 'visual' : initialStation
  );

  // Audio station state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);
  const [audioVolume, setAudioVolume] = useState(80);

  const AUDIO_TRACKS = [
    {
      id: 'track-1',
      title: 'Cosmic Journey: Earth as an Ocean World',
      narrator: `${userProfile.companionName || 'Nova Rider'} AI Voice`,
      duration: '4:20',
      description:
        'Earth, the third planet from the sun, supports life as a unique ocean world with magnetic dynamo shielding and protective atmosphere.',
    },
    {
      id: 'track-2',
      title: 'Orbital Mechanics & Keplerian Trajectories',
      narrator: 'Cosmic Physics Station',
      duration: '6:15',
      description:
        'Mathematical formulation of orbital ellipses, gravitational binding energy, and escape velocity derivations.',
    },
    {
      id: 'track-3',
      title: '432Hz Deep Space Alpha-Wave Focus Stream',
      narrator: 'Harmonic Space Ambience',
      duration: '25:00',
      description:
        'Binaural cognitive frequency tuned for sustained university study sprints without mental fatigue.',
    },
  ];

  // Visual station 3D celestial parameters
  const [selectedPlanet, setSelectedPlanet] = useState<'Earth' | 'Mars' | 'Jupiter' | 'Saturn'>('Earth');

  const PLANET_DATA = {
    Earth: {
      gravity: '9.807 m/s²',
      velocity: '29.78 km/s',
      radius: '6,371 km',
      atmosphere: '78% N₂, 21% O₂, 1% Ar',
      tempRange: '-88°C to 58°C',
      notes:
        'Hydrosphere covers 70.8% of the surface. Active plate tectonics drive geochemical carbon recycling.',
    },
    Mars: {
      gravity: '3.721 m/s²',
      velocity: '24.07 km/s',
      radius: '3,389.5 km',
      atmosphere: '95% CO₂, 2.6% N₂, 1.9% Ar',
      tempRange: '-140°C to 20°C',
      notes:
        'Thin atmosphere allows severe cosmic radiation. Features Olympus Mons, the tallest volcano in the solar system.',
    },
    Jupiter: {
      gravity: '24.79 m/s²',
      velocity: '13.07 km/s',
      radius: '69,911 km',
      atmosphere: '90% H₂, 10% He',
      tempRange: '-145°C (cloud tops)',
      notes:
        'Gas giant with magnetic field 20,000 times stronger than Earth. Protects inner solar system from cometary impacts.',
    },
    Saturn: {
      gravity: '10.44 m/s²',
      velocity: '9.68 km/s',
      radius: '58,232 km',
      atmosphere: '96% H₂, 3% He, 0.4% CH₄',
      tempRange: '-178°C',
      notes:
        'Extensive ring system composed of 99% water ice with trace tholin impurities.',
    },
  };

  const currentTrack = AUDIO_TRACKS[currentAudioTrack];

  const handlePlayToggle = () => {
    const next = !isPlayingAudio;
    setIsPlayingAudio(next);
    pipAudio.playClick();
    if (next) {
      pipSpeech.speak(`Now playing: ${currentTrack.title}. ${currentTrack.description}`);
    } else {
      pipSpeech.stopSpeaking();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* 1. TOP HERO SECTION MATCHING SCREEN 3 OF USER REFERENCE IMAGE */}
      <div className="relative rounded-3xl overflow-hidden bg-[#060b18] border border-sky-500/25 shadow-2xl">
        {/* Large Earth Curve Backdrop matching Screen 3 */}
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          <img
            src="/assets/images/cosmic_earth_station_1792999984561.jpg"
            alt="Cosmic Journey Ocean Earth"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040816] via-[#040816]/40 to-transparent" />

          {/* Top navigation back button */}
          <button
            onClick={() => {
              pipAudio.playClick();
              onBack();
            }}
            className="absolute top-4 left-4 p-2.5 rounded-full bg-[#030612]/80 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition"
            title="Return to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Main Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30">
                ACTIVE LEARNING STATION
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Cosmic Journey
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl">
                Earth, the third planet from the sun, supports life as a unique ocean world making it the only known place in the universe sustaining life.
              </p>
            </div>

            {/* Play Button matching Screen 3 */}
            <button
              onClick={handlePlayToggle}
              className="w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-xl shadow-cyan-500/30 transition hover:scale-105 active:scale-95 shrink-0"
              title={isPlayingAudio ? 'Pause Lecture' : 'Play Lecture'}
            >
              {isPlayingAudio ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
          </div>
        </div>

        {/* Explorer Profile Strip matching Screen 3 */}
        <div className="p-4 md:p-6 bg-[#04091a]/95 border-t border-sky-500/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                {userProfile.callsign || 'Nova Rider'}
                <span className="text-amber-400 text-xs font-mono font-bold">★★★★★ 5.0</span>
              </h4>
              <p className="text-xs text-slate-400">
                Cognitive Guide: {userProfile.companionName || 'Cosmo'} ({userProfile.companionPersonality})
              </p>
            </div>
          </div>

          {/* Station Mode Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#02050f] border border-sky-500/25">
            <button
              onClick={() => {
                pipAudio.playClick();
                setActiveTab('audio');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'audio'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Headphones size={13} />
              <span>Audio Station</span>
            </button>

            <button
              onClick={() => {
                pipAudio.playClick();
                setActiveTab('visual');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'visual'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye size={13} />
              <span>Visual Station</span>
            </button>

            <button
              onClick={() => {
                pipAudio.playClick();
                setActiveTab('practical');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'practical'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BrainCircuit size={13} />
              <span>Practical Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATION CONTENT PANELS */}

      {/* A. AUDIO STATION */}
      {activeTab === 'audio' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#060b18]/90 border border-sky-500/20 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300">
                <Headphones size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Audio Learning Station</h3>
                <p className="text-xs text-slate-400">
                  Acoustic explanations, binaural alpha-waves, and spoken lesson breakdowns
                </p>
              </div>
            </div>

            <button
              onClick={handlePlayToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition"
            >
              {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isPlayingAudio ? 'Stop Narrating' : 'Listen with AI Voice'}</span>
            </button>
          </div>

          {/* Current Track Player Card */}
          <div className="p-5 rounded-2xl bg-[#040816] border border-sky-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  NOW STREAMING
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">{currentTrack.title}</h4>
                <p className="text-xs text-slate-400">Narrator: {currentTrack.narrator}</p>
              </div>
              <span className="text-xs font-mono text-cyan-300">{currentTrack.duration}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#02050f] p-3 rounded-xl border border-white/5">
              "{currentTrack.description}"
            </p>

            {/* Play controls */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handlePlayToggle}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition active:scale-95"
              >
                {isPlayingAudio ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                <span>{isPlayingAudio ? 'Pause' : 'Play Audio Stream'}</span>
              </button>
              <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`bg-cyan-400 h-full transition-all duration-300 ${
                    isPlayingAudio ? 'w-2/3 animate-pulse' : 'w-1/4'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Track playlist */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Available Audio Lessons
            </h4>
            <div className="space-y-2">
              {AUDIO_TRACKS.map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => {
                    pipAudio.playClick();
                    setCurrentAudioTrack(idx);
                    if (isPlayingAudio) {
                      pipSpeech.speak(`Now playing: ${t.title}. ${t.description}`);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    currentAudioTrack === idx
                      ? 'bg-sky-500/20 border-cyan-400 text-white'
                      : 'bg-[#040816]/70 border-white/5 text-slate-400 hover:text-white hover:bg-[#070e22]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-cyan-400">0{idx + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-white">{t.title}</p>
                      <p className="text-[11px] text-slate-400">{t.narrator}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{t.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* B. VISUAL STATION */}
      {activeTab === 'visual' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#060b18]/90 border border-sky-500/20 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300">
                <Eye size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Visual Planetary Station</h3>
                <p className="text-xs text-slate-400">
                  Infographics, orbital mechanics, planetary physical constants, and celestial diagrams
                </p>
              </div>
            </div>

            {/* Planet selector pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#02050f] border border-white/10">
              {(['Earth', 'Mars', 'Jupiter', 'Saturn'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    pipAudio.playClick();
                    setSelectedPlanet(p);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    selectedPlanet === p
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Planetary Visual Spec Sheet */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#040816] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Surface Gravity
              </span>
              <p className="text-sm font-extrabold text-cyan-300 font-mono">
                {PLANET_DATA[selectedPlanet].gravity}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#040816] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Orbital Velocity
              </span>
              <p className="text-sm font-extrabold text-sky-300 font-mono">
                {PLANET_DATA[selectedPlanet].velocity}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#040816] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Mean Radius
              </span>
              <p className="text-sm font-extrabold text-blue-300 font-mono">
                {PLANET_DATA[selectedPlanet].radius}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#040816] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Temperature
              </span>
              <p className="text-sm font-extrabold text-amber-300 font-mono">
                {PLANET_DATA[selectedPlanet].tempRange}
              </p>
            </div>
          </div>

          {/* Atmospheric composition & analytical summary */}
          <div className="p-5 rounded-2xl bg-[#040816] border border-sky-500/25 space-y-2">
            <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
              ATMOSPHERIC & GEOLOGICAL PROFILE
            </span>
            <p className="text-xs font-semibold text-white">
              Atmosphere: {PLANET_DATA[selectedPlanet].atmosphere}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {PLANET_DATA[selectedPlanet].notes}
            </p>
          </div>
        </div>
      )}

      {/* C. PRACTICAL STATION (UPLOAD-FIRST ENGINE, DIAGNOSTIC QUIZ, ERROR DIAGNOSIS & AUTO-TODO) */}
      {activeTab === 'practical' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#060b18]/90 border border-teal-500/30 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-300">
                <BrainCircuit size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Practical Learning Lab</h3>
                <p className="text-xs text-slate-400">
                  Upload study material to auto-generate 3-chapter notes, diagnostic quizzes, error root-cause diagnosis, and prioritized to-do tasks.
                </p>
              </div>
            </div>
          </div>

          <UploadAndChapterNotesModule
            onQuizCompleted={(score, total) => {
              onQuizScoreRecorded(score, total, 'Practical Planetary Lab');
            }}
            onMasteryAchieved={() => {
              pipAudio.playCelebrate();
            }}
          />
        </div>
      )}
    </div>
  );
};
