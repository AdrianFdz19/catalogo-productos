import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppProvider'

export default function Header() {
  const navigate = useNavigate()
  const { user, handleLogout } = useAppContext()

  const handleAuthAction = async () => {
    if (user) {
      await handleLogout()
      navigate('/signin')
    } else {
      navigate('/signin')
    }
  }

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-0 py-3">
        
        {/* Logo / Nombre */}
        <Link to="/" className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            Catálogo
          </h2>
        </Link>

        {/* Navegación */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
          >
            Productos
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin/products"
              className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            >
              Panel Admin
            </Link>
          )}

          {user?.role === 'user' && (
            <Link
              to="/favoritos"
              className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            >
              Favoritos
            </Link>
          )}

          <button
            onClick={handleAuthAction}
            className="bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
          >
            {user ? 'Cerrar sesión' : 'Iniciar sesión'}
          </button>
        </nav>
      </div>
    </header>
  )
}
