import { Link, useParams, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard, Lightbulb, FileText, Kanban, MessageSquare,
  Presentation, Plug, History, ArrowLeft, Clock,
} from "lucide-react";
import { rooms } from "@/lib/mock-data";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/room/$id", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/room/$id/ideas", label: "Ideas", icon: Lightbulb },
  { to: "/room/$id/brief", label: "Brief", icon: FileText },
  { to: "/room/$id/tasks", label: "Tasks", icon: Kanban },
  { to: "/room/$id/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/room/$id/pitch", label: "Pitch", icon: Presentation },
  { to: "/room/$id/apis", label: "APIs", icon: Plug, soon: true },
  { to: "/room/$id/retro", label: "Retro", icon: History, soon: true },
];

function useCountdown(end: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  if (now === null) return "--h --m --s";
  const diff = Math.max(0, new Date(end).getTime() - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

export function RoomShell({ children }: { children: ReactNode }) {
  const { id } = useParams({ strict: false }) as { id: string };
  const room = rooms.find(r => r.id === id) ?? rooms[0];
  const pathname = useRouterState({ select: s => s.location.pathname });
  const countdown = useCountdown(room.endsAt);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <Logo />
          <div className="hidden md:flex flex-col leading-tight ml-2">
            <span className="text-xs text-muted-foreground">{room.event}</span>
            <span className="text-sm font-semibold">{room.name}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm font-mono">
              <Clock className="h-3.5 w-3.5 text-primary animate-pulse-glow" />
              <span className="tabular-nums">{countdown}</span>
            </div>
            <div className="hidden sm:flex -space-x-2">
              {room.members.slice(0, 4).map(m => (
                <Avatar key={m.id} className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className="text-[10px] bg-secondary">{m.avatar}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1600px] mx-auto w-full">
        <aside className="hidden lg:block w-56 shrink-0 p-4">
          <nav className="sticky top-20 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const href = item.to.replace("$id", id);
              const active = item.exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  params={{ id }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/15 text-primary glass"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.soon && <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-accent/30 text-accent-foreground">SOON</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-6 pb-24 lg:pb-6">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t">
        <div className="flex justify-around px-2 py-2 overflow-x-auto">
          {navItems.filter(i => !i.soon).slice(0, 6).map(item => {
            const Icon = item.icon;
            const href = item.to.replace("$id", id);
            const active = item.exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={item.to}
                to={item.to}
                params={{ id }}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[10px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
