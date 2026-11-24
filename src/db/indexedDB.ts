import { UserProfile, ExerciseSubmission, JournalEntry, CoachMessage, LifeMapData } from '../types';

const DB_NAME = 'KhodAgahDB';
const DB_VERSION = 1;

// Stores in IndexedDB
const STORES = {
  USER_PROFILE: 'user_profile',
  EXERCISES: 'exercise_submissions',
  JOURNAL: 'journal_entries',
  COACH_MESSAGES: 'coach_messages',
  COACH_MEMORY: 'coach_memories',
  LIFE_MAP: 'life_map',
  SETTINGS: 'app_settings'
};

class LocalDB {
  private db: IDBDatabase | null = null;
  private isSupported: boolean = typeof window !== 'undefined' && 'indexedDB' in window;

  async init(): Promise<IDBDatabase | null> {
    if (!this.isSupported) return null;
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        Object.values(STORES).forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            if (storeName === STORES.USER_PROFILE || storeName === STORES.LIFE_MAP) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            } else if (storeName === STORES.EXERCISES) {
              db.createObjectStore(storeName, { keyPath: 'exerciseId' });
            } else if (storeName === STORES.JOURNAL || storeName === STORES.COACH_MESSAGES) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            } else if (storeName === STORES.COACH_MEMORY) {
              db.createObjectStore(storeName, { keyPath: 'key' });
            } else {
              db.createObjectStore(storeName, { keyPath: 'key' });
            }
          }
        });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
        resolve(null);
      };
    });
  }

  // --- User Profile ---
  async getUserProfile(): Promise<UserProfile> {
    const defaultProfile: UserProfile = {
      id: 'current_user',
      name: 'همسفر خودشناسی',
      joinDate: new Date().toISOString(),
      primaryGoal: 'شناخت الگوهای فکری، بازیابی آرامش و ساخت زندگی اصیل',
      currentStage: 1,
      totalXP: 120,
      completedLessons: ['l-1-1'],
      completedExercises: [],
      prioritizedTopics: ['خودآگاهی مقدماتی', 'روابط و مرزبندی'],
      personalNotesCount: 0,
      streakDays: 3,
      lastActiveDate: new Date().toISOString(),
    };

    try {
      const db = await this.init();
      if (!db) {
        const fallback = localStorage.getItem('khodagah_profile');
        return fallback ? JSON.parse(fallback) : defaultProfile;
      }

      return new Promise((resolve) => {
        const tx = db.transaction(STORES.USER_PROFILE, 'readonly');
        const store = tx.objectStore(STORES.USER_PROFILE);
        const req = store.get('current_user');

        req.onsuccess = () => {
          if (req.result) {
            resolve(req.result);
          } else {
            // Save default and return
            this.saveUserProfile(defaultProfile);
            resolve(defaultProfile);
          }
        };
        req.onerror = () => resolve(defaultProfile);
      });
    } catch {
      return defaultProfile;
    }
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const db = await this.init();
      if (!db) {
        localStorage.setItem('khodagah_profile', JSON.stringify(profile));
        return;
      }
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.USER_PROFILE, 'readwrite');
        const store = tx.objectStore(STORES.USER_PROFILE);
        const req = store.put({ ...profile, id: 'current_user' });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      localStorage.setItem('khodagah_profile', JSON.stringify(profile));
    }
  }

  // --- Lessons Progress ---
  async markLessonCompleted(lessonId: string): Promise<UserProfile> {
    const profile = await this.getUserProfile();
    if (!profile.completedLessons.includes(lessonId)) {
      profile.completedLessons.push(lessonId);
      profile.totalXP += 50;
      await this.saveUserProfile(profile);
    }
    return profile;
  }

  // --- Exercises ---
  async getExerciseSubmissions(): Promise<Record<string, ExerciseSubmission>> {
    try {
      const db = await this.init();
      if (!db) {
        const raw = localStorage.getItem('khodagah_exercises');
        return raw ? JSON.parse(raw) : {};
      }
      return new Promise((resolve) => {
        const tx = db.transaction(STORES.EXERCISES, 'readonly');
        const store = tx.objectStore(STORES.EXERCISES);
        const req = store.getAll();
        req.onsuccess = () => {
          const map: Record<string, ExerciseSubmission> = {};
          (req.result || []).forEach((item: ExerciseSubmission) => {
            map[item.exerciseId] = item;
          });
          resolve(map);
        };
        req.onerror = () => resolve({});
      });
    } catch {
      return {};
    }
  }

  async saveExerciseSubmission(sub: ExerciseSubmission): Promise<void> {
    try {
      const db = await this.init();
      if (!db) {
        const all = await this.getExerciseSubmissions();
        all[sub.exerciseId] = sub;
        localStorage.setItem('khodagah_exercises', JSON.stringify(all));
      } else {
        const tx = db.transaction(STORES.EXERCISES, 'readwrite');
        tx.objectStore(STORES.EXERCISES).put(sub);
      }

      // Also record in profile XP & completed list
      const profile = await this.getUserProfile();
      if (!profile.completedExercises.includes(sub.exerciseId)) {
        profile.completedExercises.push(sub.exerciseId);
        profile.totalXP += 80;
        await this.saveUserProfile(profile);
      }
    } catch (e) {
      console.error('Error saving exercise:', e);
    }
  }

  // --- Journal ---
  async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      const db = await this.init();
      if (!db) {
        const raw = localStorage.getItem('khodagah_journal');
        return raw ? JSON.parse(raw) : [];
      }
      return new Promise((resolve) => {
        const tx = db.transaction(STORES.JOURNAL, 'readonly');
        const store = tx.objectStore(STORES.JOURNAL);
        const req = store.getAll();
        req.onsuccess = () => {
          const sorted = (req.result || []).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          resolve(sorted);
        };
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async saveJournalEntry(entry: JournalEntry): Promise<void> {
    try {
      const db = await this.init();
      if (!db) {
        const list = await this.getJournalEntries();
        const existingIdx = list.findIndex(e => e.id === entry.id);
        if (existingIdx >= 0) list[existingIdx] = entry;
        else list.unshift(entry);
        localStorage.setItem('khodagah_journal', JSON.stringify(list));
      } else {
        const tx = db.transaction(STORES.JOURNAL, 'readwrite');
        tx.objectStore(STORES.JOURNAL).put(entry);
      }
      const profile = await this.getUserProfile();
      profile.personalNotesCount += 1;
      await this.saveUserProfile(profile);
    } catch (e) {
      console.error('Error saving journal:', e);
    }
  }

  async deleteJournalEntry(id: string): Promise<void> {
    try {
      const db = await this.init();
      if (!db) {
        let list = await this.getJournalEntries();
        list = list.filter(item => item.id !== id);
        localStorage.setItem('khodagah_journal', JSON.stringify(list));
      } else {
        const tx = db.transaction(STORES.JOURNAL, 'readwrite');
        tx.objectStore(STORES.JOURNAL).delete(id);
      }
    } catch (e) {
      console.error('Error deleting journal entry:', e);
    }
  }

  // --- Coach Memory ---
  async getCoachMemories(): Promise<Record<string, string>> {
    try {
      const db = await this.init();
      if (!db) {
        const raw = localStorage.getItem('khodagah_coach_mem');
        return raw ? JSON.parse(raw) : {};
      }
      return new Promise((resolve) => {
        const tx = db.transaction(STORES.COACH_MEMORY, 'readonly');
        const store = tx.objectStore(STORES.COACH_MEMORY);
        const req = store.getAll();
        req.onsuccess = () => {
          const map: Record<string, string> = {};
          (req.result || []).forEach((row: { key: string; value: string }) => {
            map[row.key] = row.value;
          });
          resolve(map);
        };
        req.onerror = () => resolve({});
      });
    } catch {
      return {};
    }
  }

  async saveCoachMemory(key: string, value: string): Promise<void> {
    try {
      const db = await this.init();
      if (!db) {
        const map = await this.getCoachMemories();
        map[key] = value;
        localStorage.setItem('khodagah_coach_mem', JSON.stringify(map));
      } else {
        const tx = db.transaction(STORES.COACH_MEMORY, 'readwrite');
        tx.objectStore(STORES.COACH_MEMORY).put({ key, value });
      }
    } catch (e) {
      console.error('Error saving coach memory:', e);
    }
  }

  // --- Coach Messages ---
  async getCoachMessages(): Promise<CoachMessage[]> {
    try {
      const db = await this.init();
      if (!db) {
        const raw = localStorage.getItem('khodagah_coach_msgs');
        return raw ? JSON.parse(raw) : [];
      }
      return new Promise((resolve) => {
        const tx = db.transaction(STORES.COACH_MESSAGES, 'readonly');
        const store = tx.objectStore(STORES.COACH_MESSAGES);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async saveCoachMessage(msg: CoachMessage): Promise<void> {
    try {
      const db = await this.init();
      if (!db) {
        const list = await this.getCoachMessages();
        list.push(msg);
        localStorage.setItem('khodagah_coach_msgs', JSON.stringify(list));
      } else {
        const tx = db.transaction(STORES.COACH_MESSAGES, 'readwrite');
        tx.objectStore(STORES.COACH_MESSAGES).put(msg);
      }
    } catch (e) {
      console.error('Error saving coach message:', e);
    }
  }

  // --- Life Map ---
  async getLifeMap(): Promise<LifeMapData> {
    const defaultLifeMap: LifeMapData = {
      lastUpdated: new Date().toISOString(),
      currentSelfDescription: 'در حال کاوش و بازسازی الگوهای درونی و ایجاد رابطه شفققت‌آمیز با خود.',
      coreValues: ['اصالت و راستی با خود', 'آرامش درونی', 'رشد و یادگیری مستمر', 'روابط عمیق و بدون نقاب'],
      strengths: ['کنجکاوی درونی', 'همدلی بالا', 'پشتکار در فهم ریشه‌های احساسات'],
      shadowsAndFears: ['ترس از قضاوت و ناامید کردن دیگران', 'کمال‌گرایی بازدارنده', 'تردید در ابراز مخالفت'],
      boundaryRules: [
        'حق دارم وقتی انرژی ندارم محترمانه "نه" بگویم.',
        'مسئولیت حل احساسات ناخوشایند همه اطرافیان با من نیست.',
        'مرزهای زمانی مشخص برای استراحت و تنهایی خودم دارم.'
      ],
      shortTermGoals: [
        { id: 'g1', title: 'تکمیل آزمون ۱۲ کهن‌الگو و شناخت تمایلات روان', completed: true },
        { id: 'g2', title: 'تمرین روزانه ثبت احساسات بدون خودسانسوری به مدت ۱ هفته', completed: false },
        { id: 'g3', title: 'یک‌بار ابراز نظر صریح و محترمانه در جمع بدون عذرخواهی بی‌دلیل', completed: false }
      ],
      longTermVision: 'رسیدن به فردیت‌یابی، یکپارچه‌سازی سایه و پرسونا، و زیستن بر اساس ارزش‌های اصیل به جای همرنگی کورکورانه.',
      activeHabits: [
        { id: 'h1', title: '۱۰ دقیقه سکوت و تأمل صبحگاهی', frequency: 'روزانه', streak: 5 },
        { id: 'h2', title: 'ثبت یک تجربه یا آموخته در دفترچه خودشناسی', frequency: 'روزانه', streak: 3 }
      ],
      personalDeclaration: 'من می‌پذیرم که انسانی در حال تکامل هستم؛ با تمام تضادها، توانمندی‌ها و نقاط تاریکم، و خود را شایسته مهربانی و درک می‌دانم.'
    };

    try {
      const db = await this.init();
      if (!db) {
        const raw = localStorage.getItem('khodagah_lifemap');
        return raw ? JSON.parse(raw) : defaultLifeMap;
      }
      return new Promise((resolve) => {
        const tx = db.transaction(STORES.LIFE_MAP, 'readonly');
        const store = tx.objectStore(STORES.LIFE_MAP);
        const req = store.get('main_lifemap');
        req.onsuccess = () => resolve(req.result ? req.result.data : defaultLifeMap);
        req.onerror = () => resolve(defaultLifeMap);
      });
    } catch {
      return defaultLifeMap;
    }
  }

  async saveLifeMap(data: LifeMapData): Promise<void> {
    try {
      const db = await this.init();
      if (!db) {
        localStorage.setItem('khodagah_lifemap', JSON.stringify(data));
      } else {
        const tx = db.transaction(STORES.LIFE_MAP, 'readwrite');
        tx.objectStore(STORES.LIFE_MAP).put({ id: 'main_lifemap', data });
      }
    } catch (e) {
      console.error('Error saving life map:', e);
    }
  }

  // --- Export / Import Backup ---
  async exportFullBackup(): Promise<string> {
    const profile = await this.getUserProfile();
    const exercises = await this.getExerciseSubmissions();
    const journal = await this.getJournalEntries();
    const memories = await this.getCoachMemories();
    const lifeMap = await this.getLifeMap();

    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'KhodAgah',
      data: {
        profile,
        exercises,
        journal,
        memories,
        lifeMap
      }
    };

    return JSON.stringify(backupData, null, 2);
  }

  async importFullBackup(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.appName || parsed.appName !== 'KhodAgah' || !parsed.data) {
        throw new Error('قالب فایل نامعتبر است.');
      }

      if (parsed.data.profile) await this.saveUserProfile(parsed.data.profile);
      if (parsed.data.lifeMap) await this.saveLifeMap(parsed.data.lifeMap);

      if (parsed.data.journal && Array.isArray(parsed.data.journal)) {
        for (const item of parsed.data.journal) {
          await this.saveJournalEntry(item);
        }
      }

      if (parsed.data.exercises) {
        for (const exKey of Object.keys(parsed.data.exercises)) {
          await this.saveExerciseSubmission(parsed.data.exercises[exKey]);
        }
      }

      if (parsed.data.memories) {
        for (const key of Object.keys(parsed.data.memories)) {
          await this.saveCoachMemory(key, parsed.data.memories[key]);
        }
      }

      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  }
}

export const db = new LocalDB();
