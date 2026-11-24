import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Compass, 
  Bot, 
  Flame, 
  Map, 
  PenTool, 
  TrendingUp, 
  Settings,
  Sparkles,
  WifiOff
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'courses'
  | 'lesson'
  | 'assessments'
  | 'assessment_test'
  | 'assessment_result'
  | 'coach'
  | 'exercises'
  | 'lifemap'
  | 'journal'
  | 'progress'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOnline: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOnline,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'داشبورد اصلی', icon: LayoutDashboard },
    { id: 'courses', label: 'دوره خودشناسی', icon: BookOpen, badge: '۴ مرحله' },
    { id: 'assessments', label: 'مرکز آزمون‌ها', icon: Compass, badge: '۱۲ کهن‌الگو' },
    { id: 'coach', label: 'مربی تعاملی', icon: Bot, isNew: true },
    { id: 'exercises', label: 'تمرین‌های عملی', icon: Flame },
    { id: 'lifemap', label: 'نقشه زندگی من', icon: Map, isSpecial: true },
    { id: 'journal', label: 'دفترچه شخصی', icon: PenTool },
    { id: 'progress', label: 'سنجش پیشرفت', icon: TrendingUp },
    { id: 'settings', label: 'تنظیمات و پشتیبان', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId as NavTab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 right-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-l border-white/60 shadow-soft z-50 flex flex-col justify-between p-4 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-100">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-teal-light to-brand-purple-light p-1 shadow-inner-soft flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="خودآگاه" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-1.5">
                خودآگاه
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-brand-purple-light text-brand-purple-dark font-medium">
                  نسخه کامل
                </span>
              </h1>
              <p className="text-xs text-slate-400">سامانه جامع تحول فردی</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || 
                (item.id === 'courses' && currentTab === 'lesson') ||
                (item.id === 'assessments' && (currentTab === 'assessment_test' || currentTab === 'assessment_result'));

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-brand-purple-light to-brand-teal-light/50 text-brand-purple-dark shadow-sm border border-brand-purple/20 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-white text-brand-purple shadow-soft' 
                        : 'bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-brand-purple'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600 font-normal">
                      {item.badge}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-brand-teal-light text-brand-teal-dark font-medium">
                      <Sparkles className="w-2.5 h-2.5" />
                      آفلاین
                    </span>
                  )}
                  {item.isSpecial && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Offline status */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
            <span className="text-slate-500">وضعیت پایگاه داده:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              محلی و امن (IndexedDB)
            </span>
          </div>

          {!isOnline && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs">
              <WifiOff className="w-4 h-4 flex-shrink-0" />
              <span>حالت آفلاین فعال است. کلیه داده‌ها ذخیره می‌شوند.</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
