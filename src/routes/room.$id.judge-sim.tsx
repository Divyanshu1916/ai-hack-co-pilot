import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Gavel, Sparkles, ChevronLeft, ChevronRight, RefreshCw, FileText, Mic, Lightbulb, TrendingUp, Cpu, Briefcase, Presentation } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/room/$id/judge-sim")({
  head: () => ({ meta: [{ title: "AI Judge Simulator · HackMate AI" }] }),
  component: JudgeSim,
});

type Question = { id: number; q: string; category: string };
type Answer = { questionId: number; text: string };
type Evaluation = {
  perQuestion: { questionId: number; score: number; feedback: string; suggestion: string }[];
  scores: { demo: number; innovation: number; technical: number; business: number; overall: number };
  strengths: string[];
  improvements: string[];
};

const BRIEF_DEFAULT = `VoiceBridge is a clinician's headset overlay that streams real-time, medical-grade translation with <600ms latency. Targeting ER nurses at Tier-2 hospitals. Stack: Whisper (edge) · Claude Sonnet · Cloudflare Workers · WebRTC.`;

function generateQuestions(brief: string): Question[] {
  const hasAI = /\b(ai|llm|whisper|claude|gpt|gemini|model)\b/i.test(brief);
  const hasData = /\b(data|database|phi|pii|hipaa|privacy|gdpr)\b/i.test(brief);
  const hasUsers = /\b(user|customer|hospital|clinic|patient|team|enterprise)\b/i.test(brief);
  return [
    { id: 1, category: "Problem", q: "In 30 seconds, what's the single most painful problem you're solving and who feels it most acutely today?" },
    { id: 2, category: "Differentiation", q: hasAI ? "Big players like Google and OpenAI could ship this next quarter. What's your defensible moat?" : "What stops a well-funded competitor from cloning this in 90 days?" },
    { id: 3, category: "Technical", q: hasData ? "Walk me through how user data flows through your system — where does it live, who can read it, and how do you handle compliance?" : "What's the single hardest engineering problem you solved this weekend, and how?" },
    { id: 4, category: "Business", q: hasUsers ? "Who pays, how much, and what's your path from this demo to your first 10 paying customers?" : "What's your business model and unit economics at scale?" },
    { id: 5, category: "Impact", q: "If I gave you $1M tomorrow, what would you build in the next 6 months and what metric would prove it worked?" },
  ];
}

function scoreAnswer(text: string): { score: number; feedback: string; suggestion: string } {
  const t = text.trim();
  const words = t.split(/\s+/).filter(Boolean).length;
  const hasNumber = /\d/.test(t);
  const hasSpecific = /\b(because|specifically|for example|e\.g\.|users?|customers?|hospitals?|teams?)\b/i.test(t);
  const hasMetric = /\b(\d+\s*(%|x|ms|sec|min|hr|users?|customers?|\$|k|m|b))\b/i.test(t);

  let score = 40;
  if (words >= 20) score += 15;
  if (words >= 60) score += 10;
  if (hasNumber) score += 10;
  if (hasSpecific) score += 10;
  if (hasMetric) score += 15;
  score = Math.min(98, Math.max(20, score));

  let feedback = "Solid framing.";
  let suggestion = "Tighten with one concrete metric.";
  if (words < 15) { feedback = "Too brief — judges want substance, not a one-liner."; suggestion = "Expand to 3 sentences: claim → evidence → why-it-matters."; }
  else if (!hasMetric) { feedback = "Clear but missing a number that anchors credibility."; suggestion = "Add a metric: latency, users, conversion, dollars, or %."; }
  else if (!hasSpecific) { feedback = "Has numbers but feels abstract."; suggestion = "Name a specific user, hospital, or scenario."; }
  else { feedback = "Specific, quantified, and grounded. Strong answer."; suggestion = "Optional: end with a forward-looking commitment (timeline / milestone)."; }
  return { score, feedback, suggestion };
}

function evaluate(questions: Question[], answers: Answer[]): Evaluation {
  const perQuestion = questions.map(q => {
    const a = answers.find(x => x.questionId === q.id)?.text ?? "";
    return { questionId: q.id, ...scoreAnswer(a) };
  });
  const avg = perQuestion.reduce((s, p) => s + p.score, 0) / perQuestion.length;
  const jitter = (seed: number) => Math.round(avg + (Math.sin(seed * 7.3) * 8));
  const scores = {
    demo: Math.min(98, Math.max(20, jitter(1))),
    innovation: Math.min(98, Math.max(20, jitter(2))),
    technical: Math.min(98, Math.max(20, jitter(3))),
    business: Math.min(98, Math.max(20, jitter(4))),
    overall: Math.round(avg),
  };
  const strengths: string[] = [];
  const improvements: string[] = [];
  perQuestion.forEach((p, i) => {
    if (p.score >= 75) strengths.push(`Q${i + 1}: ${questions[i].category} answered with confidence.`);
    else improvements.push(`Q${i + 1} (${questions[i].category}): ${p.suggestion}`);
  });
  if (strengths.length === 0) strengths.push("You showed up and shipped — that beats most teams.");
  if (improvements.length === 0) improvements.push("Polish delivery cadence — practice 2-min pitch with a stopwatch.");
  return { perQuestion, scores, strengths, improvements };
}

function ScoreCard({ icon: Icon, label, value }: { icon: typeof Mic; label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span>{label}</span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-3xl font-display font-bold gradient-text">{value}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

function JudgeSim() {
  const { id } = useParams({ from: "/room/$id/judge-sim" });
  const [brief, setBrief] = useState(BRIEF_DEFAULT);
  const [phase, setPhase] = useState<"setup" | "interview" | "results">("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [active, setActive] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [thinking, setThinking] = useState(false);

  const start = () => {
    if (brief.trim().length < 20) { toast.error("Add more project context first"); return; }
    setQuestions(generateQuestions(brief));
    setAnswers([]);
    setActive(0);
    setPhase("interview");
  };

  const importBrief = () => {
    setBrief(BRIEF_DEFAULT);
    toast.success("Imported from Project Brief");
  };

  const setAnswer = (text: string) => {
    setAnswers(prev => {
      const exists = prev.find(a => a.questionId === questions[active].id);
      if (exists) return prev.map(a => a.questionId === questions[active].id ? { ...a, text } : a);
      return [...prev, { questionId: questions[active].id, text }];
    });
  };

  const submit = () => {
    setThinking(true);
    setTimeout(() => {
      setEvaluation(evaluate(questions, answers));
      setPhase("results");
      setThinking(false);
      toast.success("Evaluation complete");
    }, 1200);
  };

  const reset = () => {
    setPhase("setup");
    setQuestions([]);
    setAnswers([]);
    setEvaluation(null);
    setActive(0);
  };

  const curAnswer = questions[active] ? (answers.find(a => a.questionId === questions[active].id)?.text ?? "") : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Gavel className="h-7 w-7 text-primary" /> AI Judge Simulator
          </h1>
          <p className="text-muted-foreground mt-1">Rehearse under pressure. 5 tough questions, AI-scored.</p>
        </div>
        {phase === "results" && (
          <div className="flex gap-2">
            <Button onClick={reset} variant="outline" className="glass"><RefreshCw className="h-4 w-4 mr-1" /> New session</Button>
            <Link to="/room/$id/pitch" params={{ id }}>
              <Button className="gradient-bg text-primary-foreground border-0 glow"><Presentation className="h-4 w-4 mr-1" /> Back to Pitch</Button>
            </Link>
          </div>
        )}
      </div>

      {phase === "setup" && (
        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          <div className="glass-strong rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Project details</h3>
              <Button onClick={importBrief} size="sm" variant="ghost" className="text-xs"><Sparkles className="h-3 w-3 mr-1 text-primary" /> Import from Brief</Button>
            </div>
            <Textarea
              value={brief}
              onChange={e => setBrief(e.target.value)}
              rows={10}
              placeholder="Describe your project: problem, solution, users, stack, business model..."
              className="glass border-0 resize-none"
            />
            <Button onClick={start} className="w-full gradient-bg text-primary-foreground border-0 glow">
              <Gavel className="h-4 w-4 mr-2" /> Start mock interview
            </Button>
          </div>
          <aside className="glass rounded-2xl p-5 space-y-3">
            <h3 className="font-display font-semibold">How it works</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-4">
              <li>5 realistic judge questions are generated from your brief.</li>
              <li>Type concise answers as if on stage.</li>
              <li>AI scores delivery, innovation, technical depth, and business impact.</li>
              <li>Get improvement suggestions per question.</li>
            </ol>
          </aside>
        </div>
      )}

      {phase === "interview" && questions[active] && (
        <div className="grid lg:grid-cols-[1fr,280px] gap-6">
          <div className="space-y-4">
            <div className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute inset-0 gradient-bg opacity-5" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2 py-1 rounded-full glass text-primary">JUDGE · {questions[active].category.toUpperCase()}</span>
                  <span className="text-xs text-muted-foreground">Question {active + 1} of {questions.length}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-semibold leading-snug">{questions[active].q}</h2>
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <label className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><Mic className="h-3 w-3 text-primary" /> Your answer</label>
              <Textarea
                value={curAnswer}
                onChange={e => setAnswer(e.target.value)}
                rows={6}
                placeholder="Answer as if you're on stage with judges watching..."
                className="glass border-0 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-muted-foreground">{curAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
                <div className="flex gap-2">
                  <Button onClick={() => setActive(Math.max(0, active - 1))} variant="ghost" size="sm" disabled={active === 0}><ChevronLeft className="h-4 w-4" /></Button>
                  {active < questions.length - 1 ? (
                    <Button onClick={() => setActive(active + 1)} variant="outline" className="glass" size="sm">Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
                  ) : (
                    <Button onClick={submit} disabled={thinking} className="gradient-bg text-primary-foreground border-0 glow" size="sm">
                      {thinking ? "Evaluating..." : <>Submit <Sparkles className="h-3.5 w-3.5 ml-1" /></>}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="glass rounded-2xl p-4 lg:sticky lg:top-20 self-start">
            <h3 className="font-display font-semibold text-sm mb-3">Questions</h3>
            <ul className="space-y-1.5">
              {questions.map((q, i) => {
                const answered = !!answers.find(a => a.questionId === q.id)?.text.trim();
                return (
                  <li key={q.id}>
                    <button
                      onClick={() => setActive(i)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        i === active ? "bg-primary/15 text-primary glass" : "hover:bg-accent/30 text-muted-foreground"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${answered ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      <span className="truncate">Q{i + 1} · {q.category}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      )}

      {phase === "results" && evaluation && (
        <div className="space-y-6">
          <div className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-10" />
            <div className="relative grid sm:grid-cols-[auto,1fr] items-center gap-6">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="url(#judgeGrad)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${(evaluation.scores.overall / 100) * 276.5} 276.5`} />
                  <defs>
                    <linearGradient id="judgeGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-display font-bold gradient-text">{evaluation.scores.overall}</span>
                  <span className="text-[10px] text-muted-foreground tracking-wider">OVERALL</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-full glass text-primary">JUDGE VERDICT</span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mt-3">
                  {evaluation.scores.overall >= 85 ? "Pitch-ready. Go win." :
                   evaluation.scores.overall >= 70 ? "Strong foundation. Polish two answers." :
                   evaluation.scores.overall >= 55 ? "Solid draft. Tighten specifics." :
                   "Needs work. Re-run after revising."}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">Based on {questions.length} answers across delivery, innovation, technical depth, and business impact.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <ScoreCard icon={Mic} label="Demo presentation" value={evaluation.scores.demo} />
            <ScoreCard icon={Lightbulb} label="Innovation" value={evaluation.scores.innovation} />
            <ScoreCard icon={Cpu} label="Technical complexity" value={evaluation.scores.technical} />
            <ScoreCard icon={Briefcase} label="Business impact" value={evaluation.scores.business} />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="glass-strong rounded-2xl p-5">
              <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Strengths</h3>
              <ul className="space-y-2 text-sm">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary mt-0.5">▸</span><span>{s}</span></li>
                ))}
              </ul>
            </div>
            <div className="glass-strong rounded-2xl p-5">
              <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> Improvements</h3>
              <ul className="space-y-2 text-sm">
                {evaluation.improvements.map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent mt-0.5">▸</span><span>{s}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold mb-4">Question-by-question breakdown</h3>
            <div className="space-y-4">
              {questions.map((q, i) => {
                const e = evaluation.perQuestion[i];
                const a = answers.find(x => x.questionId === q.id)?.text ?? "(no answer)";
                return (
                  <div key={q.id} className="glass rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-primary">Q{i + 1} · {q.category.toUpperCase()}</span>
                        <p className="font-medium text-sm mt-1">{q.q}</p>
                      </div>
                      <span className="shrink-0 text-2xl font-display font-bold gradient-text">{e.score}</span>
                    </div>
                    <p className="text-xs text-muted-foreground italic line-clamp-3 mb-2">"{a}"</p>
                    <div className="text-xs space-y-1">
                      <p><span className="text-primary font-medium">Feedback:</span> {e.feedback}</p>
                      <p><span className="text-accent font-medium">Suggestion:</span> {e.suggestion}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
