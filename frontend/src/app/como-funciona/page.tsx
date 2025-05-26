"use client";
import { FiSearch, FiCheckCircle, FiClock, FiStar, FiShield, FiMessageSquare, FiDollarSign } from 'react-icons/fi';

const steps = [
  {
    icon: <FiSearch size={32} className="text-blue-600" />,
    title: "Busca",
    description: "Encuentra el servicio que necesitas y el profesional más cercano a ti en nuestra plataforma. Filtra por categoría, ubicación y valoraciones para encontrar exactamente lo que buscas."
  },
  {
    icon: <FiCheckCircle size={32} className="text-blue-600" />,
    title: "Compara",
    description: "Revisa perfiles detallados, valoraciones de otros usuarios y precios para elegir el mejor profesional. Cada perfil incluye fotos de trabajos anteriores, certificaciones y comentarios verificados."
  },
  {
    icon: <FiClock size={32} className="text-blue-600" />,
    title: "Contacta",
    description: "Agenda una visita o solicita un presupuesto sin compromiso directamente con el profesional. Nuestra plataforma facilita la comunicación y el seguimiento de tu solicitud."
  },
  {
    icon: <FiStar size={32} className="text-blue-600" />,
    title: "Valora",
    description: "Comparte tu experiencia y ayuda a otros usuarios a encontrar los mejores profesionales. Tu opinión es fundamental para mantener la calidad de nuestra comunidad."
  }
];

const features = [
  {
    icon: <FiShield size={24} className="text-blue-600" />,
    title: "Profesionales Verificados",
    description: "Todos los profesionales pasan por un proceso de verificación de identidad y experiencia."
  },
  {
    icon: <FiMessageSquare size={24} className="text-blue-600" />,
    title: "Comunicación Directa",
    description: "Habla directamente con los profesionales a través de nuestra plataforma segura."
  },
  {
    icon: <FiDollarSign size={24} className="text-blue-600" />,
    title: "Precios Transparentes",
    description: "Conoce los precios antes de contratar y compara entre diferentes profesionales."
  }
];

export default function ComoFunciona() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 border-b border-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Cómo funciona Obralia
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Encuentra y contrata profesionales de confianza en solo unos minutos. 
              Nuestra plataforma conecta a los mejores profesionales con personas que necesitan sus servicios.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-6">{step.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Obralia?
            </h2>
            <p className="text-xl text-gray-600">
              Nuestra plataforma está diseñada para hacer tu búsqueda de profesionales más fácil y segura.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Listo para encontrar tu profesional?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comienza ahora mismo a buscar el profesional que necesitas para tu proyecto.
          </p>
          <a
            href="/search"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Buscar profesionales
          </a>
        </div>
      </section>
    </div>
  );
} 