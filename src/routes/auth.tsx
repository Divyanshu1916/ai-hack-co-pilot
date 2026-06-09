import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Mail, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in · HackMate AI" }, { name: "description", content: "Sign in or sign up to HackMate AI." }] }),
  component: Auth,
});

const skillOptions = ["React", "Node.js", "Python", "Design", "AI/ML", "Solidity", "Rust", "Mobile", "Data", "DevOps"];

function Auth() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"auth" | "onboard">("auth");
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="ml-auto"><ThemeToggle /></div>
      </header>

      <div className="flex-1 grid place-items-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8"><Logo /></div>

          <div className="glass-strong rounded-2xl p-8">
            {step === "auth" ? (
              <>
                <h1 className="text-2xl font-bold tracking-tight">Welcome back, hacker</h1>
                <p className="text-sm text-muted-foreground mt-1">Pick up where you left off, or start fresh.</p>

                <div className="mt-6 space-y-2">
                  <Button onClick={() => setStep("onboard")} variant="outline" className="w-full h-11 glass">
                    <Github className="h-4 w-4 mr-2" /> Continue with GitHub
                  </Button>
                  <Button onClick={() => setStep("onboard")} variant="outline" className="w-full h-11 glass">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12a10 10 0 1 1-3.5-7.6l-2.8 2.8A6 6 0 1 0 18 12h-6V8h10v4Z" /></svg>
                    Continue with Google
                  </Button>
                </div>

                <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-border" /> or email <div className="h-px flex-1 bg-border" />
                </div>

                <form onSubmit={e => { e.preventDefault(); setStep("onboard"); }} className="space-y-3">
                  <div>
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input id="email" type="email" placeholder="alex@hack.io" required className="mt-1 glass" />
                  </div>
                  <div>
                    <Label htmlFor="pw" className="text-xs">Password</Label>
                    <Input id="pw" type="password" placeholder="••••••••" required className="mt-1 glass" />
                  </div>
                  <Button type="submit" className="w-full h-11 gradient-bg text-primary-foreground border-0 glow">
                    <Mail className="h-4 w-4 mr-2" /> Continue
                  </Button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight">Tell us what you build</h1>
                <p className="text-sm text-muted-foreground mt-1">Pick a few skills so we can match you with the right teams.</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {skillOptions.map(s => {
                    const active = selected.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelected(active ? selected.filter(x => x !== s) : [...selected, s])}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          active ? "gradient-bg text-primary-foreground border-0" : "glass hover:bg-accent/30"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <input type="checkbox" id="pool" className="rounded" defaultChecked />
                  <Label htmlFor="pool" className="text-sm">Add me to the solo-hacker matching pool</Label>
                </div>
                <Button onClick={() => navigate({ to: "/dashboard" })} className="w-full mt-6 h-11 gradient-bg text-primary-foreground border-0 glow">
                  Enter dashboard
                </Button>
              </>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing you agree to the terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
