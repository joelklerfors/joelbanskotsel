export const WORK_TYPES = [
  "Klippning green",
  "Klippning tee",
  "Klippning fairway",
  "Klippning ruff",
  "Trimmning",
  "Hålflytt",
  "Bunkerkratt",
  "Gödsling",
  "Dressing",
  "Luftning",
  "Bevattning",
  "Verkstad",
  "Bunkerkanter",
  "Dammkanter",
  "Trimma stolpar",
  "Övrigt",
] as const;

export type Area = { id: string; name: string; kind: string; sort: number };
export type WorkLog = {
  id: string;
  area_id: string;
  work_type: string;
  staff_name: string;
  comment: string | null;
  done_at: string;
};
export type Todo = {
  id: string;
  area_id: string | null;
  work_type: string | null;
  title: string;
  comment: string | null;
  created_by: string;
  done: boolean;
  done_by: string | null;
  done_at: string | null;
  created_at: string;
};

export function daysAgo(iso: string, now = new Date()): number {
  const d = new Date(iso);
  const a = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const b = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((a - b) / 86400000);
}

export function agoLabel(iso: string): string {
  const n = daysAgo(iso);
  if (n <= 0) return "Idag";
  if (n === 1) return "Igår";
  return `${n} dagar sedan`;
}

/** fresh = 0-2 dagar, aging = 3-6, stale = 7+ */
export function freshness(iso: string | undefined): "fresh" | "aging" | "stale" | "never" {
  if (!iso) return "never";
  const n = daysAgo(iso);
  if (n <= 2) return "fresh";
  if (n <= 6) return "aging";
  return "stale";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Latest log per work type for an area */
export function latestByType(logs: WorkLog[]): Map<string, WorkLog> {
  const m = new Map<string, WorkLog>();
  for (const l of logs) {
    const cur = m.get(l.work_type);
    if (!cur || cur.done_at < l.done_at) m.set(l.work_type, l);
  }
  return m;
}
