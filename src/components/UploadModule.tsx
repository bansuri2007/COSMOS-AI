import React, { useState } from 'react';
import {
  Upload,
  Youtube,
  FileText,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { PipCharacter } from './PipCharacter';
import { pipAudio } from '../utils/audio';

interface UploadModuleProps {
  onAddFlashcard: (card: { front: string; back: string; category: string }) => void;
}

export const UploadModule: React.FC<UploadModuleProps> = ({ onAddFlashcard }) => {
  const [sourceType, setSourceType] = useState<'youtube' | 'text'>('youtube');
  const [ytUrl, setYtUrl] = useState('https://www.youtube.com/watch?v=kPRA0W1kECg');
  const [textInput, setTextInput] = useState('');
  const [title, setTitle] = useState('Neural Networks Demystified — Backpropagation & Gradient Descent');
  const [isLoading, setIsLoading] = useState(false);

  // Result state
  const [result, setResult] = useState<any>({
    title: 'Neural Networks Demystified — Backpropagation & Gradient Descent',
    keyTakeaways: [
      'Gradients compute the partial derivative of the loss function with respect to every weight vector.',
      'The chain rule decomposes complex nested layer activations into straightforward scalar multiplications.',
      'Learning rate schedules prevent jumping out of local minima during stochastic gradient descent.',
    ],
    summary:
      'This lecture breaks down how artificial neural networks learn by propagating error backwards through each layer. By utilizing matrix calculus and the chain rule, weights and biases are iteratively updated via gradient descent to minimize cross-entropy loss.',
    flashcards: [
      {
        front: 'What is the role of the Chain Rule in Backpropagation?',
        back: 'The chain rule computes the partial derivative ∂Loss/∂w by multiplying the local gradient at a node with the incoming gradient from the layer ahead.',
      },
      {
        front: 'Why is Stochastic Gradient Descent (SGD) preferred over Batch GD on huge datasets?',
        back: 'SGD calculates updates using mini-batches rather than the whole dataset, reducing memory footprint and escaping shallow local saddles.',
      },
    ],
    recommendedQuiz: [
      {
        question: 'If the learning rate is set excessively high during backpropagation training, what will happen?',
        options: ['The network will overfit immediately', 'The loss will diverge or oscillate wildly', 'Gradients will become exactly zero', 'Epoch time increases linearly'],
        correctIndex: 1,
        explanation: 'An overly large step size causes gradient descent to overshoot the global minimum, causing loss values to oscillate or explode toward infinity.',
      },
    ],
  });

  const handleProcess = async () => {
    setIsLoading(true);
    pipAudio.playThinking();

    try {
      const content = sourceType === 'youtube'
        ? `Educational YouTube Lecture: ${ytUrl}. Topic: ${title}`
        : textInput;

      const res = await fetch('/api/gemini/summarize-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          source: sourceType,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        pipAudio.playCelebrate();
      }
    } catch (err) {
      console.error('Failed to summarize module:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <Youtube size={16} />
            </span>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Smart Content Ingestion
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Upload Module & Paste YouTube Link</h2>
          <p className="text-xs text-slate-400">
            Paste any educational YouTube lecture or study notes. Pip synthesizes core concepts, generates flashcards, and builds practice quizzes.
          </p>
        </div>

        <PipCharacter state={isLoading ? 'thinking' : 'studying'} scale={0.7} interactive={false} />
      </div>

      {/* Input Form */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        {/* Toggle between YT and Text */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              pipAudio.playClick();
              setSourceType('youtube');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              sourceType === 'youtube'
                ? 'bg-red-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Youtube size={14} />
            Paste YouTube Video Link
          </button>

          <button
            onClick={() => {
              pipAudio.playClick();
              setSourceType('text');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              sourceType === 'text'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={14} />
            Upload Study Notes / PDF Text
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Module Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {sourceType === 'youtube' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                YouTube Educational Video URL
              </label>
              <input
                type="text"
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Paste Lecture Text or Notes
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="Paste chapter notes, lecture transcript, or study summary..."
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleProcess}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isLoading ? 'Pip is Ingesting Content...' : 'Extract Study Aids & Flashcards'}
          </button>
        </div>
      </div>

      {/* Extracted Output */}
      {result && (
        <div className="space-y-6">
          {/* Summary & Takeaways */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-purple-400" />
              Executive Summary & Core Insights
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{result.summary}</p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Key Takeaways:
              </span>
              {result.keyTakeaways?.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Flashcards */}
          {result.flashcards && result.flashcards.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers size={16} className="text-pink-400" />
                  AI-Generated Flashcards
                </h3>
                <span className="text-xs text-slate-400">{result.flashcards.length} cards extracted</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.flashcards.map((c: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-pink-400 uppercase">Question</span>
                      <p className="text-xs font-bold text-white mt-0.5">{c.front}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-purple-400 uppercase">Answer</span>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{c.back}</p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          onAddFlashcard({ front: c.front, back: c.back, category: title });
                          pipAudio.playCelebrate();
                        }}
                        className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-[11px] font-bold text-white transition flex items-center gap-1"
                      >
                        Add to Flashcard Deck
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
