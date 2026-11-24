import { UserProfile, ArchetypeResult, ComprehensiveAwarenessScore } from '../types';

export interface PersonalizationRecommendation {
  focusAreaTitle: string;
  focusAreaDescription: string;
  recommendedLessonId: string;
  recommendedExerciseId: string;
  priorityTags: string[];
  coachTriggerPrompt: string;
  reason: string;
}

export class PersonalizationEngine {
  static analyzeProfile(
    profile: UserProfile,
    archetypes?: ArchetypeResult,
    awareness?: ComprehensiveAwarenessScore
  ): PersonalizationRecommendation {
    // Priority 1: Check low boundary setting
    if (awareness && awareness.boundarySetting < 55) {
      return {
        focusAreaTitle: 'تقویت مرزهای شخصی و هنر نه گفتن',
        focusAreaDescription: 'بررسی ارزیابی اخیر نشان می‌دهد که بخش مهمی از انرژی روانی شما صرف راضی نگه‌داشتن دیگران یا رودربایستی می‌شود.',
        recommendedLessonId: 'l-2-2',
        recommendedExerciseId: 'ex-2-2',
        priorityTags: ['مرزبندی', 'قاطعیت', 'کاهش احساس گناه'],
        coachTriggerPrompt: 'در ارزیابی اخیر متوجه شدیم مرزبندی برای شما یک چالش است. آیا مایلید با هم روی یک تمرین ساده نه گفتن کار کنیم؟',
        reason: 'نمره مهارت مرزبندی کمتر از ۵۵٪ ثبت شده است.'
      };
    }

    // Priority 2: Check intellectual independence / fear of judgment
    if (awareness && awareness.intellectualIndependence < 55) {
      return {
        focusAreaTitle: 'استقلال فکری و شجاعت نامحبوب بودن',
        focusAreaDescription: 'ترس از قضاوت و نیاز شدید به تایید اطرافیان مانع از بروز شجاعانه باورها و توانایی‌های واقعی شما شده است.',
        recommendedLessonId: 'l-2-1',
        recommendedExerciseId: 'ex-2-1',
        priorityTags: ['استقلال رای', 'شجاعت نامحبوب بودن', 'شناخت پرسونا'],
        coachTriggerPrompt: 'گاهی فکر کردن به قضاوت دیگران آدم را فلج می‌کند. آخرین باری که نظرت را سانسور کردی کی بود؟',
        reason: 'نمره استقلال فکری نیازمند تقویت شناسایی شده است.'
      };
    }

    // Priority 3: Check action persistence
    if (awareness && awareness.actionPersistence < 55) {
      return {
        focusAreaTitle: 'شکستن اهمال‌کاری و تثبیت خرده‌عادت‌ها',
        focusAreaDescription: 'شما ایده‌ها و آرمان‌های زیبایی دارید اما در استمرار روزمره و تبدیل تصمیمات به رفتار با مقاومت روبرو می‌شوید.',
        recommendedLessonId: 'l-4-1',
        recommendedExerciseId: 'ex-4-1',
        priorityTags: ['خرده‌عادت‌ها', 'تغییر رفتار', 'مدیریت انرژی'],
        coachTriggerPrompt: 'برای شروع کارهای جدید چقدر با وسواسِ بی‌نقص بودن کلنجار می‌روی؟ بیا با قدم‌های ۲ دقیقه‌ای شروع کنیم.',
        reason: 'شاخص استمرار عمل نیازمند رویکرد عادات ذره‌ای است.'
      };
    }

    // Priority 4: Check archetypes top driver
    if (archetypes && archetypes.topArchetypes.length > 0) {
      const top = archetypes.topArchetypes[0].id;
      if (top === 'caregiver') {
        return {
          focusAreaTitle: 'تعادل در ایثار و مراقبت از خویشتن',
          focusAreaDescription: 'کهن‌الگوی حامی در روان شما بسیار درخشان است؛ اما مراقب باشید محبت به دیگران به قیمت فرسودگی و نادیده گرفتن روح خودتان تمام نشود.',
          recommendedLessonId: 'l-2-2',
          recommendedExerciseId: 'ex-2-2',
          priorityTags: ['خودمراقبتی', 'حامی سالم', 'مرز عاطفی'],
          coachTriggerPrompt: 'تو برای همه کوه استواری هستی؛ اما چه کسی حامی و پناه خودت است؟',
          reason: 'کهن‌الگوی غالب شما «حامی» است که نیازمند توجه به مرزبندی است.'
        };
      }
      if (top === 'orphan') {
        return {
          focusAreaTitle: 'شفا و بازیابی اعتماد به جریان زندگی',
          focusAreaDescription: 'کهن‌الگوی یتیم/بی‌پناه به شما واقع‌بینی و درک رنج می‌دهد، اما نیازمند خودنوازی و ایجاد پایگاه امن درونی است.',
          recommendedLessonId: 'l-1-3',
          recommendedExerciseId: 'ex-1-3',
          priorityTags: ['پایگاه امن', 'شفقت به خود', 'آشتی با سایه'],
          coachTriggerPrompt: 'رنج‌های گذشته تو را سرسخت کرده‌اند، اما اجازه داری خستگی‌هایت را هم زمین بگذاری.',
          reason: 'تمایل روان به سوی کهن‌الگوی یتیم شناسایی شده است.'
        };
      }
    }

    // Default recommendation if no extreme flags
    return {
      focusAreaTitle: 'آغاز سفر بیداری و کشف نقاب‌ها',
      focusAreaDescription: 'گذر از رفتارهای خودکار روزمره و شناخت ساختار خودآگاه و ناخودآگاه، نخستین و اساسی‌ترین گام این سفر است.',
      recommendedLessonId: 'l-1-1',
      recommendedExerciseId: 'ex-1-1',
      priorityTags: ['خودآگاهی', 'بیداری درون', 'مشاهده بی‌قضاوت'],
      coachTriggerPrompt: 'سلام همسفر گرامی. برای شروع سفر خودشناسی امروز، آماده‌ای یک نگاه تازه به رفتارهای روزمره‌ات بیندازیم؟',
      reason: 'مسیر استاندارد گام‌به‌گام برای ورود به دوره.'
    };
  }
}
