import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Compass, 
  Heart, 
  Wind, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { CoachMessage, UserProfile } from '../types';
import { COACH_SCENARIOS } from '../data/coachScenarios';
import { db } from '../db/indexedDB';
import { formatRelativeTime } from '../utils/persianDate';

interface CoachPageProps {
  profile: UserProfile;
  onNavigateToLesson: (lessonId: string) => void;
  onNavigateToExercise: (exerciseId: string) => void;
  onNavigateToJournal: () => void;
}

export const CoachPage: React.FC<CoachPageProps> = ({
  profile,
  onNavigateToLesson,
  onNavigateToExercise,
  onNavigateToJournal
}) => {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [currentScenarioStepId, setCurrentScenarioStepId] = useState<string>('step_1');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load message history from DB or start fresh scenario
  useEffect(() => {
    db.getCoachMessages().then((stored) => {
      if (stored && stored.length > 0) {
        setMessages(stored);
      } else {
        startScenario('welcome_checkin');
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const startScenario = async (scenarioKey: string) => {
    const scenario = COACH_SCENARIOS[scenarioKey];
    if (!scenario || scenario.length === 0) return;

    const firstStep = scenario[0];
    setCurrentScenarioStepId(firstStep.id);

    const initialMsg: CoachMessage = {
      id: `msg-${Date.now()}`,
      sender: 'coach',
      text: firstStep.coachText,
      timestamp: new Date().toISOString(),
      options: firstStep.options.map((opt, i) => ({
        id: `opt-${i}`,
        text: opt.text,
        scenarioNextId: opt.nextStepId
      }))
    };

    setMessages([initialMsg]);
    await db.saveCoachMessage(initialMsg);
  };

  const handleOptionClick = async (optionText: string, nextStepId?: string) => {
    // 1. Post user message
    const userMsg: CoachMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: optionText,
      timestamp: new Date().toISOString()
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    await db.saveCoachMessage(userMsg);

    // 2. Check scenario step
    const scenario = COACH_SCENARIOS['welcome_checkin'];
    const currentStep = scenario.find(s => s.id === currentScenarioStepId);
    const chosenOption = currentStep?.options.find(o => o.text === optionText);

    // Check memory recording
    if (chosenOption?.recordMemoryKey && chosenOption?.recordMemoryValue) {
      await db.saveCoachMemory(chosenOption.recordMemoryKey, chosenOption.recordMemoryValue);
    }

    // Check action execution
    if (chosenOption?.action) {
      if (chosenOption.action === 'suggest_lesson') {
        onNavigateToLesson(chosenOption.targetId || 'l-1-1');
        return;
      }
      if (chosenOption.action === 'suggest_exercise') {
        onNavigateToExercise(chosenOption.targetId || 'ex-2-2');
        return;
      }
      if (chosenOption.action === 'open_journal') {
        onNavigateToJournal();
        return;
      }
    }

    // Advance to next step
    const targetNextId = chosenOption?.nextStepId || nextStepId;
    if (targetNextId) {
      setIsTyping(true);
      setCurrentScenarioStepId(targetNextId);

      setTimeout(async () => {
        const nextStep = scenario.find(s => s.id === targetNextId);
        if (nextStep) {
          const coachReply: CoachMessage = {
            id: `msg-${Date.now()}-coach`,
            sender: 'coach',
            text: nextStep.coachText,
            timestamp: new Date().toISOString(),
            options: nextStep.options.map((opt, i) => ({
              id: `opt-${Date.now()}-${i}`,
              text: opt.text,
              scenarioNextId: opt.nextStepId
            }))
          };
          setMessages(prev => [...prev, coachReply]);
          await db.saveCoachMessage(coachReply);
        }
        setIsTyping(false);
      }, 700);
    }
  };

  const resetConversation = async () => {
    setMessages([]);
    startScenario('welcome_checkin');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between glass-card rounded-3xl p-4 sm:p-5 shadow-soft border border-white">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-teal text-white flex items-center justify-center shadow-soft">
            <Bot className="w-6 h-6" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-1.5">
              مربی همراه درونی
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-teal-light text-brand-teal-dark font-medium">
                آفلاین و امن
              </span>
            </h2>
            <p className="text-xs text-slate-400">همراه تأملی بر مبنای روان‌شناسی تحلیلی و شناختی</p>
          </div>
        </div>

        <button
          onClick={resetConversation}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          title="شروع مجدد گفتگو"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">گفتگوی تازه</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="px-4 py-2 rounded-2xl bg-slate-100/70 border border-slate-200/50 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-brand-purple flex-shrink-0" />
        <span>گفتگوهای شما صرفاً در این دستگاه پردازش می‌شوند و هیچ پیامی به هیچ سرور خارجی ارسال نمی‌گردد.</span>
      </div>

      {/* Messages Scroll Container */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-soft border border-white min-h-[420px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isCoach = msg.sender === 'coach';
          return (
            <div key={msg.id} className={`flex flex-col ${isCoach ? 'items-start' : 'items-end'}`}>
              <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                {isCoach && (
                  <div className="w-7 h-7 rounded-xl bg-brand-purple-light text-brand-purple-dark flex items-center justify-center flex-shrink-0 text-xs font-bold mb-1 shadow-sm">
                    م
                  </div>
                )}
                <div
                  className={`p-4 rounded-3xl text-sm leading-relaxed ${
                    isCoach 
                      ? 'bg-white/95 text-slate-800 shadow-soft border border-slate-100 rounded-tr-sm whitespace-pre-line' 
                      : 'bg-gradient-to-r from-brand-purple to-brand-purple-dark text-white rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-2">
                {formatRelativeTime(msg.timestamp)}
              </span>

              {/* Interaction Option Chips */}
              {isCoach && msg.options && msg.options.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 pr-9">
                  {msg.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt.text, opt.scenarioNextId)}
                      className="px-3.5 py-2 rounded-2xl bg-white hover:bg-brand-purple-light/50 border border-brand-purple/20 text-xs font-medium text-brand-purple-dark shadow-sm hover:scale-[1.02] transition-all text-right"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 pr-2">
            <div className="w-6 h-6 rounded-xl bg-brand-purple-light text-brand-purple flex items-center justify-center text-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-2xl bg-white text-xs text-slate-400 flex items-center gap-1.5 shadow-sm border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-ping"></span>
              <span>مربی در حال اندیشیدن...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
