'use client';

import { useState } from 'react';
import ProfessionalCard from '@/components/ProfessionalCard';

// Datos de ejemplo
const mockProfessionals = [
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
    profession: 'Electricista',
    rating: 4.8,
    reviews: 95,
    price: '30€',
    image: '/professionals/electrician.jpg',
    location: 'Madrid Norte',
    verified: true,
  },
  {
    id: 3,
    name: 'Carlos López',
    profession: 'Albañil',
    rating: 4.2,
    reviews: 76,
    price: '28€',
    image: '/professionals/builder.jpg',
    location: 'Madrid Sur',
    verified: false,
  },
  // Añade más profesionales según necesites
];

export default function ProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Todos',
    'Fontanería',
    'Electricidad',
    'Albañilería',
    'Carpintería',
    'Pintura',
    'Cerrajería',
  ];

  const filteredProfessionals = mockProfessionals.filter((professional) => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || selectedCategory === '' || 
                          professional.profession === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Profesionales</h1>
        <p className="text-gray-600">
          Encuentra el profesional perfecto para tu proyecto
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre o profesión..."
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

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
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
    </div>
  );
} 