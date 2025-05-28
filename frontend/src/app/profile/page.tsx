'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { FiUser, FiMail, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-8">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FiLogOut />
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FiUser className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                                        <p className="text-sm text-gray-500">Usuario {user?.userType}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <FiMail className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-600">{user?.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 