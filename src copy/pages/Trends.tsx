
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter, RefreshCw, Share } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Datos simulados para los gráficos
const mentionsData = [
  { date: "01/04", twitter: 120, facebook: 75, instagram: 45, blogs: 20, forums: 35 },
  { date: "02/04", twitter: 132, facebook: 70, instagram: 48, blogs: 18, forums: 30 },
  { date: "03/04", twitter: 145, facebook: 80, instagram: 52, blogs: 24, forums: 32 },
  { date: "04/04", twitter: 135, facebook: 85, instagram: 56, blogs: 28, forums: 38 },
  { date: "05/04", twitter: 158, facebook: 95, instagram: 62, blogs: 22, forums: 36 },
  { date: "06/04", twitter: 172, facebook: 92, instagram: 68, blogs: 30, forums: 40 },
  { date: "07/04", twitter: 160, facebook: 88, instagram: 64, blogs: 32, forums: 42 },
];

const sentimentData = [
  { date: "01/04", positive: 65, neutral: 25, negative: 10 },
  { date: "02/04", positive: 62, neutral: 28, negative: 10 },
  { date: "03/04", positive: 60, neutral: 30, negative: 10 },
  { date: "04/04", positive: 58, neutral: 28, negative: 14 },
  { date: "05/04", positive: 62, neutral: 24, negative: 14 },
  { date: "06/04", positive: 68, neutral: 22, negative: 10 },
  { date: "07/04", positive: 70, neutral: 22, negative: 8 },
];

const topicsData = [
  { name: "Producto A", value: 45 },
  { name: "Servicio al cliente", value: 25 },
  { name: "Precio", value: 15 },
  { name: "Calidad", value: 10 },
  { name: "Entrega", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Trends() {
  const [period, setPeriod] = useState("7d");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Tendencias</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="h-4 w-4 mr-2" />
              Últimos 7 días
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" className="h-9">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="mentions">
          <TabsList className="mb-6">
            <TabsTrigger value="mentions">Menciones</TabsTrigger>
            <TabsTrigger value="sentiment">Sentimiento</TabsTrigger>
            <TabsTrigger value="topics">Temas</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalías</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mentions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Volumen de menciones por canal</CardTitle>
                  <CardDescription>Evolución en los últimos 7 días</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mentionsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTwitter" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1DA1F2" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1DA1F2" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4267B2" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4267B2" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C13584" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#C13584" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#FF8C00" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorForums" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="twitter"
                        stroke="#1DA1F2"
                        fillOpacity={1}
                        fill="url(#colorTwitter)"
                      />
                      <Area
                        type="monotone"
                        dataKey="facebook"
                        stroke="#4267B2"
                        fillOpacity={1}
                        fill="url(#colorFacebook)"
                      />
                      <Area
                        type="monotone"
                        dataKey="instagram"
                        stroke="#C13584"
                        fillOpacity={1}
                        fill="url(#colorInstagram)"
                      />
                      <Area
                        type="monotone"
                        dataKey="blogs"
                        stroke="#FF8C00"
                        fillOpacity={1}
                        fill="url(#colorBlogs)"
                      />
                      <Area
                        type="monotone"
                        dataKey="forums"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorForums)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución por canal</CardTitle>
                  <CardDescription>Porcentaje del total de menciones</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Twitter", value: 920 },
                          { name: "Facebook", value: 500 },
                          { name: "Instagram", value: 300 },
                          { name: "Blogs", value: 150 },
                          { name: "Foros", value: 230 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {topicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sentiment">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución del sentimiento</CardTitle>
                  <CardDescription>Tendencia en los últimos 7 días</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sentimentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="positive"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorPositive)"
                      />
                      <Area
                        type="monotone"
                        dataKey="neutral"
                        stroke="#6366f1"
                        fillOpacity={1}
                        fill="url(#colorNeutral)"
                      />
                      <Area
                        type="monotone"
                        dataKey="negative"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorNegative)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución del sentimiento</CardTitle>
                  <CardDescription>Por canal de comunicación</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { canal: "Twitter", positivo: 60, neutro: 25, negativo: 15 },
                        { canal: "Facebook", positivo: 65, neutro: 20, negativo: 15 },
                        { canal: "Instagram", positivo: 75, neutro: 20, negativo: 5 },
                        { canal: "Blogs", positivo: 55, neutro: 35, negativo: 10 },
                        { canal: "Foros", positivo: 45, neutro: 30, negativo: 25 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="canal" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="positivo" stackId="a" fill="#10b981" />
                      <Bar dataKey="neutro" stackId="a" fill="#6366f1" />
                      <Bar dataKey="negativo" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Temas principales</CardTitle>
                  <CardDescription>Distribución por relevancia</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topicsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {topicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evolución de temas</CardTitle>
                  <CardDescription>Tendencia en los últimos 7 días</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: "01/04", "Producto A": 25, "Servicio al cliente": 15, "Precio": 10, "Calidad": 5, "Entrega": 3 },
                        { date: "02/04", "Producto A": 28, "Servicio al cliente": 18, "Precio": 12, "Calidad": 8, "Entrega": 5 },
                        { date: "03/04", "Producto A": 30, "Servicio al cliente": 20, "Precio": 15, "Calidad": 10, "Entrega": 4 },
                        { date: "04/04", "Producto A": 35, "Servicio al cliente": 22, "Precio": 14, "Calidad": 8, "Entrega": 6 },
                        { date: "05/04", "Producto A": 38, "Servicio al cliente": 24, "Precio": 16, "Calidad": 12, "Entrega": 7 },
                        { date: "06/04", "Producto A": 42, "Servicio al cliente": 26, "Precio": 14, "Calidad": 11, "Entrega": 5 },
                        { date: "07/04", "Producto A": 45, "Servicio al cliente": 25, "Precio": 15, "Calidad": 10, "Entrega": 5 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Producto A" stroke="#0088FE" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="Servicio al cliente" stroke="#00C49F" />
                      <Line type="monotone" dataKey="Precio" stroke="#FFBB28" />
                      <Line type="monotone" dataKey="Calidad" stroke="#FF8042" />
                      <Line type="monotone" dataKey="Entrega" stroke="#8884D8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anomalies">
            <Card>
              <CardHeader>
                <CardTitle>Detección de anomalías</CardTitle>
                <CardDescription>Picos anómalos detectados en los últimos 30 días</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis
                      type="category"
                      dataKey="date"
                      name="Fecha"
                      allowDuplicatedCategory={false}
                    />
                    <YAxis type="number" dataKey="mentions" name="Menciones" />
                    <ZAxis type="number" dataKey="sentiment" range={[50, 400]} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter
                      name="Normal"
                      data={[
                        { date: "01/04", mentions: 80, sentiment: 70 },
                        { date: "02/04", mentions: 85, sentiment: 72 },
                        { date: "03/04", mentions: 82, sentiment: 68 },
                        { date: "04/04", mentions: 78, sentiment: 65 },
                        { date: "05/04", mentions: 90, sentiment: 70 },
                        { date: "06/04", mentions: 95, sentiment: 72 },
                        { date: "07/04", mentions: 92, sentiment: 74 },
                      ]}
                      fill="#8884d8"
                    />
                    <Scatter
                      name="Anomalía"
                      data={[
                        { date: "04/04", mentions: 180, sentiment: 40 },
                        { date: "06/04", mentions: 220, sentiment: 35 },
                      ]}
                      fill="#ff5722"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
