export interface Question {
  cau: number;
  hoi: string;
  A: string;
  B: string;
  C: string;
  D: string;
  dapAn: 'A' | 'B' | 'C' | 'D';
}

export type StudentName = 'Bảo Khuê' | 'Duy Sang' | 'Minh Chi';

export type ScreenState = 'select_name' | 'quiz' | 'result';

export interface QuizSubmissionData {
  ten: string;
  lop: string;
  diem: number;
  tongCau: number;
  url: string;
}
