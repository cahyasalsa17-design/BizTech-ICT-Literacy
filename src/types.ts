export interface ModuleContent {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: string;
  subTopics: {
    title: string;
    text: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    timeLimit?: number; // seconds
  }[];
}

export type AppView = 'home' | 'module-list' | 'module-detail' | 'quiz' | 'glossary' | 'about' | 'auth' | 'profile' | 'teacher-dashboard' | 'certificate';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher';
  scores: Record<string, number>;
  progress: Record<string, number>;
  createdAt: any;
}
