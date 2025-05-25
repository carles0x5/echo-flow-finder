
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sourcesService } from '@/services/sources';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type SourceConfiguration = Database['public']['Tables']['source_configurations']['Row'];
type SourceConfigurationInsert = Database['public']['Tables']['source_configurations']['Insert'];
type SourceConfigurationUpdate = Database['public']['Tables']['source_configurations']['Update'];

export function useSources(userId?: string) {
  const queryClient = useQueryClient();

  const {
    data: sources = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sources', userId],
    queryFn: async () => {
      const { data, error } = await sourcesService.getSources(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const createSourceMutation = useMutation({
    mutationFn: (source: SourceConfigurationInsert) => 
      sourcesService.createSource(source),
    onSuccess: (result) => {
      if (result.error) {
        toast.error('Error al crear la fuente: ' + result.error.message);
      } else {
        toast.success('Fuente creada exitosamente');
        queryClient.invalidateQueries({ queryKey: ['sources'] });
      }
    },
    onError: (error) => {
      toast.error('Error inesperado al crear la fuente');
      console.error('Create source error:', error);
    },
  });

  const updateSourceMutation = useMutation({
    mutationFn: ({ id, source }: { id: string; source: SourceConfigurationUpdate }) =>
      sourcesService.updateSource(id, source),
    onSuccess: (result) => {
      if (result.error) {
        toast.error('Error al actualizar la fuente: ' + result.error.message);
      } else {
        toast.success('Fuente actualizada exitosamente');
        queryClient.invalidateQueries({ queryKey: ['sources'] });
      }
    },
    onError: (error) => {
      toast.error('Error inesperado al actualizar la fuente');
      console.error('Update source error:', error);
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: (id: string) => sourcesService.deleteSource(id),
    onSuccess: (result) => {
      if (result.error) {
        toast.error('Error al eliminar la fuente: ' + result.error.message);
      } else {
        toast.success('Fuente eliminada exitosamente');
        queryClient.invalidateQueries({ queryKey: ['sources'] });
      }
    },
    onError: (error) => {
      toast.error('Error inesperado al eliminar la fuente');
      console.error('Delete source error:', error);
    },
  });

  return {
    sources,
    isLoading,
    error,
    createSource: createSourceMutation.mutate,
    updateSource: updateSourceMutation.mutate,
    deleteSource: deleteSourceMutation.mutate,
    isCreating: createSourceMutation.isPending,
    isUpdating: updateSourceMutation.isPending,
    isDeleting: deleteSourceMutation.isPending,
  };
}
