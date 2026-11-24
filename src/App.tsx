import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { LessonViewPage } from './pages/LessonViewPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { AssessmentTestPage } from './pages/AssessmentTestPage';
import { AssessmentResultPage } from './pages/AssessmentResultPage';
import { CoachPage } from './pages/CoachPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { LifeMapPage } from './pages/LifeMapPage';
import { JournalPage } from './pages/JournalPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { UserProfile, LifeMapData } from './types';
import { db } from './db/indexedDB';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('l-1-1');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('ass-archetypes');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>(undefined);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lifeMap, setLifeMap] = useState<LifeMapData | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);

  useEffect(() => {
    // Initial data load from IndexedDB
    const loadData = async () => {
      const p = await db.getUserProfile();
      const lm = await db.getLifeMap();
      setProfile(p);
      setLifeMap(lm);
    };
    loadData();

    // Listen to network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleNavigate = (tab: NavTab, params?: any) => {
    if (params?.lessonId) setSelectedLessonId(params.lessonId);
    if (params?.assessmentId) setSelectedAssessmentId(params.assessmentId);
    if (params?.exerciseId) setSelectedExerciseId(params.exerciseId);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!profile || !lifeMap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-700">
        <div className="w-16 h-16 rounded-3xl bg-brand-purple-light p-3 shadow-soft animate-pulse flex items-center justify-center mb-4">
          <img src="/logo.png" alt="خودآگاه" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-lg font-bold">در حال فراخوانی پایگاه داده محلی خودآگاه...</h2>
        <p className="text-xs text-slate-400 mt-1">بارگذاری بدون نیاز به اینترنت</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-[#F3F6FA] to-[#F5EFF9] text-slate-800 antialiased font-vazir">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => handleNavigate(tab)}
        isOnline={isOnline}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          profile={profile}
          onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
          onOpenProfile={() => handleNavigate('settings')}
          onOpenCoach={() => handleNavigate('coach')}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              profile={profile}
              lifeMap={lifeMap}
              onNavigate={(tab, params) => handleNavigate(tab, params)}
            />
          )}

          {currentTab === 'courses' && (
            <CoursesPage
              profile={profile}
              onSelectLesson={(id) => handleNavigate('lesson', { lessonId: id })}
            />
          )}

          {currentTab === 'lesson' && (
            <LessonViewPage
              lessonId={selectedLessonId}
              profile={profile}
              onBack={() => handleNavigate('courses')}
              onNavigateToExercise={(exId) => handleNavigate('exercises', { exerciseId: exId })}
              onLessonCompleted={(upd) => setProfile(upd)}
            />
          )}

          {currentTab === 'assessments' && (
            <AssessmentsPage
              profile={profile}
              onStartAssessment={(id) => handleNavigate('assessment_test', { assessmentId: id })}
              onViewResults={(id) => handleNavigate('assessment_result', { assessmentId: id })}
            />
          )}

          {currentTab === 'assessment_test' && (
            <AssessmentTestPage
              assessmentId={selectedAssessmentId}
              profile={profile}
              onBack={() => handleNavigate('assessments')}
              onCompleted={(upd) => {
                setProfile(upd);
                handleNavigate('assessment_result', { assessmentId: selectedAssessmentId });
              }}
            />
          )}

          {currentTab === 'assessment_result' && (
            <AssessmentResultPage
              assessmentId={selectedAssessmentId}
              profile={profile}
              onBack={() => handleNavigate('assessments')}
              onRetake={() => handleNavigate('assessment_test', { assessmentId: selectedAssessmentId })}
              onNavigateToLesson={(lId) => handleNavigate('lesson', { lessonId: lId })}
            />
          )}

          {currentTab === 'coach' && (
            <CoachPage
              profile={profile}
              onNavigateToLesson={(lId) => handleNavigate('lesson', { lessonId: lId })}
              onNavigateToExercise={(eId) => handleNavigate('exercises', { exerciseId: eId })}
              onNavigateToJournal={() => handleNavigate('journal')}
            />
          )}

          {currentTab === 'exercises' && (
            <ExercisesPage
              profile={profile}
              initialExerciseId={selectedExerciseId}
              onProfileUpdated={(upd) => setProfile(upd)}
            />
          )}

          {currentTab === 'lifemap' && (
            <LifeMapPage
              initialLifeMap={lifeMap}
              profile={profile}
            />
          )}

          {currentTab === 'journal' && (
            <JournalPage />
          )}

          {currentTab === 'progress' && (
            <ProgressPage
              profile={profile}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              profile={profile}
              onProfileUpdated={(upd) => setProfile(upd)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
