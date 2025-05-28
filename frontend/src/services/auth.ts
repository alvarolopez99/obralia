import { GoogleLoginRequest, LoginRequest } from '@/types/auth';
import { RegisterRequest, User } from '@/types/auth';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const authService = {
    async login(request: LoginRequest): Promise<{ user: User }> {
        const response = await axios.post(`${API_URL}/auth/login`, request, {
            withCredentials: true // Importante: permite el envío de cookies
        });
        return response.data;
    },

    async register(request: RegisterRequest): Promise<{ user: User }> {
        const response = await axios.post(`${API_URL}/auth/register`, request, {
            withCredentials: true
        });
        return response.data;
    },

    async loginWithGoogle(request: GoogleLoginRequest): Promise<{ user: User }> {
        const response = await axios.post(`${API_URL}/auth/google-login`, request, {
            withCredentials: true
        });
        return response.data;
    },

    async logout(): Promise<void> {
        await axios.post(`${API_URL}/auth/logout`, {}, {
            withCredentials: true
        });
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return null;
        }
    },

    isAuthenticated(): boolean {
        // No podemos verificar directamente si hay un token porque es HTTP-only
        // En su lugar, podemos hacer una petición a /auth/me y ver si responde con éxito
        return false; // Esto se manejará en el AuthContext
    }
}; 