
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseSources } from '@/services/supabase';
import { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type SourceConfiguration = Database['public']['Tables']['source_configurations']['Row'];
type SourceConfigurationInsert = Database['public']['Tables']['source_configurations']['Insert'];
type SourceConfigurationUpdate = Database['public']['Tables']['source_configurations']['Update'];

export function useSources(userId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query for fetching sources
  const {
    data: sources = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['sources', userId],
    queryFn: async () => {
      const { data, error } = await supabaseSources.getSources(userId);
      if (error) throw error;
      return data || [];
    },
  });

  // Mutation for creating a source
  const createSourceMutation = useMutation({
    mutationFn: async (source: SourceConfigurationInsert) => {
      const { data, error } = await supabaseSources.createSource(source);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      toast({
        title: "Fuente creada",
        description: "La fuente se ha creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating source:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la fuente. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  // Mutation for updating a source
  const updateSourceMutation = useMutation({
    mutationFn: async ({ id, source }: { id: string; source: SourceConfigurationUpdate }) => {
      const { data, error } = await supabaseSources.updateSource(id, source);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      toast({
        title: "Fuente actualizada",
        description: "La fuente se ha actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating source:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la fuente. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting a source
  const deleteSourceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { success, error } = await supabaseSources.deleteSource(id);
      if (error || !success) throw error || new Error('Failed to delete source');
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      toast({
        title: "Fuente eliminada",
        description: "La fuente se ha eliminado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting source:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la fuente. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  return {
    sources,
    isLoading,
    error,
    refetch,
    createSource: createSourceMutation.mutate,
    updateSource: updateSourceMutation.mutate,
    deleteSource: deleteSourceMutation.mutate,
    isCreating: createSourceMutation.isPending,
    isUpdating: updateSourceMutation.isPending,
    isDeleting: deleteSourceMutation.isPending,
  };
}
