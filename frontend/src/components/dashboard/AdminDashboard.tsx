"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiUsers, FiBriefcase, FiBarChart2, FiUserCheck } from "react-icons/fi";

export default function AdminDashboard() {
  // Aquí puedes traer datos reales con SWR o fetch si tienes endpoints de admin
  const stats = {
    totalUsers: 1200,
    totalProfessionals: 340,
    totalProjects: 560,
    activeProjects: 42,
  };

  return (
    <div className="space-y-6">
      {/* Bienvenida personalizada */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="mt-1 text-indigo-100">Resumen de la plataforma y gestión global.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <FiUsers className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profesionales</CardTitle>
            <FiUserCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProfessionals}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Totales</CardTitle>
            <FiBriefcase className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
            <FiBarChart2 className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
          </CardContent>
        </Card>
      </div>

      {/* Aquí puedes añadir más secciones: tablas de usuarios, últimos proyectos, etc. */}
      <div className="mt-8">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Gestión rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Ver y gestionar usuarios</li>
              <li>Ver y gestionar profesionales</li>
              <li>Ver y gestionar proyectos</li>
              <li>Acceso a estadísticas avanzadas</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 