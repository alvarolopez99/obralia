"use client";
import { useParams } from "next/navigation";
import { mockProfessionals } from "@/data/mockProfessionals";
import { FiMapPin, FiCheckCircle, FiCalendar, FiMessageSquare } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import DateRangePickerResponsive from "@/components/ui/date-picker/DateRangePickerResponsive";
import dayjs, { Dayjs } from "dayjs";
import { useState, useRef } from "react";
import ProfessionalDatePicker from "@/components/ProfessionalDatePicker";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfessionalPage() {
  const { id } = useParams();
  const professional = mockProfessionals.find(p => p.id === Number(id));
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [calendarMounted, setCalendarMounted] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [reviewsToShow, setReviewsToShow] = useState(3);
  const reviewsContainerRef = useRef<HTMLDivElement>(null);

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profesional no encontrado</h1>
          <Link href="/search" className="text-blue-600 hover:text-blue-700">
            Volver a la búsqueda
          </Link>
        </div>
      </div>
    );
  }

  // Función para bloquear fechas ocupadas
  function isRangeBlocked(start: Dayjs, end: Dayjs) {
    if (!professional || !professional.agenda) return false;
    return professional.agenda.some(event => {
      const eventStart = dayjs(event.start);
      const eventEnd = dayjs(event.end);
      // Si hay solapamiento
      return (
        (start.isBefore(eventEnd) && end.isAfter(eventStart))
      );
    });
  }

  const handleOpenBooking = () => {
    // Si ya hay fecha y hora seleccionadas y el resumen está visible, no hacer nada
    if (selectedDate && selectedHour !== null && !showBooking) {
      return;
    }
    setCalendarMounted(true);
    setShowBooking(true);
  };

  const handleCloseBooking = () => {
    setShowBooking(false);
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setCalendarMounted(false);
    }, 350); // Espera a que termine la animación de altura
  };

  const handleChangeDateTime = () => {
    console.log('Changing date/time...');
    setShowBooking(true);
  };

  const handleSelectionChange = ({ date, hour }: { date: Dayjs | null; hour: number | null }) => {
    console.log('Selection changed:', { date, hour });
    setSelectedDate(date);
    setSelectedHour(hour);
    if (date && hour !== null) {
      setShowBooking(false); // Cerrar el calendario cuando se completa la selección
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header con navegación */}
        <div className="mb-8">
          <Link href="/search" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la búsqueda
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Información del profesional */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src={professional.image}
                    alt={professional.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{professional.name}</h1>
                    {professional.verified && (
                      <FiCheckCircle className="text-blue-600" size={20} />
                    )}
                  </div>
                  <p className="text-xl text-gray-600 mb-4">{professional.profession}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <AiFillStar className="text-yellow-400" />
                      <span>{professional.rating}</span>
                      <span className="text-gray-400">({professional.reviews} reseñas)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiMapPin />
                      <span>{professional.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre mí</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{professional.description}</p>
            </div>

            {/* Condiciones de visita y reserva */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Condiciones de visita y reserva</h2>
              <ul className="text-gray-700 space-y-2">
                <li>
                  <span className="font-medium">¿La visita tiene coste?</span> {professional.visitCost > 0 ? `Sí, ${professional.visitCost}€` : 'No, es gratuita'}
                </li>
                <li>
                  <span className="font-medium">Notas:</span> La visita tendrá una duración estimada de una hora, salvo que el profesional considere necesario más o menos tiempo. En ese caso, el profesional confirmará y reservará el tiempo necesario como visita.
                </li>
              </ul>
            </div>

            {/* Disponibilidad */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Disponibilidad</h2>
              <div className="space-y-3">
                {professional.workingHours && Object.entries(professional.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-2 text-gray-600">
                    <span className="capitalize w-24">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                    {hours ? (
                      <span>{hours.start.toString().padStart(2, '0')}:00 - {hours.end.toString().padStart(2, '0')}:00</span>
                    ) : (
                      <span>No disponible</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Servicios */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Servicios que ofrezco</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiCheckCircle className="text-blue-600" size={20} />
                  <span className="text-gray-700">Instalaciones y reparaciones</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiCheckCircle className="text-blue-600" size={20} />
                  <span className="text-gray-700">Mantenimiento preventivo</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiCheckCircle className="text-blue-600" size={20} />
                  <span className="text-gray-700">Diagnóstico y asesoramiento</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiCheckCircle className="text-blue-600" size={20} />
                  <span className="text-gray-700">Presupuestos sin compromiso</span>
                </div>
              </div>
            </div>

            {/* Reseñas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reseñas de clientes</h2>
              <div className="space-y-6" ref={reviewsContainerRef}>
                <AnimatePresence>
                {professional.reviewsList && professional.reviewsList
                  .slice(0, reviewsToShow)
                  .map((review: import('@/types/professional').ProfessionalReview, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="border-b border-gray-100 pb-6 last:border-0"
                      >
                        <motion.div
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          exit={{ y: -20 }}
                          transition={{ duration: 0.2, delay: 0.05 }}
                        >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(i => i <= review.rating ? (
                            <span key={i} className="text-yellow-400">★</span>
                          ) : (
                            <span key={i} className="text-gray-300">★</span>
                          ))}
                        </div>
                        <span className="text-gray-500">{review.date}</span>
                        <span className="ml-2 text-gray-700 font-semibold">{review.author}</span>
                      </div>
                      <p className="text-gray-600">{review.text}</p>
                        </motion.div>
                      </motion.div>
                  ))}
                </AnimatePresence>
                {professional.reviewsList && professional.reviewsList.length > 3 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => {
                      if (!professional.reviewsList) return;
                      
                      // Si vamos a contraer las reseñas, primero hacemos el scroll
                      if (reviewsToShow >= professional.reviewsList.length) {
                        if (reviewsContainerRef.current) {
                          const firstReview = reviewsContainerRef.current.querySelector('.border-b');
                          if (firstReview) {
                            firstReview.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                        // Esperamos a que termine el scroll antes de actualizar el estado
                        setTimeout(() => {
                        setReviewsToShow(3);
                        }, 300);
                      } else {
                        // Si estamos expandiendo, simplemente actualizamos el estado
                        setReviewsToShow(Math.min(reviewsToShow + 10, professional.reviewsList.length));
                      }
                    }}
                    className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {professional.reviewsList && reviewsToShow >= professional.reviewsList.length ? 'Ver menos...' : 'Ver más...'}
                  </motion.button>
                )}
              </div>
            </div>

            {/* Proyectos completados */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Proyectos completados</h2>
              <div className="space-y-4">
                {professional.portfolio && professional.portfolio.map((proj: import('@/types/professional').ProfessionalProject, idx: number) => (
                  <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2">
                    <div className="font-bold text-blue-800">{proj.title} <span className="text-gray-400 font-normal">({proj.year})</span></div>
                    <div className="text-gray-700">{proj.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tarjeta de contacto */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {professional.price}
                <span className="text-sm font-normal text-gray-500">/hora</span>
              </div>
              <div className="space-y-4">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    // TODO: Implementar contacto
                    alert('Funcionalidad de contacto en desarrollo');
                  }}
                >
                  <FiMessageSquare size={20} />
                  Contactar
                </button>
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  onClick={handleOpenBooking}
                >
                  <FiCalendar size={20} />
                  Agendar visita
                </button>
              </div>

              {/* DatePicker embebido */}
              <div className="relative">
                <AnimatePresence initial={false}>
                  {calendarMounted && (
                    <motion.div
                      key="calendar"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                      className="w-full"
                    >
                      {calendarMounted && (
                        <div className="mt-4 relative">
                          <div className="pt-2">
                            <ProfessionalDatePicker
                              agenda={professional.agenda}
                              workingHours={professional.workingHours}
                              value={{ date: selectedDate, hour: selectedHour }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          {/* Selector de horas animado */}
                          <AnimatePresence initial={false}>
                            {selectedDate && selectedHour === null && (
                              <motion.div
                                key="selector-horas"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                style={{ overflow: 'hidden' }}
                                className="mt-4"
                              >
                                {/* Aquí puedes poner un mensaje o el selector de horas si lo tienes separado */}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resumen de la visita animado */}
              <AnimatePresence>
                {!showBooking && selectedDate && selectedHour !== null && (
                  <motion.div
                    key="resumen-visita"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    className="mt-4"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-full bg-gray-50 rounded-lg p-4 mb-2">
                        <div className="font-bold text-gray-900 mb-1">Resumen de la visita</div>
                        <div className="text-gray-700">Día: <span className="font-semibold">{selectedDate.format('DD/MM/YYYY')}</span></div>
                        <div className="text-gray-700">Hora: <span className="font-semibold">{selectedHour.toString().padStart(2, '0')}:00</span></div>
                      </div>
                      <div className="font-semibold text-gray-900 text-lg">Total primera visita: {professional.visitCost > 0 ? `${professional.visitCost}€` : '0€'}</div>
                      <button
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        onClick={() => {
                          alert(`Visita confirmada:\nDía: ${selectedDate.format('DD/MM/YYYY')}\nHora: ${selectedHour.toString().padStart(2, '0')}:00`);
                          setSelectedDate(null);
                          setSelectedHour(null);
                          setShowBooking(false);
                          setCalendarMounted(false);
                        }}
                      >
                        Confirmar visita
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 