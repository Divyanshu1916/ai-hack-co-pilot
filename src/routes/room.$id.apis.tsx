import { createFileRoute } from "@tanstack/react-router";
import { apis } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plug, Code, ExternalLink, Search } from "lucide-react";

export const Route = createFileRoute("/room/$id/apis")({
  head: () => ({ meta: [{ title: "API marketplace · HackMate AI" }] }),
  component: APIs,
});

function APIs() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Plug className="h-7 w-7 text-primary" /> API marketplace</h1>
          <p className="text-muted-foreground mt-1">Sponsor APIs and free-tier services tuned to your project. <span className="text-primary font-medium">Coming soon</span> — preview below.</p>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input placeholder="Search APIs by category, sponsor, free tier..." className="border-0 bg-transparent flex-1" disabled />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apis.map(a => (
          <div key={a.id} className="glass rounded-2xl p-5 opacity-90">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-semibold">{a.name}</h3>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{a.category}</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full glass font-mono">{a.tier}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{a.desc}</p>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="glass flex-1" disabled><Code className="h-3.5 w-3.5 mr-1" /> Boilerplate</Button>
              <Button size="sm" variant="ghost" disabled><ExternalLink className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
