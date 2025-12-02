// src/services/api.service.ts
import { Quiz, LoginRequest, RegisterRequest, AuthResponse } from '../types/quiz.types';

const VITE_API = (import.meta as any).env?.VITE_API_URL;
const API_BASE_URL = (VITE_API ? `${String(VITE_API).replace(/\/$/, '')}/api` : 'https://localhost:5001/api');

class ApiService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token');
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
    localStorage.setItem('token', data.token);
    return data;
  }

  async register(data: any): Promise<AuthResponse> {
    // Extract only fields expected by backend API
    // confirmPassword is frontend-only (not sent to server)
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
    localStorage.setItem('token', result.token);
    return result;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
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
    // Include auth token if available (for owned quizzes)
    // but also work without token (for public quiz viewing)
    const token = localStorage.getItem('token');
    const headers = token ? this.getAuthHeader() : { 'Content-Type': 'application/json' };
    
    const response = await fetch(`${API_BASE_URL}/quiz/${id}`, {
      headers
    });

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

  async duplicateQuiz(id: number): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/quiz/${id}/duplicate`, {
      method: 'POST',
      headers: this.getAuthHeader()
    });
    
    if (!response.ok) throw new Error('Failed to duplicate quiz');
    return response.json();
  }

  // Submit quiz answers for grading
  async submitQuizAttempt(quizId: number, answers: any): Promise<any> {
    // Format request to match backend DTO expectations
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