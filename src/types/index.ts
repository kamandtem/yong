export type StageId = 1 | 2 | 3 | 4;

export interface UserProfile {
  id: string;
  name: string;
  joinDate: string;
  primaryGoal: string;
  currentStage: StageId;
  totalXP: number;
  completedLessons: string[];
  completedExercises: string[];
  archetypeResults?: ArchetypeResult;
  awarenessScore?: ComprehensiveAwarenessScore;
  prioritizedTopics: string[]; // From personalization engine
  personalNotesCount: number;
  streakDays: number;
  lastActiveDate: string;
}

// 12 Archetypes according to Carol Pearson / Jungian model
export type ArchetypeId = 
  | 'innocent'    // معصوم
  | 'orphan'      // یتیم / بی‌پناه
  | 'warrior'     // جنگجو
  | 'caregiver'   // حامی / مراقبت‌کننده
  | 'seeker'      // جستجوگر
  | 'destroyer'   // نابودگر / دگرگون‌ساز
  | 'lover'       // عاشق
  | 'creator'     // آفرینشگر
  | 'ruler'       // حاکم
  | 'magician'    // جادوگر
  | 'sage'        // فرزانه
  | 'jester';     // دلقک / بازیگوش

export interface ArchetypeScore {
  id: ArchetypeId;
  nameFa: string;
  score: number; // percentage or raw
  percentage: number;
  coreDesire: string;
  coreFear: string;
  constructiveAspect: string;
  shadowAspect: string;
  summary: string;
}

export interface ArchetypeResult {
  date: string;
  scores: Record<ArchetypeId, number>;
  topArchetypes: ArchetypeScore[];
  shadowArchetype: ArchetypeScore;
  overallInsight: string;
}

export interface ComprehensiveAwarenessScore {
  date: string;
  emotionalRegulation: number; // تنظیم هیجان (0-100)
  boundarySetting: number;     // قاطعیت و مرزبندی (0-100)
  intellectualIndependence: number; // استقلال فکری (0-100)
  selfCompassion: number;      // خودشفقتی و پذیرش (0-100)
  valueClarity: number;        // وضوح ارزش‌ها و جهت زندگی (0-100)
  actionPersistence: number;   // استمرار و تغییر رفتار (0-100)
  insights: string[];
}

export interface LessonSection {
  title: string;
  content: string; // Markdown or rich text
  type: 'concept' | 'theory' | 'example' | 'diagram' | 'reflection' | 'summary';
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  hint?: string;
}

export interface Lesson {
  id: string;
  stageId: StageId;
  chapterTitle: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  order: number;
  sections: LessonSection[];
  reflectionQuestions: ReflectionQuestion[];
  linkedExerciseId?: string;
  references: string[];
  keyTakeaways: string[];
}

export interface Exercise {
  id: string;
  stageId: StageId;
  title: string;
  category: 'self_reflection' | 'behavioral' | 'emotional' | 'boundaries' | 'habit' | 'values';
  difficulty: 'easy' | 'medium' | 'deep';
  objective: string;
  instructions: string[];
  prompts: {
    id: string;
    label: string;
    placeholder: string;
    type: 'text' | 'textarea' | 'scale' | 'checklist';
    options?: string[];
  }[];
  isCompleted?: boolean;
}

export interface ExerciseSubmission {
  exerciseId: string;
  submittedAt: string;
  answers: Record<string, any>;
  personalReflection: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
  mood: 'peaceful' | 'reflective' | 'challenging' | 'joyful' | 'anxious' | 'motivated';
  linkedLessonId?: string;
}

export interface CoachMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  timestamp: string;
  options?: {
    id: string;
    text: string;
    scenarioNextId?: string;
  }[];
  referencedMemory?: string;
}

export interface CoachScenarioStep {
  id: string;
  coachText: string;
  requiresMemoryCheck?: string; // key in user memory
  options: {
    text: string;
    nextStepId?: string;
    recordMemoryKey?: string;
    recordMemoryValue?: string;
    action?: 'suggest_lesson' | 'suggest_exercise' | 'open_journal' | 'end';
    targetId?: string;
  }[];
}

export interface LifeMapData {
  lastUpdated: string;
  currentSelfDescription: string;
  coreValues: string[];
  strengths: string[];
  shadowsAndFears: string[];
  boundaryRules: string[];
  shortTermGoals: { id: string; title: string; completed: boolean }[];
  longTermVision: string;
  activeHabits: { id: string; title: string; frequency: string; streak: number }[];
  personalDeclaration: string;
}
