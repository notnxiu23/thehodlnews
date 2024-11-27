import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initNetlifyIdentity, getCurrentUser, openNetlifyModal, logout as netlifyLogout } from '../services/netlify-identity';
import toast from 'react-hot-toast';

interface User {
  email: string;
  user_metadata: {
    full_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleLogin = (user: User) => {
      if (mounted) {
        setUser(user);
        toast.success('Successfully logged in!');
      }
    };

    const handleLogout = () => {
      if (mounted) {
        setUser(null);
        toast.success('Successfully logged out');
      }
    };

    const handleError = (err: Error) => {
      console.error('Auth error:', err);
      toast.error('Authentication error occurred');
    };

    const initialize = async () => {
      try {
        await initNetlifyIdentity();
        
        if (!mounted) return;

        // Set initial user
        const currentUser = getCurrentUser();
        setUser(currentUser);

        // Set up event listeners
        window.netlifyIdentity.on('login', handleLogin);
        window.netlifyIdentity.on('logout', handleLogout);
        window.netlifyIdentity.on('error', handleError);

      } catch (error) {
        console.error('Failed to initialize Netlify Identity:', error);
        if (mounted) {
          toast.error('Failed to initialize authentication');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      if (window.netlifyIdentity) {
        window.netlifyIdentity.off('login', handleLogin);
        window.netlifyIdentity.off('logout', handleLogout);
        window.netlifyIdentity.off('error', handleError);
      }
    };
  }, []);

  const login = () => {
    try {
      openNetlifyModal('login');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to open login modal');
    }
  };

  const signup = () => {
    try {
      openNetlifyModal('signup');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to open signup modal');
    }
  };

  const logout = () => {
    try {
      netlifyLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}