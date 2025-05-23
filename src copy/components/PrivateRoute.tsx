import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - loading:', loading, 'user:', user ? user.email : 'none');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('PrivateRoute - redirecting to auth page');
    return <Navigate to="/auth" replace />;
  }

  console.log('PrivateRoute - rendering protected content');
  return children;
}
