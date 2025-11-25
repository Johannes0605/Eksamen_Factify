// src/types/quiz.types.ts

export interface Quiz {
  quizId: number;
  title: string;
  description?: string;
  createdBy?: string;
  createdDate?: Date;
  questions: Question[];
}

export interface Question {
  questionId: number;
  quizId: number;
  questionText: string;
  points: number;
  answerOptions: AnswerOption[];
}

export interface AnswerOption {
  answerOptionId: number;
  questionId: number;
  answerText: string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  attemptId: number;
  quizId: number;
  userId: string;
  score: number;
  totalPoints: number;
  completedDate: Date;
  answers: UserAnswer[];
}

export interface UserAnswer {
  userAnswerId: number;
  attemptId: number;
  questionId: number;
  selectedAnswerOptionId: number;
}

export interface User {
  userId: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
}