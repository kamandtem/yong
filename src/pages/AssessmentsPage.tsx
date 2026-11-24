import React from 'react';
import { 
  Compass, 
  Layers, 
  Clock, 
  HelpCircle, 
  ArrowLeft, 
  Award, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';
import { ARCHETYPE_ASSESSMENT, COMPREHENSIVE_AWARENESS_ASSESSMENT } from '../data/assessmentsData';
import { UserProfile } from '../types';
import { toPersianDigits, formatToPersianDate } from '../utils/persianDate';

interface AssessmentsPageProps {
  profile: UserProfile;
  onStartAssessment: (assessmentId: string) => void;
  onViewResults: (assessmentId: string) => void;
}

export const AssessmentsPage: React.FC<AssessmentsPageProps> = ({
  profile,
  onStartAssessment,
  onViewResults
}) => {
  const assessments = [
    {
      info: ARCHETYPE_ASSESSMENT,
      hasResult: !!profile.archetypeResults,
      lastDate: profile.archetypeResults?.date,
      summary: profile.archetypeResults 
        ? `کهن‌الگوی غالب شما: ${profile.archetypeResults.topArchetypes[0]?.nameFa || 'تعیین‌شده'}`
        : 'شناسایی نیروهای کهن‌الگویی فعال، نقاب‌ها و سایه روان'
    },
    {
      info: COMPREHENSIVE_AWARENESS_ASSESSMENT,
      hasResult: !!profile.awarenessScore,
      lastDate: profile.awarenessScore?.date,
      summary: profile.awarenessScore
        ? `میانگین تعادل روانی: ${toPersianDigits(Math.round((profile.awarenessScore.emotionalRegulation + profile.awarenessScore.boundarySetting + profile.awarenessScore.intellectualIndependence) / 3))}٪`
        : 'ارزیابی ۶ شاخص: تنظیم هیجان، مرزبندی، استقلال فکری و خودشفقتی'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple mb-1">
          <Compass className="w-4 h-4" />
          <span>ارزیابی‌های چندبعدی خودآگاهی و کهن‌الگوها</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          مرکز آزمون‌ها و آینه‌های روان
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          آزمون‌ها در این سامانه برچسب بیماری نمی‌زنند؛ بلکه نقشه‌ای برای آغاز گفتگو و تأمل شخصی ترسیم می‌کنند.
        </p>
      </div>

      {/* Scientific limitation alert box */}
      <div className="glass-card rounded-3xl p-5 shadow-soft border border-indigo-100 bg-indigo-50/40 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-900 leading-relaxed">
          <span className="font-bold">اصل شفافیت و مسئولیت علمی:</span> نتایج ارزیابی‌های خودشناسی برای افزایش بینش فردی و کشف الگوهای تکراری است و جایگزین تشخیص‌های بالینی روان‌پزشکی نمی‌باشد. در مدل ۱۲ کهن‌الگو، هیچ تیپی بهتر یا بدتر از دیگری نیست؛ همه کهن‌الگوها نیروهای بالقوه روان هستند.
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map(({ info, hasResult, lastDate, summary }) => (
          <div
            key={info.id}
            className="glass-card rounded-3xl p-6 shadow-soft border border-white flex flex-col justify-between hover:border-brand-purple/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-teal-light text-brand-teal-dark font-semibold">
                  {info.badge}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{toPersianDigits(info.estimatedMinutes)} دقیقه</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1">{info.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{info.subtitle}</p>

              <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-100 space-y-2 mb-4">
                <div className="text-xs text-slate-700 leading-relaxed font-medium">
                  {summary}
                </div>
                {hasResult && lastDate && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>آخرین انجام: {formatToPersianDate(lastDate)}</span>
                  </div>
                )}
              </div>

              {/* Theoretical base snapshot */}
              <div className="text-[11px] text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-500">پایه نظری: </span>
                {info.theoreticalFoundation}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {hasResult ? (
                <>
                  <button
                    onClick={() => onViewResults(info.id)}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all text-center"
                  >
                    مشاهده تحلیل کارنامه
                  </button>
                  <button
                    onClick={() => onStartAssessment(info.id)}
                    className="py-2.5 px-4 rounded-2xl bg-brand-purple text-white hover:bg-brand-purple-dark text-xs font-bold transition-all"
                  >
                    آزمون مجدد
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onStartAssessment(info.id)}
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-teal text-white hover:opacity-95 text-xs font-bold shadow-soft flex items-center justify-center gap-2 transition-all"
                >
                  <span>شروع ارزیابی ({toPersianDigits(info.questionsCount)} پرسش)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
