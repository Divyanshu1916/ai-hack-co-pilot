import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { members } from "@/lib/mock-data";

export const Route = createFileRoute("/room/$id/brief")({
  head: () => ({ meta: [{ title: "Project brief · HackMate AI" }] }),
  component: Brief,
});

type Section = { id: string; title: string; placeholder: string; value: string };

const initial: Section[] = [
  { id: "problem", title: "Problem statement", placeholder: "What's broken?", value: "ER teams lose 4–9 critical minutes per patient when language barriers prevent direct intake. Phone interpreters are slow, video interpreters are unavailable at night." },
  { id: "solution", title: "Solution hypothesis", placeholder: "How do we fix it?", value: "VoiceBridge is a clinician's headset overlay that streams real-time, medical-grade translation with <600ms latency. Works on hospital wifi, no patient app required." },
  { id: "users", title: "Target users", placeholder: "Who's it for?", value: "ER nurses and triage physicians at Tier-2 hospitals without in-house interpreter staff. Secondary: paramedic teams." },
  { id: "features", title: "Key features (MVP)", placeholder: "What ships in 48h?", value: "• Two-way live translation (EN ↔ ES, ZH, AR)\n• Medical glossary pre-bias\n• Speaker color-coding HUD\n• Latency dashboard for judges\n• Local-first; no PHI leaves device" },
  { id: "stack", title: "Tech stack", placeholder: "What are we building with?", value: "Whisper (distil) on edge · Claude Sonnet 4 · Cloudflare Workers · WebRTC · Supabase · Next.js + Tailwind." },
];

function Brief() {
  const [sections, setSections] = useState(initial);
  const [thinking, setThinking] = useState<string | null>(null);

  const fillAi = (id: string) => {
    setThinking(id);
    setTimeout(() => {
      setSections(s => s.map(x => x.id === id ? { ...x, value: x.value + "\n\n[AI added] " + ({
        problem: "30% of US ERs lack 24/7 interpreter coverage per JCAHO 2024 report.",
        solution: "Edge inference keeps PHI on-device, addressing HIPAA blockers competitors face.",
        users: "Pilot interest from 3 community hospitals in MA and TX.",
        features: "• Offline fallback mode using on-device Whisper-tiny.",
        stack: "Edge: Cloudflare Workers AI for Whisper, fallback to Replicate on cold start.",
      }[id] || "Additional context.") }: x));
      setThinking(null);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><FileText className="h-7 w-7 text-primary" /> Project brief</h1>
          <p className="text-muted-foreground mt-1">A living one-pager. Edits sync to your team.</p>
        </div>
        <div className="flex items-center gap-3 glass rounded-full px-3 py-1.5 text-xs">
          <Users className="h-3.5 w-3.5 text-accent" />
          <span className="text-muted-foreground">Live · 3 editing</span>
          <div className="flex -space-x-1.5">
            {members.slice(0, 3).map(m => (
              <Avatar key={m.id} className="h-5 w-5 border border-card"><AvatarFallback className="text-[8px] bg-secondary">{m.avatar}</AvatarFallback></Avatar>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {sections.map(s => (
            <div key={s.id} className="glass-strong rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-semibold">{s.title}</h3>
                <Button onClick={() => fillAi(s.id)} disabled={thinking === s.id} size="sm" variant="ghost" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1 text-primary" /> {thinking === s.id ? "Thinking..." : "AI fill"}
                </Button>
              </div>
              <Textarea
                value={s.value}
                onChange={e => setSections(prev => prev.map(x => x.id === s.id ? { ...x, value: e.target.value } : x))}
                placeholder={s.placeholder}
                rows={4}
                className="glass border-0 resize-none"
              />
            </div>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold mb-3">Brief health</h3>
            <div className="space-y-3 text-sm">
              {[
                ["Problem clarity", 92],
                ["Solution specificity", 78],
                ["Feasibility", 81],
                ["Demo readiness", 64],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">{l}</span><span className="font-bold">{v}%</span></div>
                  <div className="h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                    <div className="h-full gradient-bg" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold mb-2 flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-primary" /> AI nudge</h3>
            <p className="text-sm text-muted-foreground">Your "Demo readiness" is low. Add a 30-second demo script to the brief before T-12h to unblock pitch generation.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
