import React from 'react';
import { GRAMMAR_DATA } from '../data/chineseData';
import { playSentence, playSfxClick } from '../utils/audioPlayer';
import { Volume2, BookOpen } from 'lucide-react';

export const GrammarSection: React.FC = () => {
  const handlePlaySentence = (text: string) => {
    playSfxClick();
    playSentence(text, 0.85);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Trọng điểm Ngữ pháp Bài 11
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Các mẫu câu và hiện tượng ngữ pháp quan trọng trong bài: Giới thiệu & Đại từ số nhiều
        </p>
      </div>

      <div className="space-y-6">
        {GRAMMAR_DATA.map((item, idx) => (
          <div
            key={idx}
            className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border-t-4 border-t-purple-500 border border-purple-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                #{idx + 1}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {item.title}
              </h3>
            </div>

            <div className="inline-block px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-dashed border-purple-300 font-bold text-xs sm:text-sm my-2">
              {item.formula}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mt-1 mb-4">
              {item.desc}
            </p>

            {/* Special Comparison Table for Point 3 matching image_68b7d579 */}
            {idx === 2 ? (
              <div className="mt-4 mb-2 overflow-x-auto rounded-2xl border border-gray-200/90 bg-white shadow-xs">
                <div className="p-4 bg-gradient-to-r from-teal-50/70 via-purple-50/50 to-pink-50/60 border-b border-gray-200">
                  <h4 className="text-lg sm:text-xl font-bold text-[#0c4a60] flex items-center gap-2 font-rounded">
                    <span>📊</span>
                    <span>Bảng So Sánh Trực Tiếp 一下儿 và 一会儿</span>
                  </h4>
                </div>

                <table className="w-full text-left text-sm border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-700">
                      <th className="py-3 px-4 font-bold text-gray-800 w-[22%] border-r border-gray-200">
                        Tiêu chí
                      </th>
                      <th className="py-3 px-4 font-extrabold text-purple-700 w-[39%] border-r border-gray-200">
                        一下儿 <span className="text-xs font-semibold text-purple-500">(yíxiàr)</span>
                      </th>
                      <th className="py-3 px-4 font-extrabold text-indigo-700 w-[39%]">
                        一会儿 <span className="text-xs font-semibold text-indigo-500">(yíhuìr)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {/* Row 1: Từ loại */}
                    <tr className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-200 bg-gray-50/40">
                        Từ loại
                      </td>
                      <td className="py-3 px-4 border-r border-gray-200">
                        Bổ ngữ động lượng
                      </td>
                      <td className="py-3 px-4">
                        Danh từ chỉ thời gian
                      </td>
                    </tr>

                    {/* Row 2: Vị trí */}
                    <tr className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-200 bg-gray-50/40">
                        Vị trí
                      </td>
                      <td className="py-3 px-4 border-r border-gray-200">
                        Luôn đứng <strong className="font-extrabold text-purple-700">sau</strong> động từ
                      </td>
                      <td className="py-3 px-4">
                        Linh hoạt (trước/sau động từ,...)
                      </td>
                    </tr>

                    {/* Row 3: Cấu trúc */}
                    <tr className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-200 bg-gray-50/40">
                        Cấu trúc
                      </td>
                      <td className="py-3 px-4 border-r border-gray-200 font-mono text-purple-700 font-bold">
                        V + 一下儿
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-700 font-bold">
                        (一会儿) + V / V + (了) + 一会儿
                      </td>
                    </tr>

                    {/* Row 4: Nhấn mạnh */}
                    <tr className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-200 bg-gray-50/40">
                        Nhấn mạnh
                      </td>
                      <td className="py-3 px-4 border-r border-gray-200">
                        Hành động xảy ra <strong className="font-extrabold text-purple-700">nhanh, ngắn</strong>
                      </td>
                      <td className="py-3 px-4">
                        <strong className="font-extrabold text-indigo-700">Khoảng thời gian</strong> diễn ra hành động
                      </td>
                    </tr>

                    {/* Row 5: Ví dụ */}
                    <tr className="hover:bg-purple-50/30 transition-colors bg-purple-50/20">
                      <td className="py-3.5 px-4 font-bold text-gray-800 border-r border-gray-200 bg-gray-50/40">
                        Ví dụ
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-bold text-gray-900 text-base">我问一下儿老师。</span>
                            <span className="text-gray-500 text-xs block sm:inline sm:ml-1">(Tôi hỏi giáo viên một chút.)</span>
                          </div>
                          <button
                            onClick={() => handlePlaySentence('我问一下儿老师。')}
                            title="Nghe câu: 我问一下儿老师。"
                            className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center justify-center shrink-0 transition hover:scale-110 shadow-xs"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-bold text-gray-900 text-base">我要学习一会儿。</span>
                            <span className="text-gray-500 text-xs block sm:inline sm:ml-1">(Tôi muốn học một lát.)</span>
                          </div>
                          <button
                            onClick={() => handlePlaySentence('我要学习一会儿。')}
                            title="Nghe câu: 我要学习一会儿。"
                            className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center justify-center shrink-0 transition hover:scale-110 shadow-xs"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null}

            {/* Examples List */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-purple-500 tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>CÂU VÍ DỤ MINH HỌA</span>
              </div>

              {item.ex.map((exItem, eIdx) => (
                <div
                  key={eIdx}
                  className="p-3.5 rounded-xl bg-purple-50/50 hover:bg-white border border-purple-100 flex items-start justify-between gap-3 transition-colors group"
                >
                  <div className="flex-1">
                    <div className="text-base font-bold text-gray-800">
                      {exItem.zh}
                    </div>
                    <div className="text-xs font-semibold text-purple-500 mt-0.5">
                      {exItem.py}
                    </div>
                    <div className="text-xs text-gray-500 italic mt-0.5">
                      {exItem.vn}
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlaySentence(exItem.zh)}
                    title="Nghe phát âm"
                    className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center justify-center shrink-0 transition hover:scale-110 shadow-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
