import { useState } from "react";

export default function AdvisorFilter({ filters, setFilters }) {
  const [localFilters, setLocalFilters] = useState(filters); // Para almacenar los filtros temporalmente

  const specialties = [
    "Programación",
    "Planificación Financiera",
    "Inversiones",
    "Desarrollo Profesional",
    "Liderazgo",
    "Estrategia Empresarial",
    "Marketing",
    "Asesoría Legal",
  ];

  const priceRanges = [
    { label: "Menos de $20000/hora", value: "0-20000" },
    { label: "$20000-50000/hora", value: "20000-50000" },
    { label: "$50000-100000/hora", value: "50000-100000" },
    { label: "Más de $100000/hora", value: "100000+" },
  ];

  // Función para aplicar los filtros
  const applyFilters = () => {
    setFilters(localFilters); // Actualiza el estado padre con los filtros seleccionados
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>

      <div className="space-y-4">
        {/* Filtro por especialidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Especialidad
          </label>
          <select
            value={localFilters.specialty}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, specialty: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Todas las Especialidades</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por rango de precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rango de Precios
          </label>
          <select
            value={localFilters.priceRange}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, priceRange: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Cualquier Precio</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por calificación mínima */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Calificación Mínima
          </label>
          <select
            value={localFilters.rating}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                rating: Number(e.target.value),
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="0">Cualquier Calificación</option>
            <option value="4">4+ Estrellas</option>
            <option value="4.5">4.5+ Estrellas</option>
          </select>
        </div>
      </div>

      {/* Botón para aplicar los filtros */}
      <div className="mt-4">
        <button
          onClick={applyFilters}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}
