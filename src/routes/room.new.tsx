import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Plus, Sparkles, Users, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";
import { rooms } from "@/lib/mock-data";

export const Route = createFileRoute("/room/new")({
  head: () => ({
    meta: [
      { title: "Create Room · HackMate AI" },
      { name: "description", content: "Spin up a new hackathon room in under 30 seconds." },
    ],
  }),
  component: CreateRoom,
});

function CreateRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [theme, setTheme] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [size, setSize] = useState("4");
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !event) {
      toast.error("Room name and event are required");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const target = rooms[0]?.id ?? "neon-2026";
      toast.success(`Room "${name}" created`);
      navigate({ to: "/room/$id", params: { id: target } });
    }, 700);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="glass-strong rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 gradient-bg opacity-20 blur-3xl rounded-full" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs mb-4">
              <Sparkles className="h-3 w-3 text-primary" /> New room
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Create a hackathon room</h1>
            <p className="text-muted-foreground mt-2">Set the basics — you can invite your team and tune the brief inside the room.</p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Room name" icon={Hash}>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team Neon 2026" />
                </Field>
                <Field label="Hackathon / event" icon={Calendar}>
                  <Input value={event} onChange={(e) => setEvent(e.target.value)} placeholder="MIT Hack 2026" />
                </Field>
              </div>

              <Field label="Theme or track" icon={Sparkles}>
                <Input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="AI for accessibility" />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Ends at" icon={Calendar}>
                  <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
                </Field>
                <Field label="Team size" icon={Users}>
                  <Input type="number" min={1} max={10} value={size} onChange={(e) => setSize(e.target.value)} />
                </Field>
              </div>

              <Field label="Notes (optional)">
                <Textarea rows={3} placeholder="Anything your team should know on day zero?" />
              </Field>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" disabled={submitting} className="gradient-bg text-primary-foreground border-0 glow h-11 px-6">
                  <Plus className="h-4 w-4 mr-1" />
                  {submitting ? "Creating…" : "Create room"}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <Link to="/dashboard">
                  <Button type="button" variant="outline" className="h-11 px-6">Cancel</Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: any;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />} {label}
      </Label>
      {children}
    </div>
  );
}
