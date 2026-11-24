import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Smartphone, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { UserProfile } from '../types';
import { db } from '../db/indexedDB';

interface SettingsPageProps {
  profile: UserProfile;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  profile,
  onProfileUpdated
}) => {
  const [name, setName] = useState(profile.name);
  const [primaryGoal, setPrimaryGoal] = useState(profile.primaryGoal);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...profile, name, primaryGoal };
    await db.saveUserProfile(updated);
    onProfileUpdated(updated);
    setStatusMsg('مشخصات با موفقیت ذخیره شد.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleExportBackup = async () => {
    const jsonStr = await db.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khodagah-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('فایل پشتیبان با موفقیت دانلود شد.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const success = await db.importFullBackup(content);
      if (success) {
        const freshProfile = await db.getUserProfile();
        onProfileUpdated(freshProfile);
        setStatusMsg('اطلاعات با موفقیت بازیابی شدند.');
      } else {
        alert('خطا در بازیابی: فرمت فایل پشتیبان نامعتبر است.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple mb-1">
          <Settings className="w-4 h-4" />
          <span>پیکربندی، حریم خصوصی و مدیریت پایگاه داده</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          تنظیمات و نگهداری اطلاعات
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          تمام داده‌های شما در حافظه محلی همین مرورگر نگهداری می‌شوند و هرگز به سروری ارسال نمی‌گردند.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-white space-y-4">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
          مشخصات همراهی در برنامه
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">نام یا عنوان دلخواه شما</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">هدف اصلی شما در سفر خودشناسی</label>
            <textarea
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              rows={2}
              className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purple-dark transition-colors shadow-sm"
        >
          ذخیره تغییرات مشخصات
        </button>
      </form>

      {/* Backup and Restore */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-white space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-brand-teal" />
          <h3 className="text-sm font-bold text-slate-800">پشتیبان‌گیری و انتقال اطلاعات</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          برای اینکه با پاک کردن کش مرورگر یا تغییر گوشی، یادداشت‌ها و کارنامه‌های خود را از دست ندهید، می‌توانید یک فایل نسخه پشتیبان دانلود کرده و هر زمان در دستگاه دیگر بازیابی کنید.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-soft transition-all"
          >
            <Download className="w-4 h-4" />
            <span>دانلود فایل پشتیبان (JSON)</span>
          </button>

          <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-soft cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-brand-purple" />
            <span>بازیابی اطلاعات از فایل</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* PWA Installation Guide */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-white space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800">نصب به عنوان برنامه مستقل (PWA)</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          این اپلیکیشن کاملاً استاندارد به صورت Progressive Web App طراحی شده و بدون نیاز به دانلود از اپ‌استورها روی موبایل یا کامپیوتر شما نصب می‌شود:
        </p>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <li><strong>در آیفون (Safari):</strong> دکمه اشتراک‌گذاری (Share) را بزنید و گزینه <em>Add to Home Screen</em> را انتخاب کنید.</li>
          <li><strong>در اندروید (Chrome):</strong> روی منوی سه‌نقطه بزنید و گزینه <em>نصب برنامه (Install App)</em> یا <em>افزودن به صفحه اصلی</em> را لمس نمایید.</li>
          <li><strong>در کامپیوتر:</strong> آیکون نصب در سمت راست نوار آدرس مرورگر را کلیک کنید.</li>
        </ul>
      </div>
    </div>
  );
};
