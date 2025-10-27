import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAppContext } from '../context/AppProvider';
import { useNavigate } from 'react-router-dom';

interface SignUpForm {
    username: string;
    email: string;
    full_name: string;
    password: string;
    confirmPassword: string;
}

const SignUp: React.FC = () => {
    const { apiUrl, setUser } = useAppContext();
    const [formData, setFormData] = useState<SignUpForm>({
        username: '',
        email: '',
        full_name: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validación simple
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        // Aquí iría la llamada a la API

        try {
            const response = await fetch(`${apiUrl}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('Formulario enviado:', formData);
                const data = await response.json();
                console.log(data);

                setUser(data.user);

                setSuccess(true);
                setFormData({
                    username: '',
                    email: '',
                    full_name: '',
                    password: '',
                    confirmPassword: '',
                });

                setTimeout(() => {
                    navigate(`/`, { replace: true });
                }, 2500);

            } else {
                const errData = await response.json().catch(() => ({}));
                console.error(`Client error:`, errData.message || response.statusText);
                setError(errData.message || 'Error al registrar usuario');
            }

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Crear cuenta de Admin</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">¡Cuenta creada con éxito!</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Tu nombre de usuario"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Tu nombre completo"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
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
                        Crear cuenta
                    </button>
                    <p className="text-sm text-center text-gray-500 mt-4">
                        ¿Ya tienes una cuenta?{' '}
                        <a
                            href="/signin"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Inicia sesión
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
