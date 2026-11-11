import React, { useState, useEffect, useRef } from 'react';
import { VOCAB_WORDS, VocabWord } from '../data/chineseData';
import { playWord, playSfxClick } from '../utils/audioPlayer';

declare global {
  interface Window {
    HanziWriter?: {
      create: (
        elementId: string | HTMLElement,
        character: string,
        options: Record<string, unknown>
      ) => {
        animateCharacter: (options?: { onComplete?: () => void }) => void;
        loopCharacterAnimation: () => void;
      };
    };
  }
}

export const WritingSection: React.FC = () => {
  // Default to 0 ('秘书' as shown in the screenshot)
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);
  const [brushColor, setBrushColor] = useState<string>('#3d3346');
  const [showTrace, setShowTrace] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animContainerRef = useRef<HTMLDivElement | null>(null);

  // Drawing canvas state
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const history = useRef<ImageData[]>([]);

  const currentWord: VocabWord = VOCAB_WORDS[selectedWordIndex] || VOCAB_WORDS[0];
  const characters = Array.from(currentWord.h);
  const currentChar = characters[activeCharIndex] || characters[0];

  // Set up Drawing Canvas
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 7;
      ctx.strokeStyle = brushColor;
    }
    history.current = [];
  };

  useEffect(() => {
    setupCanvas();
    const handleResize = () => setTimeout(setupCanvas, 100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When word or char changes, clear previous animation container so no ghost stroke remains
  useEffect(() => {
    if (animContainerRef.current) {
      animContainerRef.current.innerHTML = '';
    }
    setIsAnimating(false);
  }, [currentChar]);

  const handleSelectWord = (idx: number) => {
    playSfxClick();
    setSelectedWordIndex(idx);
    setActiveCharIndex(0);
    clearCanvas(true);
    playWord(VOCAB_WORDS[idx]);
  };

  const handleSelectChar = (cIdx: number) => {
    playSfxClick();
    setActiveCharIndex(cIdx);
    clearCanvas(true);
    playWord(characters[cIdx]);
  };

  const handlePlayAudio = () => {
    playWord(currentWord);
  };

  const handleAnimate = () => {
    playSfxClick();
    if (!window.HanziWriter || !animContainerRef.current) return;

    // Reset container and hide static trace to prevent double overlay
    animContainerRef.current.innerHTML = '';
    setIsAnimating(true);

    const stageEl = document.getElementById('writeStageBox');
    const size = stageEl ? stageEl.clientWidth : 340;

    try {
      const writer = window.HanziWriter.create(animContainerRef.current, currentChar, {
        width: size,
        height: size,
        padding: 15,
        showOutline: false,
        showCharacter: false,
        strokeAnimationSpeed: 1.2,
        delayBetweenStrokes: 180,
        strokeColor: '#a98bff'
      });

      writer.animateCharacter({
        onComplete: () => {
          setTimeout(() => {
            if (animContainerRef.current) {
              animContainerRef.current.innerHTML = '';
            }
            setIsAnimating(false);
          }, 1000);
        }
      });
    } catch {
      setIsAnimating(false);
    }
  };

  const handleToggleTrace = () => {
    playSfxClick();
    if (isAnimating) {
      if (animContainerRef.current) {
        animContainerRef.current.innerHTML = '';
      }
      setIsAnimating(false);
    }
    setShowTrace((prev) => !prev);
  };

  const handleRandom = () => {
    playSfxClick();
    const randIdx = Math.floor(Math.random() * VOCAB_WORDS.length);
    handleSelectWord(randIdx);
  };

  // Drawing logic
  const pushHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (history.current.length > 30) history.current.shift();
    } catch {
      // ignore
    }
  };

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isDrawing.current = true;
    const pos = getCanvasPos(e);
    lastPos.current = pos;
    pushHistory();

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = brushColor;
      ctx.fill();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPos.current) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  const clearCanvas = (silent: boolean = false) => {
    if (!silent) {
      playSfxClick();
      pushHistory();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
    }
  };

  const handleUndo = () => {
    playSfxClick();
    const canvas = canvasRef.current;
    if (!canvas || history.current.length === 0) return;
    const prev = history.current.pop();
    const ctx = canvas.getContext('2d');
    if (ctx && prev) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.putImageData(prev, 0, 0);
      ctx.restore();
    }
  };

  const colorPalette = [
    { code: '#3d3346', label: 'Đen xám' },
    { code: '#ff7fa3', label: 'Hồng pastel' },
    { code: '#a98bff', label: 'Tím pastel' },
    { code: '#4fc3a1', label: 'Xanh bạc hà' },
    { code: '#ffa726', label: 'Cam ấm' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Word Select Card (Design matching user screenshot) */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-sm border border-purple-100">
        <h3 className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#7a6b88] tracking-wider mb-3">
          <span>✍️</span>
          <span>CHỌN TỪ ĐỂ LUYỆN VIẾT</span>
        </h3>

        {/* Word Dropdown */}
        <select
          value={selectedWordIndex}
          onChange={(e) => handleSelectWord(parseInt(e.target.value, 10))}
          className="w-full max-w-[500px] px-4 py-2.5 sm:py-3 rounded-2xl border-2 border-[#f0e6f7] bg-white text-[#4a3f55] font-semibold text-sm sm:text-base focus:border-[#c9b6ff] focus:outline-none transition-colors cursor-pointer shadow-xs"
        >
          {VOCAB_WORDS.map((w, idx) => (
            <option key={w.id} value={idx}>
              {w.h} — {w.p}
            </option>
          ))}
        </select>

        {/* Character Chips (KaiTi font as in screenshot) */}
        <div className="flex gap-2.5 flex-wrap mt-3.5">
          {characters.map((char, cIdx) => {
            const isActive = activeCharIndex === cIdx;
            return (
              <button
                key={cIdx}
                type="button"
                onClick={() => handleSelectChar(cIdx)}
                style={{
                  fontFamily: '"KaiTi", "STKaiti", "Kaiti SC", "SimKai", "DFKai-SB", "Noto Serif SC", serif'
                }}
                className={`w-14 h-14 rounded-2xl text-3xl leading-none flex items-center justify-center font-normal transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-[#ff9dbb] to-[#a98bff] text-white shadow-lg shadow-purple-300 -translate-y-0.5 scale-105'
                    : 'bg-white text-[#7a6b88] shadow-sm hover:text-[#5d4d70] hover:-translate-y-0.5'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-2.5 flex-wrap mt-3.5">
          {/* Pink Button: Nghe đọc */}
          <button
            type="button"
            onClick={handlePlayAudio}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#ff9dbb] to-[#ff7fa3] shadow-md shadow-pink-200 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
          >
            <span>🔊</span>
            <span>Nghe đọc</span>
          </button>

          {/* Purple Button with dark border: Xem nét vẽ */}
          <button
            type="button"
            onClick={handleAnimate}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#a98bff] to-[#8a6bff] border-2 border-[#3d3346] shadow-md shadow-purple-200 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
          >
            <span>▶</span>
            <span>Xem nét vẽ</span>
          </button>

          {/* White Ghost Button: Ngẫu nhiên */}
          <button
            type="button"
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-[#8a7d95] bg-white/95 shadow-sm hover:text-[#5d4d70] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
          >
            <span>🎲</span>
            <span>Ngẫu nhiên</span>
          </button>
        </div>
      </div>

      {/* Writing Stage & Side Palette (Designed exactly like user screenshots) */}
      <div className="flex flex-wrap gap-6 justify-center items-start">
        {/* Stage: Mi-tian-ge Canvas */}
        <div
          id="writeStageBox"
          className="relative w-[min(420px,88vw)] aspect-square rounded-[26px] overflow-hidden bg-white/95 shadow-xl shadow-purple-100 ring-2 ring-white select-none touch-none"
        >
          {/* SVG Grid with soft pink borders and dashed cross */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <rect
              x="0.6"
              y="0.6"
              width="98.8"
              height="98.8"
              fill="none"
              stroke="#ffb3c6"
              strokeWidth="1.2"
              rx="6"
            />
            <line
              x1="50"
              y1="0.6"
              x2="50"
              y2="99.4"
              stroke="#ffd0de"
              strokeWidth="0.8"
              strokeDasharray="3 3"
            />
            <line
              x1="0.6"
              y1="50"
              x2="99.4"
              y2="50"
              stroke="#ffd0de"
              strokeWidth="0.8"
              strokeDasharray="3 3"
            />
            <line
              x1="0.6"
              y1="0.6"
              x2="99.4"
              y2="99.4"
              stroke="#ffe8f0"
              strokeWidth="0.6"
              strokeDasharray="3 3"
            />
            <line
              x1="99.4"
              y1="0.6"
              x2="0.6"
              y2="99.4"
              stroke="#ffe8f0"
              strokeWidth="0.6"
              strokeDasharray="3 3"
            />
          </svg>

          {/* Stroke Animation Container - Only active while playing stroke animation */}
          <div
            ref={animContainerRef}
            style={{
              display: isAnimating ? 'flex' : 'none'
            }}
            className="absolute inset-0 z-20 items-center justify-center pointer-events-none"
          />

          {/* Clean KaiTi Calligraphy Character (ONLY shown when showTrace is true and not animating) */}
          {showTrace && !isAnimating && (
            <div
              style={{
                fontFamily: '"KaiTi", "STKaiti", "Kaiti SC", "SimKai", "DFKai-SB", "Noto Serif SC", "Ma Shan Zheng", serif',
                fontSize: 'min(300px, 64vw)',
                color: '#c4b5fd'
              }}
              className="absolute inset-0 z-20 flex items-center justify-center font-normal select-none pointer-events-none leading-none transition-opacity duration-200"
            >
              {currentChar}
            </div>
          )}

          {/* User Drawing Canvas */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="absolute inset-0 w-full h-full z-30 cursor-crosshair touch-none"
          />
        </div>

        {/* Side Tool Palette: BÚT VẼ (as in image_6989f797.png and image_5ae1dc1e.png) */}
        <div className="w-full sm:w-[280px] bg-white/80 backdrop-blur-md rounded-[22px] p-5 shadow-sm border border-purple-100 flex flex-col gap-3.5">
          <h3 className="flex items-center gap-2 text-xs font-extrabold text-[#7a6b88] tracking-wider uppercase">
            <span>🖌️</span>
            <span>BÚT VẼ</span>
          </h3>

          {/* Swatches Row */}
          <div className="flex gap-2.5 items-center flex-wrap">
            {colorPalette.map((item) => {
              const isActive = brushColor === item.code;
              return (
                <div
                  key={item.code}
                  onClick={() => {
                    playSfxClick();
                    setBrushColor(item.code);
                  }}
                  style={{
                    backgroundColor: item.code,
                    boxShadow: isActive ? '0 0 0 3px #a98bff' : '0 2px 8px rgba(0,0,0,.13)'
                  }}
                  title={item.label}
                  className={`w-7 h-7 rounded-full border-2 border-white cursor-pointer transition-transform hover:scale-110 ${
                    isActive ? 'scale-110' : ''
                  }`}
                />
              );
            })}
          </div>

          {/* Action Buttons Row 1 */}
          <div className="flex gap-2 flex-wrap pt-1">
            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-[#7fdcc0] to-[#4fc3a1] shadow-md shadow-teal-100 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>↩️</span>
              <span>Xóa nét vừa viết</span>
            </button>

            <button
              type="button"
              onClick={() => clearCanvas(false)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs text-[#8a7d95] bg-white/95 shadow-xs hover:text-[#5d4d70] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>🧹</span>
              <span>Xóa hết</span>
            </button>
          </div>

          {/* Action Button: Ẩn/Hiện mẫu (pill shape with solid dark border as in image_5ae1dc1e.png) */}
          <div className="flex">
            <button
              type="button"
              onClick={handleToggleTrace}
              className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs sm:text-sm text-[#3d3346] bg-white border-2 border-[#2d2638] shadow-xs hover:bg-purple-50 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>👁️</span>
              <span>{showTrace ? 'Ẩn mẫu' : 'Hiện mẫu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
