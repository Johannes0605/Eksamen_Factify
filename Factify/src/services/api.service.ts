// src/services/api.service.ts
import { Quiz, LoginRequest, RegisterRequest, AuthResponse } from '../types/quiz.types';

const VITE_API = (import.meta as any).env?.VITE_API_URL;
const API_BASE_URL = (VITE_API ? `${String(VITE_API).replace(/\/$/, '')}/api` : 'https://localhost:5001/api');

class ApiService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
  }

  async register(data: any): Promise<AuthResponse> {
    // Backend RegisterRequest only expects: username, email, password
    // Strip confirmPassword if present (validation done on frontend)
    const { username, email, password } = data;
    const body = { username, email, password };
    
    const response = await fetch(`${API_BASE_URL}/account/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Registration error:', response.status, errorData);
      throw new Error(errorData?.message || 'Registration failed');
    }
    const result = await response.json();
    localStorage.setItem('authToken', result.token);
    return result;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Quiz endpoints
  async getAllQuizzes(): Promise<Quiz[]> {
    const response = await fetch(`${API_BASE_URL}/quiz`, {
      headers: this.getAuthHeader()
    });
    
    if (!response.ok) throw new Error('Failed to fetch quizzes');
    return response.json();
  }

  async getQuizById(id: number): Promise<Quiz> {
    const token = localStorage.getItem('authToken');
    const url = token ? `${API_BASE_URL}/quiz/${id}` : `${API_BASE_URL}/quiz/public/${id}`;
    const response = await fetch(url, token ? { headers: this.getAuthHeader() } : undefined);

    if (!response.ok) throw new Error('Failed to fetch quiz');
    return response.json();
  }

  // Public quizzes (demo) - no auth required
  async getPublicQuizzes(): Promise<Quiz[]> {
    const response = await fetch(`${API_BASE_URL}/quiz/public`);
    if (!response.ok) throw new Error('Failed to fetch public quizzes');
    return response.json();
  }

  async createQuiz(quiz: Omit<Quiz, 'quizId'>): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/quiz`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(quiz)
    });
    
    if (!response.ok) throw new Error('Failed to create quiz');
    return response.json();
  }

  async updateQuiz(id: number, quiz: Quiz): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/quiz/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify(quiz)
    });
    
    if (!response.ok) throw new Error('Failed to update quiz');
  }

  async deleteQuiz(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/quiz/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    
    if (!response.ok) throw new Error('Failed to delete quiz');
  }

  // TakeQuiz endpoints (juster basert på din TakeQuizController)
  async submitQuizAttempt(quizId: number, answers: any): Promise<any> {
    // Backend expects a body { QuizId, SelectedAnswers }
    const body = { QuizId: quizId, SelectedAnswers: Array.isArray(answers) ? answers : answers?.answers || [] };
    const response = await fetch(`${API_BASE_URL}/takequiz/submit`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(body)
    });
    
    if (!response.ok) throw new Error('Failed to submit quiz');
    return response.json();
  }
}

export default new ApiService();