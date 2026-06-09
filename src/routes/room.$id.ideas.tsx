import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles, Lightbulb, Lock, ThumbsUp, Clock, Trophy, Cpu, Target, Loader2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/room/$id/ideas")({
  head: () => ({ meta: [{ title: "AI Idea Generator · HackMate AI" }] }),
  component: Ideas,
});

type GeneratedIdea = {
  id: string;
  name: string;
  problem: string;
  solution: string;
  feasibility: number;
  stack: string[];
  devTime: string;
  winning: number;
  votes: number;
};

const STACKS = [
  ["Next.js", "Supabase", "OpenAI", "Tailwind"],
  ["React", "FastAPI", "Postgres", "LangChain"],
  ["SvelteKit", "Cloudflare Workers", "D1", "Whisper"],
  ["Expo", "tRPC", "Prisma", "Anthropic"],
  ["Remix", "Drizzle", "Pinecone", "Replicate"],
];

function buildIdeas(theme: string, skills: string, size: number): GeneratedIdea[] {
  const t = theme.trim() || "AI for Good";
  const skillList = skills.split(",").map(s => s.trim()).filter(Boolean);
  const sizeFactor = Math.min(1, size / 5);
  const templates = [
    {
      name: `Pulse — Real-time ${t} Copilot`,
      problem: `Teams working on ${t} lack real-time, contextual guidance and waste hours on coordination.`,
      solution: `An ambient AI copilot that listens to team activity, summarizes progress, and nudges next steps grounded in ${t} best practices.`,
    },
    {
      name: `Lumen — ${t} Insight Engine`,
      problem: `Decision-makers in ${t} drown in scattered data and miss critical signals.`,
      solution: `A multi-source ingestion + LLM analytics layer that turns raw ${t} data into a daily one-page brief with actionable insights.`,
    },
    {
      name: `Sprout — Community ${t} Marketplace`,
      problem: `People can't easily discover or trust ${t} solutions built by their peers.`,
      solution: `A reputation-weighted marketplace where verified contributors publish ${t} micro-tools that anyone can remix in one click.`,
    },
    {
      name: `Echo — Voice-first ${t} Assistant`,
      problem: `${t} tools assume a desk and a keyboard — millions of users have neither.`,
      solution: `A multilingual voice agent (Whisper + TTS) that delivers ${t} workflows over a phone call or WhatsApp message.`,
    },
    {
      name: `Forge — Auto-${t} Workflow Builder`,
      problem: `Building bespoke ${t} workflows still takes weeks of engineering work most teams can't afford.`,
      solution: `A drag-free, prompt-driven builder that generates production ${t} pipelines from a plain-English brief in under 60 seconds.`,
    },
  ];
  return templates.map((tpl, i) => {
    const base = 62 + ((tpl.name.length + i * 13) % 30);
    const feasibility = Math.min(10, Math.round((base / 10) + sizeFactor + (skillList.length > 2 ? 1 : 0)));
    const winning = Math.min(10, Math.max(5, Math.round(feasibility * 0.7 + (i === 0 ? 2 : 1) + sizeFactor)));
    const hours = 18 + ((i * 7) % 22) - Math.round(sizeFactor * 6);
    return {
      id: `gen-${Date.now()}-${i}`,
      name: tpl.name,
      problem: tpl.problem,
      solution: tpl.solution,
      feasibility,
      stack: STACKS[i % STACKS.length],
      devTime: `${hours}–${hours + 8} hrs`,
      winning,
      votes: 0,
    };
  });
}

function Ideas() {
  const [theme, setTheme] = useState("AI for Good");
  const [skills, setSkills] = useState("React, Python, Design");
  const [size, setSize] = useState(4);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [generating, setGenerating] = useState(false);
  const [locked, setLocked] = useState<string | null>(null);

  const generate = () => {
    if (!theme.trim()) { toast.error("Add a hackathon theme first"); return; }
    setGenerating(true);
    setIdeas([]);
    setLocked(null);
    setTimeout(() => {
      setIdeas(buildIdeas(theme, skills, size));
      setGenerating(false);
      toast.success("5 fresh ideas, ranked");
    }, 1100);
  };

  const vote = (id: string) => setIdeas(prev => prev.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Lightbulb className="h-7 w-7 text-primary" /> AI Idea Generator
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Describe your hackathon and team — we'll rank 5 winning project ideas in seconds.
        </p>
      </div>

      {/* Input panel */}
      <div className="glass-strong rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 space-y-1.5">
            <Label htmlFor="theme" className="text-xs uppercase tracking-wider text-muted-foreground">Hackathon Theme</Label>
            <Input id="theme" value={theme} onChange={e => setTheme(e.target.value)} placeholder="e.g. Climate × AI" className="glass" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="skills" className="text-xs uppercase tracking-wider text-muted-foreground">Team Skills</Label>
            <Input id="skills" value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, ML, Design" className="glass" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="size" className="text-xs uppercase tracking-wider text-muted-foreground">Team Size</Label>
            <Input id="size" type="number" min={1} max={10} value={size} onChange={e => setSize(Math.max(1, Math.min(10, +e.target.value || 1)))} className="glass" />
          </div>
        </div>
        <Button onClick={generate} disabled={generating} className="w-full sm:w-auto gradient-bg text-primary-foreground border-0 glow">
          {generating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate Ideas</>}
        </Button>
      </div>

      {/* Results */}
      {generating && (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 space-y-3 animate-pulse">
              <div className="h-5 w-2/3 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-5/6 bg-muted rounded" />
              <div className="h-20 w-full bg-muted/60 rounded mt-3" />
              <div className="flex gap-2 mt-3"><div className="h-6 w-16 bg-muted rounded" /><div className="h-6 w-16 bg-muted rounded" /></div>
            </div>
          ))}
        </div>
      )}

      {!generating && ideas.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center">
          <Sparkles className="h-8 w-8 text-primary mx-auto" />
          <p className="mt-3 text-muted-foreground">Fill in the theme above and hit <span className="text-foreground font-medium">Generate Ideas</span> to see 5 ranked, feasibility-scored project ideas.</p>
        </div>
      )}

      {!generating && ideas.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {ideas.map((idea, idx) => {
            const isLocked = locked === idea.id;
            return (
              <div
                key={idea.id}
                className={`glass rounded-2xl p-5 sm:p-6 flex flex-col transition-all animate-fade-in ${isLocked ? "ring-2 ring-primary glow" : "hover:-translate-y-0.5"}`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Idea #{idx + 1}</div>
                    <h3 className="font-display font-bold text-lg sm:text-xl mt-0.5">{idea.name}</h3>
                  </div>
                  {isLocked && (
                    <span className="text-[10px] gradient-bg text-primary-foreground px-2 py-0.5 rounded-full font-bold uppercase shrink-0">Locked</span>
                  )}
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3" /> Problem</div>
                    <p className="mt-1 text-foreground/90">{idea.problem}</p>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Lightbulb className="h-3 w-3" /> Solution</div>
                    <p className="mt-1 text-foreground/90">{idea.solution}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5">
                  <Metric label="Feasibility" value={`${idea.feasibility}/10`} pct={idea.feasibility * 10} />
                  <Metric label="Winning" value={`${idea.winning}/10`} pct={idea.winning * 10} />
                  <Metric label="Build" value={idea.devTime} icon={<Clock className="h-3 w-3" />} />
                </div>

                <div className="mt-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Cpu className="h-3 w-3" /> Recommended Stack</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {idea.stack.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded glass font-mono">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/50">
                  <Button onClick={() => vote(idea.id)} variant="ghost" size="sm" className="text-xs">
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" /> {idea.votes}
                  </Button>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5 text-primary" /> {idea.winning >= 8 ? "High" : idea.winning >= 6 ? "Solid" : "Stretch"} winning potential
                  </span>
                  <Button
                    onClick={() => { setLocked(isLocked ? null : idea.id); if (!isLocked) toast.success(`Locked in: ${idea.name}`); }}
                    size="sm"
                    className={`ml-auto ${isLocked ? "" : "gradient-bg text-primary-foreground border-0"}`}
                    variant={isLocked ? "outline" : "default"}
                  >
                    <Lock className="h-3.5 w-3.5 mr-1" /> {isLocked ? "Unlock" : "Lock in"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, pct, icon }: { label: string; value: string; pct?: number; icon?: React.ReactNode }) {
  return (
    <div className="glass rounded-lg p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">{icon}{label}</div>
      <div className="font-bold text-sm mt-0.5">{value}</div>
      {pct !== undefined && (
        <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full gradient-bg" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
