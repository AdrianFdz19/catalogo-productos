import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Define la interfaz de tu contexto
interface User {
  id: number,
  username: string,
  email: string,
  role: string
}

interface AppContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User>>;
  apiUrl: string | null;
  setAuthLoading: Dispatch<SetStateAction<boolean>>;
  isAuthLoading: boolean;
  handleLogout: () => void;
}

// 2. Crea el contexto con valor inicial opcional (null hasta que se provea)
const AppContext = createContext<AppContextProps | undefined>(undefined);

// 3. Hook para usar el contexto de forma más cómoda
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext debe usarse dentro de un AppProvider");
  return context;
};

// 4. Componente Provider
interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [isAuthLoading, setAuthLoading] = useState<boolean>(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      const res = await fetch(`${apiUrl}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setUser(null);
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Autenticar al usuario en cada recarga
  // Verificación de usuario al cargar app
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch(`${apiUrl}/auth/verify`, {
          method: 'GET',
          credentials: 'include', // importante para enviar la cookie
        });

        const data = await res.json();
        if (data.success && data.user) {
          console.log(data);
          
          setUser(data.user);
        } else {
          console.log(data);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        setUser(null);
        setAuthLoading(false);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, apiUrl, setAuthLoading, isAuthLoading, handleLogout }}>
      {children}
    </AppContext.Provider>
  );
}
