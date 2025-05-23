
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SourceCard } from "@/components/sources/SourceCard";
import { SourceConfigForm } from "@/components/sources/SourceConfigForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FunctionSquare, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Datos simulados para las fuentes
const mockSources = [
  {
    id: "1",
    name: "Twitter - Marca principal",
    type: "twitter" as const,
    active: true,
    keywords: ["marca", "producto", "#marca"],
    accounts: ["@marca", "@competidor1", "@competidor2"],
    lastSync: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "2",
    name: "Facebook - Páginas oficiales",
    type: "facebook" as const,
    active: true,
    keywords: ["marca", "producto", "servicio"],
    accounts: ["Marca Oficial", "Servicio al Cliente"],
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Instagram - Marketing",
    type: "instagram" as const,
    active: true,
    keywords: ["#marca", "#producto", "#industria"],
    accounts: ["@marca.oficial", "@influencer1"],
    lastSync: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Blogs especializados",
    type: "blog" as const,
    active: false,
    keywords: ["reseña marca", "opinión producto", "comparativa"],
    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export default function Sources() {
  const [sources, setSources] = useState(mockSources);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const handleToggleSource = (id: string, active: boolean) => {
    setSources(
      sources.map((source) =>
        source.id === id ? { ...source, active } : source
      )
    );
  };

  const handleEditSource = (id: string) => {
    // En una implementación real, esto abriría un diálogo con el formulario pre-rellenado
    setIsConfigDialogOpen(true);
  };

  const handleDeleteSource = (id: string) => {
    setSources(sources.filter((source) => source.id !== id));
  };

  const handleSubmitSourceConfig = (values: any) => {
    // Simular guardar una nueva fuente o editar una existente
    console.log("Form values:", values);
    setIsConfigDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Fuentes de datos</h1>
          <div className="flex gap-2">
            <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Fuente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Configurar Fuente</DialogTitle>
                  <DialogDescription>
                    Define los parámetros para monitorizar esta fuente de datos.
                  </DialogDescription>
                </DialogHeader>
                <SourceConfigForm onSubmit={handleSubmitSourceConfig} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Fuentes Activas</TabsTrigger>
            <TabsTrigger value="inactive">Fuentes Inactivas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sources
                .filter((source) => source.active)
                .map((source) => (
                  <SourceCard
                    key={source.id}
                    id={source.id}
                    name={source.name}
                    type={source.type}
                    active={source.active}
                    keywords={source.keywords}
                    accounts={source.accounts}
                    lastSync={source.lastSync}
                    onToggle={handleToggleSource}
                    onEdit={handleEditSource}
                    onDelete={handleDeleteSource}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="inactive">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sources
                .filter((source) => !source.active)
                .map((source) => (
                  <SourceCard
                    key={source.id}
                    id={source.id}
                    name={source.name}
                    type={source.type}
                    active={source.active}
                    keywords={source.keywords}
                    accounts={source.accounts}
                    lastSync={source.lastSync}
                    onToggle={handleToggleSource}
                    onEdit={handleEditSource}
                    onDelete={handleDeleteSource}
                  />
                ))}
            </div>
            {sources.filter((source) => !source.active).length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <FunctionSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No hay fuentes inactivas</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Todas tus fuentes configuradas están activas.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="max-w-3xl mx-auto">
              <div className="bg-primary/5 p-4 rounded-lg mb-6 flex items-start gap-3">
                <Settings className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Configuración global de fuentes</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estas configuraciones se aplican a todas las fuentes de datos. Puedes establecer límites, configurar la frecuencia de actualización y más.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Frecuencia de sincronización</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Twitter</label>
                        <select className="bg-background border rounded-md text-sm py-1 px-2">
                          <option>5 minutos</option>
                          <option>15 minutos</option>
                          <option>30 minutos</option>
                          <option>1 hora</option>
                        </select>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        El intervalo en el que se recogerán nuevos datos.
                      </p>
                    </div>
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Facebook</label>
                        <select className="bg-background border rounded-md text-sm py-1 px-2">
                          <option>30 minutos</option>
                          <option>1 hora</option>
                          <option>2 horas</option>
                          <option>6 horas</option>
                        </select>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        El intervalo en el que se recogerán nuevos datos.
                      </p>
                    </div>
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Instagram</label>
                        <select className="bg-background border rounded-md text-sm py-1 px-2">
                          <option>30 minutos</option>
                          <option>1 hora</option>
                          <option>2 horas</option>
                          <option>6 horas</option>
                        </select>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        El intervalo en el que se recogerán nuevos datos.
                      </p>
                    </div>
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Blogs y foros</label>
                        <select className="bg-background border rounded-md text-sm py-1 px-2">
                          <option>1 hora</option>
                          <option>2 horas</option>
                          <option>6 horas</option>
                          <option>12 horas</option>
                        </select>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        El intervalo en el que se recogerán nuevos datos.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Límites de API</h3>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Límite diario máximo de peticiones</label>
                      <input
                        type="number"
                        value="5000"
                        className="bg-background border rounded-md text-sm py-1 px-2 w-32 text-right"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Tasa de peticiones por minuto</label>
                      <input
                        type="number"
                        value="60"
                        className="bg-background border rounded-md text-sm py-1 px-2 w-32 text-right"
                      />
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="rate-limit" className="mr-2" checked />
                      <label htmlFor="rate-limit" className="text-sm">
                        Activar limitación automática para evitar errores de límite de API
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Guardar configuración</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
