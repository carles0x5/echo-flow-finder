
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AlertNotification {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  priority: "high" | "medium" | "low";
  status: "new" | "read" | "resolved";
  source: string;
  url?: string;
}

interface AlertNotificationCardProps extends AlertNotification {
  onMarkAsRead: (id: string) => void;
  onMarkAsResolved: (id: string) => void;
}

export function AlertNotificationCard({
  id,
  title,
  content,
  timestamp,
  priority,
  status,
  source,
  url,
  onMarkAsRead,
  onMarkAsResolved,
}: AlertNotificationCardProps) {
  const priorityColor = {
    high: "bg-destructive/10 text-destructive border-destructive/30",
    medium: "bg-warning/10 text-warning-foreground border-warning/30",
    low: "bg-primary/10 text-primary border-primary/30",
  };

  const priorityText = {
    high: "Alta",
    medium: "Media",
    low: "Baja",
  };

  const statusColor = {
    new: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    read: "bg-gray-200 text-gray-600 border-gray-300",
    resolved: "bg-success/10 text-success border-success/30",
  };

  const statusText = {
    new: "Nueva",
    read: "Leída",
    resolved: "Resuelta",
  };

  return (
    <Card
      className={cn(
        "border-l-4 transition-all duration-200",
        status === "new" 
          ? "border-l-blue-500" 
          : status === "resolved" 
          ? "border-l-success" 
          : "border-l-muted"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{source}</span>
              <span>•</span>
              <span>{formatDistanceToNow(timestamp, { addSuffix: true, locale: es })}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(priorityColor[priority])}>
              {priorityText[priority]}
            </Badge>
            <Badge variant="outline" className={cn(statusColor[status])}>
              {statusText[status]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/90 mb-3">{content}</p>
        <div className="flex justify-between items-center">
          {url ? (
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Ver origen
              </a>
            </Button>
          ) : (
            <div></div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {status === "new" && (
                <DropdownMenuItem onClick={() => onMarkAsRead(id)}>
                  Marcar como leída
                </DropdownMenuItem>
              )}
              {status !== "resolved" && (
                <DropdownMenuItem onClick={() => onMarkAsResolved(id)}>
                  Marcar como resuelta
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
