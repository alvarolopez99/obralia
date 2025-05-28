'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types/auth';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import ProfessionalDashboard from '@/components/dashboard/ProfessionalDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

export default function DashboardPage() {
    const { user } = useAuth();

    const renderDashboard = () => {
        if (!user) return null;

        switch (user.role) {
            case UserRole.ADMIN:
                return <AdminDashboard />;
            case UserRole.PROFESSIONAL:
                return <ProfessionalDashboard />;
            case UserRole.CLIENT:
                return <ClientDashboard />;
            case UserRole.PROFESSIONAL_AND_CLIENT:
                return (
                    <Tabs defaultValue="professional" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="professional">Panel Profesional</TabsTrigger>
                            <TabsTrigger value="client">Panel Cliente</TabsTrigger>
                        </TabsList>
                        <TabsContent value="professional">
                            <ProfessionalDashboard />
                        </TabsContent>
                        <TabsContent value="client">
                            <ClientDashboard />
                        </TabsContent>
                    </Tabs>
                );
            default:
                return <ClientDashboard />;
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Bienvenido a tu panel de control
                        </p>
                    </div>
                    {renderDashboard()}
                </div>
            </div>
        </ProtectedRoute>
    );
} 