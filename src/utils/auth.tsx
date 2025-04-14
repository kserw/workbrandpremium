import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Types for the authentication system
export interface User {
  id: string;
  email: string;
  name: string;
  companyId: string;
  companyName: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock user data for demonstration purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@workbrand.com',
    password: 'workbrand123',
    name: 'Admin User',
    companyId: 'company-1',
    companyName: 'Workbrand Global',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'user@acme.com',
    password: 'password123',
    name: 'John Doe',
    companyId: 'company-2',
    companyName: 'Acme Corporation',
    role: 'user' as const,
  },
  {
    id: '3',
    email: 'user@techcorp.com',
    password: 'password123',
    name: 'Jane Smith',
    companyId: 'company-3',
    companyName: 'TechCorp Inc.',
    role: 'user' as const,
  },
  {
    id: '4',
    email: 'user@mastercard.com',
    password: 'password123',
    name: 'Michael Johnson',
    companyId: 'mastercard',
    companyName: 'Mastercard',
    role: 'user' as const,
  },
  {
    id: '5',
    email: 'admin@mastercard.com',
    password: 'admin123',
    name: 'Sarah Williams',
    companyId: 'mastercard',
    companyName: 'Mastercard',
    role: 'admin' as const,
  },
];

// Create the auth context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
});

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage on initial load
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('workbrand_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user with matching credentials
      const matchedUser = MOCK_USERS.find(u => u.email === email && u.password === password);

      if (!matchedUser) {
        throw new Error('Invalid credentials');
      }

      // Create sanitized user object (without password)
      const { password: _, ...userWithoutPassword } = matchedUser;

      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('workbrand_user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('workbrand_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}
