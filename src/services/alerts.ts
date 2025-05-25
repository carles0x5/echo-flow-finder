
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type AlertRule = Database['public']['Tables']['alert_rules']['Row'];
type AlertRuleInsert = Database['public']['Tables']['alert_rules']['Insert'];
type AlertRuleUpdate = Database['public']['Tables']['alert_rules']['Update'];
type AlertNotification = Database['public']['Tables']['alert_notifications']['Row'];
type AlertNotificationUpdate = Database['public']['Tables']['alert_notifications']['Update'];

export const alertsService = {
  async getAlertRules(userId?: string): Promise<{ data: AlertRule[] | null; error: PostgrestError | null }> {
    try {
      let query = supabase
        .from('alert_rules')
        .select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching alert rules:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error fetching alert rules:', err);
      return { data: null, error: err as PostgrestError };
    }
  },
  
  async createAlertRule(rule: AlertRuleInsert): Promise<{ data: AlertRule | null; error: PostgrestError | null }> {
    try {
      const ruleWithTimestamp = {
        ...rule,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('alert_rules')
        .insert(ruleWithTimestamp)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating alert rule:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error creating alert rule:', err);
      return { data: null, error: err as PostgrestError };
    }
  },
  
  async updateAlertRule(id: string, rule: AlertRuleUpdate): Promise<{ data: AlertRule | null; error: PostgrestError | null }> {
    try {
      const ruleWithTimestamp = {
        ...rule,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('alert_rules')
        .update(ruleWithTimestamp)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating alert rule ${id}:`, error);
      }
      
      return { data, error };
    } catch (err) {
      console.error(`Unexpected error updating alert rule ${id}:`, err);
      return { data: null, error: err as PostgrestError };
    }
  },
  
  async deleteAlertRule(id: string): Promise<{ success: boolean; error: PostgrestError | null }> {
    try {
      const { error } = await supabase
        .from('alert_rules')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting alert rule ${id}:`, error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error(`Unexpected error deleting alert rule ${id}:`, err);
      return { success: false, error: err as PostgrestError };
    }
  },
  
  async getAlertNotifications(): Promise<{ data: AlertNotification[] | null; error: PostgrestError | null }> {
    try {
      const { data, error } = await supabase
        .from('alert_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching alert notifications:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error fetching alert notifications:', err);
      return { data: null, error: err as PostgrestError };
    }
  },
  
  async updateNotificationStatus(id: string, status: string): Promise<{ data: AlertNotification | null; error: PostgrestError | null }> {
    try {
      const { data, error } = await supabase
        .from('alert_notifications')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating notification status ${id}:`, error);
      }
      
      return { data, error };
    } catch (err) {
      console.error(`Unexpected error updating notification status ${id}:`, err);
      return { data: null, error: err as PostgrestError };
    }
  }
};
