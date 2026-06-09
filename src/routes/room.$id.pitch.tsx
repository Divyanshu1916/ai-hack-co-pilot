import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { slides as seed } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, Download, Play, ChevronLeft, ChevronRight, Presentation } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/room/$id/pitch")({
  head: () => ({ meta: [{ title: "Pitch studio · HackMate AI" }] }),
  component: Pitch,
});

const questions = [
  "How do you ensure HIPAA compliance with edge inference?",
  "What's your moat if Google Translate ships medical mode?",
  "What's the unit economics per hospital per month?",
  "Show me the latency under packet loss.",
];

function Pitch() {
  const [slides, setSlides] = useState(seed);
  const [active, setActive] = useState(0);
  const [judgeMode, setJudgeMode] = useState(false);

  const cur = slides[active];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Presentation className="h-7 w-7 text-primary" /> Pitch studio</h1>
          <p className="text-muted-foreground mt-1">Auto-generated 5-slide deck. Edit inline. Rehearse with judge-mode Q&A.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setSlides(seed); toast.success("Deck regenerated from latest brief"); }} variant="outline" className="glass">
            <Sparkles className="h-4 w-4 mr-1 text-primary" /> Regenerate
          </Button>
          <Button onClick={() => toast.success("Exported to pitch-deck.pdf")} className="gradient-bg text-primary-foreground border-0 glow">
            <Download className="h-4 w-4 mr-1" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,320px] gap-6">
        <div className="space-y-4">
          {/* Slide canvas */}
          <div className="glass-strong rounded-3xl p-8 sm:p-12 aspect-[16/9] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-5" />
            <div className="absolute top-4 right-6 text-[10px] font-mono text-muted-foreground">{active + 1} / {slides.length}</div>
            <div className="relative flex-1 flex flex-col">
              <Input
                value={cur.title}
                onChange={e => setSlides(s => s.map((sl, i) => i === active ? { ...sl, title: e.target.value } : sl))}
                className="text-2xl sm:text-4xl font-display font-bold border-0 bg-transparent gradient-text h-auto px-0 focus-visible:ring-0"
              />
              <Textarea
                value={cur.body}
                onChange={e => setSlides(s => s.map((sl, i) => i === active ? { ...sl, body: e.target.value } : sl))}
                className="mt-4 flex-1 border-0 bg-transparent resize-none focus-visible:ring-0 text-base sm:text-lg"
              />
            </div>
          </div>

          {/* Slide strip */}
          <div className="flex items-center gap-2">
            <Button onClick={() => setActive(Math.max(0, active - 1))} variant="ghost" size="icon" disabled={active === 0}><ChevronLeft className="h-4 w-4" /></Button>
            <div className="flex-1 flex gap-2 overflow-x-auto">
              {slides.map((s, i) => (
                <button key={s.id} onClick={() => setActive(i)} className={`shrink-0 w-32 h-20 rounded-xl p-2 text-left text-[10px] transition-all ${
                  i === active ? "glass-strong ring-2 ring-primary glow" : "glass hover:ring-1 hover:ring-border"
                }`}>
                  <div className="font-bold truncate">{i + 1}. {s.title}</div>
                  <div className="text-muted-foreground line-clamp-3 mt-1">{s.body}</div>
                </button>
              ))}
            </div>
            <Button onClick={() => setActive(Math.min(slides.length - 1, active + 1))} variant="ghost" size="icon" disabled={active === slides.length - 1}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">Judge mode</h3>
              <Button onClick={() => setJudgeMode(!judgeMode)} size="sm" variant={judgeMode ? "default" : "outline"} className={judgeMode ? "gradient-bg text-primary-foreground border-0" : "glass"}>
                <Play className="h-3.5 w-3.5 mr-1" /> {judgeMode ? "Stop" : "Simulate"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Run a simulated tough Q&A based on your brief.</p>
            {judgeMode && (
              <ul className="mt-4 space-y-2">
                {questions.map((q, i) => (
                  <li key={i} className="glass rounded-xl p-3 text-sm">
                    <span className="text-[10px] text-primary font-mono">JUDGE</span>
                    <div className="mt-0.5">{q}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold mb-2">Rubric score</h3>
            <p className="text-xs text-muted-foreground mb-3">Pre-judging estimate based on your brief & deck.</p>
            <div className="space-y-2 text-sm">
              {[["Innovation", 88], ["Technical", 82], ["Design", 75], ["Impact", 91]].map(([l, v]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">{l}</span><span className="font-bold">{v}/100</span></div>
                  <div className="h-1.5 rounded-full bg-muted mt-1 overflow-hidden"><div className="h-full gradient-bg" style={{ width: `${v}%` }} /></div>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-sm font-display font-bold">Composite</span>
                <span className="text-2xl font-display font-bold gradient-text">84</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
