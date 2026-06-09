import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { rooms, currentUser } from "@/lib/mock-data";
import { Plus, Calendar, ArrowRight, Users, Sparkles, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · HackMate AI" }, { name: "description", content: "Your rooms, events, and matching pool." }] }),
  component: Dashboard,
});

function Dashboard() {
  const active = rooms.filter(r => r.status === "active");
  const upcoming = rooms.filter(r => r.status === "upcoming");
  const past = rooms.filter(r => r.status === "complete");

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back, {currentUser.name.split(" ")[0]} 👋</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">Your hack HQ</h1>
        </div>
        <CreateRoomDialog />
      </div>

      {/* Active rooms */}
      <Section title="Active rooms" subtitle="Sprints in progress">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map(r => <RoomCard key={r.id} room={r} />)}
        </div>
      </Section>

      <Section title="Upcoming events" subtitle="On your calendar">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map(r => <RoomCard key={r.id} room={r} />)}
          <UpcomingEventCard />
        </div>
      </Section>

      <Section title="Team matching pool" subtitle="Solo hackers looking for teammates">
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <span className="font-semibold">142 solo hackers</span> matching your skills are looking for teams this week.
            </div>
            <Button variant="outline" size="sm" className="ml-auto glass" disabled>Browse pool · Soon</Button>
          </div>
        </div>
      </Section>

      <Section title="Past rooms" subtitle="Your hackathon portfolio">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {past.map(r => <RoomCard key={r.id} room={r} />)}
        </div>
      </Section>
    </AppShell>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-xl font-display font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function RoomCard({ room }: { room: typeof rooms[number] }) {
  const statusColor = {
    active: "bg-accent/20 text-accent-foreground border-accent/30",
    upcoming: "bg-primary/15 text-primary border-primary/30",
    complete: "bg-muted text-muted-foreground border-border",
  }[room.status];
  return (
    <Link to="/room/$id" params={{ id: room.id }} className="group">
      <div className="glass rounded-2xl p-5 h-full hover:-translate-y-1 hover:glow transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${statusColor}`}>
            {room.status}
          </div>
          {room.status === "active" && (
            <div className="flex items-center gap-1 text-xs text-accent-foreground">
              <Activity className="h-3 w-3 animate-pulse-glow" /> Live
            </div>
          )}
        </div>
        <h3 className="font-display font-semibold text-lg">{room.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{room.event} · {room.theme}</p>
        {room.idea && <p className="text-sm mt-3 line-clamp-2 text-foreground/80">{room.idea}</p>}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {room.members.slice(0, 4).map(m => (
              <Avatar key={m.id} className="h-7 w-7 border-2 border-card">
                <AvatarFallback className="text-[10px] bg-secondary">{m.avatar}</AvatarFallback>
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
              <div className="h-full gradient-bg" style={{ width: `${room.health}%` }} />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

function UpcomingEventCard() {
  return (
    <div className="glass rounded-2xl p-5 border-dashed">
      <Calendar className="h-5 w-5 text-primary mb-3" />
      <h3 className="font-display font-semibold">HackHarvard 2026</h3>
      <p className="text-xs text-muted-foreground">Oct 17–19 · Cambridge, MA</p>
      <p className="text-sm mt-3">Registration opens Aug 1. Save your spot in the matching pool.</p>
      <Button variant="outline" size="sm" className="mt-4 w-full glass">
        <Sparkles className="h-3.5 w-3.5 mr-1" /> Notify me
      </Button>
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
        <DialogHeader><DialogTitle>Create a hackathon room</DialogTitle></DialogHeader>
        <form onSubmit={e => { e.preventDefault(); setOpen(false); toast.success("Room created — invite link copied"); }} className="space-y-4">
          <div>
            <Label htmlFor="rn" className="text-xs">Team name</Label>
            <Input id="rn" placeholder="Team Neon" required className="mt-1 glass" />
          </div>
          <div>
            <Label htmlFor="ev" className="text-xs">Event</Label>
            <Input id="ev" placeholder="MIT Hack 2026" required className="mt-1 glass" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start" className="text-xs">Starts</Label>
              <Input id="start" type="datetime-local" required className="mt-1 glass" />
            </div>
            <div>
              <Label htmlFor="end" className="text-xs">Ends</Label>
              <Input id="end" type="datetime-local" required className="mt-1 glass" />
            </div>
          </div>
          <div>
            <Label htmlFor="theme" className="text-xs">Theme / Track</Label>
            <Input id="theme" placeholder="AI for Good" className="mt-1 glass" />
          </div>
          <DialogFooter>
            <Button type="submit" className="gradient-bg text-primary-foreground border-0 glow w-full sm:w-auto">Create room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
