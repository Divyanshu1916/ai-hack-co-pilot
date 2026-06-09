import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { tasks as seed, members, type Task } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Kanban, Plus, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/room/$id/tasks")({
  head: () => ({ meta: [{ title: "Task board · HackMate AI" }] }),
  component: Board,
});

const columns: { id: Task["status"]; label: string; tone: string }[] = [
  { id: "todo", label: "To do", tone: "text-muted-foreground" },
  { id: "doing", label: "In progress", tone: "text-primary" },
  { id: "done", label: "Done", tone: "text-accent-foreground" },
];

const roleColor: Record<Task["role"], string> = {
  frontend: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  backend: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  design: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  devops: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  ai: "bg-chart-5/15 text-chart-5 border-chart-5/30",
};

const priorityTone: Record<Task["priority"], string> = {
  low: "text-muted-foreground",
  med: "text-accent-foreground",
  high: "text-destructive",
};

function Board() {
  const [items, setItems] = useState<Task[]>(seed);
  const [dragId, setDragId] = useState<string | null>(null);

  const move = (id: string, status: Task["status"]) => {
    setItems(items.map(t => t.id === id ? { ...t, status } : t));
  };

  const regenerate = () => {
    toast.success("AI re-prioritized · 2 tasks bumped to High");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Kanban className="h-7 w-7 text-primary" /> Task board</h1>
          <p className="text-muted-foreground mt-1">Auto-generated from your brief. Drag to reorder. AI re-prioritizes as the clock ticks.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={regenerate} variant="outline" className="glass"><Sparkles className="h-4 w-4 mr-1 text-primary" /> Re-prioritize</Button>
          <Button className="gradient-bg text-primary-foreground border-0 glow"><Plus className="h-4 w-4 mr-1" /> New task</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {columns.map(col => {
          const colItems = items.filter(t => t.status === col.id);
          return (
            <div
              key={col.id}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (dragId) { move(dragId, col.id); setDragId(null); } }}
              className="glass-strong rounded-2xl p-4 min-h-[400px]"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className={`text-sm font-display font-bold uppercase tracking-wider ${col.tone}`}>{col.label}</h2>
                <span className="text-xs font-mono text-muted-foreground">{colItems.length}</span>
              </div>
              <div className="space-y-2">
                {colItems.map(t => {
                  const assignee = members.find(m => m.id === t.assignee);
                  return (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      className="glass rounded-xl p-3 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 transition-transform"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-semibold ${roleColor[t.role]}`}>{t.role}</span>
                        <span className={`text-[10px] uppercase font-bold ${priorityTone[t.priority]}`}>{t.priority}</span>
                      </div>
                      <div className="text-sm font-medium leading-snug">{t.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> {t.estimate}
                        </div>
                        {assignee && (
                          <Avatar className="h-6 w-6"><AvatarFallback className="text-[9px] bg-secondary">{assignee.avatar}</AvatarFallback></Avatar>
                        )}
                      </div>
                    </div>
                  );
                })}
                {colItems.length === 0 && (
                  <div className="text-xs text-center text-muted-foreground py-6 border border-dashed border-border/50 rounded-xl">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
