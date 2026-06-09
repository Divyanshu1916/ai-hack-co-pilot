export type Member = { id: string; name: string; role: string; avatar: string; online: boolean };
export type Room = {
  id: string;
  name: string;
  event: string;
  theme: string;
  startsAt: string;
  endsAt: string;
  status: "upcoming" | "active" | "complete";
  health: number;
  members: Member[];
  idea?: string;
};
export type Idea = {
  id: string;
  title: string;
  pitch: string;
  feasibility: number;
  novelty: number;
  impact: number;
  stack: string[];
  votes: number;
  inspiration: string;
};
export type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  role: "frontend" | "backend" | "design" | "devops" | "ai";
  priority: "low" | "med" | "high";
  assignee?: string;
  estimate: string;
};
export type ChatMsg = { id: string; role: "user" | "assistant"; author?: string; content: string; time: string };

export const currentUser: Member = {
  id: "u1",
  name: "Alex Rivera",
  role: "Full-stack",
  avatar: "AR",
  online: true,
};

export const members: Member[] = [
  currentUser,
  { id: "u2", name: "Mira Chen", role: "Design", avatar: "MC", online: true },
  { id: "u3", name: "Jordan Park", role: "Backend", avatar: "JP", online: true },
  { id: "u4", name: "Sasha Volkov", role: "AI/ML", avatar: "SV", online: false },
];

export const rooms: Room[] = [
  {
    id: "neon-2026",
    name: "Team Neon",
    event: "MIT Hack 2026",
    theme: "AI for Good",
    startsAt: "2026-06-10T18:00",
    endsAt: "2026-06-12T18:00",
    status: "active",
    health: 82,
    members,
    idea: "VoiceBridge — real-time speech translation for ER rooms",
  },
  {
    id: "pixel-2026",
    name: "Pixel Pioneers",
    event: "Y Combinator AI Hack",
    theme: "Frontier Models",
    startsAt: "2026-07-04T10:00",
    endsAt: "2026-07-05T22:00",
    status: "upcoming",
    health: 0,
    members: members.slice(0, 3),
  },
  {
    id: "quantum-2025",
    name: "Quantum Quokkas",
    event: "TreeHacks 2025",
    theme: "Climate",
    startsAt: "2025-02-14T10:00",
    endsAt: "2025-02-16T16:00",
    status: "complete",
    health: 94,
    members,
    idea: "CarbonLens — supply chain CO2 audits with vision models",
  },
];

export const ideas: Idea[] = [
  {
    id: "i1",
    title: "VoiceBridge",
    pitch: "Real-time multilingual translation overlay for emergency rooms with medical-grade glossaries.",
    feasibility: 78,
    novelty: 85,
    impact: 92,
    stack: ["Whisper", "Next.js", "WebRTC", "Supabase"],
    votes: 12,
    inspiration: "MedMatch (HackMIT 2024 winner)",
  },
  {
    id: "i2",
    title: "GrantPilot",
    pitch: "Auto-fills nonprofit grant applications from a 5-question intake. Saves 40+ hrs per grant.",
    feasibility: 88,
    novelty: 70,
    impact: 80,
    stack: ["Claude", "tRPC", "Postgres"],
    votes: 9,
    inspiration: "GrantWriter.ai",
  },
  {
    id: "i3",
    title: "EchoLearn",
    pitch: "Turns lecture recordings into spaced-repetition flashcards and Socratic quizzes.",
    feasibility: 82,
    novelty: 65,
    impact: 75,
    stack: ["Whisper", "GPT-4o", "Anki API"],
    votes: 7,
    inspiration: "Quizlet AI",
  },
  {
    id: "i4",
    title: "SwarmCommit",
    pitch: "Multi-agent code review that argues, then converges on the best PR feedback.",
    feasibility: 65,
    novelty: 92,
    impact: 70,
    stack: ["LangGraph", "GitHub App"],
    votes: 5,
    inspiration: "Cursor + CodeRabbit",
  },
];

export const tasks: Task[] = [
  { id: "t1", title: "Wire Whisper streaming endpoint", description: "WebSocket relay, 200ms chunks", status: "doing", role: "backend", priority: "high", assignee: "u3", estimate: "3h" },
  { id: "t2", title: "Design ER overlay HUD", description: "Glass-panel translation card with speaker color", status: "doing", role: "design", priority: "high", assignee: "u2", estimate: "2h" },
  { id: "t3", title: "Medical glossary loader", description: "Pre-bias 1.2k SNOMED terms", status: "todo", role: "ai", priority: "med", assignee: "u4", estimate: "2h" },
  { id: "t4", title: "Latency dashboard", description: "p50/p95 chart for judges", status: "todo", role: "frontend", priority: "med", assignee: "u1", estimate: "1.5h" },
  { id: "t5", title: "Deploy edge inference", description: "Cloudflare Worker + Replicate", status: "todo", role: "devops", priority: "high", estimate: "2h" },
  { id: "t6", title: "Landing page + demo video", description: "30s teaser for submission", status: "todo", role: "frontend", priority: "low", assignee: "u1", estimate: "2h" },
  { id: "t7", title: "Repo scaffold", description: "Turborepo + CI", status: "done", role: "devops", priority: "high", assignee: "u3", estimate: "1h" },
  { id: "t8", title: "Brief lock-in", description: "Problem/Solution/Demo flow signed off", status: "done", role: "ai", priority: "high", assignee: "u1", estimate: "30m" },
];

export const initialChat: ChatMsg[] = [
  { id: "c1", role: "assistant", content: "Welcome to HackMate. I've loaded your brief for **VoiceBridge** and the current task board. Ask me anything — I'll ground answers in your stack.", time: "now" },
];

export const apis = [
  { id: "a1", name: "Anthropic Claude", category: "AI", tier: "Free $5", desc: "Sonnet 4 for long-context reasoning." },
  { id: "a2", name: "Twilio Voice", category: "Comms", tier: "Trial $15", desc: "Programmable voice + transcription." },
  { id: "a3", name: "Supabase", category: "Backend", tier: "Free tier", desc: "Postgres + Auth + Realtime." },
  { id: "a4", name: "Cloudflare Workers AI", category: "AI", tier: "10k req/day", desc: "Edge LLM + Whisper." },
  { id: "a5", name: "Stripe", category: "Payments", tier: "No setup fee", desc: "Test-mode checkout for demos." },
  { id: "a6", name: "Vercel AI SDK", category: "Tooling", tier: "OSS", desc: "Streaming + tool calls." },
];

export const slides = [
  { id: "s1", title: "The Problem", body: "ER teams lose critical minutes when patients and clinicians don't share a language. 1 in 4 hospitals lack on-call interpreters at night." },
  { id: "s2", title: "Our Solution", body: "VoiceBridge — a clinician's headset overlay that streams two-way translation with medical-grade glossaries, latency under 600ms." },
  { id: "s3", title: "Live Demo", body: "Trauma intake, English → Spanish → Mandarin in one continuous conversation. No app install for the patient." },
  { id: "s4", title: "Tech Stack", body: "Whisper (edge) · Claude Sonnet · Cloudflare Workers · WebRTC · Supabase · Next.js." },
  { id: "s5", title: "The Team", body: "4 hackers, 2 ER residents advising. Shipping in 36 hours." },
];
