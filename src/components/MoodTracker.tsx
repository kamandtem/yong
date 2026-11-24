import React, { useState } from 'react';
import { Smile, Frown, Meh, Heart, Zap, Sparkles } from 'lucide-react';
import { db } from '../db/indexedDB';

interface MoodTrackerProps {
  onMoodLogged?: (moodLabel: string) => void;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodLogged }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const moods = [
    { id: 'joyful', label: 'شاداب و پرانرژی', icon: Sparkles, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { id: 'peaceful', label: 'آرام و متمرکز', icon: Heart, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { id: 'reflective', label: 'در فکر و تأمل', icon: Meh, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
    { id: 'challenging', label: 'کمی تحت فشار', icon: Zap, color: 'text-purple-500 bg-purple-50 border-purple-200' },
    { id: 'anxious', label: 'کلافه یا مضطرب', icon: Frown, color: 'text-rose-500 bg-rose-50 border-rose-200' },
  ];

  const handleSelect = async (mood: typeof moods[0]) => {
    setSelectedMood(mood.id);
    setSavedFeedback(`حس و حال «${mood.label}» ثبت شد. با خودت مهربان باش.`);
    
    // Save to coach memory & journal record
    await db.saveCoachMemory('today_mood', mood.id);
    await db.saveCoachMemory('today_mood_label', mood.label);

    if (onMoodLogged) {
      onMoodLogged(mood.label);
    }

    setTimeout(() => {
      setSavedFeedback(null);
    }, 4000);
  };

  return (
    <div className="glass-card rounded-3xl p-5 shadow-soft border border-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">نبض احساسی امروز</h3>
          <p className="text-xs text-slate-400">بدون سرزنش، حال درونی‌ات را به رسمیت بشناس</p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
          پایش روزانه
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 pt-2">
        {moods.map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelect(m)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-200 ${
                isSelected 
                  ? `${m.color} ring-2 ring-brand-purple scale-105 shadow-sm font-semibold` 
                  : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200 text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-1.5 transition-transform hover:scale-110" />
              <span className="text-[10px] text-center leading-tight">{m.label}</span>
            </button>
          );
        })}
      </div>

      {savedFeedback && (
        <div className="mt-3 p-2.5 rounded-xl bg-brand-teal-light text-brand-teal-dark text-xs flex items-center gap-2 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-ping"></span>
          <span>{savedFeedback}</span>
        </div>
      )}
    </div>
  );
};
