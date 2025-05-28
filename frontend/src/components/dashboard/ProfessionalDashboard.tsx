'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiBriefcase, FiDollarSign, FiFileText, FiClock } from 'react-icons/fi';

export default function ProfessionalDashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            {/* Bienvenida personalizada */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold">¡Hola, {user?.name}!</h1>
                <p className="mt-1 text-blue-100">Bienvenido a tu dashboard. Aquí puedes gestionar tus proyectos y presupuestos.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900">Proyectos Activos</CardTitle>
                        <FiBriefcase className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user?.professionalProfile?.activeProjects || 0}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900">Proyectos Completados</CardTitle>
                        <FiFileText className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user?.professionalProfile?.completedProjects || 0}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900">Total Ganado</CardTitle>
                        <FiDollarSign className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">0,00 €</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="projects" className="space-y-4">
                <TabsList className="bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger value="projects" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Mis Proyectos</TabsTrigger>
                    <TabsTrigger value="budgets" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Presupuestos</TabsTrigger>
                    <TabsTrigger value="invoices" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Facturas</TabsTrigger>
                    <TabsTrigger value="clients" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Clientes</TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="space-y-4">
                    <Card className="bg-white shadow-md">
                        <CardHeader>
                            <CardTitle>Proyectos Activos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-900">No hay proyectos activos en este momento.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="budgets" className="space-y-4">
                    <Card className="bg-white shadow-md">
                        <CardHeader>
                            <CardTitle>Presupuestos Enviados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-900">No hay presupuestos pendientes.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="invoices" className="space-y-4">
                    <Card className="bg-white shadow-md">
                        <CardHeader>
                            <CardTitle>Facturas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-900">No hay facturas disponibles.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="clients" className="space-y-4">
                    <Card className="bg-white shadow-md">
                        <CardHeader>
                            <CardTitle>Mis Clientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-900">No tienes clientes asignados.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 