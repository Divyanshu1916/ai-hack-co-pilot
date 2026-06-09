import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ideas as seedIdeas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ThumbsUp, Lock, MessageCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/room/$id/ideas")({
  head: () => ({ meta: [{ title: "Ideation · HackMate AI" }] }),
  component: Ideas,
});

function Ideas() {
  const [theme, setTheme] = useState("AI for Good");
  const [ideas, setIdeas] = useState(seedIdeas);
  const [locked, setLocked] = useState<string | null>("i1");
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setIdeas([...ideas].sort(() => Math.random() - 0.5));
      setGenerating(false);
      toast.success("4 new idea variants ranked");
    }, 900);
  };

  const vote = (id: string) => setIdeas(ideas.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Lightbulb className="h-7 w-7 text-primary" /> Ideation</h1>
        <p className="text-muted-foreground mt-1">Drop your theme, browse AI-ranked ideas, vote, then lock the winner.</p>
      </div>

      <div className="glass-strong rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input value={theme} onChange={e => setTheme(e.target.value)} placeholder="Hackathon theme..." className="glass flex-1" />
          <Button onClick={generate} disabled={generating} className="gradient-bg text-primary-foreground border-0 glow">
            <Sparkles className="h-4 w-4 mr-1" /> {generating ? "Generating..." : "Generate ideas"}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {ideas.map(idea => {
          const isLocked = locked === idea.id;
          return (
            <div key={idea.id} className={`glass rounded-2xl p-6 transition-all ${isLocked ? "ring-2 ring-primary glow" : "hover:-translate-y-0.5"}`}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-bold text-xl">{idea.title}</h3>
                {isLocked && <span className="text-[10px] gradient-bg text-primary-foreground px-2 py-0.5 rounded-full font-bold uppercase">Locked</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{idea.pitch}</p>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <Score label="Feasibility" v={idea.feasibility} />
                <Score label="Novelty" v={idea.novelty} />
                <Score label="Impact" v={idea.impact} />
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {idea.stack.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded glass font-mono">{s}</span>)}
              </div>

              <div className="text-xs text-muted-foreground mt-3">Inspired by: <span className="text-foreground">{idea.inspiration}</span></div>

              <div className="flex items-center gap-2 mt-5 pt-5 border-t border-border/50">
                <Button onClick={() => vote(idea.id)} variant="ghost" size="sm" className="text-xs">
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" /> {idea.votes}
                </Button>
                <Button variant="ghost" size="sm" className="text-xs"><MessageCircle className="h-3.5 w-3.5 mr-1" /> 3</Button>
                <Button
                  onClick={() => { setLocked(isLocked ? null : idea.id); if (!isLocked) toast.success(`Locked in: ${idea.title}`); }}
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
    </div>
  );
}

function Score({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground"><span>{label}</span><span className="font-bold text-foreground">{v}</span></div>
      <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full gradient-bg" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
