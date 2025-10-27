import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // si usas React Router
import { useAppContext } from '../context/AppProvider';

interface SignInForm {
  usernameOrEmail: string;
  password: string;
}

const SignIn: React.FC = () => {
  const location = useLocation();
  const from = location.state?.from || '/admin/products';
  const { apiUrl, setUser } = useAppContext();
  const [formData, setFormData] = useState<SignInForm>({
    usernameOrEmail: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // para redirigir después de login

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${apiUrl}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 🔑 Enviar cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al iniciar sesión');
        return;
      }

      setUser(data.user);
      setSuccess(true);
      setFormData({ usernameOrEmail: '', password: '' });

      // Redirigir al dashboard o home
      setTimeout(() => navigate(from, { replace: true }), 1500);

    } catch (err) {
      console.error(err);
      setError('Error en la conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Iniciar sesión</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">¡Ingreso exitoso!</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario o correo
            </label>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              placeholder="Tu usuario o correo"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              Mostrar contraseña
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          ¿No tienes una cuenta?{' '}
          <a
            href="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
