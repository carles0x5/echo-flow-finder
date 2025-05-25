
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type SavedQuery = Database['public']['Tables']['saved_queries']['Row'];
type SavedQueryInsert = Database['public']['Tables']['saved_queries']['Insert'];

export const queriesService = {
  async getSavedQueries(userId?: string): Promise<{ data: SavedQuery[] | null; error: PostgrestError | null }> {
    try {
      let query = supabase
        .from('saved_queries')
        .select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching saved queries:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error fetching saved queries:', err);
      return { data: null, error: err as PostgrestError };
    }
  },

  async saveQuery(query: SavedQueryInsert): Promise<{ data: SavedQuery | null; error: PostgrestError | null }> {
    try {
      const { data, error } = await supabase
        .from('saved_queries')
        .insert(query)
        .select()
        .single();
      
      if (error) {
        console.error('Error saving query:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error saving query:', err);
      return { data: null, error: err as PostgrestError };
    }
  },

  async deleteQuery(id: string): Promise<{ success: boolean; error: PostgrestError | null }> {
    try {
      const { error } = await supabase
        .from('saved_queries')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting saved query ${id}:`, error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error(`Unexpected error deleting saved query ${id}:`, err);
      return { success: false, error: err as PostgrestError };
    }
  }
};
