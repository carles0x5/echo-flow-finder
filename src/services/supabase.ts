
// Main service file that exports all services for backward compatibility
export { authService as supabaseAuth } from './auth';
export { alertsService as supabaseAlerts } from './alerts';
export { sourcesService as supabaseSources } from './sources';
export { queriesService as supabaseQueries } from './queries';

// Re-export for any existing realtime and storage functionality
export const supabaseRealtime = {
  // subscribeToAlerts: (callback: (payload: any) => void) => {
  //   const subscription = supabase
  //     .channel('alert_notifications')
  //     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alert_notifications' }, callback)
  //     .subscribe();
  
  //   return () => {
  //     supabase.removeChannel(subscription);
  //   };
  // }
};

export const supabaseStorage = {
  // uploadFile: (bucket: string, path: string, file: File) => 
  //   supabase.storage.from(bucket).upload(path, file),
  
  // getPublicUrl: (bucket: string, path: string) => 
  //   supabase.storage.from(bucket).getPublicUrl(path)
};
