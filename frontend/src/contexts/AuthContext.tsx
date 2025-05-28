'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginRequest, RegisterRequest, GoogleLoginRequest } from '../types/auth';
import { authService } from '../services/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (request: LoginRequest) => Promise<void>;
    register: (request: RegisterRequest) => Promise<void>;
    loginWithGoogle: (request: GoogleLoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Error checking auth:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (request: LoginRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.login(request);
            setUser(response.user);
            router.push('/profile');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error al iniciar sesión');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (request: RegisterRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.register(request);
            setUser(response.user);
            router.push('/profile');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error al registrarse');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async (request: GoogleLoginRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.loginWithGoogle(request);
            setUser(response.user);
            router.push('/profile');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error al iniciar sesión con Google');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        loginWithGoogle,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 