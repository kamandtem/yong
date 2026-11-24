import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  ShieldAlert, 
  ArrowLeft, 
  Heart, 
  Eye, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { UserProfile, ArchetypeId } from '../types';
import { ARCHETYPES_META } from '../data/assessmentsData';
import { toPersianDigits, formatToPersianDate } from '../utils/persianDate';

interface AssessmentResultPageProps {
  assessmentId: string;
  profile: UserProfile;
  onBack: () => void;
  onRetake: () => void;
  onNavigateToLesson: (lessonId: string) => void;
}

export const AssessmentResultPage: React.FC<AssessmentResultPageProps> = ({
  assessmentId,
  profile,
  onBack,
  onRetake,
  onNavigateToLesson
}) => {
  const isArchetypes = assessmentId === 'ass-archetypes';
  const archResult = profile.archetypeResults;
  const awareResult = profile.awarenessScore;

  if (isArchetypes && !archResult) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-sm text-slate-500">نتیجه‌ای برای این آزمون یافت نشد.</p>
        <button onClick={onRetake} className="px-5 py-2.5 rounded-2xl bg-brand-purple text-white text-xs font-bold">
          شرکت در آزمون
        </button>
      </div>
    );
  }

  if (!isArchetypes && !awareResult) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-sm text-slate-500">نتیجه‌ای برای این ارزیابی ثبت نشده است.</p>
        <button onClick={onRetake} className="px-5 py-2.5 rounded-2xl bg-brand-purple text-white text-xs font-bold">
          شرکت در ارزیابی
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به مرکز آزمون‌ها</span>
        </button>

        <button
          onClick={onRetake}
          className="flex items-center gap-1.5 text-xs font-medium text-brand-purple hover:underline"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>آزمون مجدد</span>
        </button>
      </div>

      {isArchetypes && archResult && (
        <div className="space-y-6">
          {/* Hero Insights Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-white bg-gradient-to-br from-white via-brand-purple-light/20 to-brand-teal-light/20">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-purple mb-2">
              <Sparkles className="w-4 h-4" />
              <span>کارنامه تحلیل کهن‌الگوها • {formatToPersianDate(archResult.date)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              کهن‌الگوی راهنمای شما: {archResult.topArchetypes[0].nameFa}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              {archResult.overallInsight}
            </p>
          </div>

          {/* Top 3 Dominant Archetypes */}
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-3">۳ نیروی کهن‌الگویی پیشران شما</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {archResult.topArchetypes.map((arch, idx) => (
                <div key={arch.id} className="glass-card rounded-3xl p-5 shadow-soft border border-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand-purple-light text-brand-purple-dark font-bold">
                      رتبه {toPersianDigits(idx + 1)}
                    </span>
                    <span className="text-sm font-black text-brand-purple">
                      {toPersianDigits(arch.percentage)}٪
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-base">{arch.nameFa}</h4>
                    <p className="text-xs text-slate-500 mt-1">{arch.summary}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                    <div>
                      <span className="font-semibold text-emerald-600">نیروی سازنده: </span>
                      <span className="text-slate-600">{arch.constructiveAspect}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-rose-500">نقطه سایه: </span>
                      <span className="text-slate-600">{arch.shadowAspect}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shadow Archetype Section */}
          <div className="glass-card rounded-3xl p-6 shadow-soft border border-rose-100 bg-rose-50/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <Eye className="w-4 h-4" />
              <span>کهن‌الگوی در لایه سایه: {archResult.shadowArchetype.nameFa}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              این کهن‌الگو کمترین امتیاز را در ارزیابی داشته است (امتیاز: {toPersianDigits(archResult.shadowArchetype.percentage)}٪). در روان‌شناسی یونگ، کهن‌الگوهای با نمره پایین معمولاً یا سرکوب شده‌اند یا نادیده گرفته شده‌اند. آشتی با ویژگی‌های مثبت این کهن‌الگو می‌تواند گنج بزرگی از انرژی روانی را برای شما آزاد کند.
            </p>
          </div>

          {/* Full 12 Archetypes Spectrum (Bars) */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-white space-y-4">
            <h3 className="text-sm font-bold text-slate-800">طیف جامع ۱۲ کهن‌الگو در روان شما</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(ARCHETYPES_META) as ArchetypeId[]).map((id) => {
                const meta = ARCHETYPES_META[id];
                const raw = archResult.scores[id] || 2;
                const pct = Math.round(((raw - 2) / 8) * 100);

                return (
                  <div key={id} className="p-3 rounded-2xl bg-white/70 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{meta.nameFa}</span>
                      <span className="font-semibold text-slate-500">{toPersianDigits(pct)}٪</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: meta.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Dimensions Result */}
      {!isArchetypes && awareResult && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-white bg-gradient-to-br from-white to-brand-teal-light/30">
            <span className="text-xs font-bold text-brand-teal-dark px-2.5 py-1 rounded-md bg-brand-teal-light">
              کارنامه ۶ بعد خودآگاهی و تعادل روان
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-3 tracking-tight">
              شاخص‌های پویای سلامت و بلوغ روان
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              نتایج شما نشان‌دهنده نقاط اتکای مستحکم و فرصت‌های طلایی رشد در رفتار و روابط است.
            </p>
          </div>

          {/* Dimensions Bars */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-white space-y-5">
            {[
              { label: 'تنظیم هیجان و تاب‌آوری', val: awareResult.emotionalRegulation, color: 'bg-emerald-500' },
              { label: 'قاطعیت و مهارت مرزبندی', val: awareResult.boundarySetting, color: 'bg-brand-purple' },
              { label: 'استقلال فکری و رهایی از قضاوت', val: awareResult.intellectualIndependence, color: 'bg-indigo-500' },
              { label: 'خودشفقتی و بخشش خویشتن', val: awareResult.selfCompassion, color: 'bg-rose-500' },
              { label: 'شفافیت ارزش‌ها و قطب‌نما', val: awareResult.valueClarity, color: 'bg-amber-500' },
              { label: 'استمرار و تغییر عادات خرد', val: awareResult.actionPersistence, color: 'bg-teal-600' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
                  <span>{item.label}</span>
                  <span>{toPersianDigits(item.val)}٪</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                    style={{ width: `${item.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested next step */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm sm:text-base">مسیر آموزشی منطبق بر نتایج آزمون فعال شد</h4>
          <p className="text-xs text-slate-300 mt-1">درس‌ها و تمرین‌های پیشنهادی در داشبورد شما به‌روزرسانی شدند.</p>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-2xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-all shadow-md"
        >
          بازگشت به داشبورد
        </button>
      </div>
    </div>
  );
};
