'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { FiUser, FiMail, FiPhone, FiCalendar, FiShield, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Gestiona tu información personal y preferencias
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="p-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        {user?.profilePictureUrl ? (
                                            <img
                                                src={user.profilePictureUrl}
                                                alt={user.name}
                                                className="w-32 h-32 rounded-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="w-16 h-16 text-blue-600" />
                                        )}
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                                    <p className="text-sm text-gray-500 capitalize">{user?.userType}</p>
                                    <div className="mt-4 w-full">
                                        <Button
                                            variant="outline"
                                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={handleLogout}
                                        >
                                            <FiLogOut className="mr-2" />
                                            Cerrar sesión
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Información Personal
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-900">{user?.email}</p>
                                        </div>
                                    </div>
                                    {user?.phoneNumber && (
                                        <div className="flex items-center">
                                            <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Teléfono</p>
                                                <p className="text-gray-900">{user.phoneNumber}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Tipo de cuenta</p>
                                            <p className="text-gray-900 capitalize">{user?.userType}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Account Status */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Estado de la Cuenta
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <FiShield className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Verificación</p>
                                            <p className="text-gray-900">
                                                {user?.isVerified ? (
                                                    <span className="text-green-600">Cuenta verificada</span>
                                                ) : (
                                                    <span className="text-yellow-600">Pendiente de verificación</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    {user?.isProfessional && (
                                        <div className="flex items-center">
                                            <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Estado profesional</p>
                                                <p className="text-green-600">Cuenta profesional activa</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Button className="flex-1">Editar perfil</Button>
                                {!user?.isProfessional && (
                                    <Button variant="outline" className="flex-1">
                                        Convertir en profesional
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 