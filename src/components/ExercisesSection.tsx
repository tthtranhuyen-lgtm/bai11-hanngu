import React, { useState } from 'react';
import { EX1_DATA, EX2_DATA, EX3_DATA } from '../data/chineseData';
import { playSfxClick, playSfxSuccess, playSfxMiss, playSentence } from '../utils/audioPlayer';
import { CheckCircle2, RotateCcw, Volume2, Sparkles } from 'lucide-react';

interface ExercisesSectionProps {
  exerciseTab: 'ex1' | 'ex2' | 'ex3';
}

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({ exerciseTab }) => {
  // ===================== EXERCISE 1 STATE =====================
  const [ex1Answers, setEx1Answers] = useState<Record<number, string>>({});
  const [ex1Checked, setEx1Checked] = useState<boolean>(false);
  const [ex1Score, setEx1Score] = useState<number>(0);

  const handleEx1Select = (idx: number, val: string) => {
    playSfxClick();
    setEx1Answers((prev) => ({ ...prev, [idx]: val }));
    setEx1Checked(false);
  };

  const handleEx1Check = () => {
    playSfxClick();
    let correct = 0;
    EX1_DATA.forEach((item, idx) => {
      if (ex1Answers[idx] === item.ans) correct++;
    });
    setEx1Score(correct);
    setEx1Checked(true);

    if (correct === EX1_DATA.length) {
      playSfxSuccess();
    } else {
      playSfxMiss();
    }
  };

  const handleEx1Reset = () => {
    playSfxClick();
    setEx1Answers({});
    setEx1Checked(false);
    setEx1Score(0);
  };

  // Word bank options for Ex 1
  const allEx1Options = Array.from(new Set(EX1_DATA.flatMap((item) => item.opt)));

  // ===================== EXERCISE 2 STATE =====================
  const [ex2Answers, setEx2Answers] = useState<Record<number, number>>({});
  const ex2AnsweredCount = Object.keys(ex2Answers).length;
  const ex2CorrectCount = Object.entries(ex2Answers).filter(
    ([idx, ans]) => EX2_DATA[parseInt(idx, 10)].ans === ans
  ).length;

  const handleEx2Choose = (qIdx: number, optIdx: number) => {
    if (ex2Answers[qIdx] !== undefined) return;
    playSfxClick();
    setEx2Answers((prev) => ({ ...prev, [qIdx]: optIdx }));

    if (EX2_DATA[qIdx].ans === optIdx) {
      playSfxSuccess();
    } else {
      playSfxMiss();
    }
  };

  const handleEx2Reset = () => {
    playSfxClick();
    setEx2Answers({});
  };

  // ===================== EXERCISE 3 STATE =====================
  interface Ex3ItemState {
    placed: Array<{ t: string; p: string; id: number }>;
    pool: Array<{ t: string; p: string; id: number; used: boolean }>;
  }

  const initEx3State = (): Ex3ItemState[] => {
    return EX3_DATA.map((item) => ({
      placed: [],
      pool: [...item.words]
        .map((w, id) => ({ ...w, id, used: false }))
        .sort(() => 0.5 - Math.random())
    }));
  };

  const [ex3State, setEx3State] = useState<Ex3ItemState[]>(initEx3State);
  const [ex3Checked, setEx3Checked] = useState(false);
  const [ex3Score, setEx3Score] = useState(0);

  const handleEx3ClickPool = (qIdx: number, wordId: number) => {
    playSfxClick();
    setEx3State((prev) => {
      const next = [...prev];
      const item = { ...next[qIdx] };
      const poolWord = item.pool.find((w) => w.id === wordId);
      if (!poolWord || poolWord.used) return prev;

      poolWord.used = true;
      item.placed = [...item.placed, poolWord];
      next[qIdx] = item;
      return next;
    });
    setEx3Checked(false);
  };

  const handleEx3ClickPlaced = (qIdx: number, wordId: number) => {
    playSfxClick();
    setEx3State((prev) => {
      const next = [...prev];
      const item = { ...next[qIdx] };
      item.placed = item.placed.filter((w) => w.id !== wordId);
      const poolWord = item.pool.find((w) => w.id === wordId);
      if (poolWord) poolWord.used = false;
      next[qIdx] = item;
      return next;
    });
    setEx3Checked(false);
  };

  const handleEx3Check = () => {
    playSfxClick();
    let correct = 0;
    ex3State.forEach((state, idx) => {
      const userSentence = state.placed.map((w) => w.t).join('');
      if (EX3_DATA[idx].ans.includes(userSentence)) {
        correct++;
      }
    });
    setEx3Score(correct);
    setEx3Checked(true);

    if (correct === EX3_DATA.length) {
      playSfxSuccess();
    } else {
      playSfxMiss();
    }
  };

  const handleEx3Reset = () => {
    playSfxClick();
    setEx3State(initEx3State());
    setEx3Checked(false);
    setEx3Score(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===================== EXERCISE 1 ===================== */}
      {exerciseTab === 'ex1' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
            <div>
              <h3 className="text-xl font-extrabold text-gray-800">
                📝 Bài tập 1: Điền từ vào chỗ trống
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Chọn từ thích hợp từ bảng từ để hoàn thành câu hội thoại.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-xl bg-purple-100 text-purple-700 font-extrabold text-sm">
                Điểm: {ex1Score} / {EX1_DATA.length}
              </span>
            </div>
          </div>

          {/* Word Bank */}
          <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100">
            <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2.5">
              📦 Bảng từ gợi ý (Word Bank)
            </h4>
            <div className="flex flex-wrap gap-2">
              {allEx1Options.map((opt, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-purple-800 font-bold text-sm border border-purple-200 shadow-xs"
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-4">
            {EX1_DATA.map((item, idx) => {
              const parts = item.text.split('___');
              const userVal = ex1Answers[idx] || '';
              const isCorrect = userVal === item.ans;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                    ex1Checked
                      ? isCorrect
                        ? 'bg-emerald-50/80 border-emerald-300'
                        : 'bg-rose-50/80 border-rose-300'
                      : 'bg-white border-purple-100'
                  }`}
                >
                  <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>

                  <div className="flex-1 space-y-1">
                    <div className="text-base sm:text-lg font-bold text-gray-800 flex flex-wrap items-center gap-2">
                      <span>{parts[0]}</span>
                      <select
                        value={userVal}
                        onChange={(e) => handleEx1Select(idx, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-sm border-2 transition-all cursor-pointer ${
                          ex1Checked
                            ? isCorrect
                              ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                              : 'border-rose-400 bg-rose-100 text-rose-800'
                            : 'border-purple-200 bg-white text-purple-700 focus:border-purple-400'
                        }`}
                      >
                        <option value="">-- chọn từ --</option>
                        {item.opt.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <span>{parts[1]}</span>
                    </div>

                    <div className="text-xs sm:text-sm text-purple-500 font-medium">
                      {item.py}
                    </div>

                    {ex1Checked && !isCorrect && (
                      <div className="text-xs font-bold text-emerald-600 mt-1">
                        Đáp án đúng: <b>{item.ans}</b>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playSfxClick();
                      playSentence(item.text.replace('___', item.ans));
                    }}
                    title="Nghe phát âm chuẩn câu này"
                    className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center justify-center shrink-0 transition hover:scale-110 shadow-xs mt-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleEx1Check}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-md transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kiểm tra kết quả</span>
            </button>

            <button
              onClick={handleEx1Reset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================== EXERCISE 2 ===================== */}
      {exerciseTab === 'ex2' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
            <div>
              <h3 className="text-xl font-extrabold text-gray-800">
                🎯 Bài tập 2: Câu hỏi trắc nghiệm
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Chọn phương án chính xác nhất điền vào chỗ trống.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-xl bg-purple-100 text-purple-700 font-extrabold text-sm">
                Điểm: {ex2CorrectCount} / {EX2_DATA.length}
              </span>
              <button
                onClick={handleEx2Reset}
                title="Làm lại tất cả câu hỏi"
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {EX2_DATA.map((item, qIdx) => {
              const selectedOpt = ex2Answers[qIdx];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div
                  key={qIdx}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    isAnswered
                      ? selectedOpt === item.ans
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-rose-50/70 border-rose-300'
                      : 'bg-white border-purple-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="text-base sm:text-lg font-bold text-gray-800">
                      <b>{qIdx + 1}.</b> {item.q}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playSfxClick();
                        playSentence(item.q.replace('___', item.opts[item.ans].t));
                      }}
                      title="Nghe phát âm chuẩn câu này"
                      className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center justify-center shrink-0 transition hover:scale-110 shadow-xs"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-purple-500 font-medium mb-3.5">
                    {item.py}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.opts.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrect = optIdx === item.ans;
                      const isChosen = optIdx === selectedOpt;

                      let btnStyle = 'bg-white border-purple-100 hover:border-purple-300 text-gray-700';
                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'bg-rose-100 border-rose-400 text-rose-900';
                        } else {
                          btnStyle = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleEx2Choose(qIdx, optIdx)}
                          className={`p-3 rounded-xl border-2 text-left flex items-center justify-between transition-all ${btnStyle}`}
                        >
                          <div>
                            <span className="font-extrabold mr-2">{letter}.</span>
                            <span className="text-base font-bold">{opt.t}</span>
                          </div>
                          <span className="text-xs text-purple-500 font-medium">{opt.p}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {ex2AnsweredCount === EX2_DATA.length && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
              <span className="font-bold text-purple-800 text-base">
                🎉 Bạn đã hoàn thành trắc nghiệm! Đúng {ex2CorrectCount}/{EX2_DATA.length} câu.
              </span>
            </div>
          )}
        </div>
      )}

      {/* ===================== EXERCISE 3 ===================== */}
      {exerciseTab === 'ex3' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
            <div>
              <h3 className="text-xl font-extrabold text-gray-800">
                🧩 Bài tập 3: Sắp xếp các từ thành câu đúng
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Nhấp vào từ ở dưới để đưa vào câu, nhấp lại vào từ trên câu để gỡ ra.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-xl bg-purple-100 text-purple-700 font-extrabold text-sm">
                Điểm: {ex3Score} / {EX3_DATA.length}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {EX3_DATA.map((item, qIdx) => {
              const state = ex3State[qIdx];
              const userSentence = state.placed.map((w) => w.t).join('');
              const isCorrect = item.ans.includes(userSentence);

              return (
                <div
                  key={qIdx}
                  className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
                    ex3Checked
                      ? isCorrect
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-rose-50/70 border-rose-300'
                      : 'bg-white border-purple-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs sm:text-sm text-gray-500 italic">
                      💡 Nghĩa: {item.hint}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playSfxClick();
                        playSentence(item.ans[0]);
                      }}
                      title="Nghe phát âm chuẩn câu này"
                      className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center justify-center shrink-0 transition hover:scale-110 shadow-xs"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Answer Area */}
                  <div className="min-h-12 p-2.5 rounded-xl bg-purple-50/50 border-2 border-dashed border-purple-200 flex flex-wrap gap-2 items-center">
                    {state.placed.length === 0 ? (
                      <span className="text-xs text-gray-400 italic">
                        (Nhấp vào các từ bên dưới để ghép câu vào đây...)
                      </span>
                    ) : (
                      state.placed.map((word) => (
                        <button
                          key={word.id}
                          onClick={() => handleEx3ClickPlaced(qIdx, word.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-sm shadow-xs flex flex-col items-center hover:bg-emerald-200 transition"
                        >
                          <span>{word.t}</span>
                          {word.p && <span className="text-[10px] text-emerald-600">{word.p}</span>}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Words Pool */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {state.pool.map((word) => (
                      <button
                        key={word.id}
                        disabled={word.used}
                        onClick={() => handleEx3ClickPool(qIdx, word.id)}
                        className={`px-3 py-1.5 rounded-xl border font-bold text-sm flex flex-col items-center transition ${
                          word.used
                            ? 'opacity-20 pointer-events-none bg-gray-100 border-gray-200'
                            : 'bg-white border-purple-200 text-purple-800 hover:border-purple-400 hover:bg-purple-50 shadow-xs'
                        }`}
                      >
                        <span>{word.t}</span>
                        {word.p && <span className="text-[10px] text-purple-400">{word.p}</span>}
                      </button>
                    ))}
                  </div>

                  {ex3Checked && !isCorrect && (
                    <div className="text-xs font-bold text-emerald-700 pt-1">
                      Đáp án đúng: <b>{item.ans[0]}</b>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleEx3Check}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-md transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kiểm tra đáp án</span>
            </button>

            <button
              onClick={handleEx3Reset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
