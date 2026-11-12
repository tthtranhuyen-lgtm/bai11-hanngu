import React, { useState, useEffect, useRef } from 'react';
import { VOCAB_WORDS, VocabWord } from '../data/chineseData';
import { playWord, playSentence, playSfxClick, resolveAssetUrl } from '../utils/audioPlayer';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';

export const VocabSection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [speed, setSpeed] = useState(0.85);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [activeWordId, setActiveWordId] = useState<string | null>(null);

  // Start straight into the first vocab word without the introductory book/lesson title
  const firstWordStart = VOCAB_WORDS[0]?.fullAudioStart ?? 6.8;
  const lastWordEnd = VOCAB_WORDS[VOCAB_WORDS.length - 1]?.fullAudioEnd ?? 61.5;

  // Full Audio Playback State for 11-4
  const [isFullPlaying, setIsFullPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(firstWordStart);
  const [duration, setDuration] = useState(62.27);
  const fullAudioRef = useRef<HTMLAudioElement | null>(null);

  // Filter words
  const filteredWords = VOCAB_WORDS.filter((w) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      w.h.includes(q) ||
      w.p.toLowerCase().includes(q) ||
      w.m.toLowerCase().includes(q)
    );
  });

  // Track current word in full audio
  useEffect(() => {
    if (!isFullPlaying) return;
    const current = VOCAB_WORDS.find(
      (w) => currentTime >= w.fullAudioStart - 0.2 && currentTime <= w.fullAudioEnd + 0.3
    );
    if (current) {
      setActiveWordId(current.id);
    } else {
      setActiveWordId(null);
    }
  }, [currentTime, isFullPlaying]);

  const handleTogglePlayFull = () => {
    playSfxClick();
    if (!fullAudioRef.current) {
      const audio = new Audio(resolveAssetUrl('/assets/aistudio/11-4_98e89e45.mp3'));
      fullAudioRef.current = audio;
      audio.currentTime = firstWordStart;

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      audio.onloadedmetadata = () => {
        setDuration(audio.duration || 62.27);
      };
      audio.onended = () => {
        setIsFullPlaying(false);
        setActiveWordId(null);
        if (fullAudioRef.current) {
          fullAudioRef.current.currentTime = firstWordStart;
          setCurrentTime(firstWordStart);
        }
      };
    }

    const audio = fullAudioRef.current;
    audio.playbackRate = speed;

    if (isFullPlaying) {
      audio.pause();
      setIsFullPlaying(false);
    } else {
      // Jump directly into first vocab word if currently before lesson start or at the end
      if (audio.currentTime < firstWordStart || audio.currentTime >= lastWordEnd) {
        audio.currentTime = firstWordStart;
        setCurrentTime(firstWordStart);
      }
      audio.play().then(() => setIsFullPlaying(true)).catch(() => {});
    }
  };

  const handleRestartFull = () => {
    playSfxClick();
    if (fullAudioRef.current) {
      fullAudioRef.current.currentTime = firstWordStart;
      setCurrentTime(firstWordStart);
      if (!isFullPlaying) {
        fullAudioRef.current.play().then(() => setIsFullPlaying(true)).catch(() => {});
      }
    } else {
      handleTogglePlayFull();
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (fullAudioRef.current) {
      fullAudioRef.current.playbackRate = newSpeed;
    }
  };

  const toggleFlip = (id: string) => {
    playSfxClick();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePlayWord = (e: React.MouseEvent, word: VocabWord) => {
    e.stopPropagation();
    if (isFullPlaying && fullAudioRef.current) {
      fullAudioRef.current.pause();
      setIsFullPlaying(false);
    }
    setActiveWordId(word.id);
    playWord(word, speed).finally(() => {
      setTimeout(() => setActiveWordId(null), 800);
    });
  };

  const handlePlayExample = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    playSentence(text, speed);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Full Audio Banner with Real-time Sync */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-sm border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-400 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
            🎙️
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base sm:text-lg">
              二、生词 (Từ mới & Danh từ riêng)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-xs font-mono text-gray-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <button
            onClick={handleTogglePlayFull}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
              isFullPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-200'
            }`}
          >
            {isFullPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isFullPlaying ? 'Tạm dừng' : 'Nghe toàn bộ từ mới'}</span>
          </button>

          <button
            onClick={handleRestartFull}
            title="Nghe lại từ đầu"
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Speed Controls matching image_ff01733b pill design */}
      <div className="bg-white/90 backdrop-blur-md rounded-full px-5 py-3 shadow-xs border border-purple-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-2 min-w-[200px]">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm từ (chữ Hán / pinyin / nghĩa)..."
            className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400 font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5 text-sm text-purple-900 font-medium shrink-0">
          <span className="text-base">🐢</span>
          <input
            type="range"
            min="0.5"
            max="1.3"
            step="0.05"
            value={speed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="w-24 sm:w-32 accent-purple-500 cursor-pointer"
          />
          <span className="text-base">🐇</span>
          <span className="font-bold text-purple-600 min-w-[42px] text-right font-mono text-sm">
            {speed.toFixed(2)}x
          </span>
        </div>
      </div>

      {/* Word Grid - 3 columns matching image_ff01733b */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWords.map((w) => {
          const isFlipped = !!flippedCards[w.id];
          const isHighlight = activeWordId === w.id;

          return (
            <div
              key={w.id}
              onClick={() => toggleFlip(w.id)}
              className="relative h-60 [perspective:1000px] cursor-pointer group"
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] rounded-3xl ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                {/* Front Face */}
                <div
                  className={`absolute inset-0 [backface-visibility:hidden] rounded-3xl p-5 flex flex-col justify-between border transition-all ${
                    isHighlight
                      ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-400 shadow-lg ring-4 ring-pink-200'
                      : 'bg-white/95 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        {w.h}
                      </div>
                      <div className="text-base font-bold text-indigo-500 mt-1">
                        {w.p}
                      </div>
                      <div className="text-gray-500 text-sm font-medium mt-0.5">
                        {w.m}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handlePlayWord(e, w)}
                      title="Phát âm thanh bản xứ"
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-xs ${
                        isHighlight
                          ? 'bg-pink-500 text-white animate-pulse'
                          : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-auto">
                    {w.isProperNoun && (
                      <span className="inline-block mb-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                        专名 · Danh từ riêng
                      </span>
                    )}

                    <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-xs text-purple-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                        Nhấp xem ví dụ
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">Bài 11</span>
                    </div>
                  </div>
                </div>

                {/* Back Face (Examples) */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl p-5 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 shadow-sm flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-purple-200">
                      <span className="text-xs font-bold text-purple-700 tracking-wider">
                        📖 例句 (VÍ DỤ)
                      </span>
                      <span className="text-xs font-bold text-pink-600">{w.h}</span>
                    </div>

                    <div className="space-y-2.5">
                      {w.ex.map(([cn, vn], idx) => (
                        <div
                          key={idx}
                          className="pl-2 border-l-2 border-pink-300 group/ex"
                        >
                          <div
                            onClick={(e) => handlePlayExample(e, cn)}
                            className="text-xs sm:text-sm font-bold text-gray-800 hover:text-purple-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>{cn}</span>
                            <Volume2 className="w-3.5 h-3.5 text-purple-400 shrink-0 opacity-70 group-hover/ex:opacity-100" />
                          </div>
                          <div className="text-[11px] sm:text-xs text-gray-500 italic mt-0.5">
                            {vn}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[11px] text-purple-500 font-medium">
                    Nhấp lại để lật về từ vựng ↺
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
