import * as React from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { supabaseAuth } from '@/services/supabase';
import * as Tabs from '@radix-ui/react-tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  console.log('Auth component render - user:', user ? user.email : 'none');
  
  if (user) {
    console.log('Auth component - redirecting to dashboard');
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    
    console.log('Auth form submitted - isLogin:', isLogin);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (isLogin) {
        console.log('Attempting login');
        const { error } = await supabaseAuth.signIn(email, password);
        if (error) throw error;
        console.log('Login successful');
      } else {
        console.log('Attempting signup');
        // Use our new service method that handles profile creation
        const { error } = await supabaseAuth.signUp(email, password);
        if (error) throw error;
        console.log('Signup successful');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <Tabs.Root defaultValue="login" onValueChange={(value) => setIsLogin(value === 'login')}>
          <Tabs.List className="flex border-b border-gray-200 mb-6">
            <Tabs.Trigger
              value="login"
              className="px-4 py-2 -mb-px text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-300 focus:outline-none focus:border-blue-500"
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="register"
              className="px-4 py-2 -mb-px text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-300 focus:outline-none focus:border-blue-500"
            >
              Register
            </Tabs.Trigger>
          </Tabs.List>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Signing In' : 'Signing Up'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </Button>
          </form>
        </Tabs.Root>
      </div>
    </div>
  );
}
