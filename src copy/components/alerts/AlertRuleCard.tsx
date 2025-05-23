
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

interface AlertRuleCardProps {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  channels: string[];
  active: boolean;
  onToggle: (id: string, active: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AlertRuleCard({
  id,
  name,
  description,
  triggers,
  channels,
  active,
  onToggle,
  onEdit,
  onDelete,
}: AlertRuleCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Switch
            checked={active}
            onCheckedChange={(checked) => onToggle(id, checked)}
            aria-label="Toggle alert rule"
          />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Activadores:</h4>
            <div className="flex flex-wrap gap-1">
              {triggers.map((trigger) => (
                <Badge key={trigger} variant="outline" className="bg-primary/5">
                  {trigger}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Canales de notificación:</h4>
            <div className="flex flex-wrap gap-1">
              {channels.map((channel) => (
                <Badge key={channel} variant="secondary">
                  {channel}
                </Badge>
              ))}
            </div>
          </div>
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
