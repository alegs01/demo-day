import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Importa useParams para acceder a los parámetros de la ruta
import { StarIcon } from "@heroicons/react/20/solid";

const MOCK_REVIEWS = [
  // Reviews para Carlos López
  {
    id: 1,
    advisorId: 1, // ID del asesor asociado
    author: "Esteban Muñoz",
    rating: 5,
    date: "2024-02-10",
    comment:
      "¡Asesor excelente! Proporcionó consejos financieros claros y prácticos que me ayudaron a tomar mejores decisiones de inversión.",
  },
  {
    id: 2,
    advisorId: 1, // ID del asesor asociado
    author: "Sofía Ramírez",
    rating: 5,
    date: "2024-03-05",
    comment:
      "Excelente atención y profesionalismo. Me ayudó a organizar mis finanzas personales de manera efectiva.",
  },
  {
    id: 3,
    advisorId: 1, // ID del asesor asociado
    author: "Carlos López",
    rating: 4,
    date: "2024-03-12",
    comment:
      "Muy buen asesor, pero me gustaría que las sesiones fueran un poco más largas para profundizar más en los detalles.",
  },
  {
    id: 4,
    advisorId: 1, // ID del asesor asociado
    author: "María Gómez",
    rating: 4,
    date: "2024-04-01",
    comment:
      "Muy buena asesoría, aunque me hubiera gustado tener más ejemplos prácticos de cómo aplicar los consejos.",
  },

  // Reviews para María Fernández
  {
    id: 5,
    advisorId: 2, // ID del asesor asociado
    author: "Ana Martínez",
    rating: 5,
    date: "2024-03-20",
    comment:
      "Increíble experiencia. El asesor entendió perfectamente mis necesidades y me dio recomendaciones muy acertadas.",
  },
  {
    id: 6,
    advisorId: 2, // ID del asesor asociado
    author: "Javier Pérez",
    rating: 3,
    date: "2024-03-22",
    comment:
      "El asesor fue útil, pero creo que podía haber explicado mejor algunas opciones de inversión.",
  },
  {
    id: 7,
    advisorId: 2, // ID del asesor asociado
    author: "Luis Fernández",
    rating: 5,
    date: "2024-04-03",
    comment:
      "Asesor muy competente, me proporcionó un plan claro y me ayudó a invertir de forma segura.",
  },
  {
    id: 8,
    advisorId: 2, // ID del asesor asociado
    author: "Lucía Martínez",
    rating: 4,
    date: "2024-04-12",
    comment:
      "El asesor fue muy claro, pero me hubiera gustado más interacción durante las sesiones.",
  },

  // Reviews para Martin Torres
  {
    id: 9,
    advisorId: 4, // ID del asesor asociado
    author: "Carlos Ruiz",
    rating: 5,
    date: "2024-03-15",
    comment:
      "Una excelente asesoría. Gracias a sus consejos, pude desarrollar una estrategia de marketing que aumentó la visibilidad de mi negocio.",
  },
  {
    id: 10,
    advisorId: 4, // ID del asesor asociado
    author: "Pedro Álvarez",
    rating: 4,
    date: "2024-04-01",
    comment:
      "El asesor tiene un enfoque muy práctico. Me hubiera gustado recibir más ejemplos de su trabajo anterior.",
  },

  // Reviews para David Gómez
  {
    id: 11,
    advisorId: 5, // ID del asesor asociado
    author: "Patricia Gómez",
    rating: 5,
    date: "2024-02-17",
    comment:
      "Excelente asesoría legal, me ayudó a entender todos los aspectos legales relacionados con mi inversión. Muy recomendable.",
  },
  {
    id: 12,
    advisorId: 5, // ID del asesor asociado
    author: "Juan Martínez",
    rating: 4,
    date: "2024-03-05",
    comment:
      "Muy profesional, aunque algunos aspectos legales podrían haber sido explicados de forma más sencilla.",
  },

  // Reviews para Claudio Martínez
  {
    id: 13,
    advisorId: 6, // ID del asesor asociado
    author: "Ricardo Pérez",
    rating: 5,
    date: "2024-03-10",
    comment:
      "Un excelente mentor en el campo de la programación. Me brindó herramientas que me ayudaron a mejorar mis habilidades de desarrollo.",
  },
  {
    id: 14,
    advisorId: 6, // ID del asesor asociado
    author: "Gabriela López",
    rating: 4,
    date: "2024-04-02",
    comment: "...",
  },
  {
    id: 15,
    advisorId: 6, // ID del asesor asociado
    author: "Julian Ramos",
    rating: 3,
    date: "2024-04-05",
    comment:
      "El asesor tiene conocimientos, pero la sesión fue un poco superficial y no se profundizó en los temas que me interesaban.",
  },
  {
    id: 16,
    advisorId: 6, // ID del asesor asociado
    author: "Laura Díaz",
    rating: 3,
    date: "2024-04-06",
    comment:
      "La sesión fue útil, pero esperaba más ejemplos prácticos. A veces me costó seguir el ritmo de la conversación.",
  },
  {
    id: 17,
    advisorId: 6, // ID del asesor asociado
    author: "Carlos Jiménez",
    rating: 3,
    date: "2024-04-07",
    comment:
      "El asesor me brindó información básica, pero no cubrió todas mis dudas y algunas respuestas no fueron lo que esperaba.",
  },
];

export default function ReviewList() {
  const { id } = useParams(); // Obtén el ID del asesor de la ruta
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Filtrar reseñas según el ID del asesor
    const filteredReviews = MOCK_REVIEWS.filter(
      (review) => review.advisorId === parseInt(id)
    ); // Convierte el id a número
    setReviews(filteredReviews);
  }, [id]); // Dependencia de useEffect para actualizar cuando cambie el id

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Reseñas</h2>
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`h-5 w-5 ${
                          index < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {review.author}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay reseñas para este asesor.</p>
      )}
    </div>
  );
}
