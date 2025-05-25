
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseAlerts } from '@/services/supabase';
import { toast } from 'sonner';

export function useAlertNotifications() {
  const queryClient = useQueryClient();

  const {
    data: alertNotifications,
    isLoading,
    error
  } = useQuery({
    queryKey: ['alert-notifications'],
    queryFn: async () => {
      const { data, error } = await supabaseAlerts.getAlertNotifications();
      if (error) throw error;
      return data || [];
    },
  });

  const updateNotificationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('Updating notification status:', id, status);
      const { data, error } = await supabaseAlerts.updateNotificationStatus(id, status);
      if (error) {
        console.error('Error updating notification status:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-notifications'] });
      toast.success('Notification status updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating notification status:', error);
      toast.error(`Failed to update notification status: ${error.message || 'Unknown error'}`);
    },
  });

  return {
    alertNotifications: alertNotifications || [],
    isLoading,
    error,
    updateNotificationStatus: updateNotificationStatus.mutate,
    isUpdating: updateNotificationStatus.isPending,
  };
}
