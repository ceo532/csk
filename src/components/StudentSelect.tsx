import React from 'react';
import { STUDENT_LIST } from '../data/questions';
import { GraduationCap, ArrowRight, UserCheck, Sparkles, BookOpen } from 'lucide-react';

interface StudentSelectProps {
  selectedName: string;
  onSelectName: (name: string) => void;
  onStart: () => void;
}

export const StudentSelect: React.FC<StudentSelectProps> = ({
  selectedName,
  onSelectName,
  onStart
}) => {
  const isReady = Boolean(selectedName && selectedName.trim() !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReady) {
      onStart();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-xl shadow-sky-100/70 border border-sky-100 overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-teal-400 p-6 text-white text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>Tiếng Anh Lớp 7</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Bài Tập Trắc Nghiệm
          </h1>
          <p className="text-sky-100 text-sm sm:text-base font-medium">
            20 câu hỏi luyện tập kiến thức tiếng Anh 7
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <label
              htmlFor="student-name-select"
              className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg"
            >
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span>Chọn tên của em:</span>
            </label>

            <div className="relative">
              <select
                id="student-name-select"
                value={selectedName}
                onChange={(e) => onSelectName(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-800 text-base font-semibold rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition duration-150 cursor-pointer"
              >
                <option value="" disabled>
                  -- Chọn tên của em --
                </option>
                {STUDENT_LIST.map((name) => (
                  <option key={name} value={name} className="py-2 text-slate-800 font-medium">
                    {name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              * Vui lòng chọn đúng tên để lưu kết quả bài tập nhé.
            </p>
          </div>

          {/* Quick info list */}
          <div className="bg-sky-50/80 rounded-xl p-4 border border-sky-100 text-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-sky-900">
              <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Số lượng: <strong>20 câu trắc nghiệm (A, B, C, D)</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-sky-900">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Chấm điểm tự động và xem lại đáp án chi tiết sau khi nộp bài</span>
            </div>
          </div>

          {/* Start Button */}
          <button
            type="submit"
            id="start-quiz-btn"
            disabled={!isReady}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-base sm:text-lg transition-all shadow-md ${
              isReady
                ? 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white cursor-pointer active:scale-[0.99] shadow-indigo-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <span>Bắt đầu làm bài</span>
            <ArrowRight className={`w-5 h-5 ${isReady ? 'animate-pulse' : ''}`} />
          </button>
        </form>
      </div>
    </div>
  );
};
