import React, { useState } from 'react';
import {
  BookOpen,
  RotateCw,
  Plus,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Layers,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react';
import { Flashcard } from '../types/pip';
import { PipCharacter } from './PipCharacter';
import { pipAudio } from '../utils/audio';

interface FlashcardsModuleProps {
  onCardReviewed: (difficulty: string) => void;
}

const DEFAULT_CARDS: Flashcard[] = [
  {
    id: 'c1',
    category: 'Data Structures & Algorithms',
    front: 'What makes AVL Tree lookups strictly O(log N)?',
    back: 'AVL trees enforce a strict balance factor where the difference between left and right subtree heights never exceeds 1. This guarantees the maximum tree height is strictly bounded by ~1.44 log2(N).',
    difficulty: 'medium',
    repetitions: 4,
    nextReview: 'Today',
    lastIntervalDays: 3,
  },
  {
    id: 'c2',
    category: 'Calculus & Optimization',
    front: 'What is the formula and intuition for Integration by Parts?',
    back: '∫ u dv = u·v - ∫ v du. Derived from the product rule of differentiation: (uv)\' = u\'v + uv\'. Useful when integrating products of polynomial, logarithmic, and trigonometric functions (LIATE rule).',
    difficulty: 'hard',
    repetitions: 2,
    nextReview: 'Today',
    lastIntervalDays: 1,
  },
  {
    id: 'c3',
    category: 'AI & Neural Networks',
    front: 'Why do Residual Networks (ResNets) prevent the vanishing gradient problem?',
    back: 'ResNets introduce skip/identity connections (F(x) + x). During backpropagation, gradients can flow directly through the skip pathway without attenuation, allowing networks with 100+ layers to converge efficiently.',
    difficulty: 'easy',
    repetitions: 7,
    nextReview: 'In 5 days',
    lastIntervalDays: 7,
  },
  {
    id: 'c4',
    category: 'Data Structures & Algorithms',
    front: 'What is the difference between Memoization and Tabulation in Dynamic Programming?',
    back: 'Memoization is Top-Down: solves subproblems recursively and caches results on demand. Tabulation is Bottom-Up: fills an iterative DP table starting from base cases, avoiding call stack overhead.',
    difficulty: 'medium',
    repetitions: 5,
    nextReview: 'In 2 days',
    lastIntervalDays: 4,
  },
];

export const FlashcardsModule: React.FC<FlashcardsModuleProps> = ({ onCardReviewed }) => {
  const [cards, setCards] = useState<Flashcard[]>(DEFAULT_CARDS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New card form
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Science');

  const filteredCards = selectedCategory === 'All'
    ? cards
    : cards.filter((c) => c.category === selectedCategory);

  const activeCard = filteredCards[currentIdx] || filteredCards[0];
  const categories = ['All', ...Array.from(new Set(cards.map((c) => c.category)))];

  const handleFlip = () => {
    pipAudio.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    pipAudio.playClick();
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    pipAudio.playClick();
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (rating === 'easy') {
      pipAudio.playCelebrate();
    } else {
      pipAudio.playGreeting();
    }

    onCardReviewed(rating);
    handleNext();
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const created: Flashcard = {
      id: `c_${Date.now()}`,
      category: newCategory,
      front: newFront,
      back: newBack,
      difficulty: 'medium',
      repetitions: 1,
      nextReview: 'Today',
      lastIntervalDays: 1,
    };

    setCards((prev) => [created, ...prev]);
    setNewFront('');
    setNewBack('');
    setShowAddModal(false);
    pipAudio.playCelebrate();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300">
              <BookOpen size={16} />
            </span>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              Spaced Repetition System (SRS)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Active Recall Flashcards</h2>
          <p className="text-xs text-slate-400">
            Pip spaces reviews right before memory decay occurs for maximum 30-day retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-xs font-bold text-white transition hover:scale-105 active:scale-95"
          >
            <Plus size={14} />
            Add Flashcard
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              pipAudio.playClick();
              setSelectedCategory(cat);
              setCurrentIdx(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3D Interactive Flashcard Center */}
      {filteredCards.length > 0 ? (
        <div className="flex flex-col items-center space-y-6">
          {/* Card Meta Indicator */}
          <div className="flex items-center justify-between w-full max-w-xl text-xs text-slate-400">
            <span>
              Card {currentIdx + 1} of {filteredCards.length}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 font-semibold">
              {activeCard.category}
            </span>
            <span>Repetitions: {activeCard.repetitions}</span>
          </div>

          {/* Flashcard Box with Flip */}
          <div
            onClick={handleFlip}
            className="w-full max-w-xl min-h-[300px] cursor-pointer perspective-1000 group select-none"
          >
            <div
              className={`relative w-full h-full min-h-[300px] rounded-3xl p-8 transition-transform duration-500 transform-style-3d border shadow-2xl flex flex-col justify-between ${
                isFlipped
                  ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border-indigo-500/40'
                  : 'bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border-purple-500/30'
              }`}
            >
              {/* Card Header tag */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  {isFlipped ? '💡 Solution & Breakdown' : '❓ Question / Concept'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-purple-300 transition">
                  <RotateCw size={13} />
                  Click to Flip
                </span>
              </div>

              {/* Card Center Content */}
              <div className="my-auto py-6 text-center">
                <p className="text-base md:text-lg font-medium text-white leading-relaxed">
                  {isFlipped ? activeCard.back : activeCard.front}
                </p>
              </div>

              {/* Card Footer Hint */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
                <span>{isFlipped ? 'Did you recall this correctly?' : 'Test your recall before flipping'}</span>
                <span className="capitalize text-purple-300 font-medium">Difficulty: {activeCard.difficulty}</span>
              </div>
            </div>
          </div>

          {/* SRS Evaluation Rating Bar */}
          {isFlipped ? (
            <div className="w-full max-w-xl grid grid-cols-4 gap-2">
              <button
                onClick={() => handleRate('again')}
                className="p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-200 text-xs font-bold flex flex-col items-center gap-1 transition active:scale-95"
              >
                <span>Again</span>
                <span className="text-[10px] text-rose-400">&lt; 10 min</span>
              </button>

              <button
                onClick={() => handleRate('hard')}
                className="p-3 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-200 text-xs font-bold flex flex-col items-center gap-1 transition active:scale-95"
              >
                <span>Hard</span>
                <span className="text-[10px] text-amber-400">1 day</span>
              </button>

              <button
                onClick={() => handleRate('good')}
                className="p-3 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-200 text-xs font-bold flex flex-col items-center gap-1 transition active:scale-95"
              >
                <span>Good</span>
                <span className="text-[10px] text-blue-400">3 days</span>
              </button>

              <button
                onClick={() => handleRate('easy')}
                className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs font-bold flex flex-col items-center gap-1 transition active:scale-95"
              >
                <span>Easy</span>
                <span className="text-[10px] text-emerald-400">7 days</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleFlip}
                className="px-6 py-3 rounded-2xl bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-white font-bold text-xs shadow-md transition"
              >
                Reveal Answer
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">No cards in this deck yet!</div>
      )}

      {/* Add Flashcard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel-glow rounded-3xl p-6 border border-purple-500/30 text-white space-y-4 animate-bubble-pop">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus size={18} className="text-purple-400" />
              Create New Active Recall Flashcard
            </h3>

            <form onSubmit={handleAddCard} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Front (Question / Prompt)
                </label>
                <textarea
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g. State the halting problem and why it is undecidable"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Back (Solution / Explanation)
                </label>
                <textarea
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g. Proven by Alan Turing using diagonalization..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
