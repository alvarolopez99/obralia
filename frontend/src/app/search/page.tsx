"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ProfessionalCard from "@/components/ProfessionalCard";
import { FiStar, FiTrendingUp, FiClock, FiX } from "react-icons/fi";
import { mockProfessionals } from "@/data/mockProfessionals";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categoryNames: { [key: string]: string } = {
  fontaneria: 'Fontanería',
  electricidad: 'Electricidad',
  albanileria: 'Albañilería',
  carpinteria: 'Carpintería',
  pintura: 'Pintura',
  cerrajeria: 'Cerrajería',
  jardineria: 'Jardinería',
  limpieza: 'Limpieza',
};

type SortOption = 'recommended' | 'rating' | 'recent';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const location = searchParams.get("location");
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Efecto para cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Inicializar categorías seleccionadas desde la URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(','));
    }
  }, [searchParams]);

  // Actualizar URL cuando cambian las categorías
  const updateCategories = (categories: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categories.length > 0) {
      params.set("category", categories.join(','));
    } else {
      params.delete("category");
    }
    router.push(`/search?${params.toString()}`);
  };

  // Manejar selección/deselección de categorías
  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    updateCategories(newCategories);
  };

  // Filtrar profesionales según los parámetros
  let filteredProfessionals = mockProfessionals.filter((pro) => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(pro.category);
    const matchesLocation = !location || pro.location.toLowerCase().includes(location.toLowerCase());
    return matchesCategory && matchesLocation;
  });

  // Ordenar profesionales según el criterio seleccionado
  filteredProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
        return b.id - a.id;
      case 'recommended':
      default:
        const scoreA = a.rating * Math.log(a.reviews + 1);
        const scoreB = b.rating * Math.log(b.reviews + 1);
        return scoreB - scoreA;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedCategories.length === 0 
              ? 'Mostrando todos los profesionales del sector'
              : selectedCategories.length === 1
                ? `Mostrando profesionales de ${categoryNames[selectedCategories[0]]}`
                : `Mostrando profesionales de ${selectedCategories.length} categorías`
            }
          </h1>
          {location && (
            <p className="text-gray-600 mt-2">
              en {location}
            </p>
          )}
        </div>

        {/* Filtros y ordenación */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Categorías disponibles */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryNames).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => toggleCategory(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${selectedCategories.includes(key)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Ordenación */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>Ordenar por:</span>
                <span className="text-blue-600">
                  {sortBy === 'recommended' && 'Recomendados'}
                  {sortBy === 'rating' && 'Mejor valorados'}
                  {sortBy === 'recent' && 'Más recientes'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10"
                  >
                    <button
                      onClick={() => {
                        setSortBy('recommended');
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                        ${sortBy === 'recommended' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                    >
                      Recomendados
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('rating');
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                        ${sortBy === 'rating' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                    >
                      Mejor valorados
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('recent');
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                        ${sortBy === 'recent' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                    >
                      Más recientes
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Categorías seleccionadas */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              {selectedCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  {categoryNames[category]}
                  <FiX size={14} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.length > 0 ? (
            filteredProfessionals.map((pro) => (
              <ProfessionalCard 
                key={pro.id}
                id={pro.id.toString()}
                name={pro.name}
                profession={pro.profession}
                rating={pro.rating}
                reviews={pro.reviews}
                price={pro.price}
                image={pro.image}
                location={pro.location}
                verified={pro.verified}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">
                No se encontraron profesionales que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 