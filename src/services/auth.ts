
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';

export const authService = {
  async signIn(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      return { 
        user: data?.user || null, 
        session: data?.session || null, 
        error 
      };
    } catch (err) {
      console.error('Error signing in:', err);
      return { user: null, session: null, error: err as AuthError };
    }
  },
  
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error('Error signing out:', err);
      return { error: err as AuthError };
    }
  },
  
  async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { user: data?.user || null, error };
    } catch (err) {
      console.error('Error getting current user:', err);
      return { user: null, error: err as AuthError };
    }
  },
  
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data?.session || null, error };
    } catch (err) {
      console.error('Error getting session:', err);
      return { session: null, error: err as AuthError };
    }
  },
  
  async getRoles(): Promise<string | null> {
    try {
      const { user, error } = await this.getCurrentUser();
      if (error || !user) return null;
      
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error getting roles:', profileError);
        return null;
      }
      
      return data?.role || null;
    } catch (err) {
      console.error('Error getting roles:', err);
      return null;
    }
  },
  
  async signUp(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
    try {
      console.log('Signing up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        console.error('Error signing up:', error);
        return { user: null, session: null, error };
      }
      
      if (data.user) {
        console.log('Creating profile for new user:', email);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email || '',
            full_name: null,
            role: 'viewer'
          });
        
        if (profileError) {
          console.error('Error creating profile during signup:', profileError);
          return { 
            user: data.user, 
            session: data.session, 
            error: new Error('Your account was created but there was a problem setting up your profile.') 
          };
        }
        
        console.log('User signup and profile creation successful:', email);
      }
      
      return { 
        user: data.user || null, 
        session: data.session || null, 
        error: null 
      };
    } catch (err) {
      console.error('Unexpected error in signUp:', err);
      return { user: null, session: null, error: err as Error };
    }
  }
};
