import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { initialChat, type ChatMsg } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, Paperclip, Code, FileText, Kanban } from "lucide-react";

export const Route = createFileRoute("/room/$id/chat")({
  head: () => ({ meta: [{ title: "AI assistant · HackMate AI" }] }),
  component: Chat,
});

const replies = [
  "Looking at your brief: switch `whisper-large` → `distil-whisper-medium`. You'll drop p95 latency by ~180ms with <2% WER tradeoff on medical English.",
  "Your task `Wire Whisper streaming endpoint` is blocking 3 others. I'd assign Jordan + Sasha to pair on it for the next 90 minutes.",
  "Try this on Cloudflare Workers AI:\n```ts\nconst out = await ai.run('@cf/openai/whisper', { audio });\n```\nNo cold start, $0 for first 10k req/day.",
  "Your demo flow needs a 'wow moment' in the first 15s. Suggest opening with a side-by-side: phone interpreter (45s) vs VoiceBridge (real-time).",
];

function Chat() {
  const [msgs, setMsgs] = useState<ChatMsg[]>(initialChat);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, streaming]);

  const send = () => {
    if (!input.trim() || streaming) return;
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", content: input, time: "now" };
    setMsgs(m => [...m, userMsg]);
    setInput("");
    setStreaming(true);
    setTimeout(() => {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMsgs(m => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply, time: "now" }]);
      setStreaming(false);
    }, 1100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] lg:h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">AI assistant</h1>
        <p className="text-muted-foreground text-sm">Grounded in your brief, tech stack, and current tasks.</p>
      </div>

      {/* Context bar */}
      <div className="glass rounded-2xl p-3 mb-4 flex flex-wrap gap-2 text-xs">
        <Tag icon={FileText}>Brief: VoiceBridge</Tag>
        <Tag icon={Code}>Stack: Whisper, Claude, Next.js</Tag>
        <Tag icon={Kanban}>8 active tasks</Tag>
      </div>

      <div className="flex-1 glass-strong rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4">
        {msgs.map(m => (
          <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className={`text-xs ${m.role === "assistant" ? "gradient-bg text-primary-foreground" : "bg-secondary"}`}>
                {m.role === "assistant" ? <Sparkles className="h-4 w-4" /> : "AR"}
              </AvatarFallback>
            </Avatar>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === "user" ? "bg-primary text-primary-foreground" : "glass"
            }`}>
              {m.content.split("\n").map((line, i) => {
                if (line.startsWith("```")) return null;
                return <div key={i} dangerouslySetInnerHTML={{ __html: line.replace(/`([^`]+)`/g, '<code class="font-mono text-xs px-1 py-0.5 rounded bg-foreground/10">$1</code>').replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />;
              })}
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="gradient-bg text-primary-foreground"><Sparkles className="h-4 w-4 animate-pulse-glow" /></AvatarFallback></Avatar>
            <div className="glass rounded-2xl px-4 py-3 flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: "0.2s" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="glass-strong rounded-2xl p-3 mt-4">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="rounded-full"><Paperclip className="h-4 w-4" /></Button>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask about your project, paste an error, sketch an idea..."
            rows={1}
            className="resize-none border-0 bg-transparent flex-1 min-h-[2.5rem] max-h-32"
          />
          <Button onClick={send} disabled={!input.trim() || streaming} size="icon" className="rounded-full gradient-bg text-primary-foreground border-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Tag({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"><Icon className="h-3 w-3" /> {children}</span>;
}
