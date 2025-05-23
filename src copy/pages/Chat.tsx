
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, InfoIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Consultas guardadas de ejemplo
const savedQueries = [
  { id: "1", text: "¿Cuál es la tendencia de menciones en el último mes?" },
  { id: "2", text: "Muestra los comentarios negativos más recientes" },
  { id: "3", text: "¿Cuál es el producto con mejor valoración?" },
  { id: "4", text: "Compara el sentimiento entre Twitter y Facebook" },
];

export default function Chat() {
  const [userSavedQueries, setUserSavedQueries] = useState(savedQueries);

  const handleSaveQuery = (query: string) => {
    const newQuery = {
      id: Date.now().toString(),
      text: query,
    };
    setUserSavedQueries([...userSavedQueries, newQuery]);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Chat Analítico</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ChatInterface
              savedQueries={userSavedQueries}
              onSaveQuery={handleSaveQuery}
            />
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Consejos de uso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Ejemplos de consultas:</strong>
                  </p>
                  <ul className="space-y-1">
                    <li>• "Muestra las menciones negativas de la semana pasada"</li>
                    <li>• "Compara el sentimiento entre canales"</li>
                    <li>• "¿Cuáles son los temas más discutidos?"</li>
                    <li>• "Detección de anomalías en menciones"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Consultas guardadas</CardTitle>
                <CardDescription>Tus consultas frecuentes</CardDescription>
              </CardHeader>
              <CardContent>
                {userSavedQueries.length > 0 ? (
                  <ul className="space-y-2">
                    {userSavedQueries.map((query) => (
                      <li key={query.id} className="flex items-start gap-2">
                        <BookmarkIcon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <span className="text-sm">{query.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <BookmarkIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No tienes consultas guardadas</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Guarda tus consultas frecuentes para acceder rápidamente a ellas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-medium">¿Sabías que...?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Puedes exportar los resultados de tus consultas a CSV para analizarlos en otras herramientas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
