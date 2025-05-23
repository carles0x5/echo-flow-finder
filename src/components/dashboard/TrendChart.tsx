
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TrendChartProps {
  title: string;
  description?: string;
  data: any[];
  loading?: boolean;
}

export function TrendChart({ title, description, data, loading = false }: TrendChartProps) {
  const [period, setPeriod] = useState("7d");

  // Esta función simularía filtrar datos por periodo
  const getFilteredData = () => {
    return data;
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2" />
              <span className="text-sm">Menciones: {payload[0].value}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-success mr-2" />
              <span className="text-sm">Sentimiento: {payload[1].value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn(loading && "animate-pulse-blue")}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {!loading && (
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            Cargando datos...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getFilteredData()} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMentions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mentions"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorMentions)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="sentiment"
                stroke="hsl(var(--success))"
                fillOpacity={1}
                fill="url(#colorSentiment)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
