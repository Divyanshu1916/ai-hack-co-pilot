import { createFileRoute, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, Trophy, AlertTriangle, ShieldCheck, Target, Trash2,
  Rocket, ListChecks, Flame, TrendingUp, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/room/$id/win-analyzer")({
  head: () => ({
    meta: [
      { title: "Win Probability Analyzer · HackMate AI" },
      { name: "description", content: "Predict your hackathon win probability and get an MVP scope plan." },
    ],
  }),
  component: WinAnalyzer,
});

type Analysis = {
  score: number;
  readiness: number;
  strengths: string[];
  weaknesses: string[];
  risks: { label: string; level: "high" | "medium" | "low" }[];
  remove: string[];
  prioritize: string[];
  mvp: string[];
  breakdown: { label: string; value: number }[];
};

const SKILL_BUCKETS = [
  { key: "frontend", words: ["frontend", "react", "ui", "ux", "design", "tailwind", "css"] },
  { key: "backend", words: ["backend", "node", "api", "server", "python", "go", "rust", "django"] },
  { key: "ai", words: ["ai", "ml", "llm", "gpt", "ml", "pytorch", "tensorflow", "rag"] },
  { key: "data", words: ["data", "sql", "postgres", "mongo", "analytics", "etl"] },
  { key: "design", words: ["design", "figma", "branding", "motion", "video"] },
  { key: "devops", words: ["devops", "cloud", "aws", "docker", "k8s", "ci"] },
];

function analyze(teamSize: number, skillsRaw: string, hours: number, desc: string): Analysis {
  const skills = skillsRaw.split(/[,\n]/).map(s => s.trim().toLowerCase()).filter(Boolean);
  const coverage = SKILL_BUCKETS.filter(b => skills.some(s => b.words.some(w => s.includes(w)))).length;
  const coveragePct = Math.round((coverage / SKILL_BUCKETS.length) * 100);

  const teamFit = teamSize <= 0 ? 0 : teamSize < 2 ? 35 : teamSize <= 5 ? 95 : teamSize <= 7 ? 70 : 45;
  const timePressure = hours <= 0 ? 5 : hours < 6 ? 25 : hours < 18 ? 55 : hours < 36 ? 85 : 95;

  const words = desc.trim().split(/\s+/).filter(Boolean).length;
  const clarity = Math.min(100, Math.round((words / 60) * 100));
  const keywords = ["ai", "real-time", "voice", "agent", "novel", "open source", "accessibility", "climate", "health", "education"];
  const wow = Math.min(100, keywords.filter(k => desc.toLowerCase().includes(k)).length * 18 + 30);

  const score = Math.max(5, Math.min(98, Math.round(
    teamFit * 0.20 + coveragePct * 0.25 + timePressure * 0.20 + clarity * 0.15 + wow * 0.20
  )));

  const readiness = Math.max(0, Math.min(100, Math.round(
    timePressure * 0.45 + clarity * 0.25 + coveragePct * 0.20 + (teamFit * 0.10)
  )));

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  if (teamFit >= 70) strengths.push(`Balanced team size (${teamSize}) — fast coordination`);
  else weaknesses.push(teamSize < 2 ? "Solo or pair team — capacity is thin" : "Team is too large — coordination overhead");
  if (coveragePct >= 60) strengths.push(`Strong skill coverage across ${coverage}/${SKILL_BUCKETS.length} domains`);
  else weaknesses.push("Skill coverage is narrow — missing key domains");
  if (timePressure >= 70) strengths.push(`${hours}h remaining gives room to polish`);
  else weaknesses.push(`Only ${hours}h left — execution window is tight`);
  if (clarity >= 60) strengths.push("Project description is detailed and specific");
  else weaknesses.push("Project description is vague — judges need a sharper hook");
  if (wow >= 65) strengths.push("Concept signals novelty and trend alignment");
  else weaknesses.push("Concept lacks a memorable wow-factor");

  const risks: Analysis["risks"] = [];
  if (hours < 12) risks.push({ label: "Submission deadline pressure", level: "high" });
  else if (hours < 24) risks.push({ label: "Limited time for polish & demo recording", level: "medium" });
  if (coveragePct < 50) risks.push({ label: "Skill gap — likely to block integration", level: "high" });
  if (teamSize > 6) risks.push({ label: "Decision paralysis from large team", level: "medium" });
  if (teamSize < 2) risks.push({ label: "Single point of failure if blocker hits", level: "high" });
  if (clarity < 40) risks.push({ label: "Unclear scope may lead to feature creep", level: "high" });
  if (wow < 50) risks.push({ label: "Forgettable pitch in a crowded leaderboard", level: "medium" });
  if (risks.length === 0) risks.push({ label: "Execution risk only — fundamentals look solid", level: "low" });

  const remove: string[] = [];
  if (hours < 24) {
    remove.push("Custom authentication — use a provider");
    remove.push("Admin dashboards & analytics screens");
    remove.push("Native mobile builds");
  }
  if (hours < 12) {
    remove.push("Onboarding flow with tutorials");
    remove.push("Settings & preferences pages");
  }
  if (coveragePct < 50) remove.push("Anything requiring missing skill domains");
  if (remove.length === 0) remove.push("Nothing critical — keep scope tight regardless");

  const prioritize = [
    "One unforgettable hero feature — judges remember the demo, not the menu",
    "A 60-second demo video shot before final hour",
    "A clean landing/README explaining the why in one line",
    "Live deployment with a public URL",
  ];

  const mvp = [
    "Define the single user journey end-to-end",
    "Stub data where real integrations would slow you down",
    "Ship the hero flow first — polish only after it works",
    "Record demo with 4h buffer remaining",
    "Lock scope at 50% of remaining time",
  ];

  const breakdown = [
    { label: "Team fit", value: teamFit },
    { label: "Skill coverage", value: coveragePct },
    { label: "Time runway", value: timePressure },
    { label: "Idea clarity", value: clarity },
    { label: "Wow factor", value: wow },
  ];

  return { score, readiness, strengths, weaknesses, risks, remove, prioritize, mvp, breakdown };
}

function WinAnalyzer() {
  const { id } = useParams({ from: "/room/$id/win-analyzer" });
  const [teamSize, setTeamSize] = useState(4);
  const [skills, setSkills] = useState("React, Node, AI/LLM, Design");
  const [hours, setHours] = useState(24);
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const result = useMemo(
    () => (submitted ? analyze(teamSize, skills, hours, desc) : null),
    [submitted, teamSize, skills, hours, desc],
  );

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent animate-pulse-glow" /> Room {id} · Predictive analytics
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mt-2">
            Win Probability <span className="gradient-text">Analyzer</span>
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Stress-test your hackathon plan. Get a win-probability score, MVP scope, and a ruthless cut-list before the clock runs out.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input form */}
        <div className="lg:col-span-1">
          <div className="glass-strong rounded-2xl p-6 space-y-5 sticky top-20">
            <h2 className="font-display font-bold flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" /> Project inputs
            </h2>

            <div className="space-y-2">
              <Label htmlFor="team">Team size</Label>
              <Input id="team" type="number" min={1} max={20} value={teamSize}
                onChange={e => setTeamSize(Math.max(1, Number(e.target.value) || 1))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Textarea id="skills" rows={3} value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="React, Node, AI/LLM, Design, DevOps" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Hours remaining</Label>
              <Input id="hours" type="number" min={0} max={120} value={hours}
                onChange={e => setHours(Math.max(0, Number(e.target.value) || 0))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Project description</Label>
              <Textarea id="desc" rows={5} value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="What are you building? Who is it for? What's the hook?" />
            </div>

            <Button onClick={run} disabled={loading || !desc.trim()} className="w-full gradient-bg text-primary-foreground border-0 hover:opacity-90">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : <><Sparkles className="h-4 w-4" /> Analyze</>}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {!result ? (
            <div className="glass rounded-2xl p-10 text-center">
              <Trophy className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-display font-bold text-lg">Awaiting analysis</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Fill in the project inputs and hit Analyze. We'll score win probability, surface risks, and recommend an MVP scope.
              </p>
            </div>
          ) : (
            <>
              {/* Score gauges */}
              <div className="grid sm:grid-cols-2 gap-6">
                <GaugeCard title="Win Probability" value={result.score} icon={Trophy} accent />
                <GaugeCard title="Submission Readiness" value={result.readiness} icon={ShieldCheck} />
              </div>

              {/* Breakdown bars */}
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="font-display font-bold flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-primary" /> Score breakdown
                </h3>
                <div className="space-y-4">
                  {result.breakdown.map(b => (
                    <div key={b.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">{b.label}</span>
                        <span className="font-mono tabular-nums font-semibold">{b.value}%</span>
                      </div>
                      <Progress value={b.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths / Weaknesses */}
              <div className="grid sm:grid-cols-2 gap-6">
                <ListCard title="Strengths" icon={ShieldCheck} tone="good" items={result.strengths} />
                <ListCard title="Weaknesses" icon={AlertTriangle} tone="warn" items={result.weaknesses} />
              </div>

              {/* Risks */}
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="font-display font-bold flex items-center gap-2 mb-4">
                  <Flame className="h-4 w-4 text-destructive" /> Biggest risks
                </h3>
                <ul className="space-y-2">
                  {result.risks.map(r => (
                    <li key={r.label} className="flex items-center justify-between gap-3 glass rounded-xl px-4 py-3">
                      <span className="text-sm">{r.label}</span>
                      <RiskBadge level={r.level} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Remove / Prioritize */}
              <div className="grid sm:grid-cols-2 gap-6">
                <ListCard title="Cut from scope" icon={Trash2} tone="warn" items={result.remove} />
                <ListCard title="Prioritize now" icon={Target} tone="good" items={result.prioritize} />
              </div>

              {/* MVP */}
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="font-display font-bold flex items-center gap-2 mb-4">
                  <Rocket className="h-4 w-4 text-primary" /> Recommended MVP scope
                </h3>
                <ol className="space-y-2">
                  {result.mvp.map((m, i) => (
                    <li key={m} className="flex gap-3 items-start glass rounded-xl px-4 py-3">
                      <span className="h-6 w-6 shrink-0 rounded-full gradient-bg text-primary-foreground text-xs font-bold grid place-items-center">{i + 1}</span>
                      <span className="text-sm">{m}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GaugeCard({ title, value, icon: Icon, accent }: { title: string; value: number; icon: any; accent?: boolean }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 70 ? "text-accent" : value >= 45 ? "text-primary" : "text-destructive";
  return (
    <div className="glass-strong rounded-2xl p-6 relative overflow-hidden">
      {accent && <div className="absolute inset-0 gradient-bg opacity-5" />}
      <div className="relative flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Icon className="h-3.5 w-3.5" /> {title}
        </div>
        <div className="relative mt-3 h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted opacity-30" />
            <circle
              cx="60" cy="60" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
              stroke="currentColor" className={color}
              strokeDasharray={c} strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 800ms ease" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <div className={`text-4xl font-display font-bold ${color}`}>{value}<span className="text-base">%</span></div>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {value >= 70 ? "On track to podium" : value >= 45 ? "Competitive — keep pushing" : "Needs urgent action"}
        </div>
      </div>
    </div>
  );
}

function ListCard({ title, icon: Icon, tone, items }: { title: string; icon: any; tone: "good" | "warn"; items: string[] }) {
  const color = tone === "good" ? "text-accent" : "text-destructive";
  return (
    <div className="glass-strong rounded-2xl p-6">
      <h3 className="font-display font-bold flex items-center gap-2 mb-4">
        <Icon className={`h-4 w-4 ${color}`} /> {title}
      </h3>
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i} className="flex gap-2 items-start text-sm">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${tone === "good" ? "bg-accent" : "bg-destructive"}`} />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskBadge({ level }: { level: "high" | "medium" | "low" }) {
  const map = {
    high: "bg-destructive/15 text-destructive border-destructive/30",
    medium: "bg-primary/15 text-primary border-primary/30",
    low: "bg-accent/15 text-accent-foreground border-accent/30",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${map[level]}`}>
      {level}
    </span>
  );
}
