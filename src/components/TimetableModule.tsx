import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  Plus,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Trash2,
  Upload,
  FileText,
  MapPin,
  ArrowRight,
  Layers,
  RefreshCw,
  Edit2,
  Tag,
  Check,
  Zap,
} from 'lucide-react';
import { pipAudio } from '../utils/audio';

export interface EnhancedTimetableSlot {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  time: string;
  subject: string;
  topicsCovered: string[];
  durationMinutes: number;
  room?: string;
  type: 'Lecture' | 'Lab' | 'Seminar' | 'Self Study' | 'Revision' | 'Exam Prep';
  color: string;
  completed?: boolean;
}

interface TimetableModuleProps {
  onStudyTopicInEngine?: (topic: string) => void;
}

export const TimetableModule: React.FC<TimetableModuleProps> = ({ onStudyTopicInEngine }) => {
  const [slots, setSlots] = useState<EnhancedTimetableSlot[]>([
    {
      id: 's1',
      day: 'Mon',
      time: '09:00 AM',
      subject: 'Operating Systems Architecture',
      topicsCovered: [
        'Virtual Memory & Multi-Level Page Tables (PML4 to PT)',
        'Translation Lookaside Buffer (TLB) Miss Latencies',
        'Least-Recently-Used (LRU) vs Clock Page Replacement',
      ],
      durationMinutes: 90,
      room: 'Lecture Hall 301',
      type: 'Lecture',
      color: 'border-cyan-500 bg-cyan-950/40 text-cyan-200',
      completed: true,
    },
    {
      id: 's2',
      day: 'Mon',
      time: '02:00 PM',
      subject: 'Distributed Systems & Cloud Consensus',
      topicsCovered: [
        'Raft Leader Election: Randomized Heartbeat Timeouts',
        'Log Replication Invariants & Quorum Majorities (N/2 + 1)',
        'Split-Brain Partition Resilience & Network Heuristics',
      ],
      durationMinutes: 90,
      room: 'Computer Systems Lab 4',
      type: 'Lab',
      color: 'border-sky-500 bg-sky-950/40 text-sky-200',
      completed: false,
    },
    {
      id: 's3',
      day: 'Tue',
      time: '10:30 AM',
      subject: 'Multivariable Calculus & Optimization',
      topicsCovered: [
        'Hessian Curvature Matrices & Second-Order Optimality',
        'Gradient Descent Step Size under Lipschitz Smoothness',
        'Karush-Kuhn-Tucker (KKT) Necessary Conditions for Duality',
      ],
      durationMinutes: 90,
      room: 'Euler Hall 104',
      type: 'Lecture',
      color: 'border-indigo-500 bg-indigo-950/40 text-indigo-200',
      completed: false,
    },
    {
      id: 's4',
      day: 'Wed',
      time: '11:00 AM',
      subject: 'Molecular Biochemistry & Bioenergetics',
      topicsCovered: [
        'Glycolytic Allosteric Valves: PFK-1 Inhibition & AMP Activation',
        'Chemiosmotic Proton-Motive Force Across Mitochondrial Cristae',
        'ATP Synthase F0/F1 Rotary Catalysis & Theoretical Energy Yields',
      ],
      durationMinutes: 90,
      room: 'Biomedical Science Center 202',
      type: 'Lecture',
      color: 'border-emerald-500 bg-emerald-950/40 text-emerald-200',
      completed: false,
    },
    {
      id: 's5',
      day: 'Thu',
      time: '01:30 PM',
      subject: 'Operating Systems Practical Lab',
      topicsCovered: [
        'Implementing Compare-And-Swap (CAS) Spinlocks in C',
        'Banker Algorithm Safe State Matrix Verification',
      ],
      durationMinutes: 120,
      room: 'Unix Systems Lab 10',
      type: 'Lab',
      color: 'border-cyan-500 bg-cyan-950/40 text-cyan-200',
      completed: false,
    },
    {
      id: 's6',
      day: 'Fri',
      time: '03:00 PM',
      subject: 'Weekly PYQ Exam Simulator Drill',
      topicsCovered: [
        'Past Year Questions on Concurrency Deadlocks & Amortized Analysis',
        'Speed Drills & Diagnostic Error Remediation',
      ],
      durationMinutes: 60,
      room: 'Cosmos AI Focus Studio',
      type: 'Exam Prep',
      color: 'border-amber-500 bg-amber-950/40 text-amber-200',
      completed: false,
    },
  ]);

  const [selectedDay, setSelectedDay] = useState<'All' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Timetable state
  const [uploadText, setUploadText] = useState('');
  const [academicProgram, setAcademicProgram] = useState('Computer Science & Engineering');
  const [isParsingTimetable, setIsParsingTimetable] = useState(false);
  const [uploadedTimetableFile, setUploadedTimetableFile] = useState<string | null>(null);

  // New slot form state
  const [newDay, setNewDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Mon');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newSubject, setNewSubject] = useState('');
  const [newRoom, setNewRoom] = useState('Hall 201');
  const [newTopicsInput, setNewTopicsInput] = useState('');
  const [newType, setNewType] = useState<EnhancedTimetableSlot['type']>('Lecture');
  const [newDuration, setNewDuration] = useState(90);

  const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[] = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];

  const filteredSlots = selectedDay === 'All' ? slots : slots.filter((s) => s.day === selectedDay);

  const handleToggleComplete = (id: string) => {
    pipAudio.playClick();
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteSlot = (id: string) => {
    pipAudio.playClick();
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const colors: Record<string, string> = {
      Lecture: 'border-cyan-500 bg-cyan-950/40 text-cyan-200',
      Lab: 'border-sky-500 bg-sky-950/40 text-sky-200',
      Seminar: 'border-indigo-500 bg-indigo-950/40 text-indigo-200',
      'Self Study': 'border-purple-500 bg-purple-950/40 text-purple-200',
      Revision: 'border-emerald-500 bg-emerald-950/40 text-emerald-200',
      'Exam Prep': 'border-amber-500 bg-amber-950/40 text-amber-200',
    };

    const parsedTopics = newTopicsInput
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newSlotItem: EnhancedTimetableSlot = {
      id: `slot-${Date.now()}`,
      day: newDay,
      time: newTime,
      subject: newSubject,
      topicsCovered: parsedTopics.length > 0 ? parsedTopics : ['Core lecture concepts & derivations'],
      durationMinutes: newDuration,
      room: newRoom,
      type: newType,
      color: colors[newType] || 'border-cyan-500 bg-cyan-950/40 text-cyan-200',
      completed: false,
    };

    setSlots((prev) => [...prev, newSlotItem]);
    setNewSubject('');
    setNewTopicsInput('');
    setShowAddForm(false);
    pipAudio.playCelebrate();
  };

  // Upload Timetable Handler (AI Powered + Presets)
  const handleUploadTimetable = async () => {
    setIsParsingTimetable(true);
    pipAudio.playThinking();

    try {
      const res = await fetch('/api/gemini/parse-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timetableText: uploadText || 'Sample semester timetable with course names and lecture units.',
          academicProgram,
        }),
      });

      const data = await res.json();
      if (data.slots && data.slots.length > 0) {
        setSlots(data.slots);
        pipAudio.playCelebrate();
        confetti({ particleCount: 70, spread: 70 });
        setShowUploadModal(false);
        setUploadText('');
      }
    } catch (e) {
      console.error('Failed to parse timetable:', e);
    } finally {
      setIsParsingTimetable(false);
    }
  };

  const handleLoadSampleTimetable = (presetName: string) => {
    pipAudio.playClick();
    if (presetName === 'cs') {
      setAcademicProgram('Computer Science & Engineering');
      setUploadText(`Monday: 09:00 AM - Operating Systems Architecture (Topics: Virtual Memory, TLB Misses, Page Replacement)
Monday: 02:00 PM - Distributed Systems Lab (Topics: Raft Leader Elections, Quorum Majorities, Byzantine Tolerance)
Tuesday: 10:30 AM - Multivariable Calculus (Topics: Hessian Matrices, Gradient Descent, KKT Duality)
Wednesday: 11:00 AM - Molecular Biochemistry (Topics: PFK-1 Regulation, Proton-Motive Force, ATP Synthase)
Thursday: 01:30 PM - Systems Programming Lab (Topics: Mutex Locks, CAS in C, Banker Algorithm)
Friday: 03:00 PM - PYQ Exam Sprint (Topics: Recurrence Relations, Deadlocks, Algorithmic Proofs)`);
    } else if (presetName === 'med') {
      setAcademicProgram('Pre-Med & Biomedical Sciences');
      setUploadText(`Monday: 08:30 AM - Human Physiology & Neurobiology (Topics: Action Potentials, Voltage-Gated Na+ Channels, Synaptic Vesicle Release)
Tuesday: 11:00 AM - Organic Chemistry Mechanisms (Topics: SN1 vs SN2 Nucleophilic Substitution, Enolate Chemistry)
Wednesday: 01:00 PM - Cell Biology Lab (Topics: CRISPR Cas-9 Gene Knockouts, Western Blot Protocols)
Thursday: 10:00 AM - Medical Genetics (Topics: Mendelian Invariants, Pedigree Mapping, Epigenetics)
Friday: 02:00 PM - MCAT Diagnostic Drill (Topics: High-Yield Biochemical Pathways & Enzyme Kinetics)`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#040816]/95 border border-sky-500/30 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Calendar size={16} />
            </span>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
              University Curriculum Synchronizer
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Class Timetable & Topics Covered
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Upload your school timetable and track the exact topics covered in each class. Click any topic to study it immediately inside the 3-Step Course Engine.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Upload Timetable Button */}
          <button
            type="button"
            onClick={() => {
              pipAudio.playClick();
              setShowUploadModal(true);
            }}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Upload size={14} />
            <span>Upload Timetable</span>
          </button>

          {/* Add Slot Button */}
          <button
            type="button"
            onClick={() => {
              pipAudio.playClick();
              setShowAddForm(!showAddForm);
            }}
            className="px-4 py-2.5 rounded-2xl bg-[#060c1d] border border-sky-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            <span>{showAddForm ? 'Cancel' : 'Add Class Slot'}</span>
          </button>
        </div>
      </div>

      {/* UPLOAD TIMETABLE MODAL */}
      {showUploadModal && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#030714] border border-cyan-400/40 shadow-2xl space-y-5 animate-bubble-pop">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
                AI Timetable Parser
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload size={18} className="text-cyan-400" />
                Upload School / University Timetable
              </h3>
            </div>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-slate-400 hover:text-white text-xs font-bold font-mono"
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Academic Degree / Program
              </label>
              <input
                type="text"
                value={academicProgram}
                onChange={(e) => setAcademicProgram(e.target.value)}
                placeholder="e.g. Computer Science, Mechanical Engineering, Pre-Med..."
                className="w-full bg-[#02050e] border border-sky-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            {/* File Upload Dropzone */}
            <div className="p-6 rounded-2xl bg-[#02050e] border-2 border-dashed border-cyan-500/40 text-center space-y-3">
              <Upload size={24} className="mx-auto text-cyan-400" />
              <p className="text-xs text-slate-300 font-medium">
                Upload Timetable Photo / PDF / Document (.png, .jpg, .pdf, .csv)
              </p>
              <input
                type="file"
                id="timetable-file"
                accept=".png,.jpg,.jpeg,.pdf,.csv,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedTimetableFile(file.name);
                    handleLoadSampleTimetable('cs');
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="timetable-file"
                className="inline-block px-5 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs cursor-pointer transition"
              >
                Select Timetable File
              </label>
              {uploadedTimetableFile && (
                <p className="text-[11px] text-emerald-400 font-mono">
                  ✓ File loaded: {uploadedTimetableFile}
                </p>
              )}
            </div>

            {/* Quick Sample Presets */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Or load a template:</span>
              <button
                type="button"
                onClick={() => handleLoadSampleTimetable('cs')}
                className="px-3 py-1 rounded-lg bg-[#040816] border border-white/10 hover:border-cyan-400 text-cyan-300 font-mono text-[11px]"
              >
                STEM & Engineering Timetable
              </button>
              <button
                type="button"
                onClick={() => handleLoadSampleTimetable('med')}
                className="px-3 py-1 rounded-lg bg-[#040816] border border-white/10 hover:border-cyan-400 text-cyan-300 font-mono text-[11px]"
              >
                Pre-Med & Biology Timetable
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Timetable Text / Syllabus Schedule
              </label>
              <textarea
                rows={5}
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                placeholder="Paste class schedule days, times, and topics covered..."
                className="w-full bg-[#02050e] border border-sky-500/30 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-[#040816] border border-white/10 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUploadTimetable}
                disabled={isParsingTimetable}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {isParsingTimetable ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>{isParsingTimetable ? 'Parsing Schedule & Topics...' : 'Save & Ingest Timetable'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CLASS SLOT FORM */}
      {showAddForm && (
        <form
          onSubmit={handleAddSlot}
          className="p-6 md:p-8 rounded-3xl bg-[#030714] border border-cyan-400/40 shadow-2xl space-y-4 animate-bubble-pop"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus size={16} className="text-cyan-400" />
              Add Class Lecture & Covered Topics
            </h3>
            <span className="text-xs text-slate-400 font-mono">Custom Class Slot</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Day of Week
              </label>
              <select
                value={newDay}
                onChange={(e) => setNewDay(e.target.value as any)}
                className="w-full bg-[#02050e] border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Class Time
              </label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g. 09:00 AM"
                className="w-full bg-[#02050e] border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                min={15}
                max={240}
                className="w-full bg-[#02050e] border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject / Course Name
              </label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Advanced Operating Systems: Virtual Memory"
                className="w-full bg-[#02050e] border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Room / Venue
              </label>
              <input
                type="text"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                placeholder="e.g. Turing Hall 301 / Online"
                className="w-full bg-[#02050e] border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Topics Covered in this Class (Key user requirement!) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Topics Covered in this Class (One per line):
            </label>
            <textarea
              rows={3}
              value={newTopicsInput}
              onChange={(e) => setNewTopicsInput(e.target.value)}
              placeholder="Topic 1: Multi-level page tables&#10;Topic 2: TLB miss penalty&#10;Topic 3: Clock page eviction algorithm"
              className="w-full bg-[#02050e] border border-sky-500/30 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-[#040816] border border-white/10 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition"
            >
              Add Class to Schedule
            </button>
          </div>
        </form>
      )}

      {/* Day Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {(['All', ...days] as const).map((d) => (
          <button
            key={d}
            onClick={() => {
              pipAudio.playClick();
              setSelectedDay(d);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              selectedDay === d
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-[#030612] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Slots List */}
      <div className="space-y-4">
        {filteredSlots.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#040816] border border-white/5 text-center text-slate-400 space-y-2">
            <Calendar size={32} className="mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-white">No classes scheduled for {selectedDay}</p>
            <p className="text-xs">Click "Add Class Slot" or "Upload Timetable" above to load your schedule.</p>
          </div>
        ) : (
          filteredSlots.map((slot) => (
            <div
              key={slot.id}
              className={`p-6 rounded-3xl border transition shadow-xl space-y-4 ${
                slot.completed
                  ? 'bg-[#02040b]/90 border-white/5 opacity-75'
                  : 'bg-[#040816]/95 border-sky-500/30 hover:border-cyan-400/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {slot.day}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white leading-snug">{slot.subject}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-cyan-300 font-mono">
                        {slot.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-cyan-400" />
                        {slot.time} ({slot.durationMinutes}m)
                      </span>
                      {slot.room && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-500" />
                          {slot.room}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(slot.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      slot.completed
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#02050e] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Check size={13} />
                    <span>{slot.completed ? 'Attended' : 'Mark Attended'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="p-2 rounded-xl bg-[#02050e] border border-white/10 text-slate-500 hover:text-rose-400 transition"
                    title="Delete Class"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* TOPICS COVERED IN THIS CLASS (User requirement: display topics covered in that class) */}
              <div className="p-4 rounded-2xl bg-[#02050e] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Tag size={12} />
                    Topics Covered in this Class:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {slot.topicsCovered.length} Topics Recorded
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {slot.topicsCovered.map((topic, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#040816] border border-white/5 flex items-center justify-between text-xs text-slate-200 group hover:border-cyan-400/40 transition"
                    >
                      <span className="leading-snug">{topic}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onStudyTopicInEngine) {
                            pipAudio.playCelebrate();
                            onStudyTopicInEngine(topic);
                          }
                        }}
                        className="opacity-80 group-hover:opacity-100 text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold font-mono transition shrink-0 ml-2"
                        title="Study in 3-Step Course Engine"
                      >
                        Study →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
