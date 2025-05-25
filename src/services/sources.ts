
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type SourceConfiguration = Database['public']['Tables']['source_configurations']['Row'];
type SourceConfigurationInsert = Database['public']['Tables']['source_configurations']['Insert'];
type SourceConfigurationUpdate = Database['public']['Tables']['source_configurations']['Update'];

export const sourcesService = {
  async getSources(userId?: string): Promise<{ data: SourceConfiguration[] | null; error: PostgrestError | null }> {
    try {
      let query = supabase
        .from('source_configurations')
        .select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching source configurations:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error fetching source configurations:', err);
      return { data: null, error: err as PostgrestError };
    }
  },

  async createSource(source: SourceConfigurationInsert): Promise<{ data: SourceConfiguration | null; error: PostgrestError | null }> {
    try {
      const sourceWithTimestamp = {
        ...source,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('source_configurations')
        .insert(sourceWithTimestamp)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating source configuration:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error creating source configuration:', err);
      return { data: null, error: err as PostgrestError };
    }
  },

  async updateSource(id: string, source: SourceConfigurationUpdate): Promise<{ data: SourceConfiguration | null; error: PostgrestError | null }> {
    try {
      const sourceWithTimestamp = {
        ...source,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('source_configurations')
        .update(sourceWithTimestamp)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating source configuration ${id}:`, error);
      }
      
      return { data, error };
    } catch (err) {
      console.error(`Unexpected error updating source configuration ${id}:`, err);
      return { data: null, error: err as PostgrestError };
    }
  },

  async deleteSource(id: string): Promise<{ success: boolean; error: PostgrestError | null }> {
    try {
      const { error } = await supabase
        .from('source_configurations')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting source configuration ${id}:`, error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error(`Unexpected error deleting source configuration ${id}:`, err);
      return { success: false, error: err as PostgrestError };
    }
  }
};
