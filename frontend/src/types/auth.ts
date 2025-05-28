export enum UserRole {
    CLIENT = 'client',
    PROFESSIONAL = 'professional',
    ADMIN = 'admin',
    PROFESSIONAL_AND_CLIENT = 'professional_and_client'
}

export interface ProfessionalProfile {
    specialties: string[];
    experience: number;
    description: string;
    hourlyRate: number;
    availability: {
        isAvailable: boolean;
        schedule: {
            [key: string]: {
                start: string;
                end: string;
            }[];
        };
    };
    ratings: {
        average: number;
        count: number;
    };
    completedProjects: number;
    activeProjects: number;
}

export interface ClientProfile {
    activeProjects: number;
    completedProjects: number;
    totalSpent: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phoneNumber?: string;
    profilePictureUrl?: string;
    isVerified: boolean;
    isProfessional: boolean;
    professionalProfile?: ProfessionalProfile;
    clientProfile?: ClientProfile;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface RegisterResponse {
    user: User;
    token: string;
}

export interface GoogleLoginRequest {
    token: string;
} 