
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { SavedQueriesList } from "@/components/chat/SavedQueriesList";
import { useSavedQueries } from "@/hooks/useSavedQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

export default function Chat() {
  const { saveQuery } = useSavedQueries();
  const [selectedQuery, setSelectedQuery] = useState<string>("");

  const handleSaveQuery = (query: string) => {
    saveQuery(query);
  };

  const handleQuerySelect = (query: string) => {
    setSelectedQuery(query);
    // You can add logic here to pass the query to ChatInterface if needed
    console.log("Selected query:", query);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Chat Analítico</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ChatInterface onSaveQuery={handleSaveQuery} />
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

            <SavedQueriesList onQuerySelect={handleQuerySelect} />

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
