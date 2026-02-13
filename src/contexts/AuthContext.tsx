
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  isMockMode: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    // Check for active Supabase session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user profile including role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name || 'Usuário',
              role: profile.role || 'patient',
              avatarUrl: profile.avatar_url
            });
          }
        } else {
            // No session found
        }
      } catch (error) {
        console.log('Supabase not configured or connection failed. Switching to Mock Mode.');
        setIsMockMode(true);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, role: UserRole = 'patient') => {
    setLoading(true);
    
    // DEMO / MOCK LOGIN LOGIC
    setTimeout(() => {
        let mockUser: User;

        if (role === 'admin') {
            mockUser = {
                id: 'admin-1',
                email: email,
                name: 'Dr. Edgar Sarmento',
                role: 'admin',
                avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200'
            };
        } else if (role === 'nutritionist') {
             mockUser = {
                id: 'nutri-1',
                email: email,
                name: 'Nutri. Ana Clara',
                role: 'nutritionist',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
            };
        } else if (role === 'trainer') {
             mockUser = {
                id: 'trainer-1',
                email: email,
                name: 'Personal Beto',
                role: 'trainer',
                avatarUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200'
            };
        } else {
            mockUser = {
                id: 'u1',
                email: email,
                name: 'Roberto Mendes',
                role: 'patient',
                avatarUrl: 'https://picsum.photos/200'
            };
        }

        setUser(mockUser);
        setLoading(false);
    }, 800);
  };

  const signOut = async () => {
    setLoading(true);
    if (!isMockMode) {
        await supabase.auth.signOut();
    }
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isMockMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
