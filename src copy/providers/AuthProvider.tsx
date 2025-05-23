import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { supabaseAuth } from '@/services/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to ensure user profile exists (used as a fallback)
async function ensureUserProfile(user: User) {
  if (!user) return;
  
  try {
    console.log('Checking profile for user:', user.email);
    
    // First check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "row not found" error
      console.error('Error checking for existing profile:', checkError);
      return;
    }
    
    // If profile already exists, no need to create a new one
    if (existingProfile) {
      console.log('Profile already exists for user:', user.email);
      return;
    }
    
    console.log('Creating profile for user:', user.email);
    
    // Otherwise, create a new profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || null,
        role: 'viewer' // Default role
      });
    
    if (insertError) {
      console.error('Error creating user profile:', insertError);
    } else {
      console.log('Created profile for user:', user.email);
    }
  } catch (err) {
    console.error('Unexpected error ensuring user profile:', err);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider initializing');
    
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
