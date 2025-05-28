"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiUsers, FiCalendar, FiFileText, FiDollarSign, FiMessageCircle, FiClipboard, FiUserCheck, FiActivity } from "react-icons/fi";

const mockProject = {
  id: "1",
  name: "Reforma cocina",
  status: "En progreso",
  startDate: "2024-06-01",
  endDate: "2024-07-15",
  participants: ["Ana", "Carlos"],
  budgets: [
    { id: 1, amount: 1200, status: "Pendiente", date: "2024-06-02" },
    { id: 2, amount: 1350, status: "Aceptado", date: "2024-06-03" },
  ],
  invoices: [
    { id: 1, amount: 1350, status: "Pagada", date: "2024-07-16" },
  ],
  messages: [
    { id: 1, author: "Ana", text: "¿Cuándo empiezan las obras?", date: "2024-06-01" },
    { id: 2, author: "Carlos", text: "El lunes a las 9:00", date: "2024-06-01" },
  ],
  notes: [
    { id: 1, text: "Revisar el color de los azulejos." },
  ],
  timeline: [
    { date: "2024-06-01", label: "Proyecto creado" },
    { date: "2024-06-03", label: "Presupuesto aceptado" },
    { date: "2024-06-10", label: "Inicio de obra" },
  ],
};

export default function ProjectDashboard() {
  const [tab, setTab] = useState("resumen");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{mockProject.name}</h1>
        <div className="flex items-center gap-4 text-gray-700 text-sm mb-2">
          <span className="flex items-center gap-1"><FiCalendar /> {mockProject.startDate} - {mockProject.endDate}</span>
          <span className="flex items-center gap-1"><FiUsers /> {mockProject.participants.join(", ")}</span>
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-600 bg-blue-50">{mockProject.status}</span>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg mb-4">
          <TabsTrigger value="resumen" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-bold text-gray-700 flex items-center gap-1"><FiClipboard /> Resumen</TabsTrigger>
          <TabsTrigger value="budgets" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-bold text-gray-700 flex items-center gap-1"><FiDollarSign /> Presupuestos</TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-bold text-gray-700 flex items-center gap-1"><FiFileText /> Facturas</TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-bold text-gray-700 flex items-center gap-1"><FiMessageCircle /> Mensajes</TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-bold text-gray-700 flex items-center gap-1"><FiClipboard /> Notas</TabsTrigger>
          <TabsTrigger value="professionals" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-bold text-gray-700 flex items-center gap-1"><FiUserCheck /> Profesionales</TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-bold text-gray-700 flex items-center gap-1"><FiActivity /> Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="resumen">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Resumen del proyecto</h2>
            <ul className="list-disc pl-5 text-gray-900 space-y-1">
              <li>Estado: {mockProject.status}</li>
              <li>Fechas: {mockProject.startDate} - {mockProject.endDate}</li>
              <li>Participantes: {mockProject.participants.join(", ")}</li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="budgets">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Presupuestos</h2>
            <ul className="divide-y divide-gray-200">
              {mockProject.budgets.map(b => (
                <li key={b.id} className="py-2 flex items-center justify-between">
                  <span className="text-gray-900 font-medium">{b.amount} €</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{b.status}</span>
                  <span className="text-xs text-gray-500">{b.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="invoices">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Facturas</h2>
            <ul className="divide-y divide-gray-200">
              {mockProject.invoices.map(i => (
                <li key={i.id} className="py-2 flex items-center justify-between">
                  <span className="text-gray-900 font-medium">{i.amount} €</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">{i.status}</span>
                  <span className="text-xs text-gray-500">{i.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="messages">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Mensajes</h2>
            <ul className="space-y-2">
              {mockProject.messages.map(m => (
                <li key={m.id} className="flex flex-col">
                  <span className="font-semibold text-blue-700">{m.author}</span>
                  <span className="text-gray-900">{m.text}</span>
                  <span className="text-xs text-gray-500">{m.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="notes">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Notas y sugerencias</h2>
            <ul className="space-y-2">
              {mockProject.notes.map(n => (
                <li key={n.id} className="text-gray-900">{n.text}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="professionals">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Profesionales asignados</h2>
            <ul className="space-y-2">
              {mockProject.participants.map((p, i) => (
                <li key={i} className="text-gray-900">{p}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="timeline">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Timeline</h2>
            <ul className="space-y-2">
              {mockProject.timeline.map((t, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-gray-900 font-medium">{t.label}</span>
                  <span className="text-xs text-gray-500">{t.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 