import ProjectDashboard from "@/components/projects/ProjectDashboard";
import Link from "next/link";

export default function ProyectoDashboardPage() {
  return (
    <div>
      <Link href="/proyectos" className="inline-block mb-4 text-blue-600 hover:underline font-medium">← Volver a proyectos</Link>
      <ProjectDashboard />
    </div>
  );
} 