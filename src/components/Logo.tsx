import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative h-8 w-8 rounded-lg gradient-bg grid place-items-center glow">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 6 L4 18 M4 12 L12 12 M12 6 L12 18 M16 6 L20 18 M16 18 L20 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="font-display font-bold text-lg tracking-tight">
        HackMate<span className="gradient-text">.ai</span>
      </span>
    </Link>
  );
}
