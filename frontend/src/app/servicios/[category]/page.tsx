'use client';

import { useState } from 'react';
import ProfessionalCard from '@/components/ProfessionalCard';

// Datos de ejemplo para cada categoría
const mockProfessionals = {
  fontaneria: [
    {
      id: 1,
      name: 'Juan Pérez',
      profession: 'Fontanero',
      rating: 4.5,
      reviews: 128,
      price: '25€',
      image: '/professionals/plumber.jpg',
      location: 'Madrid Centro',
      verified: true,
    },
    {
      id: 2,
      name: 'María García',
      profession: 'Fontanera',
      rating: 4.8,
      reviews: 95,
      price: '30€',
      image: '/professionals/plumber2.jpg',
      location: 'Madrid Norte',
      verified: true,
    },
  ],
  electricidad: [
    {
      id: 3,
      name: 'Carlos López',
      profession: 'Electricista',
      rating: 4.2,
      reviews: 76,
      price: '28€',
      image: '/professionals/electrician.jpg',
      location: 'Madrid Sur',
      verified: true,
    },
  ],
  // Añade más categorías según necesites
};

const categoryNames = {
  fontaneria: 'Fontanería',
  electricidad: 'Electricidad',
  albanileria: 'Albañilería',
  carpinteria: 'Carpintería',
  pintura: 'Pintura',
  cerrajeria: 'Cerrajería',
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const category = params.category;
  const professionals = mockProfessionals[category as keyof typeof mockProfessionals] || [];

  const filteredProfessionals = professionals
    .filter((professional) =>
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'price') {
        return parseInt(a.price) - parseInt(b.price);
      }
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Profesionales de {categoryNames[category as keyof typeof categoryNames]}
        </h1>
        <p className="text-gray-600">
          Encuentra el profesional perfecto para tu proyecto
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por nombre o ubicación..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Ordenar por valoración</option>
            <option value="price">Ordenar por precio</option>
          </select>
        </div>
      </div>

      {/* Professionals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessionals.map((professional) => (
          <ProfessionalCard
            key={professional.id}
            {...professional}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredProfessionals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No se encontraron profesionales que coincidan con tu búsqueda.</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">¿Eres profesional?</h2>
        <p className="text-gray-600 mb-8">
          Únete a nuestra plataforma y encuentra nuevos clientes
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Regístrate como Profesional
        </button>
      </div>
    </div>
  );
} 