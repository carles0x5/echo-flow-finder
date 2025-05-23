
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

export function useSavedQueries() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: savedQueries,
    isLoading,
    error
  } = useQuery({
    queryKey: ['saved-queries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('saved_queries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const saveQuery = useMutation({
    mutationFn: async (text: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('saved_queries')
        .insert({
          text,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-queries'] });
      toast.success('Query saved successfully');
    },
    onError: (error: any) => {
      console.error('Error saving query:', error);
      toast.error('Failed to save query');
    },
  });

  const deleteQuery = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('saved_queries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-queries'] });
      toast.success('Query deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting query:', error);
      toast.error('Failed to delete query');
    },
  });

  return {
    savedQueries: savedQueries || [],
    isLoading,
    error,
    saveQuery: saveQuery.mutate,
    deleteQuery: deleteQuery.mutate,
    isSaving: saveQuery.isPending,
    isDeleting: deleteQuery.isPending,
  };
}
