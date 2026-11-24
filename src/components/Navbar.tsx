import React from 'react';
import { Menu, Search, Flame, Bell, User, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { toPersianDigits } from '../utils/persianDate';

interface NavbarProps {
  profile: UserProfile;
  onOpenMobileSidebar: () => void;
  onOpenProfile: () => void;
  onOpenCoach: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenMobileSidebar,
  onOpenProfile,
  onOpenCoach
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-md border-b border-white/60 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Right side: Mobile Menu + Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 lg:hidden text-slate-700 transition-colors"
            aria-label="باز کردن منو"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-slate-800">
                درود، {profile.name}
              </span>
              <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-brand-teal-light text-brand-teal-dark font-medium">
                مرحله {toPersianDigits(profile.currentStage)}
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-400">
              امروز یک گام دیگر به سوی خودِ حقیقی و آگاه بردارید.
            </p>
          </div>
        </div>

        {/* Left side: Streak, Quick Actions & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-xs font-semibold shadow-sm">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{toPersianDigits(profile.streakDays)} روز مداومت</span>
          </div>

          {/* Quick Coach Button */}
          <button
            onClick={onOpenCoach}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-dark text-white text-xs font-medium shadow-soft hover:shadow-soft-lg hover:scale-105 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>گفتگو با مربی</span>
          </button>

          {/* User Avatar */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-teal text-white flex items-center justify-center font-bold text-xs shadow-inner-soft">
              {profile.name.charAt(0)}
            </div>
            <span className="hidden sm:block text-xs font-medium text-slate-700">
              {profile.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
