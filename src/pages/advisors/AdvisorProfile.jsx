import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { StarIcon } from "@heroicons/react/20/solid";
import BookingCalendar from "../../components/booking/BookingCalendar";
import ReviewList from "../../components/reviews/ReviewList";

// Mock actualizado para incluir varios asesores
const MOCK_ADVISORS = [
  {
    id: 1,
    name: "Carlos López",
    specialties: ["Planificación Financiera", "Inversiones"],
    rating: 4.8,
    reviewCount: 124,
    hourlyRate: 25000,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Asesor financiero certificado con más de 10 años de experiencia en gestión de inversiones y planificación para el retiro.",
    availability: {
      monday: ["10:00", "11:00", "15:00"],
      tuesday: ["14:00", "15:00"],
      wednesday: ["09:00", "10:00", "11:00"],
      thursday: ["13:00", "14:00", "15:00", "16:00"],
      friday: ["09:00", "10:00", "11:00", "12:00"],
    },
  },
  {
    id: 2,
    name: "María Fernández",
    specialties: ["Desarrollo Profesional", "Liderazgo"],
    rating: 4.9,
    reviewCount: 89,
    hourlyRate: 50000,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Coach ejecutiva especializada en transiciones de carrera y desarrollo de liderazgo.",
    availability: {
      monday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      tuesday: [],
      wednesday: ["14:00", "15:00", "16:00"],
      thursday: ["10:00", "11:00", "12:00"],
      friday: ["14:00", "15:00", "16:00"],
    },
  },
  {
    id: 4,
    name: "Martin Torres",
    specialties: ["Marketing", "Estrategia Empresarial"],
    rating: 4.5,
    reviewCount: 2,
    hourlyRate: 30000,
    avatar:
      "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Especialista en marketing digital y estrategias de crecimiento empresarial con enfoque en transformación digital.",
    availability: {
      monday: ["09:00", "10:00", "11:00"],
      tuesday: ["12:00", "13:00", "14:00"],
      wednesday: ["10:00", "11:00", "12:00"],
      thursday: ["09:00", "10:00", "11:00"],
      friday: ["13:00", "14:00", "15:00"],
    },
  },
  {
    id: 5,
    name: "David Gómez",
    specialties: ["Asesoría Legal", "Inversiones"],
    rating: 4.5,
    reviewCount: 2,
    hourlyRate: 45000,
    avatar:
      "https://images.unsplash.com/photo-1584999734482-0361aecad844?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Abogado especializado en derecho corporativo e inversiones, con amplia experiencia en asesoramiento legal estratégico.",
    availability: {
      monday: ["08:00", "09:00", "10:00"],
      tuesday: ["11:00", "14:00"],
      wednesday: ["13:00", "14:00", "15:00"],
      thursday: ["09:00", "10:00"],
      friday: ["10:00", "11:00", "12:00"],
    },
  },
  {
    id: 6,
    name: "Claudio Martínez",
    specialties: ["Programación", "Desarrollo Profesional"],
    rating: 3,
    reviewCount: 5,
    hourlyRate: 35000,
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Desarrolladora de software con experiencia en proyectos de tecnología y una fuerte pasión por la formación profesional.",
    availability: {
      monday: ["12:00", "13:00", "14:00"],
      tuesday: ["10:00", "11:00", "12:00"],
      wednesday: ["14:00", "15:00"],
      thursday: ["11:00", "12:00", "13:00"],
      friday: ["09:00", "10:00", "11:00"],
    },
  },
];

export default function AdvisorProfile() {
  const { id } = useParams();
  const [advisor, setAdvisor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    // Obtener asesor del mock o de localStorage
    const savedProfile = JSON.parse(localStorage.getItem("savedProfile"));
    const foundAdvisor =
      MOCK_ADVISORS.find((adv) => adv.id === parseInt(id, 10)) ||
      (savedProfile && savedProfile.id === parseInt(id, 10)
        ? savedProfile
        : null);
    setAdvisor(foundAdvisor);
  }, [id]);

  if (!advisor) {
    return (
      <div className="text-center text-gray-500">Asesor no encontrado.</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Información del asesor */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <img
                src={advisor.avatar}
                alt={advisor.name}
                className="h-24 w-24 rounded-full"
              />
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {advisor.name}
                </h1>
                <div className="flex items-center mt-1">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">
                    {advisor.rating} ({advisor.reviewCount} reseñas)
                  </span>
                </div>
                <div className="mt-2">
                  {advisor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Acerca de</h2>
              <p className="mt-2 text-gray-600">{advisor.bio}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Tarifa</h2>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${advisor.hourlyRate}/hora
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowBooking(!showBooking)}
                className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reservar una sesión
              </button>
            </div>
          </div>

          {/* Sección de reseñas */}
          <div className="mt-8">
            <ReviewList advisorId={id} />
          </div>
        </div>

        {/* Calendario de reservas */}
        <div className="md:col-span-1">
          {showBooking && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Programar una sesión
              </h2>
              <BookingCalendar advisor={advisor} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
