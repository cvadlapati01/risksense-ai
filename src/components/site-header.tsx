import { Link, useRouterState } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/register", label: "Risk Register" },
  { to: "/mitigation", label: "Mitigation Track" },
  { to: "/workstreams", label: "Workstreams" },
  { to: "/admin", label: "Admin" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-6 bg-foreground rounded-sm flex items-center justify-center">
            <div className="size-2 bg-background rotate-45 transition-transform group-hover:rotate-[135deg]" />
          </div>
          <span className="font-extrabold tracking-tighter text-lg uppercase">
            Risk<span className="text-accent">Sense</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {nav.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={
                  active
                    ? "text-foreground border-b-2 border-foreground -mb-[18px] pb-3"
                    : "hover:text-foreground transition-colors"
                }
              >
                {n.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-[10px] font-mono text-muted-foreground">SYSTEM_TIME</div>
          <div className="text-xs font-medium uppercase">24 OCT 2024 — 09:42</div>
        </div>
        <div className="size-8 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold">
          JS
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="p-6 border-t border-border flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
      <div>Internal Program Governance — Confidential</div>
      <div className="flex gap-4">
        <span>Ver 4.12.0</span>
        <span>Phoenix Core Program</span>
      </div>
    </footer>
  );
}
