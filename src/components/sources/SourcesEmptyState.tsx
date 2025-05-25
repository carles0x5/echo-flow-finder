
import { Button } from "@/components/ui/button";
import { FunctionSquare, Plus } from "lucide-react";

interface SourcesEmptyStateProps {
  title: string;
  description: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

export function SourcesEmptyState({ 
  title, 
  description, 
  showCreateButton = false, 
  onCreateClick 
}: SourcesEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
        <FunctionSquare className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
      {showCreateButton && onCreateClick && (
        <Button className="mt-4" onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Fuente
        </Button>
      )}
    </div>
  );
}
