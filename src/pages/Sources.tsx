import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SourceCard } from "@/components/sources/SourceCard";
import { SourceConfigForm } from "@/components/sources/SourceConfigForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSources } from "@/hooks/useSources";
import { authService } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { SourcesEmptyState } from "@/components/sources/SourcesEmptyState";
import { SourcesConfigTab } from "@/components/sources/SourcesConfigTab";

type SourceConfiguration = Database['public']['Tables']['source_configurations']['Row'];

export default function Sources() {
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<SourceConfiguration | null>(null);

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { user } = await authService.getCurrentUser();
      return user;
    },
  });

  const {
    sources,
    isLoading,
    error,
    createSource,
    updateSource,
    deleteSource,
    isCreating,
    isUpdating,
    isDeleting,
  } = useSources(currentUser?.id);

  const handleToggleSource = (id: string, active: boolean) => {
    updateSource({
      id,
      source: { is_active: active }
    });
  };

  const handleEditSource = (id: string) => {
    const source = sources.find(s => s.id === id);
    if (source) {
      setEditingSource(source);
      setIsConfigDialogOpen(true);
    }
  };

  const handleDeleteSource = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta fuente?')) {
      deleteSource(id);
    }
  };

  const handleSubmitSourceConfig = (values: any) => {
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    const sourceData = {
      user_id: currentUser.id,
      name: values.name,
      type: values.type,
      credentials: values.credentials,
      monitoring_config: {
        keywords: values.monitoringConfig.keywords,
        excludedKeywords: values.monitoringConfig.excludedKeywords,
        languages: values.monitoringConfig.languages,
        locations: values.monitoringConfig.locations || [],
        accountsToMonitor: values.accountsToMonitor
      },
      is_active: values.isActive
    };

    if (editingSource) {
      updateSource({
        id: editingSource.id,
        source: sourceData
      });
    } else {
      createSource(sourceData);
    }

    setIsConfigDialogOpen(false);
    setEditingSource(null);
  };

  const handleCloseDialog = () => {
    setIsConfigDialogOpen(false);
    setEditingSource(null);
  };

  // Transform source data for SourceCard component
  const transformSourceForCard = (source: SourceConfiguration) => {
    const config = source.monitoring_config as any;
    return {
      id: source.id,
      name: source.name,
      type: source.type as "twitter" | "facebook" | "instagram" | "blog" | "forum" | "news",
      active: source.is_active || false,
      keywords: config?.keywords ? config.keywords.split(',').map((k: string) => k.trim()) : [],
      accounts: config?.accountsToMonitor ? config.accountsToMonitor.split(',').map((a: string) => a.trim()) : [],
      lastSync: new Date(source.updated_at || source.created_at || Date.now()),
    };
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando fuentes...</span>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            Error al cargar las fuentes: {error.message}
          </div>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </AppLayout>
    );
  }

  const transformedSources = sources.map(transformSourceForCard);
  const activeSources = transformedSources.filter(source => source.active);
  const inactiveSources = transformedSources.filter(source => !source.active);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Fuentes de datos</h1>
          <div className="flex gap-2">
            <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9" disabled={isCreating}>
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Nueva Fuente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSource ? "Editar Fuente" : "Configurar Fuente"}
                  </DialogTitle>
                  <DialogDescription>
                    Define los parámetros para monitorizar esta fuente de datos.
                  </DialogDescription>
                </DialogHeader>
                <SourceConfigForm 
                  onSubmit={handleSubmitSourceConfig}
                  initialData={editingSource ? {
                    name: editingSource.name,
                    type: editingSource.type as any,
                    credentials: editingSource.credentials as any || {},
                    monitoringConfig: editingSource.monitoring_config as any || {},
                    isActive: editingSource.is_active || false
                  } : undefined}
                  isEditing={!!editingSource}
                />
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Fuentes Activas ({activeSources.length})</TabsTrigger>
            <TabsTrigger value="inactive">Fuentes Inactivas ({inactiveSources.length})</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeSources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSources.map((source) => (
                  <SourceCard
                    key={source.id}
                    {...source}
                    onToggle={handleToggleSource}
                    onEdit={handleEditSource}
                    onDelete={handleDeleteSource}
                  />
                ))}
              </div>
            ) : (
              <SourcesEmptyState
                title="No hay fuentes activas"
                description="Crea tu primera fuente de datos para comenzar a monitorizar."
                showCreateButton
                onCreateClick={() => setIsConfigDialogOpen(true)}
              />
            )}
          </TabsContent>
          
          <TabsContent value="inactive">
            {inactiveSources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inactiveSources.map((source) => (
                  <SourceCard
                    key={source.id}
                    {...source}
                    onToggle={handleToggleSource}
                    onEdit={handleEditSource}
                    onDelete={handleDeleteSource}
                  />
                ))}
              </div>
            ) : (
              <SourcesEmptyState
                title="No hay fuentes inactivas"
                description="Todas tus fuentes configuradas están activas."
              />
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <SourcesConfigTab />
          </TabsContent>
        </Tabs>

        {(isUpdating || isDeleting) && (
          <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">
                {isUpdating && "Actualizando fuente..."}
                {isDeleting && "Eliminando fuente..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
