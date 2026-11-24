import React, { useState } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  Flame, 
  Heart, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { UserProfile } from '../types';
import { ALL_LESSONS } from '../data/coursesData';
import { ALL_EXERCISES } from '../data/exercisesData';
import { toPersianDigits } from '../utils/persianDate';

interface ProgressPageProps {
  profile: UserProfile;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ profile }) => {
  // Self-report reflection state for personal growth dimension
  const [personalGrowthLogs, setPersonalGrowthLogs] = useState<string[]>([
    'در مکالمه تلفنی اخیر توانستم بدون پرخاشگری اما بسیار قاطع بگویم فرصت این کار را ندارم.',
    'نسبت به قضاوت همکارم کمتر خشمگین شدم و آن را بازتاب خستگی خودش دیدم.',
    'عادت ۱۰ دقیقه سکوت صبحگاهی را ۳ روز متوالی بدون وقفه حفظ کردم.'
  ]);
  const [newLog, setNewLog] = useState('');

  // 1. Learning Progress
  const totalLessons = ALL_LESSONS.length;
  const completedLessonsCount = profile.completedLessons.length;
  const learningPercentage = Math.round((completedLessonsCount / totalLessons) * 100);

  // 2. Exercise Progress
  const totalExercises = ALL_EXERCISES.length;
  const completedExercisesCount = profile.completedExercises.length;
  const exercisePercentage = Math.round((completedExercisesCount / totalExercises) * 100);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.trim()) return;
    setPersonalGrowthLogs([newLog.trim(), ...personalGrowthLogs]);
    setNewLog('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>ارزیابی چندلایه رشد و تغییرات زیسته</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          سنجش پیشرفت واقعی در ۳ ساحت
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          تفکیک پیشرفت تحصیلی از استمرار در تمرین و تغییرات عینی در جهان واقعی زندگی
        </p>
      </div>

      {/* 3 Core Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Layer 1: Learning Progress */}
        <div className="glass-card rounded-3xl p-6 shadow-soft border border-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-teal-light text-brand-teal-dark font-bold">
              ساحت اول
            </span>
            <BookOpen className="w-4 h-4 text-brand-teal" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">پیشرفت آموزشی</h3>
            <p className="text-xs text-slate-400 mt-0.5">مطالعه مفاهیم و درک تئوری</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">{toPersianDigits(learningPercentage)}٪</span>
            <span className="text-xs text-slate-400">({toPersianDigits(completedLessonsCount)} از {toPersianDigits(totalLessons)} درس)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-teal rounded-full transition-all duration-500"
              style={{ width: `${learningPercentage}%` }}
            />
          </div>
        </div>

        {/* Layer 2: Practical Exercises Progress */}
        <div className="glass-card rounded-3xl p-6 shadow-soft border border-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              ساحت دوم
            </span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">پیشرفت تمرینی</h3>
            <p className="text-xs text-slate-400 mt-0.5">انجام کارگاه‌ها و ثبت پاسخ‌ها</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">{toPersianDigits(exercisePercentage)}٪</span>
            <span className="text-xs text-slate-400">({toPersianDigits(completedExercisesCount)} از {toPersianDigits(totalExercises)} تمرین)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${exercisePercentage}%` }}
            />
          </div>
        </div>

        {/* Layer 3: Personal Life Changes */}
        <div className="glass-card rounded-3xl p-6 shadow-soft border border-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-purple-light text-brand-purple-dark font-bold">
              ساحت سوم
            </span>
            <Heart className="w-4 h-4 text-brand-purple" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">دگرگونی عینی زندگی</h3>
            <p className="text-xs text-slate-400 mt-0.5">شواهد تغییر رفتار در عمل</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">{toPersianDigits(personalGrowthLogs.length)}</span>
            <span className="text-xs text-slate-400">شاهد رفتاری ثبت‌شده</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-purple rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, personalGrowthLogs.length * 20)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Layer 3 Log Submission Box */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-white space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-purple" />
          <h3 className="text-sm font-bold text-slate-800">
            ثبت یک شاهد عینی از تغییر رفتار امروز
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          امروز چه تفاوتی در واکنش‌ها، تصمیم‌گیری‌ها، نه گفتن‌ها یا احساس آرامشتان نسبت به گذشته داشتید؟
        </p>

        <form onSubmit={handleAddLog} className="flex gap-2">
          <input
            type="text"
            placeholder="مثلاً: در جمع خانوادگی وقتی نظرم پرسیده شد بدون تملق نظر واقعی‌ام را گفتم..."
            value={newLog}
            onChange={(e) => setNewLog(e.target.value)}
            className="flex-1 p-3.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purple-dark transition-colors shadow-sm flex-shrink-0"
          >
            ثبت شاهد
          </button>
        </form>

        {/* Existing Logs */}
        <div className="space-y-2 pt-2">
          {personalGrowthLogs.map((log, i) => (
            <div key={i} className="p-3 rounded-2xl bg-white/70 border border-slate-100 text-xs text-slate-700 flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
