import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';

interface Professional {
  id: number;
  name: string;
  profession: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  verified: boolean;
  isGeneral?: boolean;
  showAll?: boolean;
}

interface SuggestionItem {
  id: string;
  profession: string;
  location: string;
  isGeneral: boolean;
  showAll?: boolean;
  isPrompt?: boolean;
}

interface SmartSearchProps {
  professionals: Professional[];
  className?: string;
  variant?: 'default' | 'compact';
}

// Términos de búsqueda comunes y sus categorías
const commonSearchTerms = [
  { term: 'Fontanero', category: 'fontaneria' },
  { term: 'Electricista', category: 'electricidad' },
  { term: 'Albañil', category: 'albanileria' },
  { term: 'Carpintero', category: 'carpinteria' },
  { term: 'Pintor', category: 'pintura' },
  { term: 'Cerrajero', category: 'cerrajeria' },
  { term: 'Jardinero', category: 'jardineria' },
  { term: 'Limpiador', category: 'limpieza' },
  { term: 'Repartidor', category: 'repartidor' },
  { term: 'Mudanzas', category: 'mudanzas' },
  { term: 'Mecánico', category: 'mecanico' },
  { term: 'Técnico', category: 'tecnico' },
  { term: 'Instalador', category: 'instalador' },
  { term: 'Mantenimiento', category: 'mantenimiento' },
  { term: 'Reformas', category: 'reformas' },
];

// Ubicaciones disponibles
const locations = [
  // Países
  'España', 'Portugal', 'Francia', 'Andorra', 'Gibraltar',
  
  // Comunidades Autónomas
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria', 'Castilla-La Mancha',
  'Castilla y León', 'Cataluña', 'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Murcia', 
  'Navarra', 'País Vasco', 'La Rioja', 'Ceuta', 'Melilla',
  
  // Ciudades principales y municipios
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma',
  'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Granada',
  'A Coruña', 'Vitoria-Gasteiz', 'Elche', 'Cartagena', 'Terrassa', 'Jerez de la Frontera',
  'Sabadell', 'Móstoles', 'Santa Cruz de Tenerife', 'Pamplona', 'Santander', 'Castellón',
  'Almería', 'Burgos', 'Albacete', 'Sant Cugat', 'Alcorcón', 'Getafe', 'San Sebastián',
  'Logroño', 'Badalona', 'Huelva', 'Salamanca', 'Lleida', 'Tarragona', 'León', 'Cádiz',
  'Jaén', 'Ourense', 'Mataró', 'Algeciras', 'Marbella', 'Torrejón de Ardoz', 'Alcobendas',
  'Pozuelo de Alarcón', 'San Fernando', 'Rivas-Vaciamadrid', 'Coslada', 'Torrevieja',
  'Telde', 'Parla', 'Barakaldo', 'San Vicente del Raspeig', 'Lugo', 'Girona', 'Cáceres',
  // Municipios de Madrid
  'Alcalá de Henares', 'Alcobendas', 'Alcorcón', 'Aranjuez', 'Arganda del Rey', 'Boadilla del Monte',
  'Collado Villalba', 'Colmenar Viejo', 'Fuenlabrada', 'Getafe', 'Leganés', 'Móstoles',
  'Parla', 'Pozuelo de Alarcón', 'Rivas-Vaciamadrid', 'San Sebastián de los Reyes', 'Torrejón de Ardoz',
  'Valdemoro', 'Villaviciosa de Odón',
  // Municipios de Barcelona
  'Badalona', 'Castelldefels', 'Cerdanyola del Vallès', 'Cornellà de Llobregat', 'El Prat de Llobregat',
  'Esplugues de Llobregat', 'Granollers', 'L\'Hospitalet de Llobregat', 'Manresa', 'Mataró',
  'Mollet del Vallès', 'Rubí', 'Sant Boi de Llobregat', 'Sant Cugat del Vallès', 'Santa Coloma de Gramenet',
  'Terrassa', 'Viladecans', 'Vilanova i la Geltrú',
  // Municipios de Valencia
  'Alaquàs', 'Albal', 'Alboraya', 'Aldaia', 'Alfafar', 'Benetússer', 'Burjassot', 'Catarroja',
  'Gandia', 'L\'Eliana', 'Massanassa', 'Mislata', 'Moncada', 'Paiporta', 'Paterna', 'Quart de Poblet',
  'Riba-roja de Túria', 'Sagunto', 'San Antonio de Benagéber', 'Silla', 'Tavernes Blanques', 'Torrent',
  'Valencia', 'Xirivella'
];

// Función para calcular la similitud entre dos strings
const similarity = (str1: string, str2: string) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  return (longer.length - editDistance(longer, shorter)) / longer.length;
};

// Función para calcular la distancia de edición
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

// Función para verificar si un término es similar a una profesión
const isSimilarToProfession = (term: string, profession: string) => {
  const termLower = term.toLowerCase();
  const professionLower = profession.toLowerCase();

  // Si el término es muy corto, solo buscar coincidencias exactas
  if (termLower.length < 3) {
    return professionLower.includes(termLower);
  }

  // Si el término está contenido en la profesión o viceversa
  if (professionLower.includes(termLower) || termLower.includes(professionLower)) {
    return true;
  }

  // Calcular similitud directa
  const directSimilarity = similarity(termLower, professionLower);
  
  // Calcular similitud ignorando la primera letra
  const termWithoutFirst = termLower.slice(1);
  const professionWithoutFirst = professionLower.slice(1);
  const similarityWithoutFirst = similarity(termWithoutFirst, professionWithoutFirst);

  // Retornar true si alguna de las condiciones se cumple
  return directSimilarity > 0.5 || similarityWithoutFirst > 0.6;
};

export default function SmartSearch({ professionals, className = '', variant = 'default' }: SmartSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [searchFocused, setSearchFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const groupFocused = searchFocused || locationFocused;
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Configuración de Fuse.js para búsqueda fuzzy de profesionales
  const fuse = useMemo(() => {
    return new Fuse(professionals, {
      keys: [
        { name: 'profession', weight: 3 },
        { name: 'name', weight: 2 },
        { name: 'category', weight: 1.5 },
        { name: 'location', weight: 1 }
      ],
      threshold: 0.4,
      includeScore: true,
      shouldSort: true,
      minMatchCharLength: 2,
      location: 0,
      distance: 100,
      useExtendedSearch: true,
      findAllMatches: true,
      ignoreLocation: true,
      ignoreFieldNorm: true
    });
  }, [professionals]);

  // Configuración de Fuse.js para búsqueda de ubicaciones
  const locationFuse = useMemo(() => {
    return new Fuse(locations, {
      threshold: 0.4,
      includeScore: true,
      shouldSort: true,
      minMatchCharLength: 1,
      location: 0,
      distance: 100,
      useExtendedSearch: true,
      findAllMatches: true,
      ignoreLocation: true,
      ignoreFieldNorm: true
    });
  }, []);

  // Manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    // Si estamos en /search, no mostramos error y permitimos búsqueda vacía
    if (window.location.pathname === '/search') {
      if (search) params.set('search', search);
      if (location) params.set('location', location);
      router.push(`/search?${params.toString()}`);
      return;
    }

    // En la landing page, mantenemos el comportamiento original
    if (!search.trim() && !location.trim()) {
      setError('Introduce un valor y encuentra el profesional que buscas');
      return;
    }
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    router.push(`/search?${params.toString()}`);
  };

  // Sugerencias de búsqueda
  const searchSuggestions = useMemo(() => {
    if (!search || search.length < 2) {
      return [];
    }
    
    const searchLower = search.toLowerCase();
    console.log('SmartSearch: Buscando sugerencias para:', searchLower);
    
    // Buscar en profesionales usando Fuse.js
    const professionalResults = fuse.search(searchLower)
      .filter(result => result.score && result.score < 0.6)
      .map((result, index) => ({
        item: {
          id: `${result.item.profession}-${result.item.location}-${result.item.id}-${index}`,
          profession: result.item.profession,
          location: result.item.location,
          isGeneral: false
        } as SuggestionItem
      }))
      .slice(0, 5);
    
    console.log('SmartSearch: Resultados profesionales encontrados:', professionalResults.length);
    
    // Buscar en términos comunes usando Fuse.js
    const commonFuse = new Fuse(commonSearchTerms, {
      keys: ['term'],
      threshold: 0.4,
      includeScore: true,
      shouldSort: true,
      minMatchCharLength: 2,
      location: 0,
      distance: 100,
      useExtendedSearch: true,
      findAllMatches: true,
      ignoreLocation: true,
      ignoreFieldNorm: true
    });

    const commonResults = commonFuse.search(searchLower)
      .filter(result => result.score && result.score < 0.6)
      .map((result, index) => ({
        item: {
          id: `${result.item.category}-general-${index}`,
          profession: result.item.term,
          location: location || 'España', // Usar la ubicación especificada o España por defecto
          isGeneral: true
        } as SuggestionItem
      }))
      .slice(0, 1);

    console.log('SmartSearch: Resultados comunes encontrados:', commonResults.length);

    // Si no hay resultados específicos, mostrar sugerencia general
    if (professionalResults.length === 0 && commonResults.length === 0) {
      console.log('SmartSearch: No hay coincidencias, mostrando "Todos los profesionales"');
      return [{
        item: {
          id: 'general-suggestion',
          profession: 'Todos los profesionales',
          location: location || 'España', // Usar la ubicación especificada o España por defecto
          isGeneral: true
        } as SuggestionItem
      }];
    }

    // Combinar resultados
    const results = [...professionalResults, ...commonResults];
    console.log('SmartSearch: Sugerencias finales:', results);
    return results;
  }, [search, fuse, location]);

  // Sugerencias de ubicación
  const locationSuggestions = useMemo(() => {
    if (!location || location.length < 2) return [];
    
    // Usar un Set para eliminar duplicados
    const uniqueLocations = new Set(locations);
    const locationArray = Array.from(uniqueLocations);
    
    const locationFuse = new Fuse(locationArray, {
      threshold: 0.2,
      includeScore: true,
      shouldSort: true,
      minMatchCharLength: 2,
      location: 0,
      distance: 50,
      useExtendedSearch: true
    });
    
    return locationFuse.search(location).slice(0, 5);
  }, [location]);

  // Función para manejar la selección de una sugerencia de búsqueda
  const handleSearchSuggestionClick = (profession: string, location: string, isGeneral: boolean = false, showAll: boolean = false) => {
    setSearch(profession);
    if (isGeneral) {
      setLocation('España');
    } else {
      setLocation(location);
    }
    setSearchFocused(false);
  };

  return (
    <div className="w-full max-w-4xl">
      <form
        className={`w-full flex flex-col md:flex-row gap-3 md:gap-0 bg-white rounded-xl ${
          variant === 'compact' 
            ? 'border border-gray-200' 
            : 'shadow-lg'
        } ${
          variant === 'compact' ? 'p-1' : 'p-2'
        } transition-all ${groupFocused ? "outline outline-2 outline-blue-500" : "outline outline-0"} ${className}`}
        onSubmit={handleSearch}
      >
        <div className="flex-1 flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="¿Qué necesitas? Ej: fontanero, pintar habitación..."
              className={`w-full px-4 ${
                variant === 'compact' ? 'py-1.5' : 'py-2'
              } rounded-l-lg md:rounded-l-xl border-none focus:outline-none text-gray-800 bg-transparent`}
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setError('');
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
            {searchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                {searchSuggestions.map(({ item }) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                      item.isPrompt ? 'text-gray-400 italic' : 'text-gray-700'
                    }`}
                    onClick={() => !item.isPrompt && handleSearchSuggestionClick(
                      item.profession,
                      item.location,
                      item.isGeneral,
                      item.showAll
                    )}
                    disabled={item.isPrompt}
                  >
                    <div className="font-medium">{item.profession}</div>
                    {!item.isPrompt && item.location && (
                      <div className="text-sm text-gray-500">{item.location}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center bg-transparent border-l-2 border-gray-200 relative pl-4 md:w-[240px]">
            <FiMapPin className="text-gray-400" />
            <input
              type="text"
              placeholder="Tu ubicación"
              className={`w-12 md:w-48 px-2 ${
                variant === 'compact' ? 'py-1.5' : 'py-2'
              } border-none focus:outline-none text-gray-800 bg-transparent rounded-r-lg`}
              value={location}
              onChange={e => {
                setLocation(e.target.value);
                setError('');
              }}
              onFocus={() => setLocationFocused(true)}
              onBlur={() => setTimeout(() => setLocationFocused(false), 200)}
            />
            {locationSuggestions.length > 0 && locationFocused && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 w-full">
                {locationSuggestions.map(({ item }) => (
                  <button
                    key={item}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                    onClick={() => {
                      setLocation(item);
                      setLocationFocused(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={`flex items-center gap-2 bg-blue-600 text-white px-6 ${
            variant === 'compact' ? 'py-1.5' : 'py-2'
          } rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
            variant === 'compact' ? '' : 'shadow'
          }`}
        >
          <FiSearch size={20} /> Buscar
        </button>
      </form>
      {error && (
        <div className="mt-2 text-center text-gray-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 