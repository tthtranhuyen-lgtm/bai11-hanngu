import React, { useState, useRef, useEffect } from 'react';
import { DIALOGUE_SECTIONS, DialogueLine, DialogueSection as IDialogueSection } from '../data/chineseData';
import { playDialogueLineAudio, playSfxClick, resolveAssetUrl } from '../utils/audioPlayer';
import { Play, Pause, RotateCcw, Volume2, FastForward, CheckCircle2 } from 'lucide-react';

export const DialogueSection: React.FC = () => {
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number>(0);
  const currentSection: IDialogueSection = DIALOGUE_SECTIONS[selectedSectionIdx] || DIALOGUE_SECTIONS[0];
  const sectionStart = currentSection.lines[0]?.start ?? 0;
  const sectionEnd = currentSection.lines[currentSection.lines.length - 1]?.end ?? 40.49;

  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [currentTime, setCurrentTime] = useState(sectionStart);
  const [duration, setDuration] = useState(40.49);
  const [speed, setSpeed] = useState(0.85);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set up audio whenever section changes
  useEffect(() => {
    const start = currentSection.lines[0]?.start ?? 0;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = resolveAssetUrl(currentSection.fullAudio);
      audioRef.current.currentTime = start;
      setCurrentTime(start);
      setIsPlayingFull(false);
      setActiveLineId(null);
    } else {
      setCurrentTime(start);
    }
  }, [selectedSectionIdx, currentSection]);

  // Track active line in real-time
  useEffect(() => {
    if (!isPlayingFull) return;
    const currentLine = currentSection.lines.find(
      (line) => currentTime >= line.start - 0.25 && currentTime <= line.end + 0.25
    );

    if (currentLine) {
      setActiveLineId(currentLine.id);
      if (autoScroll) {
        const el = document.getElementById(`dlg-row-${currentLine.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    } else {
      setActiveLineId(null);
    }
  }, [currentTime, isPlayingFull, currentSection.lines, autoScroll]);

  const initAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(resolveAssetUrl(currentSection.fullAudio));
      audioRef.current = audio;
      const start = currentSection.lines[0]?.start ?? 0;
      audio.currentTime = start;

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      audio.onloadedmetadata = () => {
        setDuration(audio.duration || 40);
      };
      audio.onended = () => {
        setIsPlayingFull(false);
        setActiveLineId(null);
        if (audioRef.current) {
          const resetStart = currentSection.lines[0]?.start ?? 0;
          audioRef.current.currentTime = resetStart;
          setCurrentTime(resetStart);
        }
      };
    }
    return audioRef.current;
  };

  const handleTogglePlay = () => {
    playSfxClick();
    const audio = initAudio();
    audio.playbackRate = speed;
    const start = currentSection.lines[0]?.start ?? 0;
    const end = currentSection.lines[currentSection.lines.length - 1]?.end ?? duration;

    if (isPlayingFull) {
      audio.pause();
      setIsPlayingFull(false);
    } else {
      // Jump directly into the dialogue lines without the original book/lesson intro
      if (audio.currentTime < start || audio.currentTime >= end) {
        audio.currentTime = start;
        setCurrentTime(start);
      }
      audio.play().then(() => setIsPlayingFull(true)).catch(() => {});
    }
  };

  const handleSeek = (newTime: number) => {
    const audio = initAudio();
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleRestart = () => {
    playSfxClick();
    const audio = initAudio();
    const start = currentSection.lines[0]?.start ?? 0;
    audio.currentTime = start;
    setCurrentTime(start);
    audio.playbackRate = speed;
    audio.play().then(() => setIsPlayingFull(true)).catch(() => {});
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handlePlaySingleLine = (line: DialogueLine) => {
    if (isPlayingFull && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingFull(false);
    }
    setActiveLineId(line.id);
    playDialogueLineAudio(line, speed).finally(() => {
      setTimeout(() => setActiveLineId(null), 600);
    });
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'A':
        return {
          bg: 'bg-pink-100 text-pink-700 border-pink-200',
          avatar: 'bg-gradient-to-tr from-pink-400 to-rose-400 text-white'
        };
      case 'B':
        return {
          bg: 'bg-purple-100 text-purple-700 border-purple-200',
          avatar: 'bg-gradient-to-tr from-purple-400 to-indigo-500 text-white'
        };
      case 'C':
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          avatar: 'bg-gradient-to-tr from-teal-400 to-emerald-400 text-white'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Dialogue Section Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/70 backdrop-blur-md rounded-2xl border border-purple-100 shadow-sm">
        {DIALOGUE_SECTIONS.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => {
              playSfxClick();
              setSelectedSectionIdx(idx);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              selectedSectionIdx === idx
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200'
                : 'text-gray-600 hover:text-purple-600 hover:bg-white/90'
            }`}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* Main Player Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-purple-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">
              {currentSection.title}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{currentSection.subTitle}</p>
          </div>

          {/* Quick Play & Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                isPlayingFull
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-purple-200'
              }`}
            >
              {isPlayingFull ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingFull ? 'Tạm dừng bài khóa' : 'Phát bài khóa chuẩn'}</span>
            </button>

            <button
              onClick={handleRestart}
              title="Phát lại từ đầu"
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Audio Controls */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium text-purple-700 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 40}
              step="0.1"
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="flex-1 accent-purple-600 cursor-pointer h-2 bg-purple-100 rounded-lg"
            />
            <span className="text-xs font-mono font-medium text-gray-500 w-10">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-purple-800">Tốc độ:</span>
              {[0.75, 0.85, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2.5 py-1 rounded-md font-bold transition ${
                    speed === spd
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-400"
              />
              <span>Tự động cuộn theo giọng đọc (Karaoke)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Dialogue Lines Display */}
      <div className="space-y-3.5">
        {currentSection.lines.map((line, idx) => {
          const isCurrentActive = activeLineId === line.id;
          const badgeStyle = getRoleBadge(line.role);

          return (
            <div
              key={line.id}
              id={`dlg-row-${line.id}`}
              onClick={() => handlePlaySingleLine(line)}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 sm:gap-4 ${
                isCurrentActive
                  ? 'bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 border-pink-400 shadow-md ring-4 ring-pink-100 -translate-y-0.5'
                  : 'bg-white/80 border-purple-100 hover:border-purple-300 hover:bg-white shadow-sm'
              }`}
            >
              {/* Speaker Avatar */}
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-extrabold text-base shrink-0 shadow-sm ${badgeStyle.avatar}`}
              >
                {line.role}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${badgeStyle.bg}`}
                  >
                    {line.speakerName}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    Câu #{idx + 1}
                  </span>
                  {isCurrentActive && (
                    <span className="flex items-center gap-1 text-[11px] text-pink-600 font-bold animate-pulse ml-auto">
                      <Volume2 className="w-3.5 h-3.5" />
                      Đang đọc...
                    </span>
                  )}
                </div>

                <div className="text-base sm:text-lg font-bold text-gray-800 leading-snug">
                  {line.zh}
                </div>

                <div className="text-xs sm:text-sm font-semibold text-purple-600 mt-1 tracking-wide">
                  {line.py}
                </div>

                <div className="text-xs sm:text-sm text-gray-500 italic mt-1">
                  {line.vn}
                </div>
              </div>

              {/* Per-line listen button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaySingleLine(line);
                }}
                title="Nghe riêng câu này"
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform hover:scale-110 shadow-sm ${
                  isCurrentActive
                    ? 'bg-pink-500 text-white'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Guide Note */}
      <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 pt-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>
          Mẹo: Nhấp vào bất kỳ câu nào để nghe riêng câu đó với bản thu âm thanh gốc chuẩn.
        </span>
      </div>
    </div>
  );
};
