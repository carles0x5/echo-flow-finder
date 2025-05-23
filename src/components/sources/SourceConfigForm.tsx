
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const sourceConfigSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  type: z.enum(["twitter", "facebook", "instagram", "blog", "forum", "news"]),
  credentials: z.object({
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
    accessToken: z.string().optional(),
    accessTokenSecret: z.string().optional(),
  }),
  monitoringConfig: z.object({
    keywords: z.string().min(1, {
      message: "Debe incluir al menos una palabra clave.",
    }),
    excludedKeywords: z.string().optional(),
    languages: z.array(z.string()).min(1, {
      message: "Debe seleccionar al menos un idioma.",
    }),
    locations: z.array(z.string()).optional(),
  }),
  accountsToMonitor: z.string().optional(),
  isActive: z.boolean().default(true),
});

type SourceConfigValues = z.infer<typeof sourceConfigSchema>;

interface SourceConfigFormProps {
  initialData?: Partial<SourceConfigValues>;
  onSubmit: (values: SourceConfigValues) => void;
  isEditing?: boolean;
}

export function SourceConfigForm({
  initialData,
  onSubmit,
  isEditing = false,
}: SourceConfigFormProps) {
  const form = useForm<SourceConfigValues>({
    resolver: zodResolver(sourceConfigSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "twitter",
      credentials: {
        apiKey: initialData?.credentials?.apiKey || "",
        apiSecret: initialData?.credentials?.apiSecret || "",
        accessToken: initialData?.credentials?.accessToken || "",
        accessTokenSecret: initialData?.credentials?.accessTokenSecret || "",
      },
      monitoringConfig: {
        keywords: initialData?.monitoringConfig?.keywords || "",
        excludedKeywords: initialData?.monitoringConfig?.excludedKeywords || "",
        languages: initialData?.monitoringConfig?.languages || ["es"],
        locations: initialData?.monitoringConfig?.locations || [],
      },
      accountsToMonitor: initialData?.accountsToMonitor || "",
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Fuente" : "Nueva Fuente"}</CardTitle>
        <CardDescription>
          Configure los parámetros para monitorizar esta fuente de datos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la fuente" {...field} />
                    </FormControl>
                    <FormDescription>Un nombre descriptivo para esta fuente.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de fuente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="blog">Blogs</SelectItem>
                        <SelectItem value="forum">Foros</SelectItem>
                        <SelectItem value="news">Noticias</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      El tipo de plataforma a monitorizar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Tabs defaultValue="monitoring">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="monitoring">Monitorización</TabsTrigger>
                <TabsTrigger value="credentials">Credenciales</TabsTrigger>
                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monitoring" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="monitoringConfig.keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Palabras clave</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="palabra1, palabra2, 'frase exacta'"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Palabras o frases clave a monitorizar, separadas por comas. Use comillas para frases exactas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monitoringConfig.excludedKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Palabras clave excluidas</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="palabra1, palabra2, 'frase exacta'"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Palabras o frases a excluir de la monitorización.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountsToMonitor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuentas a monitorizar</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="@cuenta1, @cuenta2"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Lista de cuentas específicas a monitorizar, separadas por comas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="credentials" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="credentials.apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        La clave de API proporcionada por la plataforma.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credentials.apiSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Secret</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credentials.accessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Token</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credentials.accessTokenSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Token Secret</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="monitoringConfig.languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idiomas</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange([value])}
                        defaultValue={field.value?.[0]}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar idioma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">Inglés</SelectItem>
                          <SelectItem value="fr">Francés</SelectItem>
                          <SelectItem value="de">Alemán</SelectItem>
                          <SelectItem value="it">Italiano</SelectItem>
                          <SelectItem value="pt">Portugués</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        El idioma principal para la monitorización.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Activo</FormLabel>
                        <FormDescription>
                          Activar o desactivar la monitorización de esta fuente.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
