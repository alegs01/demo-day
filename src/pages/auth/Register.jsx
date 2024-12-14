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
      // Después de registrar al usuario en Firebase, guardamos en nuestra base de datos
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: userType }),
      });

      const result = await response.json();
      if (response.status === 201) {
        if (userType === 'client') {
          navigate('/advisors');
        } else {
          navigate('/profile');
        }
      } else {
        setErrorMessage(result.message || 'Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
      setErrorMessage('Ocurrió un error. Por favor, intenta de nuevo.');
    }
  };

  const handleGoogleRegister = async () => {
  try {

    const user = await loginWithGoogle();
    const uidAsPassword = user.uid;

    // Registra al usuario en tu backend
    const response = await fetch('http://localhost:5000/api/auth/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        password: uidAsPassword,
        role: userType,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Al recibir una respuesta exitosa, guarda el token y redirige
      localStorage.setItem('token', data.token); // Guarda el token JWT en el localStorage
      console.log(data.token);

            // Decodificar el token para obtener el userId
      const decodedToken = data.token;
      const userId = decodedToken.userId;  // Asegúrate de que el token contenga este campo

      // Usar el userId en tu lógica
      console.log('User ID:', userId);

      navigate('/'); // Redirige al usuario a la página principal
    } else {
      setErrorMessage(data.message || 'Error al iniciar sesión con Google');
    }
  } catch (error) {
    console.error('Error al registrarse con Google:', error);
    setErrorMessage('Error al conectarse con Google');
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
