'use client';

import { useState } from 'react';
import Image from 'next/image';

// Datos de ejemplo
const mockProfessional = {
  id: 1,
  name: 'Juan Pérez',
  profession: 'Fontanero',
  rating: 4.5,
  totalReviews: 128,
  price: '25€',
  image: '/professionals/plumber.jpg',
  location: 'Madrid Centro',
  verified: true,
  description: 'Fontanero profesional con más de 10 años de experiencia en instalaciones y reparaciones. Especializado en sistemas de calefacción y fontanería doméstica.',
  services: [
    'Reparación de fugas',
    'Instalación de grifos',
    'Desatascos',
    'Mantenimiento preventivo',
    'Instalación de calefacción',
    'Reformas de baños',
  ],
  availability: [
    { day: 'Lunes', hours: '9:00 - 18:00' },
    { day: 'Martes', hours: '9:00 - 18:00' },
    { day: 'Miércoles', hours: '9:00 - 18:00' },
    { day: 'Jueves', hours: '9:00 - 18:00' },
    { day: 'Viernes', hours: '9:00 - 18:00' },
  ],
  reviews: [
    {
      id: 1,
      name: 'María García',
      rating: 5,
      comment: 'Excelente servicio, muy profesional y puntual.',
      date: '2024-02-15',
    },
    {
      id: 2,
      name: 'Carlos López',
      rating: 4,
      comment: 'Buen trabajo, resolvió el problema rápidamente.',
      date: '2024-02-10',
    },
  ],
};

export default function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="relative w-48 h-48 rounded-lg overflow-hidden">
            <Image
              src={mockProfessional.image}
              alt={mockProfessional.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{mockProfessional.name}</h1>
                <p className="text-xl text-gray-600 mb-4">{mockProfessional.profession}</p>
              </div>
              {mockProfessional.verified && (
                <div className="bg-blue-600 text-white p-2 rounded-full">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < mockProfessional.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">
                  {mockProfessional.rating} ({mockProfessional.totalReviews} reseñas)
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {mockProfessional.location}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{mockProfessional.price}</p>
                <p className="text-gray-600">por hora</p>
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contactar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b">
          <nav className="flex">
            <button
              className={`px-6 py-4 font-semibold ${
                activeTab === 'about'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('about')}
            >
              Sobre Mí
            </button>
            <button
              className={`px-6 py-4 font-semibold ${
                activeTab === 'services'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('services')}
            >
              Servicios
            </button>
            <button
              className={`px-6 py-4 font-semibold ${
                activeTab === 'availability'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('availability')}
            >
              Disponibilidad
            </button>
            <button
              className={`px-6 py-4 font-semibold ${
                activeTab === 'reviews'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reseñas
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'about' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Sobre Mí</h2>
              <p className="text-gray-600">{mockProfessional.description}</p>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Servicios Ofrecidos</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {mockProfessional.services.map((service, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {service}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Horario de Disponibilidad</h2>
              <div className="space-y-2">
                {mockProfessional.availability.map((slot, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="font-semibold">{slot.day}</span>
                    <span className="text-gray-600">{slot.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Reseñas de Clientes</h2>
              <div className="space-y-6">
                {mockProfessional.reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">{review.name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 