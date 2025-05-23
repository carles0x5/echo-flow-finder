
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookmarkIcon, TrashIcon } from 'lucide-react';
import { useSavedQueries } from '@/hooks/useSavedQueries';

interface SavedQueriesListProps {
  onQuerySelect: (query: string) => void;
}

export function SavedQueriesList({ onQuerySelect }: SavedQueriesListProps) {
  const { savedQueries, isLoading, deleteQuery, isDeleting } = useSavedQueries();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Consultas guardadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Consultas guardadas</CardTitle>
      </CardHeader>
      <CardContent>
        {savedQueries.length > 0 ? (
          <ul className="space-y-2">
            {savedQueries.map((query) => (
              <li key={query.id} className="flex items-start gap-2 group">
                <BookmarkIcon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => onQuerySelect(query.text)}
                    className="text-sm text-left hover:text-primary transition-colors block w-full truncate"
                    title={query.text}
                  >
                    {query.text}
                  </button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteQuery(query.id)}
                  disabled={isDeleting}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <TrashIcon className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <BookmarkIcon className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No tienes consultas guardadas</p>
            <p className="text-xs text-muted-foreground mt-1">
              Guarda tus consultas frecuentes para acceder rápidamente a ellas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
