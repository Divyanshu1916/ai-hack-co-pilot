import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { History, Share2, GitBranch, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/room/$id/retro")({
  head: () => ({ meta: [{ title: "Retrospective · HackMate AI" }] }),
  component: Retro,
});

const timeline = [
  { t: "T-48h", e: "Room created · 4 hackers joined" },
  { t: "T-46h", e: "Idea locked: VoiceBridge" },
  { t: "T-44h", e: "Brief signed off, task board generated (18 tasks)" },
  { t: "T-24h", e: "First working prototype: 2-way EN↔ES translation" },
  { t: "T-12h", e: "Cut feature: offline mode (scope risk)" },
  { t: "T-4h", e: "Pitch deck generated, judge-mode rehearsal" },
  { t: "T-0h", e: "Submitted — 14 tasks shipped, 4 deferred" },
];

function Retro() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><History className="h-7 w-7 text-primary" /> Retrospective</h1>
          <p className="text-muted-foreground mt-1">AI-generated summary of what you shipped. <span className="text-primary font-medium">Coming soon</span> — preview below.</p>
        </div>
        <Button variant="outline" className="glass" disabled><Share2 className="h-4 w-4 mr-1" /> Share portfolio</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-strong rounded-2xl p-6">
          <h2 className="font-display font-bold mb-4 flex items-center gap-2"><GitBranch className="h-4 w-4 text-primary" /> Build timeline</h2>
          <ol className="relative border-l-2 border-border/50 ml-2 space-y-5">
            {timeline.map((m, i) => (
              <li key={i} className="ml-6">
                <span className="absolute -left-[7px] h-3 w-3 rounded-full gradient-bg glow" />
                <div className="text-xs font-mono text-primary">{m.t}</div>
                <div className="text-sm mt-0.5">{m.e}</div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold mb-2">Shipped</h3>
            <ul className="text-sm space-y-1.5 text-muted-foreground">
              <li>✓ 2-way live translation</li>
              <li>✓ Medical glossary</li>
              <li>✓ Latency dashboard</li>
              <li>✓ Speaker color HUD</li>
            </ul>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold mb-2">Cut from scope</h3>
            <ul className="text-sm space-y-1.5 text-muted-foreground">
              <li>✗ Offline fallback mode</li>
              <li>✗ Mandarin support</li>
            </ul>
          </div>
          <div className="glass-strong rounded-2xl p-5">
            <h3 className="font-display font-semibold mb-2 flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-primary" /> What to build next</h3>
            <p className="text-sm text-muted-foreground">Ship offline mode + 3 more languages. Pilot with the 2 community hospitals you spoke to during the hack.</p>
            <Button variant="ghost" size="sm" className="mt-3 -ml-3 text-primary" disabled>View roadmap <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
