import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { rooms, currentUser, tasks, ideas } from "@/lib/mock-data";
import {
  Plus, ArrowRight, Users, Sparkles, Activity, Zap,
  Lightbulb, MessageSquare, Kanban, Calendar, Trophy,
  Bell, TrendingUp, Clock, FolderOpen, LogIn, Bot,
  CheckCircle2, AlertCircle, Info, X, MapPin,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · HackMate AI" },
      { name: "description", content: "Your hackathon command center." },
    ],
  }),
  component: Dashboard,
});

/* ------------------------------------------------------------------ */
//  Mock data extensions
/* ------------------------------------------------------------------ */

const notifications = [
  {
    id: "n1",
    type: "alert" as const,
    title: "Idea locked in",
    desc: "Team Neon locked VoiceBridge as their final concept.",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    type: "info" as const,
    title: "New task assigned",
    desc: "Jordan assigned you the latency dashboard (frontend).",
    time: "1h ago",
    read: false,
  },
  {
    id: "n3",
    type: "success" as const,
    title: "Hackathon complete",
    desc: "Quantum Quokkas placed 2nd at TreeHacks 2025.",
    time: "2d ago",
    read: true,
  },
  {
    id: "n4",
    type: "info" as const,
    title: "Pitch deck ready",
    desc: "AI generated a 5-slide draft for VoiceBridge.",
    time: "3h ago",
    read: true,
  },
  {
    id: "n5",
    type: "alert" as const,
    title: "Deadline approaching",
    desc: "MIT Hack 2026 ends in 14 hours.",
    time: "5h ago",
    read: false,
  },
];

const upcomingHackathons = [
  {
    id: "uh1",
    name: "HackHarvard 2026",
    date: "Oct 17 – 19, 2026",
    location: "Cambridge, MA",
    tags: ["AI", "Health"],
    registered: false,
  },
  {
    id: "uh2",
    name: "CalHacks 2026",
    date: "Nov 7 – 9, 2026",
    location: "Berkeley, CA",
    tags: ["Web3", "Open"],
    registered: true,
  },
  {
    id: "uh3",
    name: "ETHGlobal SF",
    date: "Dec 5 – 7, 2026",
    location: "San Francisco, CA",
    tags: ["DeFi", "ZK"],
    registered: false,
  },
];

const recentProjects = [
  {
    id: "rp1",
    name: "CarbonLens",
    event: "TreeHacks 2025",
    result: "2nd Place",
    team: ["AR", "MC", "JP", "SV"],
    description: "Supply chain CO2 audits with vision models.",
    tags: ["Climate", "AI"],
  },
  {
    id: "rp2",
    name: "MediFlow",
    event: "HackMIT 2024",
    result: "Best AI Hack",
    team: ["AR", "JP"],
    description: "Triage chatbot with real-time vitals ingestion.",
    tags: ["Health", "NLP"],
  },
  {
    id: "rp3",
    name: "BlockVote",
    event: "ETHGlobal NYC",
    result: "Finalist",
    team: ["MC", "SV"],
    description: "Anonymous on-chain voting for university elections.",
    tags: ["Web3", "Privacy"],
  },
];

/* ------------------------------------------------------------------ */
//  Helpers
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <div className="glass aurora-border rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl gradient-bg grid place-items-center shrink-0">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        {trend && (
          <Badge variant="secondary" className="text-[10px] gap-1 glass">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </Badge>
        )}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-display font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
//  Main component
/* ------------------------------------------------------------------ */

function Dashboard() {
  const active = rooms.filter((r) => r.status === "active");
  const upcoming = rooms.filter((r) => r.status === "upcoming");
  const past = rooms.filter((r) => r.status === "complete");
  const navigate = useNavigate();

  const activeRoomsCount = active.length;
  const tasksCompleted = tasks.filter((t) => t.status === "done").length;
  const ideasGenerated = ideas.length;
  const daysActive = 47; // mock stat

  const firstActiveRoom = active[0];

  const [notifs, setNotifs] = useState(notifications);
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const dismissNotif = (id: string) => setNotifs((prev) => prev.filter((n) => n.id !== id));

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create":
        navigate({ to: "/room/new" });
        break;
      case "join":
        toast.info("Ask a teammate for a room code to join.");
        break;
      case "idea":
        if (firstActiveRoom) {
          navigate({ to: "/room/$id/ideas", params: { id: firstActiveRoom.id } });
        } else {
          toast.error("No active room. Create or join a room first.");
        }
        break;
      case "chat":
        if (firstActiveRoom) {
          navigate({ to: "/room/$id/chat", params: { id: firstActiveRoom.id } });
        } else {
          toast.error("No active room. Create or join a room first.");
        }
        break;
      case "win":
        if (firstActiveRoom) {
          navigate({ to: "/room/$id/win-analyzer", params: { id: firstActiveRoom.id } });
        } else {
          toast.error("No active room. Create or join a room first.");
        }
        break;
    }
  };

  return (
    <AppShell>
      {/* Welcome */}
      <section className="mb-8">
        <div className="glass rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 gradient-bg opacity-20 blur-3xl rounded-full" />
          <div className="relative">
            <p className="text-sm text-muted-foreground">
              Welcome back, {currentUser.name.split(" ")[0]} 👋
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">
              Your hackathon command center
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Track active rooms, ship tasks, and lock winning ideas — all from one dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard label="Active Rooms" value={String(activeRoomsCount)} icon={Zap} trend="+1 this week" />
        <StatCard label="Tasks Completed" value={String(tasksCompleted)} icon={CheckCircle2} trend="+3 today" />
        <StatCard label="Ideas Generated" value={String(ideasGenerated)} icon={Lightbulb} trend="+2 new" />
        <StatCard label="Days Active" value={String(daysActive)} icon={Clock} trend="Streak" />
      </section>

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <QuickActionButton
            label="Create Room"
            icon={Plus}
            onClick={() => handleQuickAction("create")}
            highlight
          />
          <QuickActionButton
            label="Join Room"
            icon={LogIn}
            onClick={() => handleQuickAction("join")}
          />
          <QuickActionButton
            label="Generate Idea"
            icon={Sparkles}
            onClick={() => handleQuickAction("idea")}
          />
          <QuickActionButton
            label="AI Assistant"
            icon={Bot}
            onClick={() => handleQuickAction("chat")}
          />
          <QuickActionButton
            label="Win Analyzer"
            icon={Trophy}
            onClick={() => handleQuickAction("win")}
          />
        </div>
      </section>

      {/* Main grid: rooms + sidebar */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-10">
          {/* Active rooms */}
          <Section
            title="Active Hackathon Rooms"
            subtitle="Sprints in progress right now"
            action={<CreateRoomDialog />}
          >
            {active.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {active.map((r) => (
                  <RoomCard key={r.id} room={r} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Zap}
                title="No active rooms"
                desc="Create a room or join one to start hacking."
              />
            )}
          </Section>

          {/* Recent Projects */}
          <Section title="Recent Projects" subtitle="Your hackathon portfolio">
            <div className="grid sm:grid-cols-2 gap-4">
              {recentProjects.map((p) => (
                <div
                  key={p.id}
                  className="glass rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <h3 className="font-display font-semibold">{p.name}</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full gradient-bg text-primary-foreground font-bold uppercase">
                      {p.result}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.event}</p>
                  <p className="text-sm mt-2 text-foreground/80 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full glass font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {p.team.map((avatar, i) => (
                        <Avatar
                          key={i}
                          className="h-6 w-6 border-2 border-card"
                        >
                          <AvatarFallback className="text-[9px] bg-secondary">
                            {avatar}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-1">
                      {p.team.length} hackers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

        </div>

        {/* Right column — sidebar */}
        <aside className="space-y-6">
          {/* Notifications */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h3 className="font-display font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full gradient-bg text-primary-foreground font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
            <ScrollArea className="h-72">
              <div className="space-y-2">
                {notifs.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    All caught up 🎉
                  </p>
                )}
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`relative group rounded-xl p-3 transition-colors cursor-pointer ${
                      n.read
                        ? "hover:bg-accent/20"
                        : "bg-primary/5 hover:bg-primary/10"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        {n.type === "alert" && (
                          <AlertCircle className="h-4 w-4 text-accent" />
                        )}
                        {n.type === "success" && (
                          <CheckCircle2 className="h-4 w-4 text-chart-5" />
                        )}
                        {n.type === "info" && (
                          <Info className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-xs font-semibold ${
                              n.read ? "text-foreground/70" : "text-foreground"
                            }`}
                          >
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                          {n.desc}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {n.time}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotif(n.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Team matching pool mini-card */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold">Matching Pool</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">142</span> solo hackers
              are looking for teammates this week.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full glass"
              disabled
            >
              Browse pool · Soon
            </Button>
          </div>

          {/* Mini upcoming global events */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold">Global Events</h3>
            </div>
            <div className="space-y-3">
              {upcomingHackathons.map((h) => (
                <div key={h.id} className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{h.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {h.date}
                    </p>
                  </div>
                  {h.registered ? (
                    <Badge variant="outline" className="text-[10px] glass">
                      <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                      In
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] glass">
                      Open
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hackathons List */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold">Hackathons List</h3>
            </div>
            <div className="space-y-4">
              {upcomingHackathons.map((h) => (
                <div key={h.id} className="rounded-xl p-3 bg-accent/10 border border-accent/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{h.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-[11px] text-muted-foreground">{h.location}</p>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{h.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {h.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full glass"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full glass text-xs"
                    onClick={() =>
                      toast.success(
                        h.registered
                          ? "Already registered!"
                          : "Registered successfully"
                      )
                    }
                  >
                    {h.registered ? "Registered" : "Register"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Past Rooms */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold">Past Rooms</h3>
            </div>
            <div className="space-y-3">
              {past.map((r) => (
                <Link
                  key={r.id}
                  to="/room/$id"
                  params={{ id: r.id }}
                  className="group flex items-center gap-3 rounded-xl p-3 hover:bg-accent/20 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-muted grid place-items-center shrink-0">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground">{r.event}</p>
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground">
                    {r.health}%
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
//  Sub-components
/* ------------------------------------------------------------------ */

function Section({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-display font-bold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function RoomCard({ room }: { room: (typeof rooms)[number] }) {
  const statusStyle = {
    active:
      "bg-accent/20 text-accent-foreground border-accent/30",
    upcoming:
      "bg-primary/15 text-primary border-primary/30",
    complete:
      "bg-muted text-muted-foreground border-border",
  }[room.status];

  return (
    <Link to="/room/$id" params={{ id: room.id }} className="group">
      <div className="glass rounded-2xl p-5 h-full hover:-translate-y-1 hover:glow transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${statusStyle}`}
          >
            {room.status}
          </div>
          {room.status === "active" && (
            <div className="flex items-center gap-1 text-xs text-accent-foreground">
              <Activity className="h-3 w-3 animate-pulse-glow" /> Live
            </div>
          )}
        </div>
        <h3 className="font-display font-semibold text-lg">{room.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {room.event} · {room.theme}
        </p>
        {room.idea && (
          <p className="text-sm mt-3 line-clamp-2 text-foreground/80">
            {room.idea}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {room.members.slice(0, 4).map((m) => (
              <Avatar
                key={m.id}
                className="h-7 w-7 border-2 border-card"
              >
                <AvatarFallback className="text-[10px] bg-secondary">
                  {m.avatar}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
        {room.status !== "upcoming" && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Room health</span>
              <span className="font-semibold">{room.health}%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full gradient-bg"
                style={{ width: `${room.health}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

function QuickActionButton({
  label,
  icon: Icon,
  onClick,
  highlight,
}: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
        highlight
          ? "gradient-bg text-primary-foreground glow hover:scale-[1.02]"
          : "glass hover:-translate-y-0.5 hover:bg-accent/20 text-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}

function EmptyState({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="glass rounded-2xl p-10 text-center col-span-full">
      <Icon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-display font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}

function CreateRoomDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-bg text-primary-foreground border-0 glow">
          <Plus className="h-4 w-4 mr-1" /> New room
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong">
        <DialogHeader>
          <DialogTitle>Create a hackathon room</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            toast.success("Room created — invite link copied");
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="rn" className="text-xs">
              Team name
            </Label>
            <Input
              id="rn"
              placeholder="Team Neon"
              required
              className="mt-1 glass"
            />
          </div>
          <div>
            <Label htmlFor="ev" className="text-xs">
              Event
            </Label>
            <Input
              id="ev"
              placeholder="MIT Hack 2026"
              required
              className="mt-1 glass"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start" className="text-xs">
                Starts
              </Label>
              <Input
                id="start"
                type="datetime-local"
                required
                className="mt-1 glass"
              />
            </div>
            <div>
              <Label htmlFor="end" className="text-xs">
                Ends
              </Label>
              <Input
                id="end"
                type="datetime-local"
                required
                className="mt-1 glass"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="theme" className="text-xs">
              Theme / Track
            </Label>
            <Input
              id="theme"
              placeholder="AI for Good"
              className="mt-1 glass"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="gradient-bg text-primary-foreground border-0 glow w-full sm:w-auto"
            >
              Create room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
