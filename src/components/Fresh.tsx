import { agoLabel, freshness } from "@/lib/golf";
import { cn } from "@/lib/utils";

const styles = {
  fresh: "bg-fresh-soft text-foreground border-fresh",
  aging: "bg-aging-soft text-foreground border-aging",
  stale: "bg-stale-soft text-foreground border-stale",
  never: "bg-muted text-muted-foreground border-border",
};
const dot = { fresh: "bg-fresh", aging: "bg-aging", stale: "bg-stale", never: "bg-muted-foreground/40" };

export function FreshPill({ at, className }: { at?: string | undefined; className?: string }) {
  const f = freshness(at);
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", styles[f], className)}>
      <span className={cn("h-2 w-2 rounded-full", dot[f])} />
      {at ? agoLabel(at) : "Aldrig"}
    </span>
  );
}

export function FreshDot({ at }: { at?: string | undefined }) {
  return <span className={cn("inline-block h-3 w-3 rounded-full", dot[freshness(at)])} />;
}

export function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-fresh" /> 0–2 dagar</span>
      <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-aging" /> 3–6 dagar</span>
      <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-stale" /> 7+ dagar</span>
      <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-muted-foreground/40" /> Aldrig</span>
    </div>
  );
}
