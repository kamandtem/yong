import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Bot, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Activity, 
  Compass,
  Calendar
} from 'lucide-react';
import { UserProfile, LifeMapData } from '../types';
import { BrainVisualizer } from '../components/BrainVisualizer';
import { MoodTracker } from '../components/MoodTracker';
import { PersonalizationEngine } from '../engine/personalizationEngine';
import { ALL_LESSONS } from '../data/coursesData';
import { toPersianDigits, formatToPersianDate } from '../utils/persianDate';

interface DashboardPageProps {
  profile: UserProfile;
  lifeMap: LifeMapData;
  onNavigate: (tab: any, params?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  lifeMap,
  onNavigate
}) => {
  const recommendation = PersonalizationEngine.analyzeProfile(
    profile, 
    profile.archetypeResults, 
    profile.awarenessScore
  );

  const recommendedLesson = ALL_LESSONS.find(l => l.id === recommendation.recommendedLessonId) || ALL_LESSONS[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>امروز، {formatToPersianDate(new Date().toISOString())}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            امروز حال و هوای درون چطور است؟
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            سفر خودشناسی بر مدار کشف ناخودآگاه، آشتی با سایه‌ها و زیستن در هماهنگی با جان
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('coach')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all"
          >
            <Bot className="w-4 h-4 text-brand-purple" />
            <span>همراهی مربی</span>
          </button>
          <button
            onClick={() => onNavigate('lifemap')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-teal-dark text-white shadow-soft hover:shadow-soft-lg text-xs font-semibold transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>نقشه زندگی من</span>
          </button>
        </div>
      </div>

      {/* Main Grid: UI Reference Layout (Center Brain + Balanced Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Desktop) / Top metrics */}
        <div className="lg:col-span-3 space-y-5">
          {/* Awareness Wave Metric Card */}
          <div className="glass-card rounded-3xl p-5 shadow-soft border border-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700">امواج خودآگاهی هفتگی</span>
              <Activity className="w-4 h-4 text-brand-teal" />
            </div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {toPersianDigits(profile.totalXP)} <span className="text-xs font-normal text-slate-400">امتیاز بینش</span>
            </div>
            {/* Smooth SVG Line Chart */}
            <div className="mt-3 h-16 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#528276" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#528276" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,28 Q15,35 30,20 T60,25 T85,10 T100,18"
                  fill="none"
                  stroke="#528276"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0,28 Q15,35 30,20 T60,25 T85,10 T100,18 L100,40 L0,40 Z"
                  fill="url(#waveGrad)"
                />
                <circle cx="85" cy="10" r="3" fill="#856BA9" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>شنبه</span>
              <span>دوشنبه</span>
              <span>امروز</span>
            </div>
          </div>

          {/* Psychological Balance status */}
          <div className="glass-card rounded-3xl p-5 shadow-soft border border-white">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">تعادل درونی روان</div>
                <div className="text-[11px] text-emerald-600 font-medium">پایدار و در مسیر فردیت‌یابی</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              هر دو نیم‌کره عقلانی و شهودی در تعامل هستند. تنش‌های ناخودآگاه در حال بازشناسی‌اند.
            </p>
          </div>

          {/* Mood Tracker Component */}
          <MoodTracker onMoodLogged={() => {}} />
        </div>

        {/* Center Column: 3D Brain Visualizer and Core Hub */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full glass-card rounded-3xl p-6 shadow-soft-lg border border-white/90 relative overflow-hidden flex flex-col items-center">
            {/* Background subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-purple-light/30 via-transparent to-brand-teal-light/20 pointer-events-none" />

            <div className="w-full flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-teal"></span>
                <span className="text-xs font-bold text-slate-700">مغز و روان پویا</span>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 text-slate-600 shadow-sm font-medium">
                مدل زنده دو نیم‌کره
              </span>
            </div>

            {/* Interactive 3D Canvas Model */}
            <BrainVisualizer 
              awarenessLevel={profile.awarenessScore ? Math.round((profile.awarenessScore.selfCompassion + profile.awarenessScore.intellectualIndependence) / 2) : 76} 
            />

            {/* Personalized Recommendation Card right under brain */}
            <div className="w-full mt-4 p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-100 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-purple-light text-brand-purple-dark font-semibold">
                  مسیر پیشنهادی هوشمند شما
                </span>
                <span className="text-xs text-slate-400">
                  {toPersianDigits(recommendedLesson.estimatedMinutes)} دقیقه
                </span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1">
                {recommendedLesson.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {recommendation.focusAreaDescription}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {recommendation.priorityTags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onNavigate('lesson', { lessonId: recommendedLesson.id })}
                  className="flex items-center gap-1 text-xs font-bold text-brand-purple hover:text-brand-purple-dark transition-colors"
                >
                  <span>شروع مطالعه</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Desktop) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Quick Coach Prompt Card */}
          <div className="glass-card rounded-3xl p-5 shadow-soft border border-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-brand-purple-light text-brand-purple flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">زمزمه مربی درونی</h4>
                <p className="text-[10px] text-slate-400">بدون هوش مصنوعی آنلاین</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-3 rounded-2xl border border-slate-100">
              «{recommendation.coachTriggerPrompt}»
            </p>
            <button
              onClick={() => onNavigate('coach')}
              className="w-full mt-3 py-2 px-3 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-dark transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>پاسخ و گفتگو</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Archetypes snapshot card */}
          <div className="glass-card rounded-3xl p-5 shadow-soft border border-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700">کهن‌الگوهای فعال روان</span>
              <Compass className="w-4 h-4 text-brand-purple" />
            </div>
            {profile.archetypeResults && profile.archetypeResults.topArchetypes.length > 0 ? (
              <div className="space-y-2.5">
                {profile.archetypeResults.topArchetypes.slice(0, 2).map((arch, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/60 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{arch.nameFa}</div>
                      <div className="text-[10px] text-slate-400">{arch.coreDesire}</div>
                    </div>
                    <span className="text-xs font-bold text-brand-purple">
                      {toPersianDigits(arch.percentage)}٪
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => onNavigate('assessments')}
                  className="w-full text-center text-xs text-brand-teal hover:underline pt-1"
                >
                  مشاهده همه ۱۲ کهن‌الگو
                </button>
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs text-slate-500 mb-3">هنوز در آزمون ۱۲ کهن‌الگو شرکت نکرده‌اید.</p>
                <button
                  onClick={() => onNavigate('assessment_test', { assessmentId: 'ass-archetypes' })}
                  className="px-4 py-2 rounded-xl bg-brand-teal text-white text-xs font-semibold hover:bg-brand-teal-dark transition-colors"
                >
                  شرکت در آزمون کهن‌الگوها
                </button>
              </div>
            )}
          </div>

          {/* Life Map Snapshot */}
          <div className="glass-card rounded-3xl p-5 shadow-soft border border-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">ارزش‌های محوری ثبت‌شده</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {lifeMap.coreValues.slice(0, 4).map((val, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  {val}
                </span>
              ))}
            </div>
            <button
              onClick={() => onNavigate('lifemap')}
              className="mt-3 text-xs text-brand-purple font-semibold hover:underline block"
            >
              ویرایش و مشاهده کامل سند زندگی ←
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
