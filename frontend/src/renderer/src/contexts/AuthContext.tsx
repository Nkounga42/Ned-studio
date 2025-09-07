import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userFromBackend: User) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Hydrate le contexte depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('ned_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('ned_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userFromBackend: User) => {
    setIsLoading(true);
    setError(null);
    try {
      setUser(userFromBackend);
      localStorage.setItem('ned_user', JSON.stringify(userFromBackend));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      localStorage.removeItem('ned_user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('ned_user');
    localStorage.removeItem('ned_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
