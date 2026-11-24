import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ARCHETYPE_ASSESSMENT, COMPREHENSIVE_AWARENESS_ASSESSMENT, ARCHETYPES_META } from '../data/assessmentsData';
import { UserProfile, ArchetypeId, ArchetypeScore, ArchetypeResult, ComprehensiveAwarenessScore } from '../types';
import { db } from '../db/indexedDB';
import { toPersianDigits } from '../utils/persianDate';

interface AssessmentTestPageProps {
  assessmentId: string;
  profile: UserProfile;
  onBack: () => void;
  onCompleted: (updatedProfile: UserProfile) => void;
}

export const AssessmentTestPage: React.FC<AssessmentTestPageProps> = ({
  assessmentId,
  profile,
  onBack,
  onCompleted
}) => {
  const assessment = assessmentId === 'ass-archetypes' 
    ? ARCHETYPE_ASSESSMENT 
    : COMPREHENSIVE_AWARENESS_ASSESSMENT;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = assessment.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / assessment.questions.length) * 100);

  const handleSelectOption = (score: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: score }));
    
    // Auto advance after slight pause if not at end
    if (currentIndex < assessment.questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 180);
    }
  };

  const calculateArchetypesResult = (): ArchetypeResult => {
    const rawScores: Record<ArchetypeId, number> = {
      innocent: 0, orphan: 0, warrior: 0, caregiver: 0,
      seeker: 0, destroyer: 0, lover: 0, creator: 0,
      ruler: 0, magician: 0, sage: 0, jester: 0
    };

    assessment.questions.forEach((q) => {
      if (q.archetypeId && answers[q.id]) {
        rawScores[q.archetypeId] += answers[q.id];
      }
    });

    // Each archetype has 2 questions, max raw score = 10, min = 2
    const archetypeScores: ArchetypeScore[] = (Object.keys(rawScores) as ArchetypeId[]).map((archId) => {
      const meta = ARCHETYPES_META[archId];
      const raw = rawScores[archId] || 2;
      const percentage = Math.round(((raw - 2) / 8) * 100);

      return {
        id: archId,
        nameFa: meta.nameFa,
        score: raw,
        percentage,
        coreDesire: meta.coreDesire,
        coreFear: meta.coreFear,
        constructiveAspect: meta.constructiveAspect,
        shadowAspect: meta.shadowAspect,
        summary: meta.summary
      };
    });

    // Sort descending for top archetypes
    const sorted = [...archetypeScores].sort((a, b) => b.percentage - a.percentage);
    const topArchetypes = sorted.slice(0, 3);
    const shadowArchetype = sorted[sorted.length - 1]; // lowest activated or repressed

    return {
      date: new Date().toISOString(),
      scores: rawScores,
      topArchetypes,
      shadowArchetype,
      overallInsight: `کهن‌الگوی «${topArchetypes[0].nameFa}» نیروی محرک اصلی روان شما در این دوران است و کهن‌الگوی «${shadowArchetype.nameFa}» در لایه ناخودآگاه نیاز به توجه و آشتی دارد.`
    };
  };

  const calculateAwarenessResult = (): ComprehensiveAwarenessScore => {
    const sums: Record<string, { total: number; count: number }> = {
      emotionalRegulation: { total: 0, count: 0 },
      boundarySetting: { total: 0, count: 0 },
      intellectualIndependence: { total: 0, count: 0 },
      selfCompassion: { total: 0, count: 0 },
      valueClarity: { total: 0, count: 0 },
      actionPersistence: { total: 0, count: 0 }
    };

    assessment.questions.forEach((q) => {
      if (q.dimension && answers[q.id]) {
        sums[q.dimension].total += answers[q.id];
        sums[q.dimension].count += 1;
      }
    });

    const getScore = (dim: string) => {
      const data = sums[dim];
      if (!data || data.count === 0) return 60;
      // scale 1-5 to 0-100%
      return Math.round(((data.total / data.count - 1) / 4) * 100);
    };

    return {
      date: new Date().toISOString(),
      emotionalRegulation: getScore('emotionalRegulation'),
      boundarySetting: getScore('boundarySetting'),
      intellectualIndependence: getScore('intellectualIndependence'),
      selfCompassion: getScore('selfCompassion'),
      valueClarity: getScore('valueClarity'),
      actionPersistence: getScore('actionPersistence'),
      insights: [
        'مهارت‌های خودآگاهی پویا و با تمرین‌های دوره در حال شکوفایی هستند.',
        'نقاط نیازمند توجه در مسیر آموزشی اولویت‌دار اعمال شدند.'
      ]
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const currentProfile = await db.getUserProfile();

    if (assessmentId === 'ass-archetypes') {
      const archResult = calculateArchetypesResult();
      currentProfile.archetypeResults = archResult;
      currentProfile.totalXP += 100;
    } else {
      const awareResult = calculateAwarenessResult();
      currentProfile.awarenessScore = awareResult;
      currentProfile.totalXP += 80;
    }

    await db.saveUserProfile(currentProfile);
    setIsSubmitting(false);
    onCompleted(currentProfile);
  };

  const allAnswered = assessment.questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowRight className="w-4 h-4" />
          <span>انصراف و خروج</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          پرسش {toPersianDigits(currentIndex + 1)} از {toPersianDigits(assessment.questions.length)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-brand-teal to-brand-purple transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-white space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-purple px-2.5 py-1 rounded-md bg-brand-purple-light">
            پرسش {toPersianDigits(currentIndex + 1)}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed pt-2">
            {currentQuestion.text}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5 pt-2">
          {currentQuestion.options.map((opt, i) => {
            const isSelected = answers[currentQuestion.id] === opt.score;
            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt.score)}
                className={`w-full p-4 rounded-2xl text-right text-sm font-medium transition-all duration-200 border flex items-center justify-between ${
                  isSelected 
                    ? 'bg-gradient-to-r from-brand-purple-light to-white border-brand-purple text-brand-purple-dark shadow-sm ring-2 ring-brand-purple/20' 
                    : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                  isSelected ? 'border-brand-purple bg-brand-purple text-white' : 'border-slate-300'
                }`}>
                  {isSelected && '✓'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation bottom buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none"
          >
            سوال قبلی
          </button>

          {currentIndex < assessment.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              disabled={answers[currentQuestion.id] === undefined}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-dark disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
            >
              <span>سوال بعدی</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-teal-dark text-white text-xs font-bold hover:opacity-95 shadow-soft transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'در حال تحلیل...' : 'مشاهده نتایج و کارنامه'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
