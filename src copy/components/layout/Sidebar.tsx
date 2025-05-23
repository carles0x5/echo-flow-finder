import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  MessageSquareText,
  Radio,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Key for localStorage
const SIDEBAR_STATE_KEY = "sidebar:collapsed";

export function Sidebar() {
  // Initialize from localStorage if available
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    return savedState === "true";
  });
  
  const location = useLocation();
  const { user } = useAuth();
  
  // Get user email and first letter for avatar
  const userEmail = user?.email || "usuario@empresa.com";
  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";

  // Save to localStorage when collapsed state changes
  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem(SIDEBAR_STATE_KEY, String(newState));
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Tendencias", path: "/trends", icon: <LineChart size={20} /> },
    { name: "Alertas", path: "/alerts", icon: <Bell size={20} /> },
    { name: "Chat", path: "/chat", icon: <MessageSquareText size={20} /> },
    { name: "Fuentes", path: "/sources", icon: <Radio size={20} /> },
    { name: "Configuración", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <TooltipProvider>
      <div
        className={cn(
          "bg-sidebar h-screen flex flex-col border-r border-border transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-primary mr-2" />
              <span className="text-sidebar-foreground font-bold">EchoTrend</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="text-sidebar-foreground"
            type="button"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              if (collapsed) {
                return (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-md text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        {item.icon}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  </Tooltip>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "")}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              {userInitial}
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-xs text-sidebar-foreground font-medium">
                  {userEmail.split('@')[0]}
                </p>
                <p className="text-xs text-sidebar-foreground/70">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
