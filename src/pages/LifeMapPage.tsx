import React, { useState } from 'react';
import { 
  Map, 
  Printer, 
  Save, 
  Heart, 
  ShieldCheck, 
  Eye, 
  Compass, 
  CheckCircle2, 
  Plus, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { LifeMapData, UserProfile } from '../types';
import { db } from '../db/indexedDB';
import { formatToPersianDate, toPersianDigits } from '../utils/persianDate';

interface LifeMapPageProps {
  initialLifeMap: LifeMapData;
  profile: UserProfile;
}

export const LifeMapPage: React.FC<LifeMapPageProps> = ({
  initialLifeMap,
  profile
}) => {
  const [lifeMap, setLifeMap] = useState<LifeMapData>(initialLifeMap);
  const [isEditing, setIsEditing] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const handleToggleGoal = async (goalId: string) => {
    const updatedGoals = lifeMap.shortTermGoals.map(g => 
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    const updated = { ...lifeMap, shortTermGoals: updatedGoals, lastUpdated: new Date().toISOString() };
    setLifeMap(updated);
    await db.saveLifeMap(updated);
  };

  const handleSaveAll = async () => {
    const updated = { ...lifeMap, lastUpdated: new Date().toISOString() };
    await db.saveLifeMap(updated);
    setIsEditing(false);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 print:p-0 print:m-0">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple mb-1">
            <Map className="w-4 h-4" />
            <span>سند رسمی رشد و معماری آینده</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            نقشه جامع زندگی من
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            آخرین به‌روزرسانی: {formatToPersianDate(lifeMap.lastUpdated)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-soft"
          >
            {isEditing ? 'انصراف از ویرایش' : 'ویرایش بندها'}
          </button>
          {isEditing && (
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-2xl bg-brand-purple text-white text-xs font-bold shadow-soft hover:bg-brand-purple-dark flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>ذخیره تغییرات</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-soft"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>چاپ / خروجی PDF</span>
          </button>
        </div>
      </div>

      {saveFeedback && (
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-bounce print:hidden">
          <CheckCircle2 className="w-4 h-4" />
          <span>نقشه زندگی با موفقیت در پایگاه داده محلی ذخیره شد.</span>
        </div>
      )}

      {/* Main Printable Document Sheet */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-soft border border-white space-y-8 bg-white/95 print:shadow-none print:border-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-brand-purple-light p-2 shadow-inner-soft">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                منشور فردیت‌یابی و نقشه زندگی: {profile.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                سند خودشناسی، مرزها، ارزش‌ها و اهداف اصیل زندگی
              </p>
            </div>
          </div>
          <div className="text-left text-xs text-slate-400">
            <div>تاریخ ثبت: {formatToPersianDate(profile.joinDate)}</div>
            <div>مرحله مسیر: {toPersianDigits(profile.currentStage)}</div>
          </div>
        </div>

        {/* 1. Personal Declaration (بیانیه اصالت وجودی) */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-purple-light/40 to-brand-teal-light/40 border border-brand-purple/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-purple-dark">
            <Sparkles className="w-4 h-4" />
            <span>بیانیه هویت و اصالت درونی</span>
          </div>
          {isEditing ? (
            <textarea
              value={lifeMap.personalDeclaration}
              onChange={(e) => setLifeMap({ ...lifeMap, personalDeclaration: e.target.value })}
              rows={2}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium"
            />
          ) : (
            <p className="text-sm sm:text-base font-semibold text-slate-800 italic leading-relaxed">
              «{lifeMap.personalDeclaration}»
            </p>
          )}
        </div>

        {/* 2. Grid: Core Values & Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Values */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-purple">
              <Compass className="w-4 h-4" />
              <span>ارزش‌های اصیل بنیادین (قطب‌نما)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {lifeMap.coreValues.map((val, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-sm border border-slate-100">
                  {val}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-teal">
              <ShieldCheck className="w-4 h-4" />
              <span>نقاط قوت و نیروهای روانی من</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {lifeMap.strengths.map((str, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-semibold shadow-sm border border-slate-100">
                  {str}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Shadows & Boundary Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shadows */}
          <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
              <Eye className="w-4 h-4" />
              <span>سایه‌ها، ترس‌ها و نقاط نیازمند شفقت</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
              {lifeMap.shadowsAndFears.map((sf, idx) => (
                <li key={idx} className="leading-relaxed">{sf}</li>
              ))}
            </ul>
          </div>

          {/* Boundary Rules */}
          <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <ShieldCheck className="w-4 h-4" />
              <span>منشور مرزهای ارتباطی و خطوط قرمز</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
              {lifeMap.boundaryRules.map((br, idx) => (
                <li key={idx} className="leading-relaxed">{br}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Goals & Vision */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">اهداف کوتاه‌مدت و برنامه‌های عملی</h3>
            <span className="text-xs text-slate-400">تیک بزنید تا وضعیت به‌روز شود</span>
          </div>

          <div className="space-y-2">
            {lifeMap.shortTermGoals.map((goal) => (
              <div 
                key={goal.id}
                onClick={() => handleToggleGoal(goal.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  goal.completed 
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800' 
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs ${
                    goal.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {goal.completed && '✓'}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${goal.completed ? 'line-through text-slate-400' : ''}`}>
                    {goal.title}
                  </span>
                </div>
                {goal.completed && (
                  <span className="text-[10px] font-bold text-emerald-600">محقق شد</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. Long Term Vision */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <h4 className="text-xs font-bold text-slate-700">چشم‌انداز کلان و رسالت آینده</h4>
          {isEditing ? (
            <textarea
              value={lifeMap.longTermVision}
              onChange={(e) => setLifeMap({ ...lifeMap, longTermVision: e.target.value })}
              rows={2}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {lifeMap.longTermVision}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
