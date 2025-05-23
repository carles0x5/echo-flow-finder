
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

const alertConfigSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  description: z.string().optional(),
  keywords: z.string().min(1, {
    message: "Debe incluir al menos una palabra clave.",
  }),
  sentimentThreshold: z.enum(["any", "negative", "positive"]),
  channels: z.array(z.string()).min(1, {
    message: "Debe seleccionar al menos un canal de notificación.",
  }),
  sources: z.array(z.string()).min(1, {
    message: "Debe seleccionar al menos una fuente de datos.",
  }),
  isActive: z.boolean().default(true),
});

type AlertConfigValues = z.infer<typeof alertConfigSchema>;

interface AlertConfigFormProps {
  initialData?: Partial<AlertConfigValues>;
  onSubmit: (values: AlertConfigValues) => void;
  isEditing?: boolean;
}

export function AlertConfigForm({
  initialData,
  onSubmit,
  isEditing = false,
}: AlertConfigFormProps) {
  const form = useForm<AlertConfigValues>({
    resolver: zodResolver(alertConfigSchema),
    defaultValues: {
      name: "",
      description: "",
      keywords: "",
      sentimentThreshold: "any",
      channels: [],
      sources: [],
      isActive: true,
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('Setting initial data:', initialData);
      form.reset({
        name: initialData.name || "",
        description: initialData.description || "",
        keywords: initialData.keywords || "",
        sentimentThreshold: initialData.sentimentThreshold || "any",
        channels: initialData.channels || [],
        sources: initialData.sources || [],
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: AlertConfigValues) => {
    console.log('Form submitted with values:', values);
    onSubmit(values);
  };

  const notificationChannels = [
    { id: "app", label: "Aplicación" },
    { id: "email", label: "Email" },
    { id: "slack", label: "Slack" },
  ];

  const dataSources = [
    { id: "twitter", label: "Twitter" },
    { id: "facebook", label: "Facebook" },
    { id: "instagram", label: "Instagram" },
    { id: "blogs", label: "Blogs" },
    { id: "forums", label: "Foros" },
    { id: "news", label: "Noticias" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Alerta" : "Nueva Alerta"}</CardTitle>
        <CardDescription>
          Configure los parámetros para monitorizar menciones y recibir alertas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la alerta" {...field} />
                    </FormControl>
                    <FormDescription>Un nombre descriptivo para identificar esta alerta.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sentimentThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sentimiento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar umbral" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="any">Cualquiera</SelectItem>
                        <SelectItem value="negative">Negativo</SelectItem>
                        <SelectItem value="positive">Positivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Alertar basado en el sentimiento detectado.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción de la alerta" {...field} />
                  </FormControl>
                  <FormDescription>
                    Una breve descripción del propósito de esta alerta.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palabras clave</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="palabra1, palabra2, 'frase exacta'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Palabras o frases clave separadas por comas. Use comillas para frases exactas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sources"
              render={() => (
                <FormItem>
                  <FormLabel>Fuentes</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {dataSources.map((source) => (
                      <FormField
                        key={source.id}
                        control={form.control}
                        name="sources"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={source.id}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(source.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, source.id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== source.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {source.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>
                    Seleccione las fuentes de datos a monitorizar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="channels"
              render={() => (
                <FormItem>
                  <FormLabel>Canales de notificación</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {notificationChannels.map((channel) => (
                      <FormField
                        key={channel.id}
                        control={form.control}
                        name="channels"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={channel.id}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(channel.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, channel.id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== channel.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {channel.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>
                    Seleccione dónde desea recibir las notificaciones.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Activar</FormLabel>
                    <FormDescription>
                      Marque esta opción para activar la alerta inmediatamente después de guardar.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="submit">
                {isEditing ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
