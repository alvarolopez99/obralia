"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLock, FiHome, FiBriefcase } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../types/auth';
import toast from 'react-hot-toast';

type UserType = 'client' | 'professional';

export default function LoginPage() {
    const router = useRouter();
    const { login, error, loading, clearError } = useAuth();
    const [userType, setUserType] = useState<UserType>('client');
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        try {
            await login(formData);
            toast.success('¡Sesión iniciada correctamente!');
            router.push('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Columna izquierda - Imagen y texto */}
                    <div className="hidden md:block relative bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h1 className="text-4xl font-bold mb-6">Bienvenido a Obralia</h1>
                                <p className="text-lg text-blue-100 mb-8">
                                    {userType === 'client' 
                                        ? 'Encuentra los mejores profesionales para tus proyectos y gestiona tus presupuestos de forma sencilla.'
                                        : 'Gestiona tu negocio, conecta con clientes y crece tu cartera de proyectos.'}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                        <FiHome className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold">Clientes</h3>
                                        <p className="text-sm text-blue-100">Encuentra profesionales, guarda favoritos y gestiona tus proyectos</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                        <FiBriefcase className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold">Profesionales</h3>
                                        <p className="text-sm text-blue-100">Gestiona tu agenda, clientes y crece tu negocio</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Formulario */}
                    <div className="p-8 md:p-12">
                        <div className="max-w-sm mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                                </h2>
                                <p className="text-gray-600">
                                    {isLogin 
                                        ? 'Bienvenido de nuevo a Obralia'
                                        : 'Únete a la comunidad de Obralia'}
                                </p>
                            </div>

                            {/* Selector de tipo de usuario */}
                            <div className="flex gap-4 mb-8">
                                <button
                                    onClick={() => setUserType('client')}
                                    className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-colors ${
                                        userType === 'client'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <FiHome className="inline-block mr-2" />
                                    Cliente
                                </button>
                                <button
                                    onClick={() => setUserType('professional')}
                                    className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-colors ${
                                        userType === 'professional'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <FiBriefcase className="inline-block mr-2" />
                                    Profesional
                                </button>
                            </div>

                            {/* Botón de Google */}
                            <button
                                className="w-full py-3 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6"
                                onClick={() => {
                                    // TODO: Implementar login con Google
                                    console.log('Google login clicked');
                                }}
                            >
                                <FcGoogle className="w-5 h-5" />
                                Continuar con Google
                            </button>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">o continúa con email</span>
                                </div>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="text-sm text-red-700">{error}</div>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-2 focus:border-blue-600 focus:outline-none bg-white text-gray-900 placeholder-gray-600 transition-colors"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-2 focus:border-blue-600 focus:outline-none bg-white text-gray-900 placeholder-gray-600 transition-colors"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {isLogin && (
                                    <div className="flex items-center justify-end">
                                        <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    {isLogin
                                        ? '¿No tienes cuenta? Regístrate'
                                        : '¿Ya tienes cuenta? Inicia sesión'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 