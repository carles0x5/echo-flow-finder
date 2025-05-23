
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface InsightCardProps {
  title: string;
  content: string;
  source: string;
  timestamp: Date;
  sentiment: "positive" | "neutral" | "negative";
  tags?: string[];
  loading?: boolean;
}

export function InsightCard({
  title,
  content,
  source,
  timestamp,
  sentiment,
  tags = [],
  loading = false,
}: InsightCardProps) {
  const sentimentColor = {
    positive: "bg-success/10 text-success border-success/30",
    neutral: "bg-primary/10 text-primary border-primary/30",
    negative: "bg-destructive/10 text-destructive border-destructive/30",
  };

  const sentimentText = {
    positive: "Positivo",
    neutral: "Neutral",
    negative: "Negativo",
  };

  if (loading) {
    return <Card className="animate-pulse-blue h-[180px]"></Card>;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Badge variant="outline" className={cn("ml-2", sentimentColor[sentiment])}>
            {sentimentText[sentiment]}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <span className="font-medium">{source}</span>
          <span className="mx-1">•</span>
          <span>{formatDistanceToNow(timestamp, { addSuffix: true, locale: es })}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/90 line-clamp-3">{content}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
