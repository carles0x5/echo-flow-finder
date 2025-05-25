import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AlertRuleCard } from "@/components/alerts/AlertRuleCard";
import { AlertNotificationCard } from "@/components/alerts/AlertNotificationCard";
import { AlertConfigForm } from "@/components/alerts/AlertConfigForm";
import { useAlertRules } from "@/hooks/useAlertRules";
import { useAlertNotifications } from "@/hooks/useAlertNotifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Bell, 
  Plus,
  FileText,
  CheckCircle2,
  MailCheck,
  MessageSquare,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// UI-friendly format for alert rules
interface AlertRule {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  channels: string[];
  active: boolean;
}

// Convert database alert rule to UI-friendly format
function convertDbAlertRuleToUi(dbRule: any): AlertRule {
  const triggers = typeof dbRule.triggers === 'object' && dbRule.triggers ? 
    (dbRule.triggers.keywords || []) : [];
  
  const channels = typeof dbRule.channels === 'object' && dbRule.channels ? 
    (dbRule.channels.notificationChannels || []) : [];

  return {
    id: dbRule.id,
    name: dbRule.name,
    description: dbRule.description || "",
    triggers: Array.isArray(triggers) ? triggers : [JSON.stringify(triggers)],
    channels: Array.isArray(channels) ? channels : [JSON.stringify(channels)],
    active: dbRule.is_active || false,
  };
}

export default function Alerts() {
  const { 
    alertRules: dbAlertRules, 
    isLoading: isLoadingRules, 
    createAlertRule, 
    updateAlertRule, 
    deleteAlertRule,
    isCreating,
    isUpdating,
    isDeleting
  } = useAlertRules();

  const {
    alertNotifications,
    isLoading: isLoadingNotifications,
    error: notificationsError,
    updateNotificationStatus,
    isUpdating: isUpdatingNotification
  } = useAlertNotifications();

  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [initialFormData, setInitialFormData] = useState<any>(null);

  // Convert database rules to UI format
  const alertRules = dbAlertRules.map(convertDbAlertRuleToUi);

  const handleToggleAlertRule = (id: string, active: boolean) => {
    updateAlertRule({ id, rule: { is_active: active } });
  };

  const handleEditAlertRule = (id: string) => {
    const ruleToEdit = alertRules.find(rule => rule.id === id);
    if (ruleToEdit) {
      setInitialFormData({
        name: ruleToEdit.name,
        description: ruleToEdit.description,
        keywords: ruleToEdit.triggers.join(', '),
        sentimentThreshold: "any",
        channels: ruleToEdit.channels,
        sources: ["twitter", "facebook"],
        isActive: ruleToEdit.active
      });
      setEditingRuleId(id);
      setIsConfigDialogOpen(true);
    }
  };

  const handleDeleteAlertRule = (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta regla de alerta?")) {
      return;
    }
    deleteAlertRule(id);
  };

  const handleMarkAsRead = (id: string) => {
    updateNotificationStatus({ id, status: "read" });
  };

  const handleMarkAsResolved = (id: string) => {
    updateNotificationStatus({ id, status: "resolved" });
  };

  const handleMarkAllAsRead = () => {
    const newNotifications = alertNotifications.filter(n => n.status === "new");
    newNotifications.forEach(notification => {
      updateNotificationStatus({ id: notification.id, status: "read" });
    });
  };

  const handleSubmitAlertConfig = async (values: any) => {
    console.log('Submitting alert config:', values);
    
    const alertRuleData = {
      name: values.name,
      description: values.description || "",
      is_active: values.isActive !== undefined ? values.isActive : true,
      triggers: {
        keywords: values.keywords.split(',').map((k: string) => k.trim()),
        sentimentThreshold: values.sentimentThreshold
      },
      channels: {
        notificationChannels: values.channels
      }
    };

    try {
      if (editingRuleId) {
        await updateAlertRule({ id: editingRuleId, rule: alertRuleData });
      } else {
        await createAlertRule(alertRuleData);
      }
      
      setEditingRuleId(null);
      setInitialFormData(null);
      setIsConfigDialogOpen(false);
    } catch (error) {
      console.error('Error submitting alert config:', error);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Alertas</h1>
          <div className="flex gap-2">
            <Dialog open={isConfigDialogOpen} onOpenChange={(open) => {
              setIsConfigDialogOpen(open);
              if (!open) {
                setEditingRuleId(null);
                setInitialFormData(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Alerta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingRuleId ? 'Editar Alerta' : 'Configurar Alerta'}</DialogTitle>
                  <DialogDescription>
                    Define los parámetros para la detección de alertas.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto">
                  <AlertConfigForm 
                    onSubmit={handleSubmitAlertConfig} 
                    initialData={initialFormData}
                    isEditing={!!editingRuleId}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="notifications">
          <TabsList className="mb-6">
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" /> Notificaciones
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Reglas de alerta
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center gap-1">
              <MailCheck className="h-4 w-4" /> Canales
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            {isLoadingNotifications ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Cargando notificaciones...</span>
              </div>
            ) : notificationsError ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
                <h3 className="text-lg font-medium">Error al cargar las notificaciones</h3>
                <p className="text-muted-foreground mb-4">
                  Hubo un problema al cargar las notificaciones.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 text-blue-600 py-1 px-3 rounded-full text-sm font-medium flex items-center">
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      {alertNotifications.filter((n) => n.status === "new").length} Nuevas
                    </div>
                    <div className="bg-gray-200 text-gray-600 py-1 px-3 rounded-full text-sm font-medium flex items-center">
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      {alertNotifications.filter((n) => n.status === "read").length} Leídas
                    </div>
                    <div className="bg-green-500/10 text-green-600 py-1 px-3 rounded-full text-sm font-medium flex items-center">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      {alertNotifications.filter((n) => n.status === "resolved").length} Resueltas
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleMarkAllAsRead}
                      disabled={isUpdatingNotification || alertNotifications.filter(n => n.status === "new").length === 0}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Marcar todas como leídas
                    </Button>
                  </div>
                </div>

                {alertNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No hay notificaciones</h3>
                    <p className="text-muted-foreground mb-4">
                      Las notificaciones aparecerán aquí cuando se activen las reglas de alerta.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alertNotifications.map((notification) => (
                      <AlertNotificationCard
                        key={notification.id}
                        id={notification.id}
                        title={notification.title}
                        content={notification.content}
                        timestamp={new Date(notification.created_at)}
                        priority={notification.priority as "high" | "medium" | "low"}
                        status={notification.status as "new" | "read" | "resolved"}
                        source={notification.source}
                        url={notification.url || undefined}
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAsResolved={handleMarkAsResolved}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="rules">
            {isLoadingRules ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Cargando reglas...</span>
              </div>
            ) : alertRules.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No hay reglas de alerta</h3>
                <p className="text-muted-foreground mb-4">
                  Crea una nueva regla para comenzar a monitorizar menciones.
                </p>
                <Button onClick={() => setIsConfigDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Alerta
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alertRules.map((rule) => (
                  <AlertRuleCard
                    key={rule.id}
                    id={rule.id}
                    name={rule.name}
                    description={rule.description}
                    triggers={rule.triggers}
                    channels={rule.channels}
                    active={rule.active}
                    onToggle={handleToggleAlertRule}
                    onEdit={handleEditAlertRule}
                    onDelete={handleDeleteAlertRule}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="channels">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <p className="text-muted-foreground mb-4">
                  Configure los canales de notificación para recibir alertas en tiempo real.
                </p>
              </div>

              {/* Slack Channel Configuration */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#4A154B] text-white p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 2c-1.1 0-2 .9-2 2v4.6c0 1.1.9 2 2 2h1.9c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-1.9z" />
                      <path d="M5.9 15.4c-1.1 0-2 .9-2 2v4.6c0 1.1.9 2 2 2h1.9c1.1 0 2-.9 2-2v-4.6c0-1.1-.9-2-2-2H5.9z" />
                      <path d="M14.5 13.4c-1.1 0-2 .9-2 2v4.6c0 1.1.9 2 2 2h1.9c1.1 0 2-.9 2-2v-4.6c0-1.1-.9-2-2-2h-1.9z" />
                      <path d="M5.9 4c-1.1 0-2 .9-2 2v4.6c0 1.1.9 2 2 2h1.9c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H5.9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Slack</h3>
                    <p className="text-sm text-muted-foreground">Notificaciones en tiempo real</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Webhook URL</label>
                    <div className="flex mt-1">
                      <input
                        type="text"
                        value="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXX"
                        className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        readOnly
                      />
                      <Button className="h-10 rounded-l-none">Actualizar</Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Canal</label>
                    <input
                      type="text"
                      value="#alertas-marca"
                      className="flex h-10 w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="slack-active"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked
                      />
                      <label htmlFor="slack-active" className="text-sm font-medium">
                        Activo
                      </label>
                    </div>
                    <Button variant="ghost" size="sm">
                      Enviar prueba
                    </Button>
                  </div>
                </div>
              </div>

              {/* Email Configuration */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="text-sm text-muted-foreground">Notificaciones por correo</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Destinatarios</label>
                    <textarea
                      value="admin@empresa.com, marketing@empresa.com"
                      className="flex h-20 w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separa las direcciones con comas
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Frecuencia</label>
                    <select className="flex h-10 w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option>Inmediata</option>
                      <option>Resumen diario</option>
                      <option>Resumen semanal</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email-active"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked
                      />
                      <label htmlFor="email-active" className="text-sm font-medium">
                        Activo
                      </label>
                    </div>
                    <Button variant="ghost" size="sm">
                      Enviar prueba
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Configuración de canales de notificación próximamente...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
