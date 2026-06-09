import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { currentUser, rooms } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Github, Trophy, Globe, Mail } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · HackMate AI" }, { name: "description", content: "Your hacker profile and preferences." }] }),
  component: Profile,
});

const skills = ["React", "TypeScript", "Node.js", "PostgreSQL", "AI/ML", "Design"];

function Profile() {
  const portfolio = rooms.filter(r => r.status === "complete");
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="glass-strong rounded-3xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 ring-4 ring-primary/30 glow">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold">
                {currentUser.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{currentUser.name}</h1>
              <p className="text-muted-foreground">{currentUser.role} · UTC−5</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-full glass text-xs font-medium">{s}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-4 text-sm text-muted-foreground">
                <a className="flex items-center gap-1.5 hover:text-foreground"><Github className="h-3.5 w-3.5" /> alexrivera</a>
                <a className="flex items-center gap-1.5 hover:text-foreground"><Globe className="h-3.5 w-3.5" /> alex.dev</a>
                <a className="flex items-center gap-1.5 hover:text-foreground"><Mail className="h-3.5 w-3.5" /> alex@hack.io</a>
              </div>
            </div>
            <div className="glass rounded-xl p-4 text-center min-w-[110px]">
              <Trophy className="h-5 w-5 text-accent mx-auto mb-1" />
              <div className="text-2xl font-display font-bold">7</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Hackathons</div>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-display font-bold mb-4">Public portfolio</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {portfolio.map(r => (
              <div key={r.id} className="glass rounded-2xl p-5">
                <div className="text-xs text-muted-foreground">{r.event}</div>
                <h3 className="font-display font-semibold mt-1">{r.idea}</h3>
                <p className="text-sm text-muted-foreground mt-2">Team of {r.members.length} · Health {r.health}%</p>
                <Button variant="outline" size="sm" className="mt-3 glass">View room →</Button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 glass-strong rounded-2xl p-6">
          <h2 className="text-xl font-display font-bold mb-4">Edit profile</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label className="text-xs">Display name</Label><Input defaultValue={currentUser.name} className="mt-1 glass" /></div>
            <div><Label className="text-xs">Primary role</Label><Input defaultValue={currentUser.role} className="mt-1 glass" /></div>
            <div><Label className="text-xs">Timezone</Label><Input defaultValue="UTC−5" className="mt-1 glass" /></div>
            <div><Label className="text-xs">GitHub</Label><Input defaultValue="alexrivera" className="mt-1 glass" /></div>
          </div>
        </section>

        <section className="glass-strong rounded-2xl p-6">
          <h2 className="text-xl font-display font-bold mb-4">Notifications</h2>
          <div className="space-y-4">
            {[
              { l: "Milestone nudges", d: "Get pinged when your team falls behind pace" },
              { l: "Teammate mentions", d: "Direct @mentions in chat or brief" },
              { l: "Event announcements", d: "New hackathons matching your skills" },
            ].map(n => (
              <div key={n.l} className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-sm">{n.l}</div>
                  <div className="text-xs text-muted-foreground">{n.d}</div>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
