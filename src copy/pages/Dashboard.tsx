
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { InsightTable } from "@/components/dashboard/InsightTable";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Clock,
  Download,
  List,
  Grid3X3,
  Undo2
} from "lucide-react";

// Datos simulados para demostrar el panel
const mockInsights = [
  {
    id: "1",
    title: "Mención positiva del producto X",
    source: "Twitter",
    type: "mention",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    sentiment: "positive" as const,
    tags: ["producto", "opinión", "campaña"],
  },
  {
    id: "2",
    title: "Problema reportado con el servicio de atención",
    source: "Facebook",
    type: "complaint",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    sentiment: "negative" as const,
    tags: ["servicio", "atención", "queja"],
  },
  {
    id: "3",
    title: "Publicación viral sobre nueva característica",
    source: "Instagram",
    type: "mention",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sentiment: "positive" as const,
    tags: ["funcionalidad", "viral", "comentario"],
  },
  {
    id: "4",
    title: "Reseña de producto en blog especializado",
    source: "Blog",
    type: "review",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    sentiment: "neutral" as const,
    tags: ["reseña", "blog", "análisis"],
  },
  {
    id: "5",
    title: "Pregunta sobre el proceso de devolución",
    source: "Forum",
    type: "question",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    sentiment: "neutral" as const,
    tags: ["devolución", "proceso", "pregunta"],
  },
  {
    id: "6",
    title: "Queja sobre tiempo de entrega",
    source: "Twitter",
    type: "complaint",
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    sentiment: "negative" as const,
    tags: ["entrega", "logística", "retraso"],
  },
];

const mockChartData = [
  { date: "Lun", mentions: 54, sentiment: 72 },
  { date: "Mar", mentions: 62, sentiment: 68 },
  { date: "Mié", mentions: 58, sentiment: 65 },
  { date: "Jue", mentions: 63, sentiment: 67 },
  { date: "Vie", mentions: 80, sentiment: 70 },
  { date: "Sáb", mentions: 75, sentiment: 73 },
  { date: "Dom", mentions: 68, sentiment: 75 },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    // Simulamos una carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="h-4 w-4 mr-2" />
              Últimos 7 días
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" className="h-9" onClick={() => setFilterActive(!filterActive)}>
              {filterActive ? (
                <>
                  <Undo2 className="h-4 w-4 mr-2" />
                  Reiniciar
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Actualizar
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Menciones"
            value="1,284"
            description="Todas las plataformas"
            icon={<MessageSquare />}
            trend={8.2}
            loading={loading}
          />
          <StatCard
            title="Sentimiento Medio"
            value="72%"
            description="Positivo o neutral"
            icon={<TrendingUp />}
            trend={3.6}
            loading={loading}
          />
          <StatCard
            title="Alertas Activas"
            value="3"
            description="En las últimas 24h"
            icon={<AlertTriangle />}
            trend={-5.4}
            loading={loading}
          />
          <StatCard
            title="Insights Generados"
            value="18"
            description="Esta semana"
            icon={<BarChart3 />}
            trend={12.1}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TrendChart
            title="Tendencias"
            description="Evolución de menciones y sentimiento"
            data={mockChartData}
            loading={loading}
          />
          <div className="lg:col-span-2">
            <Tabs defaultValue="table">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Insights recientes</h2>
                <TabsList>
                  <TabsTrigger value="table" className="flex items-center gap-1">
                    <List className="h-4 w-4" /> Lista
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="flex items-center gap-1">
                    <Grid3X3 className="h-4 w-4" /> Tarjetas
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="table">
                <InsightTable insights={mockInsights} loading={loading} />
              </TabsContent>
              <TabsContent value="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loading
                    ? Array(4)
                        .fill(0)
                        .map((_, i) => <InsightCard key={i} loading={true} title="" content="" source="" timestamp={new Date()} sentiment="neutral" />)
                    : mockInsights.slice(0, 4).map((insight) => (
                        <InsightCard
                          key={insight.id}
                          title={insight.title}
                          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nisl eu nisi."
                          source={insight.source}
                          timestamp={insight.timestamp}
                          sentiment={insight.sentiment}
                          tags={insight.tags}
                        />
                      ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline">Ver todos los insights</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
