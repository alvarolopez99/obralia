"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ProfessionalCard from "@/components/ProfessionalCard";
import { FiSearch, FiTool, FiZap, FiDroplet, FiHome, FiEdit, FiKey, FiFeather, FiUsers, FiMapPin, FiCheckCircle, FiClock, FiStar } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const categories = [
  { name: 'Fontanería', icon: <FiDroplet size={24} />, key: 'fontaneria' },
  { name: 'Electricidad', icon: <FiZap size={24} />, key: 'electricidad' },
  { name: 'Albañilería', icon: <FiTool size={24} />, key: 'albanileria' },
  { name: 'Carpintería', icon: <FiUsers size={24} />, key: 'carpinteria' },
  { name: 'Pintura', icon: <FiEdit size={24} />, key: 'pintura' },
  { name: 'Cerrajería', icon: <FiKey size={24} />, key: 'cerrajeria' },
  { name: 'Jardinería', icon: <FiFeather size={24} />, key: 'jardineria' },
  { name: 'Limpieza', icon: <FiTool size={24} />, key: 'limpieza' },
];

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

const mockProfessionals = [
  {
    id: 1,
    name: 'Juan Pérez',
    profession: 'Fontanero',
    rating: 4.8,
    reviews: 124,
    price: '25€',
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Madrid, España',
    verified: true,
    category: 'fontaneria',
  },
  {
    id: 2,
    name: 'María García',
    profession: 'Electricista',
    rating: 4.9,
    reviews: 89,
    price: '30€',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Barcelona, España',
    verified: true,
    category: 'electricidad',
  },
  {
    id: 3,
    name: 'Carlos López',
    profession: 'Albañil',
    rating: 4.7,
    reviews: 76,
    price: '28€',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Valencia, España',
    verified: false,
    category: 'albanileria',
  },
  {
    id: 4,
    name: 'Lucía Torres',
    profession: 'Pintora',
    rating: 4.6,
    reviews: 55,
    price: '22€',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Sevilla, España',
    verified: true,
    category: 'pintura',
  },
  {
    id: 5,
    name: 'Pedro Martín',
    profession: 'Carpintero',
    rating: 4.5,
    reviews: 40,
    price: '35€',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Bilbao, España',
    verified: false,
    category: 'carpinteria',
  },
  {
    id: 6,
    name: 'Ana Ruiz',
    profession: 'Cerrajera',
    rating: 4.7,
    reviews: 60,
    price: '27€',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Granada, España',
    verified: true,
    category: 'cerrajeria',
  },
  {
    id: 7,
    name: 'Miguel Ángel',
    profession: 'Jardinero',
    rating: 4.8,
    reviews: 70,
    price: '24€',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Valencia, España',
    verified: true,
    category: 'jardineria',
  },
  {
    id: 8,
    name: 'Sofía Ramos',
    profession: 'Limpiadora',
    rating: 4.9,
    reviews: 80,
    price: '20€',
    image: 'https://images.unsplash.com/photo-1519340333755-c2f6c58f5b6e?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Madrid, España',
    verified: true,
    category: 'limpieza',
  },
  // Añadimos más profesionales para cada categoría
  {
    id: 11,
    name: 'Roberto Sánchez',
    profession: 'Fontanero',
    rating: 4.7,
    reviews: 92,
    price: '28€',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Madrid, España',
    verified: true,
    category: 'fontaneria',
  },
  {
    id: 12,
    name: 'Laura Martínez',
    profession: 'Electricista',
    rating: 4.9,
    reviews: 110,
    price: '32€',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Barcelona, España',
    verified: true,
    category: 'electricidad',
  },
  {
    id: 13,
    name: 'Antonio Gómez',
    profession: 'Albañil',
    rating: 4.8,
    reviews: 85,
    price: '30€',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Valencia, España',
    verified: true,
    category: 'albanileria',
  },
  {
    id: 14,
    name: 'Carmen Díaz',
    profession: 'Pintora',
    rating: 4.7,
    reviews: 78,
    price: '25€',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Sevilla, España',
    verified: true,
    category: 'pintura',
  },
  {
    id: 15,
    name: 'Francisco Ruiz',
    profession: 'Carpintero',
    rating: 4.9,
    reviews: 95,
    price: '38€',
    image: 'https://images.unsplash.com/photo-1506795660198-e95c632ab3ca?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Bilbao, España',
    verified: true,
    category: 'carpinteria',
  },
  {
    id: 16,
    name: 'Isabel Moreno',
    profession: 'Cerrajera',
    rating: 4.8,
    reviews: 88,
    price: '29€',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Granada, España',
    verified: true,
    category: 'cerrajeria',
  },
  {
    id: 17,
    name: 'José Luis',
    profession: 'Jardinero',
    rating: 4.7,
    reviews: 82,
    price: '26€',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Valencia, España',
    verified: true,
    category: 'jardineria',
  },
  {
    id: 18,
    name: 'Elena Castro',
    profession: 'Limpiadora',
    rating: 4.9,
    reviews: 105,
    price: '22€',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=facearea&w=400&h=400&facepad=2',
    location: 'Madrid, España',
    verified: true,
    category: 'limpieza',
  },
];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const groupFocused = searchFocused || locationFocused;

  const ITEMS_TO_SHOW = 5;
  const ITEMS_TO_SLIDE = 3;
  const ITEM_WIDTH = 320;

  // Sincroniza el filtro con el query param
  useEffect(() => {
    const categoryParam = searchParams.get("category") || "";
    setSelectedCategory(categoryParam);
  }, [searchParams]);

  // Cambia el filtro y actualiza la URL
  const handleCategoryClick = (key: string) => {
    const params = new URLSearchParams();
    if (key) params.set("category", key);
    if (location) params.set("location", location);
    router.push(`/search?${params.toString()}`);
  };

  // Filtrado de profesionales destacados
  const filteredProfessionals = mockProfessionals.filter((pro) => {
    const matchesCategory = !selectedCategory || pro.category === selectedCategory;
    const matchesSearch =
      pro.name.toLowerCase().includes(search.toLowerCase()) ||
      pro.profession.toLowerCase().includes(search.toLowerCase()) ||
      pro.location.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSlide = (direction: 'left' | 'right') => {
    if (isAnimating || !sliderRef.current || !slideRef.current || filteredProfessionals.length === 0) return;

    setIsAnimating(true);
    const slider = sliderRef.current;
    const slide = slideRef.current;

    // Calcular el desplazamiento
    const offset = direction === 'right' ? -ITEM_WIDTH * ITEMS_TO_SLIDE : ITEM_WIDTH * ITEMS_TO_SLIDE;
    
    // Aplicar la transformación
    slide.style.transform = `translateX(${offset}px)`;
    slide.style.transition = 'transform 0.4s ease-in-out';

    // Después de la animación
    setTimeout(() => {
      // Actualizar el índice
      setCurrentIndex(prev => {
        const newIndex = direction === 'right'
          ? (prev + ITEMS_TO_SLIDE) % filteredProfessionals.length
          : (prev - ITEMS_TO_SLIDE + filteredProfessionals.length) % filteredProfessionals.length;
        return newIndex;
      });

      // Resetear la transformación sin transición
      slide.style.transition = 'none';
      slide.style.transform = 'translateX(0)';
      
      // Forzar un reflow
      void slide.offsetWidth;
      
      // Restaurar la transición
      slide.style.transition = 'transform 0.4s ease-in-out';
      setIsAnimating(false);
    }, 400);
  };

  // Calcular el buffer de tarjetas
  const getBuffer = () => {
    if (filteredProfessionals.length === 0) return [];
    
    const buffer = [];
    const totalItems = filteredProfessionals.length;
    
    // Añadir tarjetas anteriores
    for (let i = -ITEMS_TO_SLIDE; i < 0; i++) {
      const index = (currentIndex + i + totalItems) % totalItems;
      buffer.push(filteredProfessionals[index]);
    }
    
    // Añadir tarjetas visibles
    for (let i = 0; i < ITEMS_TO_SHOW; i++) {
      const index = (currentIndex + i) % totalItems;
      buffer.push(filteredProfessionals[index]);
    }
    
    // Añadir tarjetas posteriores
    for (let i = 0; i < ITEMS_TO_SLIDE; i++) {
      const index = (currentIndex + ITEMS_TO_SHOW + i) % totalItems;
      buffer.push(filteredProfessionals[index]);
    }
    
    return buffer;
  };

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
          <form
            className={`w-full max-w-2xl flex flex-col md:flex-row gap-3 md:gap-0 bg-white rounded-xl shadow-lg p-2 transition-all ${groupFocused ? "outline outline-2 outline-blue-500" : "outline outline-0"}`}
            onSubmit={e => e.preventDefault()}
          >
            <div className="flex-1 flex">
              <input
                type="text"
                placeholder="¿Qué necesitas? Ej: fontanero, pintar habitación..."
                className="flex-1 px-4 py-2 rounded-l-lg md:rounded-l-xl border-none focus:outline-none text-gray-800 bg-transparent"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <div className="flex items-center bg-transparent border-l-2 border-gray-200">
                <FiMapPin className="text-gray-400 ml-2" />
                <input
                  type="text"
                  placeholder="Tu ubicación"
                  className="w-32 md:w-40 px-2 py-2 border-none focus:outline-none text-gray-800 bg-transparent rounded-r-lg"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  onFocus={() => setLocationFocused(true)}
                  onBlur={() => setLocationFocused(false)}
                />
              </div>
            </div>
            <Link
              href={`/search${search || location ? `?${new URLSearchParams({
                ...(search && { search }),
                ...(location && { location })
              }).toString()}` : ''}`}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow"
            >
              <FiSearch size={20} /> Buscar
            </Link>
          </form>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-400 transition-all bg-white hover:bg-blue-50 shadow-sm group"
              >
                <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
                  {cat.icon}
                </div>
                <span className="mt-3 font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
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
