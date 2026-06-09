import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { currentUser, rooms } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Github, Linkedin, Trophy, Globe, Mail } from "lucide-react";

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
                <a href="https://github.com/Divyanshu1916" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full glass hover:bg-primary/10 hover:text-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_20%,transparent)]">
                  <Github className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" /> Divyanshu1916
                </a>
                <a href="https://www.linkedin.com/in/divyanshu-kumar11" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full glass hover:bg-primary/10 hover:text-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_20%,transparent)]">
                  <Linkedin className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" /> divyanshu-kumar11
                </a>
                <a href="https://discordapp.com/users/1507933325598392430" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full glass hover:bg-primary/10 hover:text-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_20%,transparent)]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg> Discord
                </a>
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
