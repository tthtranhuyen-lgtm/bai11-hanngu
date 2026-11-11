import React, { useState } from 'react';
import { VocabSection } from './components/VocabSection';
import { DialogueSection } from './components/DialogueSection';
import { GrammarSection } from './components/GrammarSection';
import { WritingSection } from './components/WritingSection';
import { GameSection } from './components/GameSection';
import { ExercisesSection } from './components/ExercisesSection';
import { playSfxClick } from './utils/audioPlayer';

export type TabType = 'vocab' | 'dialogue' | 'grammar' | 'write' | 'game' | 'ex1' | 'ex2' | 'ex3';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('vocab');

  const tabsRow1: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'vocab', label: 'Từ vựng', icon: '📚' },
    { id: 'dialogue', label: 'Bài khóa', icon: '💬' },
    { id: 'grammar', label: 'Ngữ pháp', icon: '📐' },
    { id: 'write', label: 'Luyện viết', icon: '✍️' },
    { id: 'game', label: 'Trò chơi', icon: '🎮' },
  ];

  const tabsRow2: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'ex1', label: 'Bài tập 1', icon: '📝' },
    { id: 'ex2', label: 'Bài tập 2', icon: '📝' },
    { id: 'ex3', label: 'Bài tập 3', icon: '📝' },
  ];

  const handleTabChange = (tabId: TabType) => {
    playSfxClick();
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden text-gray-800 bg-gradient-to-br from-[#fdf1f7] via-[#f4efff] to-[#eaf7f4]">
      {/* Background Pastel Blobs */}
      <div className="fixed -top-36 -left-32 w-96 h-96 rounded-full bg-pink-200/50 blur-3xl pointer-events-none animate-blob-1 -z-10" />
      <div className="fixed top-1/4 -right-40 w-96 h-96 rounded-full bg-purple-200/50 blur-3xl pointer-events-none animate-blob-2 -z-10" />
      <div className="fixed -bottom-40 left-1/4 w-96 h-96 rounded-full bg-teal-100/60 blur-3xl pointer-events-none animate-blob-3 -z-10" />
      <div className="fixed bottom-16 right-10 w-72 h-72 rounded-full bg-amber-100/50 blur-3xl pointer-events-none animate-blob-4 -z-10" />

      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#ffffff99_1.3px,transparent_1.3px)] [background-size:28px_28px] opacity-70 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        {/* Hero Header */}
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-pink-300 text-white font-extrabold text-xs tracking-wider uppercase shadow-xs mb-3">
            <span>BÀI 11 · 介绍</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-indigo-300 drop-shadow-sm pb-1 font-rounded">
            Giới Thiệu
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xl mx-auto font-medium">
            Giao tiếp · Giới thiệu · Đại từ số nhiều · Ôn tập tiếng Trung
          </p>
        </header>

        {/* Navigation Tabs - 2 Rows of rounded pills matching image_ff01733b */}
        <nav className="flex flex-col items-center gap-2.5 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {tabsRow1.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-purple-500 text-white shadow-md shadow-purple-200 scale-105'
                      : 'bg-white/85 text-gray-700 hover:text-purple-700 hover:bg-white shadow-xs border border-purple-50'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {tabsRow2.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-purple-500 text-white shadow-md shadow-purple-200 scale-105'
                      : 'bg-white/85 text-gray-700 hover:text-purple-700 hover:bg-white shadow-xs border border-purple-50'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Panels */}
        <main className="transition-all duration-300">
          {activeTab === 'vocab' && <VocabSection />}
          {activeTab === 'dialogue' && <DialogueSection />}
          {activeTab === 'grammar' && <GrammarSection />}
          {activeTab === 'write' && <WritingSection />}
          {activeTab === 'game' && <GameSection />}
          {(activeTab === 'ex1' || activeTab === 'ex2' || activeTab === 'ex3') && (
            <ExercisesSection exerciseTab={activeTab} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-purple-100/60 text-center text-xs text-gray-500">
          <p className="font-semibold text-purple-700">
            Giáo trình Hán ngữ Quyển 1 · Bài 11: 我们都是留学生 (Chúng tôi đều là lưu học sinh)
          </p>
        </footer>
      </div>
    </div>
  );
}
