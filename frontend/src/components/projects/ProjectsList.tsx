"use client";

import Link from "next/link";
import { FiPlus, FiUsers, FiCalendar, FiChevronRight, FiCheckCircle, FiClock } from "react-icons/fi";

const mockProjects = [
  {
    id: "1",
    name: "Reforma cocina",
    status: "En progreso",
    startDate: "2024-06-01",
    endDate: "2024-07-15",
    participants: ["Ana", "Carlos"],
  },
  {
    id: "2",
    name: "Pintura salón",
    status: "Pendiente",
    startDate: "2024-07-20",
    endDate: "2024-07-25",
    participants: ["Luis"],
  },
  {
    id: "3",
    name: "Instalación aire acondicionado",
    status: "Finalizado",
    startDate: "2024-05-10",
    endDate: "2024-05-12",
    participants: ["Marta", "Pedro"],
  },
];

const statusColor = {
  "En progreso": "text-blue-600 bg-blue-50",
  "Pendiente": "text-yellow-700 bg-yellow-50",
  "Finalizado": "text-green-700 bg-green-50",
};

export default function ProjectsList() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Proyectos</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <FiPlus /> Nuevo proyecto
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 truncate">{project.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[project.status as keyof typeof statusColor]}`}>{project.status}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-700 text-sm">
              <span className="flex items-center gap-1"><FiCalendar /> {project.startDate} - {project.endDate}</span>
              <span className="flex items-center gap-1"><FiUsers /> {project.participants.length} participantes</span>
            </div>
            <div className="flex justify-end mt-2">
              <Link href={`/proyectos/${project.id}`} className="flex items-center gap-1 text-blue-600 font-medium hover:underline">
                Ver proyecto <FiChevronRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 