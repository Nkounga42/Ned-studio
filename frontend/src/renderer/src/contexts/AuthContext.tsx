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
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Check for existing session on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('ned_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error('Error parsing saved user data:', err);
        localStorage.removeItem('ned_user');
      }
    }
  }, []);

const login = async (userFromBackend: { _id: string; name: string; email: string }) => {
  setIsLoading(true);
  setError(null);

  try {
    const userData: User = {
      id: userFromBackend._id,
      username: userFromBackend.name,
      email: userFromBackend.email
    };

    setUser(userData);
    localStorage.setItem('ned_user', JSON.stringify(userData));
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erreur de connexion');
    localStorage.removeItem('ned_user');
    localStorage.removeItem('ned_token');
    throw err;
  } finally {
    setIsLoading(false);
  }
};


  const logout = (): void => {
    setUser(null);
    setError(null);
    localStorage.removeItem('ned_user');
    localStorage.removeItem('ned_token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
