import { Professional } from '@/types/professional';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
dayjs.extend(dayOfYear);

// Nombres y apellidos para generar datos aleatorios
const firstNames = [
  'Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Miguel', 'Sofía', 'José', 'Carmen',
  'Antonio', 'Isabel', 'Francisco', 'Lucía', 'Manuel', 'Elena', 'David', 'Paula', 'Javier', 'Marta',
  'Daniel', 'Sara', 'Roberto', 'Cristina', 'Fernando', 'Natalia', 'Alberto', 'Beatriz', 'Raúl', 'Victoria',
  'Pablo', 'Marina', 'Diego', 'Claudia', 'Ángel', 'Patricia', 'Rubén', 'Nuria', 'Sergio', 'Rocío'
];

const lastNames = [
  'García', 'Rodríguez', 'López', 'Martínez', 'Sánchez', 'Pérez', 'González', 'Fernández', 'Gómez', 'Moreno',
  'Jiménez', 'Díaz', 'Romero', 'Alonso', 'Navarro', 'Torres', 'Domínguez', 'Ramos', 'Vázquez', 'Gil',
  'Serrano', 'Ruiz', 'Blanco', 'Molina', 'Morales', 'Suárez', 'Ortega', 'Delgado', 'Castro', 'Ortiz',
  'Rubio', 'Marín', 'Sanz', 'Iglesias', 'Medina', 'Cortés', 'Garrido', 'Castillo', 'Santos', 'Lozano'
];

const cities = [
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao',
  'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Hospitalet', 'A Coruña', 'Vitoria', 'Elche', 'Granada',
  'Terrassa', 'Cartagena', 'Sabadell', 'Santa Cruz', 'Oviedo', 'Móstoles', 'Pamplona', 'Santander', 'Castellón', 'Almería'
];

const categories = {
  fontaneria: {
    professions: ['Fontanero', 'Instalador de fontanería', 'Técnico de fontanería'],
    priceRange: { min: 20, max: 35 }
  },
  electricidad: {
    professions: ['Electricista', 'Instalador eléctrico', 'Técnico de electricidad'],
    priceRange: { min: 25, max: 40 }
  },
  albanileria: {
    professions: ['Albañil', 'Maestro de obra', 'Oficial de albañilería'],
    priceRange: { min: 22, max: 38 }
  },
  carpinteria: {
    professions: ['Carpintero', 'Ebanista', 'Instalador de muebles'],
    priceRange: { min: 28, max: 45 }
  },
  pintura: {
    professions: ['Pintor', 'Decorador', 'Técnico de pintura'],
    priceRange: { min: 20, max: 35 }
  },
  cerrajeria: {
    professions: ['Cerrajero', 'Instalador de cerraduras', 'Técnico de seguridad'],
    priceRange: { min: 25, max: 40 }
  },
  jardineria: {
    professions: ['Jardinero', 'Paisajista', 'Técnico de jardinería'],
    priceRange: { min: 18, max: 32 }
  },
  limpieza: {
    professions: ['Limpiador', 'Técnico de limpieza', 'Especialista en limpieza'],
    priceRange: { min: 15, max: 28 }
  }
};

// Función para generar un número aleatorio entre min y max de forma determinista
const deterministicRandom = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
};

// Función para generar un elemento aleatorio de un array de forma determinista
const deterministicElement = <T>(array: T[], seed: number): T => {
  const index = deterministicRandom(seed, 0, array.length - 1);
  return array[index];
};

// Generar horarios variados para cada profesional
const workingHoursVariants = [
  {
    monday: { start: 7, end: 15 },
    tuesday: { start: 7, end: 15 },
    wednesday: { start: 7, end: 15 },
    thursday: { start: 7, end: 15 },
    friday: { start: 7, end: 15 },
    saturday: null,
    sunday: null
  },
  {
    monday: { start: 9, end: 18 },
    tuesday: { start: 9, end: 18 },
    wednesday: { start: 9, end: 18 },
    thursday: { start: 9, end: 18 },
    friday: { start: 9, end: 18 },
    saturday: { start: 10, end: 14 },
    sunday: null
  },
  {
    monday: { start: 8, end: 20 },
    tuesday: { start: 8, end: 20 },
    wednesday: { start: 8, end: 20 },
    thursday: { start: 8, end: 20 },
    friday: { start: 8, end: 20 },
    saturday: { start: 9, end: 13 },
    sunday: null
  },
  {
    monday: { start: 10, end: 18 },
    tuesday: { start: 10, end: 18 },
    wednesday: { start: 10, end: 18 },
    thursday: { start: 10, end: 18 },
    friday: { start: 10, end: 18 },
    saturday: null,
    sunday: null
  },
  {
    monday: { start: 8, end: 17 },
    tuesday: { start: 8, end: 17 },
    wednesday: { start: 8, end: 17 },
    thursday: { start: 8, end: 17 },
    friday: { start: 8, end: 17 },
    saturday: { start: 8, end: 12 },
    sunday: null
  }
];

// Función para generar un profesional de forma determinista
const generateProfessional = (id: number, category: string): Professional => {
  const categoryData = categories[category as keyof typeof categories];
  const firstName = deterministicElement(firstNames, id);
  const lastName = deterministicElement(lastNames, id + 1);
  const city = deterministicElement(cities, id + 2);
  const profession = deterministicElement(categoryData.professions, id + 3);
  const price = deterministicRandom(id + 4, categoryData.priceRange.min, categoryData.priceRange.max);
  const rating = Number((deterministicRandom(id + 5, 35, 50) / 10).toFixed(1));
  const reviews = deterministicRandom(id + 6, 20, 200);
  const verified = deterministicRandom(id + 7, 0, 100) > 20; // 80% de probabilidad de estar verificado
  const visitCost = deterministicRandom(id + 8, 0, 1) ? deterministicRandom(id + 9, 10, 30) : 0; // 50% gratis, 50% entre 10-30€
  const allowsDirectBooking = deterministicRandom(id + 10, 0, 1) === 1;
  const bookingPrice = allowsDirectBooking ? deterministicRandom(id + 11, 50, 200) : undefined;
  const bookingNotes = allowsDirectBooking ? 'Puedes reservar este servicio directamente desde la plataforma.' : 'Solo se permite agendar visita.';

  // Simulación de agenda: generar eventos aleatorios entre 2024 y 2025
  let agenda: Professional["agenda"] = [];
  const startDate = dayjs('2024-06-01');
  const endDate = dayjs('2025-12-31');
  let current = startDate.clone();
  while (current.isBefore(endDate, 'day')) {
    // Aleatoriamente, algunos días tendrán más ocupación que otros
    const daySeed = id * 10000 + current.dayOfYear();
    const rand = deterministicRandom(daySeed, 0, 100);
    if (rand < 10) {
      // Día completamente ocupado (gris)
      agenda.push({
        type: "visita",
        start: current.hour(8).minute(0).toISOString(),
        end: current.hour(18).minute(0).toISOString(),
      });
    } else if (rand < 30) {
      // Día con pocas horas libres (rojo)
      agenda.push({
        type: "visita",
        start: current.hour(8).minute(0).toISOString(),
        end: current.hour(15).minute(0).toISOString(),
      });
    } else if (rand < 60) {
      // Día con algunas horas libres (amarillo)
      agenda.push({
        type: "visita",
        start: current.hour(10).minute(0).toISOString(),
        end: current.hour(14).minute(0).toISOString(),
      });
    } // El resto de días quedan verdes (sin eventos)
    current = current.add(1, 'day');
  }

  // Descripción larga
  const longDescription = `Soy un profesional con más de 15 años de experiencia en ${profession.toLowerCase()}. He trabajado en proyectos residenciales, comerciales e industriales, siempre enfocado en la calidad, la seguridad y la satisfacción del cliente. Me apasiona mantenerme actualizado con las últimas tendencias y tecnologías del sector. Mi objetivo es ofrecer soluciones eficientes y personalizadas para cada cliente.\n\nCuento con certificaciones oficiales y una amplia red de colaboradores para abordar cualquier reto, desde pequeñas reparaciones hasta grandes reformas. Si buscas un profesional comprometido, puntual y transparente, ¡no dudes en contactarme!`;

  // Reviews simuladas
  const reviewsList = Array.from({ length: deterministicRandom(id, 8, 30) }, (_, i) => ({
    author: deterministicElement(firstNames, id + i),
    rating: deterministicRandom(id + i, 3, 5),
    date: dayjs().subtract(deterministicRandom(id + i, 1, 400), 'day').format('DD/MM/YYYY'),
    text: `Muy satisfecho con el trabajo realizado. ${profession} muy profesional y resolutivo. Lo recomendaría sin dudarlo. (${i + 1})`
  }));

  // Portfolio de proyectos
  const portfolio = [
    {
      title: "Reforma integral de vivienda",
      description: "Proyecto de renovación completa de un piso antiguo, incluyendo fontanería, electricidad y acabados de alta calidad.",
      year: 2023
    },
    {
      title: "Instalación de sistema domótico",
      description: "Automatización de una vivienda unifamiliar con control inteligente de iluminación, climatización y seguridad.",
      year: 2024
    },
    {
      title: "Mantenimiento industrial",
      description: "Supervisión y reparación de maquinaria en una planta de producción, garantizando la continuidad operativa.",
      year: 2022
    }
  ];

  return {
    id,
    name: `${firstName} ${lastName}`,
    profession,
    rating,
    reviews: reviewsList.length,
    price: `${price}€`,
    image: `https://i.pravatar.cc/400?u=${id}`,
    location: `${city}, España`,
    verified,
    category,
    visitCost,
    allowsDirectBooking,
    bookingPrice,
    bookingNotes,
    agenda,
    workingHours: workingHoursVariants[id % workingHoursVariants.length],
    description: longDescription,
    reviewsList,
    portfolio
  };
};

// Generar 15 profesionales por categoría de forma determinista
const generateProfessionals = (): Professional[] => {
  const professionals: Professional[] = [];
  let id = 1;

  Object.keys(categories).forEach(category => {
    for (let i = 0; i < 15; i++) {
      professionals.push(generateProfessional(id++, category));
    }
  });

  return professionals;
};

export const mockProfessionals = generateProfessionals(); 