
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function SourcesConfigTab() {
  return (
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
                defaultValue="5000"
                className="bg-background border rounded-md text-sm py-1 px-2 w-32 text-right"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tasa de peticiones por minuto</label>
              <input
                type="number"
                defaultValue="60"
                className="bg-background border rounded-md text-sm py-1 px-2 w-32 text-right"
              />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="rate-limit" className="mr-2" defaultChecked />
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
  );
}
