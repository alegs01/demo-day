import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // Para mostrar mensajes de error en la interfaz

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      // Manejar el error específico de credenciales no válidas
      if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Las credenciales proporcionadas no son válidas. Verifica tu correo y contraseña.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('No se encontró un usuario con ese correo electrónico.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('La contraseña es incorrecta.');
      } else {
        setErrorMessage('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    }
  };

const handleGoogleLogin = async () => {
  try {
    // Llama a loginWithGoogle para obtener el usuario autenticado
    const user = await loginWithGoogle();
    
    // Redirige al perfil después de obtener el usuario
    navigate('/profile');

    // Devuelve el objeto user completo (opcional si quieres usarlo en otro lugar)
    return user;
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);

    // Manejo de errores
    if (error.code === 'auth/invalid-credential') {
      setErrorMessage('Las credenciales de Google no son válidas. Intenta de nuevo.');
    } else {
      setErrorMessage('Ocurrió un error al iniciar sesión con Google. Por favor, intenta de nuevo.');
    }

    throw error; // Re-lanzar el error si necesitas manejarlo externamente
  }
};


  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            {...register('email', { required: 'El correo electrónico es obligatorio' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            {...register('password', { required: 'La contraseña es obligatoria' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Iniciar Sesión
        </button>

        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      </form>

      <div className="mt-6">
        <button onClick={handleGoogleLogin}className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <img
                className="h-5 w-5 mr-2"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
              />
              Google
        </button>
      </div>
    </div>
  );
}
