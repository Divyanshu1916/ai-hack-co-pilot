import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { rooms, tasks } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, Lightbulb, FileText, Kanban, Presentation, MessageSquare, Clock, Target, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/room/$id/")({
  head: () => ({ meta: [{ title: "Room overview · HackMate AI" }] }),
  component: RoomOverview,
});

function RoomOverview() {
  const { id } = useParams({ from: "/room/$id/" });
  const room = rooms.find(r => r.id === id) ?? rooms[0];
  const done = tasks.filter(t => t.status === "done").length;
  const total = tasks.length;

  const milestones = [
    { name: "Idea locked", done: true, at: "T-46h" },
    { name: "Brief signed off", done: true, at: "T-44h" },
    { name: "First prototype", done: false, at: "T-24h", soon: true },
    { name: "Demo rehearsal", done: false, at: "T-4h" },
    { name: "Submission", done: false, at: "T-0h" },
  ];

  const quickLinks = [
    { to: "/room/$id/ideas", icon: Lightbulb, label: "Ideas", desc: "AI ranking" },
    { to: "/room/$id/brief", icon: FileText, label: "Brief", desc: "Living one-pager" },
    { to: "/room/$id/tasks", icon: Kanban, label: "Tasks", desc: `${done}/${total} shipped` },
    { to: "/room/$id/chat", icon: MessageSquare, label: "AI Chat", desc: "Context-aware" },
    { to: "/room/$id/pitch", icon: Presentation, label: "Pitch", desc: "5 slides ready" },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-3 w-3 text-accent animate-pulse-glow" /> {room.event} · {room.theme}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mt-2">{room.name}</h1>
          {room.idea && <p className="mt-2 text-muted-foreground max-w-2xl">{room.idea}</p>}

          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            <Stat icon={Target} label="Room health" value={`${room.health}%`} />
            <Stat icon={Kanban} label="Tasks shipped" value={`${done} / ${total}`} />
            <Stat icon={TrendingUp} label="Pace" value="On track" tone="good" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Quick nav</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickLinks.map(q => (
                <Link key={q.to} to={q.to} params={{ id }} className="group glass rounded-2xl p-4 hover:-translate-y-0.5 hover:glow transition-all">
                  <q.icon className="h-5 w-5 text-primary mb-2" />
                  <div className="font-display font-semibold">{q.label}</div>
                  <div className="text-xs text-muted-foreground">{q.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h2 className="font-display font-bold mb-4">Milestone clock</h2>
            <ol className="space-y-3">
              {milestones.map((m, i) => (
                <li key={m.name} className="flex items-center gap-3">
                  <div className={`h-7 w-7 rounded-full grid place-items-center text-xs font-bold border ${
                    m.done ? "gradient-bg text-primary-foreground border-0" :
                    m.soon ? "border-primary text-primary animate-pulse-glow" : "border-border text-muted-foreground"
                  }`}>{i + 1}</div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${m.done ? "line-through text-muted-foreground" : ""}`}>{m.name}</div>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{m.at}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6">
            <h2 className="font-display font-bold mb-4">Team</h2>
            <ul className="space-y-3">
              {room.members.map(m => (
                <li key={m.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-9 w-9"><AvatarFallback className="text-xs bg-secondary">{m.avatar}</AvatarFallback></Avatar>
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${m.online ? "bg-accent" : "bg-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-display font-bold mb-2">AI suggests</h2>
            <p className="text-sm text-muted-foreground">Your latency budget is at risk. Consider pre-loading the medical glossary at build time instead of on first request.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone?: "good" }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</div>
      <div className={`mt-1 text-2xl font-display font-bold ${tone === "good" ? "gradient-text" : ""}`}>{value}</div>
    </div>
  );
}
