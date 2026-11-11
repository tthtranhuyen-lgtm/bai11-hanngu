import React, { useState, useEffect, useRef } from 'react';
import { VOCAB_WORDS, VocabWord } from '../data/chineseData';
import { playWord, playSfxSlice, playSfxMiss, playSfxSuccess, playSfxClick } from '../utils/audioPlayer';
import { Swords, Brain, Pause, Play, RotateCcw, Heart } from 'lucide-react';

export const GameSection: React.FC = () => {
  const [gameMode, setGameMode] = useState<'ninja' | 'memory'>('ninja');

  // ===================== MEMORY GAME STATE =====================
  interface MemoryCard {
    uid: string;
    wordId: string;
    type: 'hanzi' | 'pinyin';
    text: string;
    subText?: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [memoryWin, setMemoryWin] = useState(false);

  const initMemoryGame = () => {
    // Pick 8 random words
    const shuffledWords = [...VOCAB_WORDS].sort(() => 0.5 - Math.random()).slice(0, 8);
    const cards: MemoryCard[] = [];

    shuffledWords.forEach((w) => {
      cards.push({
        uid: `${w.id}-h`,
        wordId: w.id,
        type: 'hanzi',
        text: w.h,
        subText: w.m,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        uid: `${w.id}-p`,
        wordId: w.id,
        type: 'pinyin',
        text: w.p,
        subText: w.m,
        isFlipped: false,
        isMatched: false
      });
    });

    cards.sort(() => 0.5 - Math.random());
    setMemoryCards(cards);
    setFlippedCardIds([]);
    setMatchedPairs(0);
    setMemoryWin(false);
  };

  useEffect(() => {
    if (gameMode === 'memory') {
      initMemoryGame();
    }
  }, [gameMode]);

  const handleCardClick = (card: MemoryCard) => {
    if (card.isFlipped || card.isMatched || flippedCardIds.length >= 2) return;
    playSfxClick();

    const newFlipped = [...flippedCardIds, card.uid];
    setFlippedCardIds(newFlipped);

    setMemoryCards((prev) =>
      prev.map((c) => (c.uid === card.uid ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      const firstCard = memoryCards.find((c) => c.uid === newFlipped[0]);
      const secondCard = card;

      if (firstCard && firstCard.wordId === secondCard.wordId) {
        // Matched!
        setTimeout(() => {
          playSfxSuccess();
          playWord(secondCard.wordId);
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.wordId === secondCard.wordId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCardIds([]);
          setMatchedPairs((count) => {
            const nextCount = count + 1;
            if (nextCount === 8) {
              setMemoryWin(true);
            }
            return nextCount;
          });
        }, 300);
      } else {
        // Not matched
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.uid) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCardIds([]);
        }, 900);
      }
    }
  };

  // ===================== WORD NINJA STATE =====================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [isNinjaPlaying, setIsNinjaPlaying] = useState(false);
  const [isNinjaPaused, setIsNinjaPaused] = useState(false);
  const [isNinjaGameOver, setIsNinjaGameOver] = useState(false);

  const gameState = useRef<{
    score: number;
    lives: number;
    combo: number;
    lastSliceTime: number;
    fruits: Array<{
      text: string;
      pinyin: string;
      word: VocabWord;
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      rotation: number;
      vr: number;
      color: number;
    }>;
    particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: number;
      life: number;
      size: number;
    }>;
    trail: Array<{ x: number; y: number; life: number }>;
    spawnTimer: number;
    lastTime: number;
    rafId: number | null;
    isPointerDown: boolean;
    lastPointerPos: { x: number; y: number } | null;
  }>({
    score: 0,
    lives: 3,
    combo: 0,
    lastSliceTime: 0,
    fruits: [],
    particles: [],
    trail: [],
    spawnTimer: 0,
    lastTime: 0,
    rafId: null,
    isPointerDown: false,
    lastPointerPos: null
  });

  const startNinjaGame = () => {
    playSfxClick();
    const st = gameState.current;
    st.score = 0;
    st.lives = 3;
    st.combo = 0;
    st.fruits = [];
    st.particles = [];
    st.trail = [];
    st.spawnTimer = 0;
    st.lastTime = performance.now();

    setScore(0);
    setLives(3);
    setCombo(0);
    setIsNinjaGameOver(false);
    setIsNinjaPaused(false);
    setIsNinjaPlaying(true);

    if (st.rafId) cancelAnimationFrame(st.rafId);
    st.rafId = requestAnimationFrame(ninjaLoop);
  };

  const pauseNinjaGame = () => {
    playSfxClick();
    setIsNinjaPaused(true);
    if (gameState.current.rafId) cancelAnimationFrame(gameState.current.rafId);
  };

  const resumeNinjaGame = () => {
    playSfxClick();
    setIsNinjaPaused(false);
    gameState.current.lastTime = performance.now();
    gameState.current.rafId = requestAnimationFrame(ninjaLoop);
  };

  const ninjaLoop = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const st = gameState.current;
    const dt = time - st.lastTime;
    st.lastTime = time;

    // Update
    st.spawnTimer -= dt;
    if (st.spawnTimer <= 0 && st.fruits.length < 5) {
      const randWord = VOCAB_WORDS[Math.floor(Math.random() * VOCAB_WORDS.length)];
      const radius = 45;
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = canvas.height + radius;
      const vx = ((canvas.width / 2 - x) * (0.6 + Math.random() * 0.4)) / 100;
      const vy = -(9 + Math.random() * 3.5);

      st.fruits.push({
        text: randWord.h,
        pinyin: randWord.p,
        word: randWord,
        x,
        y,
        vx,
        vy,
        radius,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.08,
        color: Math.floor(Math.random() * 360)
      });
      st.spawnTimer = 900 + Math.random() * 400;
    }

    // Move fruits
    for (let i = st.fruits.length - 1; i >= 0; i--) {
      const f = st.fruits[i];
      f.x += f.vx;
      f.y += f.vy;
      f.vy += 0.16; // gravity
      f.rotation += f.vr;

      if (f.y > canvas.height + f.radius && f.vy > 0) {
        st.fruits.splice(i, 1);
        st.lives -= 1;
        setLives(st.lives);
        playSfxMiss();

        if (st.lives <= 0) {
          setIsNinjaPlaying(false);
          setIsNinjaGameOver(true);
          return;
        }
      }
    }

    // Move particles
    for (let i = st.particles.length - 1; i >= 0; i--) {
      const p = st.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.life -= 0.025;
      if (p.life <= 0) st.particles.splice(i, 1);
    }

    // Trail life
    for (let i = st.trail.length - 1; i >= 0; i--) {
      st.trail[i].life -= dt * 0.004;
      if (st.trail[i].life <= 0) st.trail.splice(i, 1);
    }

    // Combo timeout
    if (st.combo > 0 && performance.now() - st.lastSliceTime > 800) {
      st.combo = 0;
      setCombo(0);
    }

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw blade trail
    if (st.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(st.trail[0].x, st.trail[0].y);
      for (let i = 1; i < st.trail.length; i++) {
        ctx.lineTo(st.trail[i].x, st.trail[i].y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw fruits
    st.fruits.forEach((f) => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rotation);

      // Bubble background
      ctx.beginPath();
      ctx.arc(0, 0, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${f.color}, 80%, 55%, 0.25)`;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = `hsla(${f.color}, 90%, 75%, 1)`;
      ctx.stroke();

      // Hanzi
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "Segoe UI", "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.text, 0, -6);

      // Pinyin
      ctx.fillStyle = `hsla(${f.color}, 95%, 85%, 1)`;
      ctx.font = 'bold 13px "Segoe UI", sans-serif';
      ctx.fillText(f.pinyin, 0, 18);

      ctx.restore();
    });

    // Draw particles
    st.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.color}, 90%, 70%, 1)`;
      ctx.fill();
      ctx.restore();
    });

    st.rafId = requestAnimationFrame(ninjaLoop);
  };

  const handlePointerDownNinja = (e: React.PointerEvent<HTMLCanvasElement>) => {
    gameState.current.isPointerDown = true;
    gameState.current.lastPointerPos = null;
  };

  const handlePointerUpNinja = () => {
    gameState.current.isPointerDown = false;
    gameState.current.lastPointerPos = null;
  };

  const handlePointerMoveNinja = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isNinjaPlaying || isNinjaPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const st = gameState.current;
    if (st.lastPointerPos) {
      checkSlice(st.lastPointerPos.x, st.lastPointerPos.y, x, y);
      st.trail.push({ x, y, life: 1.0 });
      if (st.trail.length > 20) st.trail.shift();
    }
    st.lastPointerPos = { x, y };
  };

  const checkSlice = (x1: number, y1: number, x2: number, y2: number) => {
    const st = gameState.current;
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(1, Math.ceil(dist / 10));

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = x1 + (x2 - x1) * t;
      const cy = y1 + (y2 - y1) * t;

      for (let i = st.fruits.length - 1; i >= 0; i--) {
        const f = st.fruits[i];
        if (Math.hypot(cx - f.x, cy - f.y) < f.radius) {
          // Sliced!
          playSfxSlice();
          playWord(f.word);

          const now = performance.now();
          if (now - st.lastSliceTime < 800) {
            st.combo += 1;
          } else {
            st.combo = 1;
          }
          st.lastSliceTime = now;
          setCombo(st.combo);

          const pts = st.combo > 1 ? 10 * st.combo : 10;
          st.score += pts;
          setScore(st.score);

          // Spawn burst particles
          for (let p = 0; p < 15; p++) {
            st.particles.push({
              x: f.x,
              y: f.y,
              vx: (Math.random() - 0.5) * 14,
              vy: (Math.random() - 0.5) * 14 - 3,
              color: f.color,
              life: 1.0,
              size: Math.random() * 4 + 2
            });
          }

          st.fruits.splice(i, 1);
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameState.current.rafId) cancelAnimationFrame(gameState.current.rafId);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            playSfxClick();
            setGameMode('ninja');
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all ${
            gameMode === 'ninja'
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-purple-200'
              : 'bg-white/80 text-gray-600 hover:text-purple-600'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>⚔️ Word Ninja</span>
        </button>

        <button
          onClick={() => {
            playSfxClick();
            setGameMode('memory');
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all ${
            gameMode === 'memory'
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-purple-200'
              : 'bg-white/80 text-gray-600 hover:text-purple-600'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>🧠 Memory Match</span>
        </button>
      </div>

      {/* ===================== MODE 1: WORD NINJA ===================== */}
      {gameMode === 'ninja' && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900 via-slate-900 to-black shadow-2xl border-4 border-purple-900/40 select-none">
          {/* Top HUD */}
          <div className="absolute top-0 inset-x-0 p-4 sm:p-5 flex items-center justify-between text-white font-bold z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div className="flex items-center gap-4 text-base sm:text-lg">
              <span className="flex items-center gap-1.5 text-amber-300">
                ⭐ Điểm: <b>{score}</b>
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>{lives}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 pointer-events-auto">
              {combo > 1 && (
                <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black animate-bounce shadow-md">
                  COMBO x{combo}!
                </span>
              )}
              {isNinjaPlaying && (
                <button
                  onClick={isNinjaPaused ? resumeNinjaGame : pauseNinjaGame}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition border border-white/30"
                >
                  {isNinjaPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDownNinja}
            onPointerMove={handlePointerMoveNinja}
            onPointerUp={handlePointerUpNinja}
            className="w-full h-[450px] sm:h-[500px] block cursor-crosshair touch-none"
          />

          {/* Overlay when not playing */}
          {!isNinjaPlaying && !isNinjaGameOver && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-20">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-3xl shadow-xl mb-4">
                ⚔️
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Word Ninja</h2>
              <p className="text-gray-300 text-sm max-w-sm mb-6 leading-relaxed">
                Chém các bóng chữ Hán và Pinyin đang bay lên. Khi chém trúng sẽ lập tức phát âm thanh chuẩn bản xứ!
              </p>
              <button
                onClick={startNinjaGame}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-base shadow-xl shadow-purple-900/50 hover:scale-105 transition-all"
              >
                Bắt đầu chơi ngay 🎮
              </button>
            </div>
          )}

          {/* Paused Overlay */}
          {isNinjaPaused && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-20">
              <h3 className="text-2xl font-bold text-white mb-4">Đang tạm dừng</h3>
              <button
                onClick={resumeNinjaGame}
                className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md"
              >
                Tiếp tục chơi ▶
              </button>
            </div>
          )}

          {/* Game Over Overlay */}
          {isNinjaGameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-20">
              <h2 className="text-3xl font-black text-rose-400 mb-2">Kết Thúc Lượt Chơi!</h2>
              <p className="text-gray-300 text-base mb-2">
                Tổng điểm đạt được: <b className="text-amber-300 text-2xl">{score}</b>
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Chém chuẩn xác giúp bạn vừa phản xạ vừa nghe chuẩn giọng bản xứ!
              </p>
              <button
                onClick={startNinjaGame}
                className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-base shadow-xl hover:scale-105 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Chơi lại</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===================== MODE 2: MEMORY MATCH ===================== */}
      {gameMode === 'memory' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Lật thẻ ghép đôi Chữ Hán & Pinyin
              </h3>
              <p className="text-xs text-gray-500">
                Tìm cặp chữ Hán tương ứng với phiên âm Pinyin. Ghép đúng sẽ phát âm thanh từ vựng!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-100 text-purple-700">
                Cặp đúng: {matchedPairs} / 8
              </span>
              <button
                onClick={initMemoryGame}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                title="Làm mới bàn chơi"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
            {memoryCards.map((card) => (
              <div
                key={card.uid}
                onClick={() => handleCardClick(card)}
                className={`aspect-square [perspective:1000px] cursor-pointer select-none ${
                  card.isMatched ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <div
                  className={`relative w-full h-full rounded-2xl transition-transform duration-500 [transform-style:preserve-3d] shadow-sm ${
                    card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* Card Back (Hidden) */}
                  <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-sm hover:scale-102 transition-transform">
                    ?
                  </div>

                  {/* Card Front (Revealed) */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-white border-2 border-purple-300 flex flex-col items-center justify-center p-2 text-center shadow-md">
                    <span
                      className={`font-bold leading-tight ${
                        card.type === 'hanzi'
                          ? 'text-xl sm:text-2xl text-pink-600'
                          : 'text-sm sm:text-base text-purple-700'
                      }`}
                    >
                      {card.text}
                    </span>
                    {card.subText && (
                      <span className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                        {card.subText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Win Modal */}
          {memoryWin && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-center animate-fade-in">
              <h4 className="text-xl font-bold text-emerald-800 mb-1">
                🎉 Chúc mừng bạn đã hoàn thành xuất sắc!
              </h4>
              <p className="text-sm text-emerald-600 mb-4">
                Bạn đã ghi nhớ chuẩn xác các cặp chữ Hán và phiên âm Pinyin Bài 11.
              </p>
              <button
                onClick={initMemoryGame}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
              >
                Chơi ván mới 🔄
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
