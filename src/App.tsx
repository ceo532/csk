import { useState } from 'react';
import { ScreenState } from './types';
import { QUESTIONS } from './data/questions';
import { StudentSelect } from './components/StudentSelect';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResult } from './components/QuizResult';
import { BookOpenCheck } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('select_name');
  const [studentName, setStudentName] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});

  const handleStart = () => {
    if (!studentName) return;
    setAnswers({});
    setCurrentIndex(0);
    setScreen('quiz');
  };

  const handleSelectAnswer = (ans: 'A' | 'B' | 'C' | 'D') => {
    const currentQ = QUESTIONS[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.cau]: ans,
    }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setStudentName('');
    setAnswers({});
    setCurrentIndex(0);
    setScreen('select_name');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToQuestion = (idx: number) => {
    if (idx >= 0 && idx < QUESTIONS.length) {
      setCurrentIndex(idx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentQuestion = QUESTIONS[currentIndex];
  const currentAnswer = answers[currentQuestion?.cau];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-indigo-50/40 text-slate-800 flex flex-col justify-between selection:bg-indigo-100">
      {/* Top Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight block">
                Tiếng Anh Lớp 7
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium leading-none block">
                Trắc Nghiệm 20 Câu • Tự Chấm Điểm
              </span>
            </div>
          </div>

          {screen === 'quiz' && studentName && (
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Đang làm bài:</span>
              <span className="text-xs sm:text-sm font-bold text-indigo-700 block">
                {studentName}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        {screen === 'select_name' && (
          <StudentSelect
            selectedName={studentName}
            onSelectName={setStudentName}
            onStart={handleStart}
          />
        )}

        {screen === 'quiz' && (
          <QuizQuestion
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={QUESTIONS.length}
            studentName={studentName}
            selectedAnswer={currentAnswer}
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
            onJumpToQuestion={handleJumpToQuestion}
          />
        )}

        {screen === 'result' && (
          <QuizResult
            studentName={studentName}
            answers={answers}
            questions={QUESTIONS}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200/60 bg-white/60">
        <p>Hệ thống bài tập trắc nghiệm Tiếng Anh 7 • Chúc các em học tốt!</p>
      </footer>
    </div>
  );
}
