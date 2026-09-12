import React, { useEffect, useRef, useState } from 'react';
import { Question } from '../types';
import { WEBHOOK_URL } from '../data/questions';
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Award, 
  Sparkles, 
  User, 
  Check, 
  X,
  Filter
} from 'lucide-react';

interface QuizResultProps {
  studentName: string;
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  questions: Question[];
  onRestart: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  studentName,
  answers,
  questions,
  onRestart,
}) => {
  const hasSentRef = useRef(false);
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'wrong'>('all');

  // Calculate score
  const correctCount = questions.reduce((acc, q) => {
    return answers[q.cau] === q.dapAn ? acc + 1 : acc;
  }, 0);

  const total = questions.length;
  const wrongCount = total - correctCount;
  const percentage = Math.round((correctCount / total) * 100);

  // Send score to Google Sheet / Telegram Webhook immediately on mount
  useEffect(() => {
    if (hasSentRef.current) return;
    hasSentRef.current = true;

    const payload = {
      ten: studentName,
      lop: '7',
      diem: correctCount,
      tongCau: total,
      url: window.location.href,
    };

    console.log('[QuizResult] Sending results to webhook:', payload);

    // CRITICAL: Header must be 'text/plain;charset=utf-8' to avoid CORS preflight OPTIONS rejection
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const text = await response.text().catch(() => '');
        console.log('[QuizResult] Webhook submitted successfully:', response.status, text);
      })
      .catch((error) => {
        // As required: do not show error on screen, just log to console
        console.error('[QuizResult] Webhook submission failed (silent log):', error);
      });
  }, [studentName, correctCount, total]);

  // Encouragement message for grade 7 students
  const getEncouragement = (score: number) => {
    if (score >= 18) {
      return {
        title: 'Xuất sắc lắm em ơi! 🎉',
        desc: 'Kiến thức tiếng Anh lớp 7 của em vô cùng vững vàng!',
        bg: 'from-amber-400 via-orange-400 to-rose-400',
        textColor: 'text-amber-700',
      };
    }
    if (score >= 14) {
      return {
        title: 'Rất tốt! Làm bài giỏi lắm! 👏',
        desc: 'Em đã nắm rất chắc phần lớn kiến thức rồi đấy!',
        bg: 'from-emerald-400 via-teal-500 to-sky-500',
        textColor: 'text-emerald-700',
      };
    }
    if (score >= 10) {
      return {
        title: 'Khá tốt! Cố gắng thêm nhé! 💪',
        desc: 'Xem lại các câu làm sai bên dưới để rút kinh nghiệm nhé!',
        bg: 'from-sky-400 to-indigo-500',
        textColor: 'text-sky-700',
      };
    }
    return {
      title: 'Đừng nản lòng, cùng ôn tập lại nhé! 🌟',
      desc: 'Hãy đọc kỹ lại các câu sai bên dưới và thử làm lại một lần nữa nha!',
      bg: 'from-indigo-400 to-purple-500',
      textColor: 'text-indigo-700',
    };
  };

  const encouragement = getEncouragement(correctCount);

  const filteredQuestions = questions.filter((q) => {
    const isCorrect = answers[q.cau] === q.dapAn;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'wrong') return !isCorrect;
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Score Overview Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-sky-100/60 border border-sky-100 overflow-hidden text-center">
        <div className={`bg-gradient-to-r ${encouragement.bg} p-6 sm:p-8 text-white relative`}>
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kết quả bài làm</span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2 text-white/95 text-base sm:text-lg font-medium">
            <User className="w-4 h-4" />
            <span>Học sinh: <strong>{studentName}</strong> • Lớp 7</span>
          </div>

          {/* Core Score Requirement: "Em đúng X/20 câu" */}
          <div className="my-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-xs">
              Em đúng {correctCount}/{total} câu
            </h1>
            <p className="text-white/90 text-base sm:text-lg font-semibold mt-1">
              Đạt tỉ lệ: {percentage}%
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-xs max-w-md mx-auto rounded-xl p-3 text-white">
            <h2 className="font-bold text-lg mb-0.5">{encouragement.title}</h2>
            <p className="text-xs sm:text-sm text-white/90">{encouragement.desc}</p>
          </div>
        </div>

        {/* Quick Stats & Restart Action */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-lg">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Đúng: {correctCount} câu</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-100/80 px-3 py-1 rounded-lg">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Sai: {wrongCount} câu</span>
            </span>
          </div>

          <button
            type="button"
            id="restart-quiz-top-btn"
            onClick={onRestart}
            className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-sm transition active:scale-[0.99] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại từ đầu</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Chi tiết từng câu hỏi</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              type="button"
              id="filter-all-btn"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({total})
            </button>
            <button
              type="button"
              id="filter-correct-btn"
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                filterMode === 'correct'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Check className="w-3 h-3 text-emerald-600" />
              Đúng ({correctCount})
            </button>
            <button
              type="button"
              id="filter-wrong-btn"
              onClick={() => setFilterMode('wrong')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                filterMode === 'wrong'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <X className="w-3 h-3 text-rose-600" />
              Sai ({wrongCount})
            </button>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-3.5">
          {filteredQuestions.map((q) => {
            const studentChoice = answers[q.cau];
            const isCorrect = studentChoice === q.dapAn;

            return (
              <div
                key={q.cau}
                className={`bg-white rounded-xl p-4 sm:p-5 border-2 transition-all ${
                  isCorrect
                    ? 'border-emerald-200 shadow-xs hover:border-emerald-300'
                    : 'border-rose-200 shadow-xs hover:border-rose-300'
                }`}
              >
                {/* Header status */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Câu {q.cau}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        Đúng
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />
                        Sai
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    Đáp án chuẩn: <strong className="text-slate-800 font-bold">{q.dapAn}</strong>
                  </span>
                </div>

                {/* Question Prompt */}
                <p className="text-slate-900 font-semibold text-sm sm:text-base leading-relaxed mb-3">
                  {q.hoi}
                </p>

                {/* 4 Choices Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  {(['A', 'B', 'C', 'D'] as const).map((key) => {
                    const text = q[key];
                    const isStudentPick = studentChoice === key;
                    const isKeyCorrect = q.dapAn === key;

                    let cardStyle = 'bg-slate-50 border-slate-200 text-slate-700';
                    let badgeStyle = 'bg-slate-200 text-slate-700';

                    if (isKeyCorrect) {
                      cardStyle = 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium';
                      badgeStyle = 'bg-emerald-600 text-white';
                    } else if (isStudentPick && !isCorrect) {
                      cardStyle = 'bg-rose-50/80 border-rose-300 text-rose-950';
                      badgeStyle = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left ${cardStyle}`}
                      >
                        <span className={`w-5 h-5 shrink-0 flex items-center justify-center font-bold text-xs rounded-md ${badgeStyle}`}>
                          {key}
                        </span>
                        <span className="flex-1 truncate" title={text}>
                          {text}
                        </span>
                        {isStudentPick && (
                          <span className="text-[10px] uppercase font-bold tracking-tight px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 shrink-0">
                            Em chọn
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Restart Button */}
        <div className="pt-4 pb-8 flex justify-center">
          <button
            type="button"
            id="restart-quiz-bottom-btn"
            onClick={onRestart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md transition active:scale-[0.99] cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Làm lại từ đầu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
