import {
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
} from 'preact/compat';
import { createClient } from '@supabase/supabase-js';

const AuthContext = createContext(null);

const supabase = createClient(
  'https://ovbwxzrvkhlulqmuqrdt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92Ynd4enJ2a2hsdWxxbXVxcmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU0OTQyNjAsImV4cCI6MjAxMTA3MDI2MH0.VYnQe_nQvKqSCllnxvoSXvlP2BpRiQTagCuNh3on2kY',
);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // on mount check is authenticated
    supabase.auth.getUser().then((res) => {
      if (res?.data?.user) {
        setUser(res.data.user);
      }
    });
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      setUser(data);
      return { success: true };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const memoizedValue = useMemo(
    () => ({
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
