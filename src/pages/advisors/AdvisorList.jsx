import { useState, useEffect } from "react";
import AdvisorCard from "../../components/advisors/AdvisorCard";
import AdvisorFilter from "../../components/advisors/AdvisorFilter";

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
  },
];

export default function AdvisorList() {
  const [filters, setFilters] = useState({
    specialty: "",
    priceRange: "",
    rating: 0,
  });

  const [advisors, setAdvisors] = useState(MOCK_ADVISORS);
  const [filteredAdvisors, setFilteredAdvisors] = useState(MOCK_ADVISORS);

  useEffect(() => {
    // Recuperar perfil guardado en localStorage
    const savedProfile = JSON.parse(localStorage.getItem("savedProfile"));

    if (savedProfile) {
      const formattedProfile = {
        id: savedProfile.id,
        name: `${savedProfile.firstName || "Nombre"} ${
          savedProfile.lastName || "Apellido"
        }`,
        specialties: savedProfile.specialties || [],
        rating: savedProfile.rating || 0,
        reviewCount: savedProfile.reviewCount || 0,
        hourlyRate: savedProfile.hourlyRate || 0,
        avatar: savedProfile.avatar || "https://via.placeholder.com/256",
        bio: savedProfile.bio || "Sin biografía disponible.",
      };

      // Verificar si el perfil ya está en la lista
      setAdvisors((prev) => {
        const exists = prev.some(
          (advisor) => advisor.id === formattedProfile.id
        );
        return exists ? prev : [...prev, formattedProfile];
      });
    }
  }, []); // Solo se ejecuta al montar el componente

  useEffect(() => {
    // Filtrar la lista de asesores según los filtros
    const filtered = advisors.filter((advisor) => {
      return (
        // Filtrado por especialidad
        (filters.specialty
          ? advisor.specialties.includes(filters.specialty)
          : true) &&
        // Filtrado por rango de precio
        (filters.priceRange
          ? filters.priceRange === "0-20000"
            ? advisor.hourlyRate <= 20000
            : filters.priceRange === "20000-50000"
            ? advisor.hourlyRate >= 20000 && advisor.hourlyRate <= 50000
            : filters.priceRange === "50000-100000"
            ? advisor.hourlyRate >= 50000 && advisor.hourlyRate <= 100000
            : advisor.hourlyRate >= 100000
          : true) &&
        // Filtrado por calificación mínima
        (filters.rating ? advisor.rating >= filters.rating : true)
      );
    });

    setFilteredAdvisors(filtered); // Actualiza la lista filtrada
  }, [filters, advisors]); // Se ejecuta cuando cambia los filtros o la lista de asesores

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <AdvisorFilter filters={filters} setFilters={setFilters} />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Asesores Disponibles
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAdvisors.length > 0 ? (
              filteredAdvisors.map((advisor) => (
                <AdvisorCard key={advisor.id} advisor={advisor} />
              ))
            ) : (
              <p>No se encontraron asesores que coincidan con los filtros.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
