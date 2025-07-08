import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define la interfaz de tu contexto
interface AppContextProps {
  user: string | null;
  setUser: (user: string | null) => void;
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
  const [user, setUser] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
