
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  MoreHorizontal, 
  Search, 
  Share, 
  Star 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  title: string;
  source: string;
  type: string;
  timestamp: Date;
  sentiment: "positive" | "neutral" | "negative";
  tags: string[];
}

interface InsightTableProps {
  insights: Insight[];
  loading?: boolean;
}

export function InsightTable({ insights, loading = false }: InsightTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getSentimentColor = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return "bg-success/10 text-success border-success/30";
      case "neutral":
        return "bg-primary/10 text-primary border-primary/30";
      case "negative":
        return "bg-destructive/10 text-destructive border-destructive/30";
    }
  };

  const getSentimentText = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return "Positivo";
      case "neutral":
        return "Neutral";
      case "negative":
        return "Negativo";
    }
  };

  const filteredInsights = insights.filter(
    (insight) =>
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar insights..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Twitter</DropdownMenuItem>
            <DropdownMenuItem>Facebook</DropdownMenuItem>
            <DropdownMenuItem>Instagram</DropdownMenuItem>
            <DropdownMenuItem>Blogs</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sentimiento: Positivo</DropdownMenuItem>
            <DropdownMenuItem>Sentimiento: Neutral</DropdownMenuItem>
            <DropdownMenuItem>Sentimiento: Negativo</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Insight</TableHead>
              <TableHead>Fuente</TableHead>
              <TableHead>Etiquetas</TableHead>
              <TableHead>Sentimiento</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index} className="animate-pulse-blue h-14" />
                  ))
              : filteredInsights.map((insight) => (
                  <TableRow key={insight.id}>
                    <TableCell className="font-medium">{insight.title}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center">
                        {insight.source}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {insight.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs whitespace-nowrap"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(getSentimentColor(insight.sentiment))}
                      >
                        {getSentimentText(insight.sentiment)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(insight.timestamp, {
                        addSuffix: true,
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Star className="mr-2 h-4 w-4" /> Guardar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="mr-2 h-4 w-4" /> Compartir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-2 border-t">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredInsights.length} de {insights.length} resultados
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
