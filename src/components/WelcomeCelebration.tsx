import { useEffect, useMemo, useState } from "react";

const SESSION_KEY = "hm-welcomed";
const EVENT_NAME = "hackmate:celebrate";

export function triggerWelcome() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

type Particle = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  hue: number;
  size: number;
  drift: number;
  rotate: number;
};

export function WelcomeCelebration() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const particles = useMemo<Particle[]>(() => {
    const palette = [150, 95, 200, 295, 250];
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.8 + Math.random() * 1.2,
      hue: palette[i % palette.length],
      size: 6 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 160,
      rotate: Math.random() * 540 - 270,
    }));
  }, [open]);

  useEffect(() => {
    function onTrigger() {
      setClosing(false);
      setOpen(true);
      const fadeT = setTimeout(() => setClosing(true), 2200);
      const closeT = setTimeout(() => { setOpen(false); setClosing(false); }, 2900);
      return () => { clearTimeout(fadeT); clearTimeout(closeT); };
    }
    window.addEventListener("hackmate:celebrate", onTrigger);
    return () => window.removeEventListener("hackmate:celebrate", onTrigger);
  }, []);

  if (!open) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed inset-0 z-[100] pointer-events-none flex items-center justify-center transition-opacity duration-500 ${
        closing ? "opacity-0" : "opacity-100 animate-fade-in"
      }`}
    >
      {/* Soft radial backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.7 0.2 295 / 0.18), transparent 65%)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(p => (
          <span
            key={p.id}
            className="absolute top-[-8%] rounded-[2px]"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.6,
              background: `oklch(0.78 0.18 ${p.hue})`,
              boxShadow: `0 0 8px oklch(0.78 0.18 ${p.hue} / 0.55)`,
              animation: `hm-confetti-fall ${p.duration}s cubic-bezier(.22,.61,.36,1) ${p.delay}s forwards`,
              ["--hm-drift" as any]: `${p.drift}px`,
              ["--hm-rot" as any]: `${p.rotate}deg`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="relative glass-strong aurora-border rounded-3xl px-7 sm:px-12 py-8 sm:py-10 mx-4 text-center max-w-md w-[min(92vw,28rem)]"
        style={{ animation: "hm-pop 0.7s cubic-bezier(.22,1.2,.36,1) both" }}
      >
        <div
          className="text-5xl sm:text-6xl mb-3 select-none"
          style={{ animation: "hm-emoji 1.6s ease-in-out both" }}
          aria-hidden="true"
        >
          🎉
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome to <span className="gradient-text">HackMate AI</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          Ready to build your next winning hackathon project?
        </p>
      </div>

      <style>{`
        @keyframes hm-confetti-fall {
          0%   { transform: translate3d(0,-20vh,0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translate3d(var(--hm-drift), 110vh, 0) rotate(var(--hm-rot)); opacity: 0; }
        }
        @keyframes hm-pop {
          0%   { transform: scale(0.92) translateY(8px); opacity: 0; }
          60%  { transform: scale(1.01) translateY(0); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes hm-emoji {
          0%   { transform: scale(0.6) rotate(-15deg); opacity: 0; }
          40%  { transform: scale(1.15) rotate(8deg); opacity: 1; }
          70%  { transform: scale(0.98) rotate(-4deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="hm-confetti-fall"] { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
    </div>
  );
}
