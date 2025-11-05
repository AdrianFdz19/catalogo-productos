import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CiMenuBurger } from "react-icons/ci"
import { IoCloseOutline } from "react-icons/io5"
import { useAppContext } from '../../context/AppProvider'

export default function HeaderMobile() {
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate();
    const { user, handleLogout } = useAppContext();

    const toggleMenu = () => setMenuOpen(!menuOpen)

    const handleAuthAction = async () => {
    if (user) {
      await handleLogout()
      navigate('/signin')
    } else {
      navigate('/signin')
    }
  }

    const categories = [
        { name: "Todos los productos", path: "/" },
        { name: "Laptops", path: "/categoria/laptops" },
        { name: "Cámaras", path: "/categoria/camaras" },
        { name: "Smart Home", path: "/categoria/smart-home" },
    ]

    return (
        <header className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
            <div className="flex items-center justify-between px-5 py-4 max-w-6xl mx-auto">
                {/* Logo o nombre */}
                <Link to="/" className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
                        Catálogo
                    </h2>
                </Link>

                {/* Botón del menú */}
                <button
                    onClick={toggleMenu}
                    className="text-gray-700 hover:text-black transition-colors"
                >
                    {menuOpen ? (
                        <IoCloseOutline size={30} />
                    ) : (
                        <CiMenuBurger size={28} />
                    )}
                </button>
            </div>

            {/* Menú desplegable de pantalla completa */}
            <div
                className={`fixed top-0 left-0 w-full bg-white transition-all duration-300 ease-in-out z-20 flex flex-col ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                    }`}
                style={{ height: '95vh' }}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-800">Menú</h2>
                    <button
                        onClick={toggleMenu}
                        className="text-gray-700 hover:text-black transition-colors"
                    >
                        <IoCloseOutline size={30} />
                    </button>
                </div>

                <nav className="flex flex-col items-center justify-center flex-1 gap-8">

                    {user?.role === 'admin' ? (
                        <>
                            <Link
                                to={'/admin/products'}
                                onClick={() => setMenuOpen(false)}
                                className="text-gray-800 text-xl font-medium hover:text-blue-600 transition-colors"
                            >
                                Admin Panel
                            </Link>
                            <Link
                                to={'/admin/products'}
                                onClick={() => setMenuOpen(false)}
                                className="text-gray-800 text-xl font-medium hover:text-blue-600 transition-colors"
                            >
                                Tokens
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to={'/favoritos'}
                                onClick={() => setMenuOpen(false)}
                                className="text-gray-800 text-xl font-medium hover:text-blue-600 transition-colors"
                            >
                                Favoritos
                            </Link>
                        </>
                    )}

                    {categories.map((cat, index) => (
                        <Link
                            key={index}
                            to={cat.path}
                            onClick={() => setMenuOpen(false)}
                            className="text-gray-800 text-xl font-medium hover:text-blue-600 transition-colors"
                        >
                            {cat.name}
                        </Link>
                    ))}
                    <li
                        onClick={handleAuthAction}
                        className="text-gray-800 text-xl font-medium hover:text-blue-600 transition-colors"
                    >
                        Cerrar sesion
                    </li>
                </nav>
            </div>
        </header>
    )
}
