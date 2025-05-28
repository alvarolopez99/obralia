"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ProfessionalCard from "@/components/ProfessionalCard";
import { FiSearch, FiTool, FiZap, FiDroplet, FiHome, FiEdit, FiKey, FiFeather, FiUsers, FiMapPin, FiCheckCircle, FiClock, FiStar } from "react-icons/fi";
import { BsSnow } from "react-icons/bs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SmartSearch from "@/components/SmartSearch";
import { mockProfessionals } from "@/data/mockProfessionals";
import useSWR from "swr";
import { fetchCategories } from "@/services/categories";

const iconMap: Record<string, any> = {
  "Fontanería": <FiDroplet size={24} />, "Electricidad": <FiZap size={24} />, "Albañilería": <FiTool size={24} />, "Carpintería": <FiUsers size={24} />, "Pintura": <FiEdit size={24} />, "Cerrajería": <FiKey size={24} />, "Jardinería": <FiFeather size={24} />, "Limpieza": <FiTool size={24} />, "Climatización": <BsSnow size={24} />
};

const howItWorks = [
  {
    icon: <FiSearch size={32} className="text-blue-600" />,
    title: "Busca",
    description: "Encuentra el servicio que necesitas y el profesional más cercano a ti en nuestra plataforma."
  },
  {
    icon: <FiCheckCircle size={32} className="text-blue-600" />,
    title: "Compara",
    description: "Revisa perfiles detallados, valoraciones de otros usuarios y precios para elegir el mejor profesional."
  },
  {
    icon: <FiClock size={32} className="text-blue-600" />,
    title: "Contacta",
    description: "Agenda una visita o solicita un presupuesto sin compromiso directamente con el profesional."
  },
  {
    icon: <FiStar size={32} className="text-blue-600" />,
    title: "Valora",
    description: "Comparte tu experiencia y ayuda a otros usuarios a encontrar los mejores profesionales."
  }
];

// Skeleton loader para categorías
function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 bg-gray-100 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-300 mb-4" />
      <div className="h-4 w-20 bg-gray-300 rounded mb-2" />
      <div className="h-3 w-16 bg-gray-200 rounded" />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: categories, isLoading, error } = useSWR("categories", fetchCategories);

  // Sincroniza el filtro con el query param
  useEffect(() => {
    const categoryParam = searchParams.get("category") || "";
    setSelectedCategory(categoryParam);
  }, [searchParams]);

  // Cambia el filtro y actualiza la URL
  const handleCategoryClick = (key: string) => {
    const params = new URLSearchParams();
    if (key) params.set("category", key);
    router.push(`/search?${params.toString()}`);
  };

  // Filtrado de profesionales destacados
  const filteredProfessionals = mockProfessionals.filter((pro) => {
    return !selectedCategory || pro.category === selectedCategory;
  });

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 border-b border-blue-100">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 max-w-3xl leading-tight">
            Encuentra profesionales de confianza para tu proyecto
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
            Obralia conecta a los mejores profesionales de la construcción y mantenimiento con personas que necesitan sus servicios.
          </p>
          <SmartSearch professionals={mockProfessionals} />
        </div>
      </section>

      {/* Categorías */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Qué necesitas hoy?</h2>
            <p className="text-gray-600">Selecciona el servicio que buscas y encuentra profesionales cerca de ti</p>
            <Link 
              href="/search"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mt-4"
            >
              Ver todos los profesionales
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {Array.from({ length: 9 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))}
            </div>
          )}
          {error && <div className="text-center text-red-500">Error al cargar servicios</div>}
          {categories && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-400 transition-all bg-white hover:bg-blue-50 shadow-sm group"
                >
                  <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
                    {iconMap[cat.name] || cat.icon || <FiTool size={24} />}
                  </div>
                  <span className="mt-3 font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cómo funciona Obralia</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Encuentra y contrata profesionales de confianza en solo unos minutos
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href="/como-funciona"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg"
            >
              Conoce más sobre cómo funciona Obralia
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
