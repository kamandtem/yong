import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  BookMarked, 
  HelpCircle, 
  PenLine, 
  Flame, 
  Sparkles,
  Share2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, UserProfile, JournalEntry } from '../types';
import { ALL_LESSONS } from '../data/coursesData';
import { db } from '../db/indexedDB';
import { toPersianDigits } from '../utils/persianDate';

interface LessonViewPageProps {
  lessonId: string;
  profile: UserProfile;
  onBack: () => void;
  onNavigateToExercise: (exerciseId: string) => void;
  onLessonCompleted: (updatedProfile: UserProfile) => void;
}

export const LessonViewPage: React.FC<LessonViewPageProps> = ({
  lessonId,
  profile,
  onBack,
  onNavigateToExercise,
  onLessonCompleted
}) => {
  const lesson = ALL_LESSONS.find(l => l.id === lessonId) || ALL_LESSONS[0];
  const isCompleted = profile.completedLessons.includes(lesson.id);

  const [personalNote, setPersonalNote] = useState('');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Check if there is an existing note for this lesson
  useEffect(() => {
    db.getJournalEntries().then((entries) => {
      const match = entries.find(e => e.linkedLessonId === lesson.id);
      if (match) {
        setPersonalNote(match.content);
      }
    });
  }, [lesson.id]);

  const handleSaveNote = async () => {
    if (!personalNote.trim()) return;
    const entry: JournalEntry = {
      id: `note-lesson-${lesson.id}`,
      title: `یادداشت درس: ${lesson.title}`,
      content: personalNote,
      createdAt: new Date().toISOString(),
      tags: ['درس', lesson.chapterTitle],
      mood: 'reflective',
      linkedLessonId: lesson.id
    };
    await db.saveJournalEntry(entry);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 3000);
  };

  const handleCompleteLesson = async () => {
    setIsFinishing(true);
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const updatedProfile = await db.markLessonCompleted(lesson.id);
    onLessonCompleted(updatedProfile);
    setIsFinishing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست درس‌ها</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-400 bg-white/80 px-3 py-1.5 rounded-full border border-slate-100">
            <Clock className="w-3.5 h-3.5" />
            <span>زمان تخمینی: {toPersianDigits(lesson.estimatedMinutes)} دقیقه</span>
          </div>
          {isCompleted && (
            <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              تکمیل‌شده
            </span>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-white">
        <span className="text-xs font-bold text-brand-purple px-2.5 py-1 rounded-md bg-brand-purple-light">
          {lesson.chapterTitle}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-3 tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">
          {lesson.subtitle}
        </p>
      </div>

      {/* Lesson Content Sections */}
      <div className="space-y-6">
        {lesson.sections.map((sec, idx) => (
          <div 
            key={idx}
            className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-white space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-teal"></span>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">{sec.title}</h3>
            </div>

            {sec.type === 'diagram' ? (
              <div className="bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm p-5 rounded-2xl leading-relaxed whitespace-pre-wrap dir-ltr overflow-x-auto shadow-inner">
                {sec.content}
              </div>
            ) : (
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line text-justify">
                {sec.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reflection Questions Box */}
      {lesson.reflectionQuestions && lesson.reflectionQuestions.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-brand-purple/20 bg-gradient-to-br from-white/90 to-brand-purple-light/30 space-y-4">
          <div className="flex items-center gap-2 text-brand-purple font-bold text-base">
            <HelpCircle className="w-5 h-5" />
            <span>پرسش‌های تأملی برای خودکاوی</span>
          </div>
          <p className="text-xs text-slate-500">
            دقایقی چشم‌هایتان را ببندید و اجازه دهید این پرسش‌ها در ذهنتان طنین‌انداز شوند:
          </p>
          <div className="space-y-3">
            {lesson.reflectionQuestions.map((q, i) => (
              <div key={q.id} className="p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm">
                <div className="text-sm font-semibold text-slate-800">
                  {toPersianDigits(i + 1)}. {q.question}
                </div>
                {q.hint && (
                  <p className="text-xs text-brand-teal-dark mt-1 bg-brand-teal-light/50 p-2 rounded-lg">
                    💡 راهنما: {q.hint}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Lesson Note Taking Area */}
      <div className="glass-card rounded-3xl p-6 shadow-soft border border-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <PenLine className="w-4 h-4 text-brand-teal" />
            <span>یادداشت شخصی و دریافت من از این درس</span>
          </div>
          {noteSavedFeedback && (
            <span className="text-xs text-emerald-600 font-medium animate-pulse">
              ✓ در دفترچه خصوصی شما ذخیره شد
            </span>
          )}
        </div>
        <textarea
          value={personalNote}
          onChange={(e) => setPersonalNote(e.target.value)}
          placeholder="مهم‌ترین بینش، احساس یا تصمیمی که از مطالعه این درس به دست آوردید را اینجا بنویسید..."
          rows={3}
          className="w-full p-4 rounded-2xl bg-white/80 border border-slate-200/80 focus:ring-2 focus:ring-brand-purple focus:outline-none text-sm text-slate-700 leading-relaxed placeholder:text-slate-400"
        />
        <button
          onClick={handleSaveNote}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          ذخیره در دفترچه خودشناسی
        </button>
      </div>

      {/* Linked Exercise Invitation Banner */}
      {lesson.linkedExerciseId && (
        <div className="glass-card rounded-3xl p-6 shadow-soft border border-amber-200 bg-amber-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-600">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">تمرین عملی متصل به این درس آماده است</h4>
              <p className="text-xs text-amber-700 mt-0.5">دانش نظری تا زمانی که به تمرین تبدیل نشود دگرگونی ایجاد نمی‌کند.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToExercise(lesson.linkedExerciseId!)}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all"
          >
            انجام تمرین عملی
          </button>
        </div>
      )}

      {/* Key Takeaways & References */}
      <div className="glass-card rounded-3xl p-6 shadow-soft border border-white space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-2">نکات کلیدی این جلسه</h4>
          <ul className="space-y-1.5">
            {lesson.keyTakeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <span className="text-brand-purple font-bold">•</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <h5 className="text-xs font-semibold text-slate-400 mb-1">منابع و مراجع علمی معتبر:</h5>
          <div className="flex flex-wrap gap-2">
            {lesson.references.map((ref, idx) => (
              <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                📚 {ref}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Button */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:underline"
        >
          ← انصراف و بازگشت
        </button>

        <button
          onClick={handleCompleteLesson}
          disabled={isFinishing}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold shadow-soft flex items-center justify-center gap-2 transition-all ${
            isCompleted 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-gradient-to-r from-brand-purple to-brand-teal text-white hover:opacity-95 hover:scale-105'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isCompleted ? 'تکمیل مجدد و ثبت در پرونده' : 'تکمیل این درس (+۵۰ امتیاز بینش)'}</span>
        </button>
      </div>
    </div>
  );
};
