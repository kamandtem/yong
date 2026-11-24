import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Plus, 
  Trash2, 
  Search, 
  Tag, 
  Calendar, 
  Smile, 
  Heart, 
  Sparkles,
  Save
} from 'lucide-react';
import { JournalEntry } from '../types';
import { db } from '../db/indexedDB';
import { formatToPersianDate, formatRelativeTime } from '../utils/persianDate';

export const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // New entry form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('خودشناسی، تامل');
  const [mood, setMood] = useState<JournalEntry['mood']>('reflective');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const list = await db.getJournalEntries();
    setEntries(list);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      title,
      content,
      createdAt: new Date().toISOString(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      mood
    };

    await db.saveJournalEntry(newEntry);
    setTitle('');
    setContent('');
    setIsCreating(false);
    loadEntries();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا مطمئنید می‌خواهید این یادداشت را حذف کنید؟')) {
      await db.deleteJournalEntry(id);
      loadEntries();
    }
  };

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple mb-1">
            <PenTool className="w-4 h-4" />
            <span>دفترچه تأمل و ثبت لحظه‌های بیداری</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            دفترچه شخصی خودشناسی
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            نوشتن، افکار آشفته ناخودآگاه را پیش چشمان شما متجسد و شفاف می‌سازد.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-teal text-white text-xs font-bold shadow-soft hover:shadow-soft-lg hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'بستن فرم' : 'ثبت تجربه یا یادداشت جدید'}</span>
        </button>
      </div>

      {/* Creation Modal / Inline Box */}
      {isCreating && (
        <form onSubmit={handleSaveEntry} className="glass-card rounded-3xl p-6 shadow-soft-lg border border-brand-purple/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">نوشتن یادداشت تازه</h3>
            <span className="text-xs text-slate-400">کاملاً خصوصی در دستگاه شما</span>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="عنوان تأمل یا تجربه امروز..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              required
            />

            <textarea
              placeholder="بدون قضاوت و خودسانسوری بنویسید؛ چه احساسی درونت در جریان است؟ چه متوجه شدی؟..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-purple"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="برچسب‌ها با کاما (مثلاً: سایه، رابطه، خشم)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700"
              />

              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as any)}
                className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 font-medium"
              >
                <option value="reflective">حالت: در فکر و تأمل</option>
                <option value="peaceful">حالت: آرامش و پذیرش</option>
                <option value="joyful">حالت: شاداب و گشایش</option>
                <option value="challenging">حالت: چالش و کشمکش درونی</option>
                <option value="anxious">حالت: اضطراب و ناآرامی</option>
                <option value="motivated">حالت: انگیزه و شجاعت اقدام</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-sm hover:bg-brand-purple-dark flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره در دفترچه</span>
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
        <input
          type="text"
          placeholder="جستجو در متن یا برچسب‌های یادداشت‌ها..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-11 pl-4 py-3 rounded-2xl bg-white/80 border border-slate-200/80 focus:ring-2 focus:ring-brand-purple focus:outline-none text-xs sm:text-sm text-slate-700"
        />
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center space-y-3">
            <p className="text-xs text-slate-400">هنوز یادداشتی ثبت نشده است یا موردی با جستجوی شما مطابقت ندارد.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-semibold"
            >
              ثبت اولین یادداشت
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="glass-card rounded-3xl p-5 sm:p-6 shadow-soft border border-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">{entry.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{formatToPersianDate(entry.createdAt)}</span>
                    <span>• {formatRelativeTime(entry.createdAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {entry.content}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {entry.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-purple-light text-brand-purple-dark font-semibold">
                  {entry.mood === 'peaceful' ? '🕊️ آرامش' : entry.mood === 'joyful' ? '✨ گشایش' : entry.mood === 'challenging' ? '⚡ چالش' : '🔍 تأمل'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
