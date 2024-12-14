import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Sessions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  // Cargar las sesiones del localStorage
  useEffect(() => {
    if (!user) {
      navigate("/login"); // Si no está autenticado, redirigir a login
    } else {
      const savedSessions = JSON.parse(localStorage.getItem("sessions")) || [];

      // Agregamos un enlace de reunión dinámico si no existe
      const sessionsWithLinks = savedSessions.map((session) => {
        if (!session.meetingLink) {
          return {
            ...session,
            meetingLink: `https://meet.example.com/${
              session.date
            }-${session.time.replace(":", "")}-${user.email}`,
          };
        }
        return session;
      });

      setSessions(sessionsWithLinks);
    }
  }, [user, navigate]);

  if (!user) {
    return <p>Cargando...</p>; // En caso de que no haya usuario o esté verificando
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-indigo-600">Mis Sesiones</h1>

      {sessions.length === 0 ? (
        <p>No tienes sesiones programadas.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session, index) => (
            <li key={index} className="bg-white shadow-lg rounded-md p-4">
              <h2 className="text-xl font-semibold">{session.title}</h2>
              <p>
                <strong>Fecha:</strong> {session.date}
              </p>
              <p>
                <strong>Asesor:</strong> {session.advisorName}
              </p>
              <p>
                <strong>Hora de asesoría:</strong> {session.time}
              </p>
              <p>
                <strong>Link de reunión:</strong>{" "}
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline"
                >
                  {session.meetingLink}
                </a>
              </p>
              <button
                onClick={() => window.open(session.meetingLink, "_blank")}
                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Unirse a Asesoría
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
