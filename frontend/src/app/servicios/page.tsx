import Link from 'next/link';

const services = [
  {
    id: 'fontaneria',
    name: 'Fontanería',
    description: 'Servicios de instalación, reparación y mantenimiento de sistemas de fontanería.',
    icon: '🚰',
    features: [
      'Reparación de fugas',
      'Instalación de grifos',
      'Desatascos',
      'Mantenimiento preventivo',
    ],
  },
  {
    id: 'electricidad',
    name: 'Electricidad',
    description: 'Instalaciones eléctricas, reparaciones y mantenimiento de sistemas eléctricos.',
    icon: '⚡',
    features: [
      'Instalaciones nuevas',
      'Reparación de averías',
      'Cambio de cuadros eléctricos',
      'Instalación de luces',
    ],
  },
  {
    id: 'albanileria',
    name: 'Albañilería',
    description: 'Trabajos de construcción, reformas y reparaciones estructurales.',
    icon: '🏗️',
    features: [
      'Reformas integrales',
      'Reparación de paredes',
      'Instalación de suelos',
      'Construcción de muros',
    ],
  },
  {
    id: 'carpinteria',
    name: 'Carpintería',
    description: 'Trabajos de carpintería en madera, instalación de muebles y reparaciones.',
    icon: '🪚',
    features: [
      'Instalación de muebles',
      'Reparación de puertas',
      'Montaje de armarios',
      'Trabajos a medida',
    ],
  },
  {
    id: 'pintura',
    name: 'Pintura',
    description: 'Servicios de pintura para interiores y exteriores, decoración y acabados.',
    icon: '🎨',
    features: [
      'Pintura de interiores',
      'Pintura de exteriores',
      'Decoración de paredes',
      'Acabados especiales',
    ],
  },
  {
    id: 'cerrajeria',
    name: 'Cerrajería',
    description: 'Servicios de cerrajería, instalación de cerraduras y seguridad.',
    icon: '🔑',
    features: [
      'Cambio de cerraduras',
      'Instalación de seguridad',
      'Apertura de puertas',
      'Copias de llaves',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Nuestros Servicios</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Encuentra el servicio que necesitas entre nuestra amplia gama de profesionales
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="text-4xl mb-4">{service.icon}</div>
            <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
            <p className="text-gray-600 mb-4">{service.description}</p>
            
            <ul className="space-y-2 mb-6">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
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
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={`/servicios/${service.id}`}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Profesionales
            </Link>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
        <p className="text-gray-600 mb-8">
          Contacta con nosotros y te ayudaremos a encontrar el profesional adecuado para tu proyecto
        </p>
        <Link
          href="/contacto"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Contactar
        </Link>
      </div>
    </div>
  );
} 