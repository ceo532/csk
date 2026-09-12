import React from 'react';
import { Question } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle2, User, HelpCircle, Send } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  studentName: string;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  onSelectAnswer: (answer: 'A' | 'B' | 'C' | 'D') => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onJumpToQuestion: (index: number) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  currentIndex,
  totalQuestions,
  studentName,
  selectedAnswer,
  answers,
  onSelectAnswer,
  onNext,
  onPrev,
  onSubmit,
  onJumpToQuestion,
}) => {
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const hasSelected = Boolean(selectedAnswer);
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[] = [
    { key: 'A', text: question.A },
    { key: 'B', text: question.B },
    { key: 'C', text: question.C },
    { key: 'D', text: question.D },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Top Student Badge & Progress Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 font-semibold text-xs sm:text-sm px-3 py-1.5 rounded-full border border-indigo-100">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>Học sinh: <strong>{studentName}</strong> (Lớp 7)</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Câu {currentIndex + 1} / {totalQuestions}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Tiến độ: {progressPercent}%</span>
            <span>Đã làm: {answeredCount}/{totalQuestions} câu</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-md border border-slate-200 space-y-6">
        {/* Question Header */}
        <div className="space-y-2">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Question {question.cau}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {question.hoi}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {options.map(({ key, text }) => {
            const isChosen = selectedAnswer === key;
            return (
              <button
                key={key}
                type="button"
                id={`option-${key}-btn`}
                onClick={() => onSelectAnswer(key)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-center gap-3.5 cursor-pointer ${
                  isChosen
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30 text-slate-800'
                }`}
              >
                {/* Option Letter Pill */}
                <span
                  className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold text-sm rounded-lg transition-colors ${
                    isChosen
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {key}
                </span>

                {/* Option Text */}
                <span className="text-base sm:text-lg font-medium flex-1">
                  {text}
                </span>

                {/* Selection indicator */}
                {isChosen && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          {currentIndex > 0 && (
            <button
              type="button"
              id="prev-question-btn"
              onClick={onPrev}
              className="flex items-center justify-center gap-2 py-3 px-4 sm:px-5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm sm:text-base transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Câu trước</span>
            </button>
          )}

          {isLastQuestion ? (
            <button
              type="button"
              id="submit-quiz-btn"
              disabled={!hasSelected}
              onClick={onSubmit}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-base sm:text-lg transition shadow-md ${
                hasSelected
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white cursor-pointer active:scale-[0.99] shadow-emerald-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <span>Nộp bài</span>
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="next-question-btn"
              disabled={!hasSelected}
              onClick={onNext}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-base sm:text-lg transition shadow-md ${
                hasSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white cursor-pointer active:scale-[0.99] shadow-indigo-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <span>Câu tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mini Question Map / Jump Bar */}
      <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-slate-200/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">Danh sách 20 câu hỏi:</span>
          <span className="text-xs text-slate-500">Bấm số câu để chuyển nhanh</span>
        </div>
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
          {Array.from({ length: totalQuestions }, (_, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = answers[idx + 1] !== undefined;

            let style = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
            if (isCurrent) {
              style = 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-300';
            } else if (isAnswered) {
              style = 'bg-sky-100 text-sky-800 font-semibold hover:bg-sky-200';
            }

            return (
              <button
                key={idx}
                type="button"
                id={`jump-question-${idx + 1}-btn`}
                onClick={() => onJumpToQuestion(idx)}
                className={`h-7 sm:h-8 rounded-lg text-xs flex items-center justify-center transition cursor-pointer ${style}`}
                title={`Câu ${idx + 1}${isAnswered ? ' (Đã chọn)' : ''}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
