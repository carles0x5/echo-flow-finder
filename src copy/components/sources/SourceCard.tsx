
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceCardProps {
  id: string;
  name: string;
  type: "twitter" | "facebook" | "instagram" | "blog" | "forum" | "news";
  active: boolean;
  keywords: string[];
  accounts?: string[];
  lastSync?: Date;
  onToggle: (id: string, active: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SourceCard({
  id,
  name,
  type,
  active,
  keywords,
  accounts = [],
  lastSync,
  onToggle,
  onEdit,
  onDelete,
}: SourceCardProps) {
  const sourceTypeIcons: Record<string, string> = {
    twitter: "bg-blue-100 text-blue-600 border-blue-200",
    facebook: "bg-indigo-100 text-indigo-600 border-indigo-200",
    instagram: "bg-pink-100 text-pink-600 border-pink-200",
    blog: "bg-orange-100 text-orange-600 border-orange-200",
    forum: "bg-teal-100 text-teal-600 border-teal-200",
    news: "bg-purple-100 text-purple-600 border-purple-200",
  };

  const sourceTypeLabelMap: Record<string, string> = {
    twitter: "Twitter",
    facebook: "Facebook",
    instagram: "Instagram",
    blog: "Blog",
    forum: "Foro",
    news: "Noticias",
  };

  return (
    <Card className={cn(!active && "opacity-70")}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className={cn("mb-2", sourceTypeIcons[type])}>
              {sourceTypeLabelMap[type]}
            </Badge>
            <CardTitle className="text-base font-medium">{name}</CardTitle>
            <CardDescription>
              {lastSync
                ? `Última sincronización: ${lastSync.toLocaleString()}`
                : "Sin sincronizar"}
            </CardDescription>
          </div>
          <Switch
            checked={active}
            onCheckedChange={(checked) => onToggle(id, checked)}
            aria-label="Toggle source"
          />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Palabras clave:</h4>
            <div className="flex flex-wrap gap-1">
              {keywords.map((keyword, i) => (
                <Badge key={i} variant="outline" className="bg-primary/5">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          {accounts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Cuentas monitorizadas:</h4>
              <div className="flex flex-wrap gap-1">
                {accounts.map((account, i) => (
                  <Badge key={i} variant="secondary">
                    {account}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}
