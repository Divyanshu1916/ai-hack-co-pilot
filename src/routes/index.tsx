import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Lightbulb, FileText, Kanban, MessageSquare, Presentation, Users,
  ArrowRight, Github, Sparkles, Zap, Clock, Trophy, Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HackMate AI — Win your next hackathon" },
      { name: "description", content: "An AI workspace built for the 48-hour sprint. Ideate, plan, build, and pitch — all in one window." },
      { property: "og:title", content: "HackMate AI" },
      { property: "og:description", content: "The AI workspace built for hackathon teams." },
    ],
  }),
  component: Landing,
});

const features: { icon: any; title: string; desc: string; to?: string; params?: any }[] = [
  { icon: Lightbulb, title: "AI Idea Generator", desc: "Ranked, feasibility-scored ideas tuned to your theme and team skills.", to: "/room/$id/ideas", params: { id: "neon-2026" } },
  { icon: FileText, title: "Living Project Brief", desc: "A one-pager that updates itself as your team converges.", to: "/room/$id/brief", params: { id: "neon-2026" } },
  { icon: Kanban, title: "AI Task Board", desc: "Auto-generated tasks, labeled by role, re-prioritized as the clock ticks.", to: "/room/$id/tasks", params: { id: "neon-2026" } },
  { icon: MessageSquare, title: "In-Context Assistant", desc: "Answers grounded in your brief, stack, and current tasks — not generic snippets.", to: "/room/$id/chat", params: { id: "neon-2026" } },
  { icon: Presentation, title: "Pitch Studio", desc: "One click to a 5-slide deck with judge-mode Q&A simulation.", to: "/room/$id/pitch", params: { id: "neon-2026" } },
  { icon: Users, title: "Team Matching", desc: "Solo hackers find compatible teams by skill, timezone, and interest.", to: "/dashboard" },
];

const stats = [
  { v: "12,400+", l: "Hackers shipped" },
  { v: "340", l: "Hackathons" },
  { v: "55%", l: "Faster to first prototype" },
  { v: "4.9★", l: "Team rating" },
];

const testimonials = [
  { q: "We went from idea to working demo in 6 hours. HackMate's task board was the unfair advantage.", a: "Priya Shah", r: "1st place, HackMIT 2025" },
  { q: "The pitch studio judge-mode caught three holes in our story before the real judges did.", a: "Marcus Lee", r: "Best AI Hack, YC AI Hackathon" },
  { q: "Brief + task board + chat in one place means no more 'who's doing what?' Slack threads.", a: "Devi Patel", r: "Team lead, TreeHacks" },
];

const plans = [
  { name: "Solo", price: "Free", desc: "For first-time hackers", features: ["1 active room", "AI idea generator", "Task board", "Community support"], cta: "Start free" },
  { name: "Team", price: "$12", per: "/hacker / event", desc: "For competitive teams", features: ["Unlimited rooms", "Pitch studio + export", "Judge Q&A simulator", "Priority assistant", "Public portfolio"], cta: "Start trial", featured: true },
  { name: "Organizer", price: "Custom", desc: "For event hosts", features: ["Team matching pool", "Sponsor API marketplace", "Analytics + retros", "Dedicated success"], cta: "Talk to us" },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center gap-2">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 mx-auto text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Link to="/auth" className="hidden sm:block"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/auth"><Button size="sm" className="gradient-bg text-primary-foreground border-0 glow whitespace-nowrap">Get started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-12 sm:pt-24 pb-16 sm:pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-6 sm:mb-8 animate-fade-in">
            <Sparkles className="h-3 w-3 text-primary shrink-0" />
            <span className="truncate">New · Pitch judge-mode now live</span>
          </div>
          <h1 className="text-[2rem] leading-[1.1] sm:text-6xl lg:text-7xl font-bold tracking-tight sm:tracking-tighter max-w-4xl mx-auto sm:leading-[1.05]">
            Ship your hackathon project{" "}
            <span className="gradient-text">before the deadline</span> bites.
          </h1>
          <p className="mt-5 sm:mt-6 text-sm sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            HackMate AI is the one workspace your team needs for the 48-hour sprint — ideation, brief, tasks, code help, and pitch deck, all aligned.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center px-2">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gradient-bg text-primary-foreground border-0 glow h-12 px-7 text-base">
                Create your room <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto glass h-12 px-7 text-base">
                <Github className="mr-1 h-4 w-4" /> See live demo
              </Button>
            </Link>
          </div>

          {/* Hero mock card */}
          <div className="relative mt-12 sm:mt-16 max-w-5xl mx-auto animate-float">
            <div className="absolute -inset-8 gradient-bg opacity-30 blur-3xl rounded-full" />
            <div className="relative glass-strong rounded-2xl p-1.5 sm:p-2 shadow-2xl">
              <div className="rounded-xl bg-card/60 p-3 sm:p-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/70 shrink-0" />
                  <div className="h-2.5 w-2.5 rounded-full bg-accent/70 shrink-0" />
                  <div className="h-2.5 w-2.5 rounded-full bg-chart-5/70 shrink-0" />
                  <div className="ml-2 sm:ml-3 text-[10px] sm:text-xs text-muted-foreground font-mono truncate">hackmate.ai/room/neon-2026</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { l: "Idea locked", v: "VoiceBridge", i: Lightbulb },
                    { l: "Tasks shipped", v: "12 / 18", i: Kanban },
                    { l: "Time left", v: "14h 22m", i: Clock },
                  ].map(s => (
                    <div key={s.l} className="glass rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><s.i className="h-3.5 w-3.5 shrink-0" />{s.l}</div>
                      <div className="mt-1 text-xl sm:text-2xl font-display font-bold">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 glass rounded-xl p-3 sm:p-4">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary shrink-0" /> AI assistant</div>
                  <div className="text-xs sm:text-sm break-words">Your latency budget is 600ms. Whisper-tiny on the edge is overkill — switch to <code className="font-mono text-primary break-all">distil-whisper</code> and reclaim 180ms for the glossary lookup.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold gradient-text">{s.v}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-5xl font-bold tracking-tight">Every tool you wished you had at 3am</h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-base sm:text-lg">No more juggling Notion, Slack, GitHub, and Canva. HackMate ships every hackathon-specific tool in one window.</p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const card = (
              <div className="group glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 h-full" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="h-11 w-11 rounded-xl gradient-bg grid place-items-center glow mb-4">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                  {f.title}
                  {f.to && <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </div>
            );
            return f.to ? (
              <Link key={f.title} to={f.to} params={f.params} className="block">{card}</Link>
            ) : (
              <div key={f.title}>{card}</div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-5xl font-bold tracking-tight">From hour zero to demo day</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { n: "01", t: "Spin up a room", d: "Invite your team, set the event clock, drop the theme." },
            { n: "02", t: "Lock the idea", d: "Browse ranked AI ideas, vote, and lock your concept." },
            { n: "03", t: "Build with AI", d: "Auto-task board, context-aware coding chat, milestone nudges." },
            { n: "04", t: "Pitch & win", d: "One-click 5-slide deck, judge-mode Q&A rehearsal, PDF export." },
          ].map(s => (
            <div key={s.n} className="glass rounded-2xl p-6">
              <div className="font-mono text-xs gradient-text font-bold">{s.n}</div>
              <h3 className="font-display font-semibold mt-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <figure key={t.a} className="glass rounded-2xl p-6">
              <Trophy className="h-5 w-5 text-accent mb-3" />
              <blockquote className="text-sm leading-relaxed">"{t.q}"</blockquote>
              <figcaption className="mt-4 text-xs">
                <div className="font-semibold">{t.a}</div>
                <div className="text-muted-foreground">{t.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-5xl font-bold tracking-tight">Simple, hacker-friendly pricing</h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground">Free forever for solo hackers. Pay per event for teams.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map(p => (
            <div key={p.name} className={`relative rounded-2xl p-6 ${p.featured ? "glass-strong glow ring-2 ring-primary/50" : "glass"}`}>
              {p.featured && <div className="absolute -top-3 left-6 px-3 py-1 rounded-full gradient-bg text-primary-foreground text-xs font-semibold">Most popular</div>}
              <h3 className="font-display font-semibold text-lg">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-display font-bold">{p.price}</span>
                {p.per && <span className="text-sm text-muted-foreground">{p.per}</span>}
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map(f => (
                  <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <Link to="/auth" className="block mt-6">
                <Button className={`w-full ${p.featured ? "gradient-bg text-primary-foreground border-0" : ""}`} variant={p.featured ? "default" : "outline"}>
                  {p.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-16 text-center">
          <div className="absolute inset-0 gradient-bg opacity-20" />
          <div className="relative">
            <Zap className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Your next hackathon starts now</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Spin up a room in under 30 seconds. No card required.</p>
            <Link to="/auth" className="inline-block mt-8">
              <Button size="lg" className="gradient-bg text-primary-foreground border-0 glow h-12 px-8 text-base">
                Start building <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 mt-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
          <Logo />
          <div>© 2026 HackMate AI — Made for hackers, by hackers.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">GitHub</a>
            <a href="#" className="hover:text-foreground">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
