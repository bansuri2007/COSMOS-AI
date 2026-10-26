import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Coffee,
  Music,
  Video,
  Languages,
  Sparkles,
  Play,
  Pause,
  ExternalLink,
  Volume2,
  CheckCircle2,
  Flame,
  Globe,
  Award,
  Clock,
  RotateCcw,
  HelpCircle,
  Zap,
  Radio,
} from 'lucide-react';
import { pipAudio } from '../utils/audio';

interface BreaksHubProps {
  onXpEarned?: (xp: number) => void;
}

interface SpotifyItem {
  title: string;
  type: 'playlist' | 'track' | 'album';
  embedId: string;
  description: string;
  tag: string;
}

export const BreaksHub: React.FC<BreaksHubProps> = ({ onXpEarned }) => {
  const [activeTab, setActiveTab] = useState<'music' | 'language' | 'gk' | 'motivation'>('music');

  // ==========================================
  // 1. SPOTIFY STUDY MUSIC STATE
  // ==========================================
  const SPOTIFY_PRESETS: SpotifyItem[] = [
    {
      title: 'Lofi Study Beats — Deep Work & Chill',
      type: 'playlist',
      embedId: '37i9dQZF1DWWQRwui0ExPn',
      description: 'Official Spotify Lofi Cafe with calm, steady bpm instrumental hip hop for prolonged deep work sprints.',
      tag: 'Lo-Fi Chill',
    },
    {
      title: 'Binaural Focus & 432Hz Alpha Waves',
      type: 'playlist',
      embedId: '37i9dQZF1DXdLEN7aqioXM',
      description: 'Alpha binaural tones to stimulate prefrontal cortex focus and reduce mental fatigue.',
      tag: 'Binaural Beats',
    },
    {
      title: 'Deep Focus — Instrumental Flow',
      type: 'playlist',
      embedId: '37i9dQZF1DWZeKCadgRdKQ',
      description: 'Timeless atmospheric compositions proven to optimize memory consolidation and spatial reasoning.',
      tag: 'Deep Focus',
    },
    {
      title: 'Peaceful Piano — Memory & Recall',
      type: 'playlist',
      embedId: '37i9dQZF1DX4sWSpwq3LiO',
      description: 'Gentle classical and contemporary solo piano for calm reading and problem solving.',
      tag: 'Piano',
    },
    {
      title: 'Brain Food — Electronic Focus',
      type: 'playlist',
      embedId: '37i9dQZF1DX8Uebhn9wzrS',
      description: 'Hypnotic electronic and downtempo beats to maintain deep coding flow state.',
      tag: 'Electronic',
    },
    {
      title: 'Synthwave Focus — Code & Flow',
      type: 'playlist',
      embedId: '37i9dQZF1DX3qCx5IaU84c',
      description: 'Uplifting retro-modern instrumental flow designed for uninterrupted coding and studying.',
      tag: 'Synthwave',
    },
  ];

  const [activeSpotifyPlaylist, setActiveSpotifyPlaylist] = useState<SpotifyItem>(SPOTIFY_PRESETS[0]);
  const [customSpotifyUrl, setCustomSpotifyUrl] = useState('');
  const [spotifyEmbedError, setSpotifyEmbedError] = useState(false);

  // Web Audio Ambient Synthesizer State (zero-cookie, offline, guaranteed fallback)
  const [ambientActive, setAmbientActive] = useState<string | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(0.4);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const ambientNodesRef = React.useRef<{ osc?: OscillatorNode; gain?: GainNode; noiseSource?: AudioBufferSourceNode } | null>(null);

  const stopAmbient = () => {
    if (ambientNodesRef.current) {
      try {
        if (ambientNodesRef.current.osc) ambientNodesRef.current.osc.stop();
        if (ambientNodesRef.current.noiseSource) ambientNodesRef.current.noiseSource.stop();
      } catch (e) {}
      ambientNodesRef.current = null;
    }
    setAmbientActive(null);
  };

  const playAmbient = (type: 'alpha432' | 'rain' | 'whitenoise' | 'cosmic') => {
    stopAmbient();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(ambientVolume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'alpha432') {
        // 432 Hz + 442 Hz (10 Hz alpha binaural difference)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(432, ctx.currentTime);
        osc2.frequency.setValueAtTime(442, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.18, ctx.currentTime);
        osc1.connect(oscGain);
        osc2.connect(oscGain);
        oscGain.connect(masterGain);

        osc1.start();
        osc2.start();
        ambientNodesRef.current = { osc: osc1, gain: masterGain };
      } else if (type === 'cosmic') {
        // Deep space harmonic drone (110Hz + 165Hz)
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(108, ctx.currentTime);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, ctx.currentTime);
        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();
        ambientNodesRef.current = { osc, gain: masterGain };
      } else {
        // Rain / White noise synthesized buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Pink / Brown filter for soft rain
            b0 = 0.99 * b0 + white * 0.05;
            output[i] = b0 * 2.5;
          } else {
            output[i] = white * 0.15;
          }
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(type === 'rain' ? 800 : 1200, ctx.currentTime);
        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        ambientNodesRef.current = { noiseSource: whiteNoise, gain: masterGain };
      }

      setAmbientActive(type);
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  };

  const handleCustomSpotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSpotifyUrl.trim()) return;
    const raw = customSpotifyUrl.trim();

    // Match Spotify URL formats:
    // https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
    // https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
    // https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3
    // spotify:playlist:37i9dQZF1DXcBWIGoYBM5M
    const urlMatch = raw.match(/open\.spotify\.com\/(playlist|track|album|episode)\/([a-zA-Z0-9]+)/);
    const uriMatch = raw.match(/spotify:(playlist|track|album|episode):([a-zA-Z0-9]+)/);

    const type = (urlMatch?.[1] || uriMatch?.[1] || 'playlist') as 'playlist' | 'track' | 'album';
    const id = urlMatch?.[2] || uriMatch?.[2] || raw;

    if (id) {
      pipAudio.playCelebrate();
      setActiveSpotifyPlaylist({
        title: `Custom ${type.toUpperCase()}: ${id.slice(0, 10)}...`,
        type,
        embedId: id,
        description: `Imported directly from user Spotify input: ${raw}`,
        tag: 'Custom',
      });
      setSpotifyEmbedError(false);
      setCustomSpotifyUrl('');
    }
  };

  // ==========================================
  // 2. FOREIGN LANGUAGE DUOLINGO-STYLE SPRINT
  // ==========================================
  const [selectedLanguage, setSelectedLanguage] = useState<'Spanish' | 'French' | 'Japanese' | 'German'>('Spanish');
  const [sprintIndex, setSprintIndex] = useState(0);
  const [revealedTranslation, setRevealedTranslation] = useState(false);
  const [langStreak, setLangStreak] = useState(0);

  // Duolingo Quiz Challenge state
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);
  const [isQuizAnswerCorrect, setIsQuizAnswerCorrect] = useState<boolean | null>(null);

  const LANGUAGE_DATA: Record<string, {
    word: string;
    phonetic: string;
    translation: string;
    example: string;
    langCode: string;
    quizOptions: string[];
    correctQuizIndex: number;
  }[]> = {
    Spanish: [
      {
        word: 'El aprendizaje',
        phonetic: 'el ah-pren-dee-SAH-heh',
        translation: 'The Learning / Apprenticeship',
        example: 'El aprendizaje continuo abre puertas infinitas.',
        langCode: 'es-ES',
        quizOptions: ['The Break / Rest', 'The Learning / Apprenticeship', 'The Examination', 'The Memory'],
        correctQuizIndex: 1,
      },
      {
        word: 'La memoria de trabajo',
        phonetic: 'lah meh-MOH-ryah deh trah-BAH-hoh',
        translation: 'Working Memory',
        example: 'La memoria de trabajo procesa la información actual.',
        langCode: 'es-ES',
        quizOptions: ['Long-term Storage', 'Working Memory', 'Visual Imagination', 'Sleep Cycle'],
        correctQuizIndex: 1,
      },
      {
        word: 'El descanso',
        phonetic: 'el des-KAHN-soh',
        translation: 'The Break / Mental Rest',
        example: 'Un buen descanso reactiva la mente para resolver problemas.',
        langCode: 'es-ES',
        quizOptions: ['The Challenge', 'The Break / Rest', 'The Homework', 'The Lecture'],
        correctQuizIndex: 1,
      },
      {
        word: 'El éxito constante',
        phonetic: 'el EK-see-toh kon-STAHN-teh',
        translation: 'Consistent Success',
        example: 'El éxito viene con la disciplina y la práctica constante.',
        langCode: 'es-ES',
        quizOptions: ['Sudden Luck', 'Consistent Success', 'Daily Routine', 'Fast Reading'],
        correctQuizIndex: 1,
      },
    ],
    French: [
      {
        word: 'La connaissance',
        phonetic: 'lah koh-neh-SAHNS',
        translation: 'Knowledge / Cognition',
        example: 'La connaissance est la véritable clé du progrès.',
        langCode: 'fr-FR',
        quizOptions: ['Patience', 'Knowledge / Cognition', 'Curiosity', 'Experiment'],
        correctQuizIndex: 1,
      },
      {
        word: 'La persévérance',
        phonetic: 'lah pair-seh-veh-RAHNS',
        translation: 'Perseverance / Tenacity',
        example: 'La persévérance bat le talent sans effort.',
        langCode: 'fr-FR',
        quizOptions: ['Inspiration', 'Perseverance / Tenacity', 'Speed', 'Imagination'],
        correctQuizIndex: 1,
      },
      {
        word: 'L’objectif clair',
        phonetic: 'lob-zhek-TEEF klehr',
        translation: 'The Clear Objective',
        example: 'Garde l’objectif en tête à chaque minute.',
        langCode: 'fr-FR',
        quizOptions: ['The Rough Draft', 'The Clear Objective', 'The Final Exam', 'The Study Room'],
        correctQuizIndex: 1,
      },
    ],
    Japanese: [
      {
        word: '改善 (Kaizen)',
        phonetic: 'Kye-zen',
        translation: 'Continuous incremental improvement',
        example: '毎日少しずつの改善。 (Daily tiny improvements).',
        langCode: 'ja-JP',
        quizOptions: ['Total Perfection', 'Continuous incremental improvement', 'Sudden Breakthrough', 'Hard Exam'],
        correctQuizIndex: 1,
      },
      {
        word: '集中 (Shūchū)',
        phonetic: 'Shoo-choo',
        translation: 'Deep Focus / Intense Concentration',
        example: '勉強に集中する。 (Concentrate deeply on studying).',
        langCode: 'ja-JP',
        quizOptions: ['Daydreaming', 'Deep Focus / Concentration', 'Relaxation', 'Quick Review'],
        correctQuizIndex: 1,
      },
      {
        word: '努力 (Doryoku)',
        phonetic: 'Doh-ryoh-koo',
        translation: 'Effort & Dedication',
        example: '努力は裏切らない。 (True effort never betrays you).',
        langCode: 'ja-JP',
        quizOptions: ['Natural Talent', 'Effort & Dedication', 'Good Luck', 'Memory Trick'],
        correctQuizIndex: 1,
      },
    ],
    German: [
      {
        word: 'Der Wissensdurst',
        phonetic: 'dair VISS-ens-doorst',
        translation: 'Thirst for Knowledge',
        example: 'Ein gesunder Wissensdurst treibt die Forschung voran.',
        langCode: 'de-DE',
        quizOptions: ['Exhaustion', 'Thirst for Knowledge', 'Study Group', 'Library'],
        correctQuizIndex: 1,
      },
      {
        word: 'Die Gewohnheit',
        phonetic: 'dee geh-VOHN-hite',
        translation: 'The Habit / Routine',
        example: 'Gute Gewohnheiten führen zum langfristigen Erfolg.',
        langCode: 'de-DE',
        quizOptions: ['The Decision', 'The Habit / Routine', 'The Goal', 'The Challenge'],
        correctQuizIndex: 1,
      },
      {
        word: 'Die Konzentration',
        phonetic: 'dee kon-tsen-trah-TSYOHN',
        translation: 'Deep Concentration',
        example: 'Volle Konzentration auf das heutige Thema.',
        langCode: 'de-DE',
        quizOptions: ['Distraction', 'Deep Concentration', 'Note-taking', 'Summarizing'],
        correctQuizIndex: 1,
      },
    ],
  };

  const currentWords = LANGUAGE_DATA[selectedLanguage] || LANGUAGE_DATA.Spanish;
  const activeWord = currentWords[sprintIndex % currentWords.length];

  // Speak word aloud using browser synthesis
  const speakForeignWord = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectQuizOption = (optIdx: number) => {
    if (quizAnswerSelected !== null) return;
    setQuizAnswerSelected(optIdx);

    const correct = optIdx === activeWord.correctQuizIndex;
    setIsQuizAnswerCorrect(correct);

    if (correct) {
      pipAudio.playCelebrate();
      setLangStreak((s) => s + 1);
      if (onXpEarned) onXpEarned(25);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#10b981', '#ffffff'],
      });
    } else {
      pipAudio.playClick();
      setLangStreak(0);
    }
  };

  const handleNextWordSprint = () => {
    pipAudio.playClick();
    setSprintIndex((prev) => prev + 1);
    setRevealedTranslation(false);
    setQuizAnswerSelected(null);
    setIsQuizAnswerCorrect(null);
  };

  // ==========================================
  // 3. GK TRIVIA BLITZ (60-SECOND RAPID FIRE)
  // ==========================================
  const GK_TRIVIA_QUESTIONS = [
    {
      q: 'Which subatomic particle was discovered by J.J. Thomson in 1897 using cathode ray tubes?',
      options: ['Proton', 'Electron', 'Neutron', 'Positron'],
      correct: 1,
      explanation: 'J.J. Thomson determined the charge-to-mass ratio of electrons in his famous cathode ray experiments.',
      category: 'Science',
    },
    {
      q: 'What is the theoretical maximum efficiency of a heat engine operating between two temperatures given by?',
      options: ['Newton Efficiency', 'Carnot Theorem', 'Gibbs Factor', 'Rankine Ratio'],
      correct: 1,
      explanation: 'The Carnot cycle efficiency eta = 1 - (T_cold / T_hot) sets the thermodynamic ceiling for all heat engines.',
      category: 'Physics',
    },
    {
      q: 'Which sorting algorithm has a worst-case time complexity of O(N log N) while maintaining stability?',
      options: ['Quicksort', 'Merge Sort', 'Heapsort', 'Selection Sort'],
      correct: 1,
      explanation: 'Merge sort always divides into halves and merges in linear time, guaranteeing O(N log N) stability.',
      category: 'Computer Science',
    },
    {
      q: 'Who formulated the Three Laws of Planetary Motion in the early 17th century?',
      options: ['Galileo Galilei', 'Johannes Kepler', 'Isaac Newton', 'Nicolaus Copernicus'],
      correct: 1,
      explanation: 'Kepler derived elliptical orbits, equal areas in equal times, and the harmonic law P^2 = a^3.',
      category: 'Astronomy',
    },
    {
      q: 'What physiological molecule is known as the "universal energy currency" of biological cells?',
      options: ['DNA', 'ATP (Adenosine Triphosphate)', 'Glucose-6-Phosphate', 'Insulin'],
      correct: 1,
      explanation: 'ATP hydrolysis releases ~30.5 kJ/mol of free energy to fuel endergonic biochemical processes.',
      category: 'Biochemistry',
    },
    {
      q: 'In distributed computing, what does the "P" in the CAP theorem represent?',
      options: ['Performance', 'Partition Tolerance', 'Parallelism', 'Persistence'],
      correct: 1,
      explanation: 'CAP stands for Consistency, Availability, and Partition Tolerance.',
      category: 'Computer Science',
    },
  ];

  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaTimer, setTriviaTimer] = useState(60);
  const [triviaActive, setTriviaActive] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaSelectedOpt, setTriviaSelectedOpt] = useState<number | null>(null);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (triviaActive && triviaTimer > 0) {
      interval = setInterval(() => {
        setTriviaTimer((t) => t - 1);
      }, 1000);
    } else if (triviaTimer === 0 && triviaActive) {
      setTriviaActive(false);
      pipAudio.playCelebrate();
      confetti({ particleCount: 80, spread: 80 });
    }
    return () => clearInterval(interval);
  }, [triviaActive, triviaTimer]);

  const handleStartTrivia = () => {
    pipAudio.playCelebrate();
    setTriviaScore(0);
    setTriviaTimer(60);
    setTriviaIndex(0);
    setTriviaSelectedOpt(null);
    setTriviaActive(true);
  };

  const handleTriviaAnswer = (optIdx: number) => {
    if (triviaSelectedOpt !== null || !triviaActive) return;
    setTriviaSelectedOpt(optIdx);

    const currentQ = GK_TRIVIA_QUESTIONS[triviaIndex % GK_TRIVIA_QUESTIONS.length];
    const isCorrect = optIdx === currentQ.correct;

    if (isCorrect) {
      pipAudio.playCelebrate();
      setTriviaScore((s) => s + 1);
      if (onXpEarned) onXpEarned(25);
    } else {
      pipAudio.playClick();
    }

    setTimeout(() => {
      setTriviaIndex((i) => i + 1);
      setTriviaSelectedOpt(null);
    }, 1200);
  };

  // ==========================================
  // 4. MOTIVATION SHORTS
  // ==========================================
  const MOTIVATION_SHORTS = [
    {
      id: 'm1',
      title: 'The 20-Minute Focus Rule — Andrew Huberman',
      creator: 'Huberman Lab Neuroscience',
      duration: '0:58',
      quote: 'Initial friction at the start of studying is simply your autonomic nervous system calibrating dopamine. Lean into the first 5 minutes.',
      tag: 'Neuroscience',
    },
    {
      id: 'm2',
      title: 'Active Recall vs 10 Hours of Passive Reading',
      creator: 'Ali Abdaal',
      duration: '1:12',
      quote: 'Testing yourself when you feel completely unready produces 3x more synaptogenesis than comfortable, effortless re-reading.',
      tag: 'Cognitive Science',
    },
    {
      id: 'm3',
      title: 'Micro-Commitments & The 2-Minute Rule',
      creator: 'James Clear (Atomic Habits)',
      duration: '0:45',
      quote: 'Make the threshold to start so tiny that your brain encounters zero resistance: just open the document and read one paragraph.',
      tag: 'Habit Design',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-[#040816]/95 border border-sky-500/20 shadow-2xl backdrop-blur-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Coffee size={16} />
            </span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
              Cognitive Dopamine Reset & Breaks Hub
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Study Breaks & Cognitive Wellness</h2>
          <p className="text-xs text-slate-400">
            Neuroscience shows 5-10 minute dopamine resets maintain 90%+ cognitive retention throughout the day.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#02050f] border border-cyan-400/30 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Brain Battery</span>
            <span className="text-sm font-black text-cyan-300 font-mono">96% Refreshed</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-sky-500/20 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('music');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'music'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Music size={15} />
          Spotify Study Music
        </button>

        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('language');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'language'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Globe size={15} />
          Foreign Language Sprint (Duolingo Style)
        </button>

        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('gk');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'gk'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Zap size={15} />
          GK Trivia Blitz (60s Game)
        </button>

        <button
          onClick={() => {
            pipAudio.playClick();
            setActiveTab('motivation');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'motivation'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#030612] border border-white/5'
          }`}
        >
          <Video size={15} />
          Motivation Shorts
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. SPOTIFY STUDY MUSIC & AMBIENT FOCUS AUDIO                               */}
      {/* ========================================================================= */}
      {activeTab === 'music' && (
        <div className="space-y-6 animate-bubble-pop">
          {/* Custom Spotify URL Input Bar */}
          <div className="p-4 rounded-2xl bg-[#040816]/90 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Music size={15} />
              </div>
              <div>
                <span className="font-bold text-white">Custom Spotify Integration</span>
                <span className="text-[11px] text-slate-400 block">Paste any Spotify playlist, album, or track URL to embed it directly.</span>
              </div>
            </div>
            <form onSubmit={handleCustomSpotifySubmit} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={customSpotifyUrl}
                onChange={(e) => setCustomSpotifyUrl(e.target.value)}
                placeholder="https://open.spotify.com/playlist/..."
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 w-full md:w-80"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition whitespace-nowrap shrink-0 shadow-lg shadow-emerald-500/20"
              >
                Load Audio
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Playlist Presets */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest font-mono">
                  Select Study Vibe:
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">Live Spotify</span>
              </div>
              {SPOTIFY_PRESETS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    pipAudio.playClick();
                    setActiveSpotifyPlaylist(item);
                    setSpotifyEmbedError(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-1 ${
                    activeSpotifyPlaylist.embedId === item.embedId
                      ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg'
                      : 'bg-[#030612] border-white/10 hover:border-emerald-500/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{item.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-emerald-300 font-mono font-bold">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}

              {/* Zero-Cookie Web Audio Ambient Generator */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio size={14} className="text-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Instant Offline Ambient</span>
                  </div>
                  {ambientActive && (
                    <button
                      onClick={stopAmbient}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-mono underline"
                    >
                      Stop
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">Synthesized directly in your browser. No login or third-party cookies required.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => playAmbient('alpha432')}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition text-center ${
                      ambientActive === 'alpha432'
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                        : 'bg-black/50 border-white/10 text-slate-300 hover:border-cyan-400'
                    }`}
                  >
                    432Hz Alpha
                  </button>
                  <button
                    onClick={() => playAmbient('rain')}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition text-center ${
                      ambientActive === 'rain'
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                        : 'bg-black/50 border-white/10 text-slate-300 hover:border-cyan-400'
                    }`}
                  >
                    Gentle Rain
                  </button>
                  <button
                    onClick={() => playAmbient('cosmic')}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition text-center ${
                      ambientActive === 'cosmic'
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                        : 'bg-black/50 border-white/10 text-slate-300 hover:border-cyan-400'
                    }`}
                  >
                    Cosmic Drone
                  </button>
                  <button
                    onClick={() => playAmbient('whitenoise')}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition text-center ${
                      ambientActive === 'whitenoise'
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                        : 'bg-black/50 border-white/10 text-slate-300 hover:border-cyan-400'
                    }`}
                  >
                    Focus Noise
                  </button>
                </div>
              </div>
            </div>

            {/* Embedded Spotify Player Card */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#040816]/95 border border-emerald-500/30 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/20">
                    <Music size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{activeSpotifyPlaylist.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Spotify {activeSpotifyPlaylist.type.toUpperCase()} • Embedded Study Audio
                    </p>
                  </div>
                </div>

                <a
                  href={`https://open.spotify.com/${activeSpotifyPlaylist.type}/${activeSpotifyPlaylist.embedId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:border-emerald-400 transition"
                >
                  Open in Spotify
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Responsive Iframe Embed with Verified Path */}
              <div className="my-5 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20 bg-black min-h-[352px]">
                <iframe
                  title="Spotify Study Player"
                  src={`https://open.spotify.com/embed/${activeSpotifyPlaylist.type}/${activeSpotifyPlaylist.embedId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#02050e] border border-white/5 flex items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-400 shrink-0" />
                  <span>
                    🎧 <strong>Audio Tip:</strong> If Spotify previews only 30s clips, click <em>Open in Spotify</em> or log into your Spotify account in another tab.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FOREIGN LANGUAGE DUOLINGO-STYLE SPRINT                                 */}
      {/* ========================================================================= */}
      {activeTab === 'language' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl space-y-6 animate-bubble-pop">
          {/* Subheader */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe size={18} className="text-cyan-400" />
                Foreign Language Sprint & Duolingo Mini-Quiz
              </h3>
              <p className="text-xs text-slate-400">
                Switch cognitive contexts for 3 minutes during study breaks to stimulate neuroplasticity.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1 font-mono mr-2">
                <Flame size={14} />
                {langStreak} Streak
              </span>

              {(['Spanish', 'French', 'Japanese', 'German'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    pipAudio.playClick();
                    setSelectedLanguage(lang);
                    setSprintIndex(0);
                    setRevealedTranslation(false);
                    setQuizAnswerSelected(null);
                    setIsQuizAnswerCorrect(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedLanguage === lang
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'bg-[#030612] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Flashcard Sprint Card */}
          <div className="max-w-xl mx-auto p-8 rounded-3xl bg-[#02050f] border border-sky-500/30 text-center space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">
                {selectedLanguage} Flash Sprint #{sprintIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => speakForeignWord(activeWord.word, activeWord.langCode)}
                className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black transition"
                title="Pronounce Word"
              >
                <Volume2 size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-black text-white tracking-wide">{activeWord.word}</div>
              <div className="text-xs text-slate-400 font-mono">[ {activeWord.phonetic} ]</div>
            </div>

            {/* Quick-Fire Duolingo Question */}
            <div className="p-5 rounded-2xl bg-[#040816] border border-white/10 space-y-3 text-left">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select the correct translation:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeWord.quizOptions.map((opt, optIdx) => {
                  let btnStyle = 'bg-[#02050e] border-white/10 text-slate-300 hover:border-cyan-400';
                  if (quizAnswerSelected !== null) {
                    if (optIdx === activeWord.correctQuizIndex) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold';
                    } else if (quizAnswerSelected === optIdx) {
                      btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={quizAnswerSelected !== null}
                      onClick={() => handleSelectQuizOption(optIdx)}
                      className={`p-3 rounded-xl border text-xs text-left transition ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizAnswerSelected !== null && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    isQuizAnswerCorrect ? 'bg-emerald-950/40 text-emerald-300' : 'bg-rose-950/40 text-rose-300'
                  }`}
                >
                  <p className="font-bold">{isQuizAnswerCorrect ? '✓ Correct! +25 XP' : '✗ Incorrect'}</p>
                  <p className="text-[11px] text-slate-300 italic mt-0.5">"{activeWord.example}"</p>
                </div>
              )}
            </div>

            <button
              onClick={handleNextWordSprint}
              className="px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition hover:scale-105 active:scale-95"
            >
              Next Language Sprint →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GK TRIVIA BLITZ (60-SECOND RAPID FIRE)                                 */}
      {/* ========================================================================= */}
      {activeTab === 'gk' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl space-y-6 animate-bubble-pop">
          {/* Subheader */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap size={18} className="text-cyan-400" />
                60-Second University GK Trivia Blitz
              </h3>
              <p className="text-xs text-slate-400">
                Rapid-fire general knowledge questions across Science, Tech, Philosophy, and History.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#02050e] border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Clock size={14} />
                <span>{triviaTimer}s Left</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
                Score: {triviaScore}
              </div>
            </div>
          </div>

          {!triviaActive && triviaTimer === 60 ? (
            <div className="p-10 rounded-3xl bg-[#02050f] border border-white/10 text-center space-y-4 max-w-lg mx-auto">
              <Zap size={36} className="mx-auto text-cyan-400 animate-bounce" />
              <h4 className="text-lg font-bold text-white">Ready for the 60s Trivia Sprint?</h4>
              <p className="text-xs text-slate-400">
                Answer as many academic trivia questions as you can before the clock runs out. Each correct answer awards +25 XP!
              </p>
              <button
                type="button"
                onClick={handleStartTrivia}
                className="px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition hover:scale-105 active:scale-95"
              >
                Start 60s Blitz!
              </button>
            </div>
          ) : triviaTimer === 0 ? (
            <div className="p-10 rounded-3xl bg-[#02050f] border border-emerald-500/30 text-center space-y-4 max-w-lg mx-auto">
              <Award size={36} className="mx-auto text-emerald-400" />
              <h4 className="text-xl font-black text-white">Time's Up! Final Score: {triviaScore}</h4>
              <p className="text-xs text-slate-300">
                Excellent rapid-fire recall! You earned +{triviaScore * 25} XP toward your mastery rank.
              </p>
              <button
                type="button"
                onClick={handleStartTrivia}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition"
              >
                Play Again
              </button>
            </div>
          ) : (
            /* Active trivia card */
            (() => {
              const currentQ = GK_TRIVIA_QUESTIONS[triviaIndex % GK_TRIVIA_QUESTIONS.length];

              return (
                <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[#02050f] border border-sky-500/30 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                      {currentQ.category}
                    </span>
                    <span className="text-slate-400">Question #{triviaIndex + 1}</span>
                  </div>

                  <h4 className="text-base font-bold text-white leading-relaxed">{currentQ.q}</h4>

                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-[#040816] border-white/10 text-slate-300 hover:border-cyan-400';
                      if (triviaSelectedOpt !== null) {
                        if (optIdx === currentQ.correct) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold';
                        } else if (triviaSelectedOpt === optIdx) {
                          btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={triviaSelectedOpt !== null}
                          onClick={() => handleTriviaAnswer(optIdx)}
                          className={`w-full p-3.5 rounded-xl border text-xs text-left transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {triviaSelectedOpt !== null && optIdx === currentQ.correct && (
                            <CheckCircle2 size={16} className="text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MOTIVATION SHORTS                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'motivation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-bubble-pop">
          {MOTIVATION_SHORTS.map((short) => (
            <div
              key={short.id}
              className="p-6 rounded-3xl bg-[#040816]/95 border border-sky-500/20 shadow-xl flex flex-col justify-between space-y-4 hover:border-cyan-400/50 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold font-mono">
                    {short.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{short.duration}</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{short.title}</h4>
                <span className="text-xs text-slate-400 block">{short.creator}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#02050e] border border-white/5 text-xs text-slate-300 leading-relaxed italic">
                "{short.quote}"
              </div>

              <button
                onClick={() => {
                  pipAudio.playCelebrate();
                  confetti({ particleCount: 40, spread: 50 });
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 hover:text-black border border-cyan-500/40 text-xs font-bold text-cyan-300 transition flex items-center justify-center gap-2"
              >
                <Play size={14} />
                Absorb Motivation Bite
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
