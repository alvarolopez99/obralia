export interface User {
    id: string;
    email: string;
    name: string;
    userType: string;
    isProfessional?: boolean;
    isVerified?: boolean;
    profilePictureUrl?: string;
    phoneNumber?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    userType: string;
}

export interface GoogleLoginRequest {
    token: string;
} 