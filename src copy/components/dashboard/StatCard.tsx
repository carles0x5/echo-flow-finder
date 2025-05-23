
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: number;
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  loading = false,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className, loading && "animate-pulse-blue")}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "-" : value}</div>
        {description && <CardDescription>{description}</CardDescription>}
        {trend !== undefined && (
          <div className="mt-2 flex items-center text-xs">
            <span
              className={cn(
                "mr-1",
                trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"}
              {Math.abs(trend)}%
            </span>
            <span className="text-muted-foreground">vs periodo anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
