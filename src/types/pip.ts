export type PipState =
  | 'idle'
  | 'walking'
  | 'welcome'
  | 'thinking'
  | 'explaining'
  | 'studying'
  | 'encouraging'
  | 'celebrating'
  | 'sleeping';

export type BackgroundTheme = 'galaxy' | 'cybergrid' | 'quantum_void' | 'solar_flare' | 'stealth';
export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';

export type CompanionType = 'astronaut' | 'cat' | 'dog' | 'owl' | 'fox';
export type AnimalType = CompanionType;

export type AnimalPersonality =
  | 'Smart & Playful'
  | 'Calm & Intelligent'
  | 'Funny & Energetic'
  | 'Curious Explorer'
  | 'Motivational Coach'
  | 'Mysterious & Futuristic';

export interface UserProfile {
  name: string;
  callsign: string;
  companionType: CompanionType;
  companionName: string;
  companionPersonality: AnimalPersonality;
  level: number;
  xp: number;
  currentSuitSkin: 'Stellar White' | 'Nebula Cyan' | 'Obsidian Void' | 'Solar Amber';
  unlockedUpgrades: string[];
}

export interface PipSettings {
  roamingEnabled: boolean;
  roamingFrequencySeconds: number;
  roamingSpeed: 'slow' | 'normal' | 'fast';
  characterScale: number;
  speechPosition: 'top' | 'bottom' | 'left' | 'right';
  soundEffects: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  startWithWindows: boolean;
  rememberPosition: boolean;
  highContrast: boolean;
  dyslexicFont: boolean;
  ttsEnabled: boolean;
  autoVoiceOnOpen: boolean;
  backgroundTheme: BackgroundTheme;
  colorBlindMode: ColorBlindMode;
  readingRuler: boolean;
  liveCaptions: boolean;
  fontSizeMultiplier: number;
  companionAnimal?: CompanionType;
  companionPersonality?: AnimalPersonality;
  companionName?: string;
}

export interface StudentProgress {
  streakDays: number;
  lastActiveDate: string;
  totalXp: number;
  level: number;
  todayMinutes: number;
  dailyGoalMinutes: number;
  totalQuizzesTaken: number;
  averageScore: number;
  weakTopics: string[];
  masteredTopics: string[];
}

export interface Flashcard {
  id: string;
  category: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  repetitions: number;
  nextReview: string;
  lastIntervalDays: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedTopic?: string;
}

export interface RemedialTopic {
  topic: string;
  whyStudentsStruggle: string;
  quickMnemonic: string;
  recommendedTodo: string;
}

export interface StudyMilestone {
  step: number;
  topic: string;
  focus: string;
  durationDays: number;
  recommendedAction: string;
  quizCheck: string;
}

export interface StudyPlan {
  title: string;
  summary: string;
  estimatedDays: number;
  milestones: StudyMilestone[];
  pipAdvice: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  time: string;
  subject: string;
  durationMinutes: number;
  color: string;
  type: 'Lecture' | 'Self Study' | 'Revision' | 'Exam Prep';
}
