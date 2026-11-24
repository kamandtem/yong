import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Save
} from 'lucide-react';
import { ALL_EXERCISES } from '../data/exercisesData';
import { UserProfile, Exercise, ExerciseSubmission } from '../types';
import { db } from '../db/indexedDB';
import { toPersianDigits, formatToPersianDate } from '../utils/persianDate';

interface ExercisesPageProps {
  profile: UserProfile;
  initialExerciseId?: string;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
}

export const ExercisesPage: React.FC<ExercisesPageProps> = ({
  profile,
  initialExerciseId,
  onProfileUpdated
}) => {
  const [activeExercise, setActiveExercise] = useState<Exercise>(
    ALL_EXERCISES.find(e => e.id === initialExerciseId) || ALL_EXERCISES[0]
  );
  const [submissions, setSubmissions] = useState<Record<string, ExerciseSubmission>>({});
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    db.getExerciseSubmissions().then((subs) => {
      setSubmissions(subs);
      if (subs[activeExercise.id]) {
        setFormAnswers(subs[activeExercise.id].answers || {});
      } else {
        setFormAnswers({});
      }
    });
  }, [activeExercise.id]);

  const handleInputChange = (promptId: string, val: string) => {
    setFormAnswers(prev => ({ ...prev, [promptId]: val }));
  };

  const handleSaveExercise = async () => {
    setIsSaving(true);
    const submission: ExerciseSubmission = {
      exerciseId: activeExercise.id,
      submittedAt: new Date().toISOString(),
      answers: formAnswers,
      personalReflection: formAnswers['p3'] || formAnswers['p2'] || ''
    };

    await db.saveExerciseSubmission(submission);
    setSubmissions(prev => ({ ...prev, [activeExercise.id]: submission }));

    const updatedProfile = await db.getUserProfile();
    onProfileUpdated(updatedProfile);

    setIsSaving(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const isCompleted = profile.completedExercises.includes(activeExercise.id);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple mb-1">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>تمرین‌های عملی دگرگونی و خودکاوی</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          کارگاه اقدام در دنیای واقعی
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          بینش بدون اقدام، توهم خودشناسی است. تمرین‌ها پل میان ذهن و رفتارند.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Exercises List Sidebar */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-bold text-slate-400 px-2 block">فهرست تمرین‌ها</span>
          {ALL_EXERCISES.map((ex) => {
            const isSelected = activeExercise.id === ex.id;
            const isDone = profile.completedExercises.includes(ex.id);

            return (
              <button
                key={ex.id}
                onClick={() => setActiveExercise(ex)}
                className={`w-full p-4 rounded-3xl text-right transition-all border flex items-center justify-between ${
                  isSelected 
                    ? 'bg-white border-brand-purple shadow-soft-lg ring-2 ring-brand-purple/20' 
                    : 'glass-card border-white hover:bg-white/80 shadow-soft'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                      مرحله {toPersianDigits(ex.stageId)}
                    </span>
                    {isDone && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold">
                        انجام‌شده
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">{ex.title}</h4>
                </div>

                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Flame className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Exercise Form */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-white space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-brand-purple px-2.5 py-1 rounded-md bg-brand-purple-light">
                  تمرین مرحله {toPersianDigits(activeExercise.stageId)}
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-2">{activeExercise.title}</h3>
              </div>
              {isCompleted && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تکمیل‌شده</span>
                </span>
              )}
            </div>

            {/* Objective & Instructions */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-700">هدف این تمرین:</div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {activeExercise.objective}
              </p>
              <ul className="text-xs text-slate-500 space-y-1 pt-1 list-disc list-inside">
                {activeExercise.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>

            {/* Dynamic Prompts Form */}
            <div className="space-y-4">
              {activeExercise.prompts.map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    {p.label}
                  </label>
                  {p.type === 'textarea' ? (
                    <textarea
                      value={formAnswers[p.id] || ''}
                      onChange={(e) => handleInputChange(p.id, e.target.value)}
                      placeholder={p.placeholder}
                      rows={3}
                      className="w-full p-4 rounded-2xl bg-white/90 border border-slate-200/80 focus:ring-2 focus:ring-brand-purple focus:outline-none text-sm text-slate-700 leading-relaxed placeholder:text-slate-400"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formAnswers[p.id] || ''}
                      onChange={(e) => handleInputChange(p.id, e.target.value)}
                      placeholder={p.placeholder}
                      className="w-full p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 focus:ring-2 focus:ring-brand-purple focus:outline-none text-sm text-slate-700 placeholder:text-slate-400"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {saveSuccessMsg && (
                <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>پاسخ شما با موفقیت ذخیره و در پرونده رشد ثبت شد!</span>
                </div>
              )}

              <button
                onClick={handleSaveExercise}
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold shadow-soft flex items-center justify-center gap-2 transition-all mr-auto"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'در حال ثبت...' : 'ثبت و ذخیره تمرین (+۸۰ امتیاز بینش)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
