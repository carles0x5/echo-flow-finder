
// Este archivo contiene los servicios para interactuar con las APIs de backend
// y con Supabase para autenticación y almacenamiento

// Simula la interacción con las APIs del servicio de IA
export const insightsService = {
  // GET /insights?from=&to=&channels=&tags=
  getInsights: async (params: {
    from?: string;
    to?: string;
    channels?: string[];
    tags?: string[];
    sentiment?: string;
  }) => {
    // En una implementación real, esto llamaría al endpoint correspondiente
    console.log("Getting insights with params:", params);
    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, data: [] };
  },

  // GET /alerts
  getAlerts: async () => {
    console.log("Getting alerts");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, data: [] };
  },

  // POST /query
  query: async (question: string) => {
    console.log("Querying:", question);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      data: {
        answer: "Respuesta simulada a la consulta: " + question,
      },
    };
  },

  // POST /alerts/configure
  configureAlerts: async (config: any) => {
    console.log("Configuring alerts:", config);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true, id: "new-alert-id" };
  },
};

// Simula la integración con Supabase
export const supabaseService = {
  // Autenticación
  auth: {
    signIn: async (email: string, password: string) => {
      console.log(`Signing in with ${email}`);
      // Simular latencia de red
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { user: { id: "user-123", email, role: "admin" }, session: {} };
    },
    signOut: async () => {
      console.log("Signing out");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true };
    },
    getCurrentUser: async () => {
      // Simular autenticación existente
      return { id: "user-123", email: "admin@empresa.com", role: "admin" };
    },
  },

  // Base de datos
  db: {
    // Configuraciones guardadas
    getSavedConfigurations: async () => {
      console.log("Getting saved configurations");
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { data: [], error: null };
    },
    saveConfiguration: async (config: any) => {
      console.log("Saving configuration:", config);
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { data: { id: "config-123", ...config }, error: null };
    },

    // Consultas guardadas
    getSavedQueries: async () => {
      console.log("Getting saved queries");
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { data: [], error: null };
    },
    saveQuery: async (query: string) => {
      console.log("Saving query:", query);
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { data: { id: "query-123", text: query }, error: null };
    },

    // Alertas
    getAlertRules: async () => {
      console.log("Getting alert rules");
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { data: [], error: null };
    },
    saveAlertRule: async (rule: any) => {
      console.log("Saving alert rule:", rule);
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { data: { id: "rule-123", ...rule }, error: null };
    },
  },

  // Tiempo real (para notificaciones)
  realtime: {
    subscribeToAlerts: (callback: (payload: any) => void) => {
      console.log("Subscribing to alerts");
      // Simular eventos de alerta periódicos
      const interval = setInterval(() => {
        callback({
          new: true,
          data: {
            id: `alert-${Date.now()}`,
            title: "Alerta simulada en tiempo real",
            priority: "medium",
            timestamp: new Date(),
          },
        });
      }, 30000); // Cada 30 segundos

      // Retornar función para limpiar la suscripción
      return () => {
        console.log("Unsubscribing from alerts");
        clearInterval(interval);
      };
    },
  },

  // Storage
  storage: {
    uploadFile: async (bucket: string, path: string, file: File) => {
      console.log(`Uploading file to ${bucket}/${path}:`, file.name);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { data: { path }, error: null };
    },
    getPublicUrl: (bucket: string, path: string) => {
      return `https://example-storage.com/${bucket}/${path}`;
    },
  },
};
