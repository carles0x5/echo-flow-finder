
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  Bookmark,
  Copy,
  Loader2,
  RefreshCw,
  Send,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatInterfaceProps {
  savedQueries?: { id: string; text: string }[];
  onSaveQuery?: (query: string) => void;
}

export function ChatInterface({ savedQueries = [], onSaveQuery }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hola, soy tu asistente de análisis. Puedes preguntarme cualquier cosa sobre las menciones, sentimiento, tendencias o datos de tus marcas monitorizadas.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulated API call with loading state
    try {
      // Aquí en un entorno real harías un fetch a la API
      // const response = await fetch('/api/query', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ query: input }),
      // });
      // const data = await response.json();
      
      // Simulamos un pequeño retraso
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsTyping(true);
      
      // Simulated response typing effect
      const demoResponse = "Basado en los datos analizados, tu marca ha tenido un incremento del 15% en menciones positivas durante la última semana, principalmente relacionadas con tu última campaña en redes sociales. Los temas más discutidos han sido: #producto, #servicio y #experiencia.";
      
      // Simulated typing effect
      let displayedResponse = "";
      for (let i = 0; i < demoResponse.length; i++) {
        displayedResponse += demoResponse[i];
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            id: "typing",
            content: displayedResponse,
            role: "assistant",
            timestamp: new Date(),
          },
        ]);
        
        // Adjust typing speed for simulation
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
      
      // Final message
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          id: Date.now().toString(),
          content: demoResponse,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
      
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Lo siento, ha habido un error procesando tu consulta. Por favor, inténtalo de nuevo.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleSaveQuery = () => {
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user");
    if (lastUserMessage && onSaveQuery) {
      onSaveQuery(lastUserMessage.content);
    }
  };

  const handleSelectSavedQuery = (queryText: string) => {
    setInput(queryText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-md overflow-hidden bg-background">
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center">
          <BarChart3 className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Chat Analítico</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMessages([messages[0]])}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Reiniciar
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={cn(
                  "flex items-start gap-3 group",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/assistant-avatar.png" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <BarChart3 className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[80%] text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/user-avatar.png" />
                    <AvatarFallback className="bg-muted">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                {message.role === "assistant" && !isTyping && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => navigator.clipboard.writeText(message.content)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {savedQueries.length > 0 && (
          <div className="border-l w-64 overflow-auto hidden md:block">
            <div className="p-3 border-b">
              <h4 className="font-medium text-sm">Consultas guardadas</h4>
            </div>
            <ScrollArea className="h-full">
              <div className="p-2">
                {savedQueries.map((query) => (
                  <button
                    key={query.id}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors mb-1 truncate"
                    onClick={() => handleSelectSavedQuery(query.text)}
                  >
                    {query.text}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            disabled={isLoading || !input.trim()}
            onClick={handleSendMessage}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSaveQuery}
            disabled={
              messages.filter((msg) => msg.role === "user").length === 0
            }
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
