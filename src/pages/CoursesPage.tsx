import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Eye, 
  HeartHandshake 
} from 'lucide-react';
import { STAGES_INFO, ALL_LESSONS } from '../data/coursesData';
import { UserProfile, StageId } from '../types';
import { toPersianDigits } from '../utils/persianDate';

interface CoursesPageProps {
  profile: UserProfile;
  onSelectLesson: (lessonId: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  profile,
  onSelectLesson
}) => {
  const [selectedStage, setSelectedStage] = useState<StageId>(1);

  const currentStageInfo = STAGES_INFO.find(s => s.id === selectedStage) || STAGES_INFO[0];
  const stageLessons = ALL_LESSONS.filter(l => l.stageId === selectedStage);

  const getStageCompletedCount = (stageId: StageId) => {
    const ids = ALL_LESSONS.filter(l => l.stageId === stageId).map(l => l.id);
    return ids.filter(id => profile.completedLessons.includes(id)).length;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple mb-1">
          <BookOpen className="w-4 h-4" />
          <span>مسیر آموزشی ۴ مرحله‌ای تحول فردی</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          سِیر یادگیری و خودکاوی
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          از درک ساختار ناخودآگاه تا بازسازی درونی، کشف معنا و معماری زندگی اصیل
        </p>
      </div>

      {/* Stage Selector Tabs (4 Stages) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STAGES_INFO.map((stage) => {
          const isSelected = selectedStage === stage.id;
          const totalInStage = ALL_LESSONS.filter(l => l.stageId === stage.id).length;
          const completedInStage = getStageCompletedCount(stage.id);
          const percent = totalInStage > 0 ? Math.round((completedInStage / totalInStage) * 100) : 0;

          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`p-4 rounded-3xl text-right transition-all duration-200 border relative overflow-hidden ${
                isSelected 
                  ? 'bg-white shadow-soft-lg border-brand-purple ring-2 ring-brand-purple/20 scale-[1.02]' 
                  : 'glass-card border-white hover:bg-white/90 shadow-soft'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  مرحله {toPersianDigits(stage.id)}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {toPersianDigits(percent)}٪ تکمیل
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{stage.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-1">{stage.subtitle}</p>

              {/* Progress line */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    stage.id === 1 ? 'bg-brand-teal' : stage.id === 2 ? 'bg-brand-purple' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Banner */}
      <div className="glass-card rounded-3xl p-6 shadow-soft border border-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-purple px-2.5 py-1 rounded-lg bg-brand-purple-light">
              {currentStageInfo.badge}
            </span>
            <h3 className="text-xl font-bold text-slate-800 mt-2">{currentStageInfo.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {currentStageInfo.description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/80 px-4 py-2 rounded-2xl border border-slate-100 self-start md:self-auto">
            <span>{toPersianDigits(stageLessons.length)} جلسه آموزشی</span>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {stageLessons.map((lesson, idx) => {
          const isCompleted = profile.completedLessons.includes(lesson.id);
          return (
            <div
              key={lesson.id}
              className="glass-card rounded-3xl p-5 shadow-soft border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-purple/40 transition-all"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-slate-100 text-slate-600 font-bold text-sm'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : toPersianDigits(idx + 1)}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-slate-400 font-medium">{lesson.chapterTitle}</span>
                    {isCompleted && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                        تکمیل‌شده
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">{lesson.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{lesson.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{toPersianDigits(lesson.estimatedMinutes)} دقیقه</span>
                </div>

                <button
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isCompleted 
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                      : 'bg-brand-purple text-white hover:bg-brand-purple-dark shadow-sm'
                  }`}
                >
                  <span>{isCompleted ? 'مرور مجدد' : 'شروع درس'}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
