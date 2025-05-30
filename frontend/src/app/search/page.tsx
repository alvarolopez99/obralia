"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ProfessionalCard from "@/components/ProfessionalCard";
import { FiX } from "react-icons/fi";
import { mockProfessionals } from "@/data/mockProfessionals";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from 'fuse.js';

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
  const search = searchParams.get("search");
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Configuración de Fuse.js para búsqueda fuzzy
  const fuse = new Fuse(mockProfessionals, {
    keys: [
      { name: 'name', weight: 2 },
      { name: 'profession', weight: 2 },
      { name: 'category', weight: 1.5 },
      { name: 'location', weight: 1 }
    ],
    threshold: 0.4,
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 2,
    location: 0,
    distance: 100,
    useExtendedSearch: true
  });

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

  // Función para calcular la similitud entre dos strings
  const calculateSimilarity = (str1: string, str2: string) => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Si uno contiene al otro, es una buena coincidencia
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Si comparten más del 70% de caracteres, es una buena coincidencia
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    
    if (longerLength === 0) return 1.0;
    
    const editDistance = (str1: string, str2: string) => {
      const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
      for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
      for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
      for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
          const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
          matrix[j][i] = Math.min(
            matrix[j][i - 1] + 1,
            matrix[j - 1][i] + 1,
            matrix[j - 1][i - 1] + substitutionCost
          );
        }
      }
      return matrix[str2.length][str1.length];
    };

    const distance = editDistance(s1, s2);
    return 1 - (distance / longerLength);
  };

  // Filtrar profesionales
  const filteredProfessionals = useMemo(() => {
    let filtered = mockProfessionals;

    // Si hay búsqueda y no es "Todos los profesionales", filtrar por profesión
    if (search && search !== 'Todos los profesionales') {
      const searchTerm = search.toLowerCase().trim();
      filtered = filtered.filter(professional => {
        const similarity = calculateSimilarity(searchTerm, professional.profession);
        return similarity > 0.7; // Umbral de similitud
      });
    }

    // Filtrar por categoría si está seleccionada
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(professional => selectedCategories.includes(professional.category));
    }

    // Filtrar por ubicación si está seleccionada
    if (location) {
      const locationLower = location.toLowerCase();
      filtered = filtered.filter(professional => {
        const professionalLocation = professional.location.toLowerCase();
        return professionalLocation === locationLower || 
               professionalLocation.includes(locationLower);
      });
    }

    return filtered;
  }, [search, selectedCategories, location]);

  // Efecto para actualizar la URL cuando no hay resultados
  useEffect(() => {
    if (search && search !== 'Todos los profesionales' && filteredProfessionals.length === mockProfessionals.length) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", "Todos los profesionales");
      router.push(`/search?${params.toString()}`);
    }
  }, [search, filteredProfessionals.length, router, searchParams, mockProfessionals.length]);

  // Ordenar profesionales según el criterio seleccionado
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
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
            {search
              ? `Resultados para "${search}"`
              : selectedCategories.length === 0 
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
          {sortedProfessionals.length > 0 ? (
            sortedProfessionals.map((pro) => (
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
                {search
                  ? `No se encontraron resultados para "${search}". Intenta con otros términos o revisa la ortografía.`
                  : "No se encontraron profesionales que coincidan con tu búsqueda."}
              </p>
              {search && (
                <div className="mt-4">
                  <p className="text-gray-500 mb-2">Sugerencias:</p>
                  <ul className="text-gray-600">
                    <li>• Verifica la ortografía de las palabras</li>
                    <li>• Intenta con términos más generales</li>
                    <li>• Prueba con sinónimos</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 