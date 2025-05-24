
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseAlerts } from '@/services/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type AlertRule = Database['public']['Tables']['alert_rules']['Row'];
type AlertRuleInsert = Database['public']['Tables']['alert_rules']['Insert'];
type AlertRuleUpdate = Database['public']['Tables']['alert_rules']['Update'];

// Helper function to ensure user profile exists
async function ensureUserProfile(userId: string, userEmail: string) {
  try {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (!existingProfile) {
      console.log('Creating missing profile for user:', userEmail);
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userEmail,
          role: 'viewer'
        });
      
      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
    }
  } catch (error: any) {
    if (error.code !== 'PGRST116') { // Not a "not found" error
      throw error;
    }
  }
}

export function useAlertRules() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: alertRules,
    isLoading,
    error
  } = useQuery({
    queryKey: ['alert-rules', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabaseAlerts.getAlertRules(user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const createAlertRule = useMutation({
    mutationFn: async (rule: Omit<AlertRuleInsert, 'user_id'>) => {
      if (!user?.id || !user?.email) throw new Error('User not authenticated');
      
      // Ensure user profile exists before creating alert rule
      await ensureUserProfile(user.id, user.email);
      
      const ruleWithUserId: AlertRuleInsert = {
        ...rule,
        user_id: user.id,
      };
      
      console.log('Creating alert rule:', ruleWithUserId);
      const { data, error } = await supabaseAlerts.createAlertRule(ruleWithUserId);
      if (error) {
        console.error('Error creating alert rule:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
      toast.success('Alert rule created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating alert rule:', error);
      toast.error(`Failed to create alert rule: ${error.message || 'Unknown error'}`);
    },
  });

  const updateAlertRule = useMutation({
    mutationFn: async ({ id, rule }: { id: string; rule: AlertRuleUpdate }) => {
      console.log('Updating alert rule:', id, rule);
      const { data, error } = await supabaseAlerts.updateAlertRule(id, rule);
      if (error) {
        console.error('Error updating alert rule:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
      toast.success('Alert rule updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating alert rule:', error);
      toast.error(`Failed to update alert rule: ${error.message || 'Unknown error'}`);
    },
  });

  const deleteAlertRule = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting alert rule:', id);
      const { success, error } = await supabaseAlerts.deleteAlertRule(id);
      if (error || !success) {
        console.error('Error deleting alert rule:', error);
        throw error || new Error('Failed to delete alert rule');
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
      toast.success('Alert rule deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting alert rule:', error);
      toast.error(`Failed to delete alert rule: ${error.message || 'Unknown error'}`);
    },
  });

  return {
    alertRules: alertRules || [],
    isLoading,
    error,
    createAlertRule: createAlertRule.mutate,
    updateAlertRule: updateAlertRule.mutate,
    deleteAlertRule: deleteAlertRule.mutate,
    isCreating: createAlertRule.isPending,
    isUpdating: updateAlertRule.isPending,
    isDeleting: deleteAlertRule.isPending,
  };
}
