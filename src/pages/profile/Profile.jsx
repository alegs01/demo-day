import { useState, useEffect } from "react";

const AdvisorProfileEdit = () => {
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const specialtiesOptions = [
    "Programación",
    "Planificación Financiera",
    "Inversiones",
    "Desarrollo Profesional",
    "Liderazgo",
    "Estrategia Empresarial",
    "Marketing",
    "Asesoría Legal",
  ];

  const defaultAvailability = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  };

  useEffect(() => {
    // Cargar perfil desde localStorage
    const storedProfile = localStorage.getItem("savedProfile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      setEditingProfile({
        ...parsedProfile,
        specialties: parsedProfile.specialties || [],
        availability: parsedProfile.availability || defaultAvailability,
      });
    } else {
      // Si no hay datos, usar un perfil de ejemplo
      const exampleProfile = {
        id: 3, // Asignar un ID mayor a 2
        firstName: "",
        lastName: "",
        hourlyRate: 0,
        bio: "",
        specialties: [],
        avatar: "",
        availability: defaultAvailability,
      };
      setProfile(exampleProfile);
      setEditingProfile(exampleProfile);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecialtiesChange = (index, value) => {
    setEditingProfile((prev) => {
      const updatedSpecialties = prev.specialties ? [...prev.specialties] : [];
      updatedSpecialties[index] = value;
      return { ...prev, specialties: updatedSpecialties };
    });
  };

  const handleAvailabilityChange = (day, timeslot) => {
    setEditingProfile((prev) => {
      const updatedAvailability = { ...prev.availability };
      updatedAvailability[day] = updatedAvailability[day] || [];
      if (updatedAvailability[day].includes(timeslot)) {
        updatedAvailability[day] = updatedAvailability[day].filter(
          (slot) => slot !== timeslot
        );
      } else {
        updatedAvailability[day] = [...updatedAvailability[day], timeslot];
      }
      return { ...prev, availability: updatedAvailability };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guardar los datos editados en localStorage
    localStorage.setItem("savedProfile", JSON.stringify(editingProfile));
    setProfile(editingProfile);
    alert("Perfil guardado con éxito.");
  };

  const timeslots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const renderProfilePreview = () => {
    return (
      <div className="space-y-4">
        <div>
          <strong>Nombre:</strong> {profile.firstName || "No especificado"}
        </div>
        <div>
          <strong>Apellido:</strong> {profile.lastName || "No especificado"}
        </div>
        <div>
          <strong>Foto de perfil:</strong>
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Foto de perfil"
              className="w-32 h-32 object-cover rounded-full"
            />
          ) : (
            "No especificado"
          )}
        </div>
        <div>
          <strong>Biografía:</strong> {profile.bio || "No especificada"}
        </div>
        <div>
          <strong>Tarifa por hora:</strong>{" "}
          {profile.hourlyRate || "No especificada"}
        </div>
        <div>
          <strong>Especialidades:</strong>{" "}
          {profile.specialties.length > 0
            ? profile.specialties.join(", ")
            : "No especificadas"}
        </div>
      </div>
    );
  };

  const renderEditForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campos del formulario de edición */}
        <div>
          <label className="block text-gray-600 mb-2">Nombre:</label>
          <input
            type="text"
            name="firstName"
            value={editingProfile.firstName || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Apellido:</label>
          <input
            type="text"
            name="lastName"
            value={editingProfile.lastName || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">
            Foto de perfil (URL):
          </label>
          <input
            type="text"
            name="avatar"
            value={editingProfile.avatar || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Biografía:</label>
          <textarea
            name="bio"
            value={editingProfile.bio || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Tarifa por hora:</label>
          <input
            type="number"
            name="hourlyRate"
            value={editingProfile.hourlyRate || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Especialidades:</label>
          {editingProfile.specialties?.map((specialty, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={specialty}
                onChange={(e) => handleSpecialtiesChange(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
          ))}
          <select
            onChange={(e) =>
              handleSpecialtiesChange(
                editingProfile.specialties.length,
                e.target.value
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          >
            <option value="">Selecciona una especialidad</option>
            {specialtiesOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Disponibilidad */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Disponibilidad
          </h3>
          {Object.keys(defaultAvailability).map((day) => (
            <div key={day} className="mb-4">
              <h4 className="font-medium text-gray-600 mb-2 capitalize">
                {day}
              </h4>
              <div className="flex flex-wrap gap-2">
                {timeslots.map((timeslot) => (
                  <button
                    key={timeslot}
                    type="button"
                    onClick={() => handleAvailabilityChange(day, timeslot)}
                    className={`px-4 py-2 border rounded-lg text-sm ${
                      editingProfile.availability[day]?.includes(timeslot)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {timeslot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200"
        >
          Guardar Cambios
        </button>
      </form>
    );
  };

  if (!profile) {
    return <p className="text-center text-gray-500">Cargando perfil...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        {isEditing ? "Editar Perfil" : "Perfil del Asesor"}
      </h2>
      {isEditing ? renderEditForm() : renderProfilePreview()}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-gray-200 mt-4"
      >
        {isEditing ? "Cancelar edición" : "Editar perfil"}
      </button>
    </div>
  );
};

export default AdvisorProfileEdit;
