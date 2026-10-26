import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Rocket, User, Shield, Compass, Check } from 'lucide-react';
import { CompanionType, AnimalPersonality } from '../types/pip';
import { pipAudio } from '../utils/audio';

interface LoginPortalProps {
  onLogin: (profile: {
    name: string;
    companionType: CompanionType;
    companionName: string;
    companionPersonality: AnimalPersonality;
  }) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onLogin }) => {
  const [name, setName] = useState('Nova Rider');
  const [companionName, setCompanionName] = useState('Cosmo');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionType>('astronaut');
  const [selectedPersonality, setSelectedPersonality] = useState<AnimalPersonality>('Curious Explorer');
  const [slideIndex, setSlideIndex] = useState(0);

  const COMPANIONS: {
    type: CompanionType;
    label: string;
    species: string;
    image: string;
    description: string;
  }[] = [
    {
      type: 'astronaut',
      label: 'Nova Rider',
      species: '3D Space Explorer',
      image: '/assets/images/astronaut_companion_1792999965265.jpg',
      description: 'Equipped with deep-space telemetry, cosmic visor, and cognitive mission guidance.',
    },
    {
      type: 'cat',
      label: 'Siberian Astra',
      species: 'Photorealistic Siberian Cat',
      image: '/assets/images/realistic_cat_companion_1793000018848.jpg',
      description: 'Authentic feline anatomy, calm focus, and sensory awareness in zero-gravity.',
    },
    {
      type: 'dog',
      label: 'Solaris Retriever',
      species: 'Photorealistic Golden Retriever',
      image: '/assets/images/realistic_dog_companion_1793000049268.jpg',
      description: 'Loyal companion, high motivation, and enthusiastic encouragement for study sprints.',
    },
    {
      type: 'owl',
      label: 'Athena Nocturna',
      species: 'Photorealistic Snowy Owl',
      image: '/assets/images/realistic_owl_companion_1793000067209.jpg',
      description: 'Keen analytical intellect, memory recall, and quiet deep-focus companionship.',
    },
    {
      type: 'fox',
      label: 'Vulpes Nebula',
      species: 'Photorealistic Cosmic Fox',
      image: '/assets/images/realistic_fox_companion_1793000090793.jpg',
      description: 'Agile problem-solving, rapid comprehension, and sharp examination heuristics.',
    },
  ];

  const currentCompanion = COMPANIONS.find((c) => c.type === selectedCompanion) || COMPANIONS[0];

  const handleStartExploration = (e: React.FormEvent) => {
    e.preventDefault();
    pipAudio.playCelebrate();
    onLogin({
      name: name.trim() || 'Nova Rider',
      companionType: selectedCompanion,
      companionName: companionName.trim() || currentCompanion.label,
      companionPersonality: selectedPersonality,
    });
  };

  return (
    <div className="min-h-screen w-full relative bg-[#02040a] flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Background starlight gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/20 via-[#030612] to-[#010206] pointer-events-none" />

      {/* Main Glassmorphic Portal Container matching the reference image */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-[#060b18]/80 border border-sky-500/20 backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* LEFT COLUMN: HERO 3D CHARACTER DISPLAY (matching Screen 1 of reference image) */}
        <div className="lg:col-span-7 relative p-8 md:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-sky-500/15">
          {/* Subtle cosmic glow */}
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
                COSMIC EXPLORER PORTAL
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">MISSION 2026.1</span>
          </div>

          {/* Hero 3D Companion Centerpiece */}
          <div className="relative my-6 flex flex-col items-center justify-center z-10">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden border border-sky-400/30 shadow-2xl shadow-sky-900/30 group">
              <img
                src={currentCompanion.image}
                alt={currentCompanion.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040817] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-[#04091a]/85 backdrop-blur-md border border-sky-400/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-white">{currentCompanion.label}</p>
                    <p className="text-[10px] text-cyan-300">{currentCompanion.species}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                    3D REALISTIC
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Headline & Description matching exact text from user reference image */}
          <div className="space-y-3 z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Your Space Journey <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-cyan-400">
                Starts Right Here
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-lg leading-relaxed">
              An immersive space app experience that inspires exploration, simplifies learning, and brings the universe closer.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN & COMPANION CUSTOMIZATION */}
        <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between bg-[#040814]/90 z-10 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Rocket size={16} />
              </span>
              <h2 className="text-lg font-bold text-white tracking-wide">Enter Navigation Hub</h2>
            </div>
            <p className="text-xs text-slate-400">
              Customize your explorer profile and choose your 3D companion to begin.
            </p>
          </div>

          <form onSubmit={handleStartExploration} className="space-y-5">
            {/* Student Explorer Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Explorer Callsign / Name</span>
                <span className="text-[10px] text-cyan-400 font-mono">PILOT ID</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nova Rider"
                  required
                  className="w-full bg-[#070e22] border border-sky-500/30 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
                <User size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
              </div>
            </div>

            {/* Choose 3D Companion Character */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Your 3D Companion
              </label>
              <div className="grid grid-cols-5 gap-2">
                {COMPANIONS.map((comp) => {
                  const isSelected = selectedCompanion === comp.type;
                  return (
                    <button
                      key={comp.type}
                      type="button"
                      onClick={() => {
                        pipAudio.playClick();
                        setSelectedCompanion(comp.type);
                        setCompanionName(comp.label);
                      }}
                      className={`relative rounded-xl p-1 border transition flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/20 shadow-md shadow-cyan-500/30'
                          : 'border-white/10 bg-[#070e22] hover:border-slate-500 opacity-70 hover:opacity-100'
                      }`}
                      title={comp.species}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden">
                        <img src={comp.image} alt={comp.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-200 truncate w-full text-center">
                        {comp.type === 'astronaut' ? 'Astronaut' : comp.label.split(' ')[0]}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                          <Check size={9} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 italic">
                {currentCompanion.description}
              </p>
            </div>

            {/* Companion Personality */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Companion Guidance Personality
              </label>
              <select
                value={selectedPersonality}
                onChange={(e) => setSelectedPersonality(e.target.value as AnimalPersonality)}
                className="w-full bg-[#070e22] border border-sky-500/30 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Curious Explorer">Curious Explorer (Deep cosmological inquiry)</option>
                <option value="Smart & Playful">Smart & Playful (Active interactive quizzing)</option>
                <option value="Calm & Intelligent">Calm & Intelligent (Paced, structured learning)</option>
                <option value="Motivational Coach">Motivational Coach (High energy study booster)</option>
                <option value="Mysterious & Futuristic">Mysterious & Futuristic (Abstract conceptual synthesis)</option>
              </select>
            </div>

            {/* Let's Explore Action Button (matching reference image) */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-98"
              >
                <span>Lets Explore</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Bottom security watermark */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-white/5 font-mono">
            <span>READY FOR ORBIT</span>
            <span>SPACE APP SENTINEL v3.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
