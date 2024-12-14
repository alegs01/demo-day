import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { registerAuth, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('client');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      await registerAuth(email, password, userType);

      // Navegar según el tipo de usuario
      if (userType === 'client') {
        navigate('/advisors');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
      setErrorMessage('Ocurrió un error. Por favor, intenta de nuevo.');
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const user = await loginWithGoogle();
      console.log('Usuario registrado con Google:', user);

      navigate('/'); // Redirigir a la página principal
    } catch (error) {
      console.error('Error al registrarse con Google:', error);
      setErrorMessage('Ocurrió un error al registrarte con Google. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

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
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Cuenta</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="client">Cliente</option>
            <option value="advisor">Asesor</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Registrarse
        </button>

        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      </form>

      <div className="mt-6">
        <button onClick={handleGoogleRegister} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <img
            className="h-5 w-5 mr-2"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
          />
          Registrate con Google
        </button>
      </div>
    </div>
  );
}
