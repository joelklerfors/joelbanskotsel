import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAreas, useDeleteLog, useLogs } from "@/lib/data";
import { WORK_TYPES, formatDate, latestByType } from "@/lib/golf";
import { FreshPill } from "@/components/Fresh";
import { LogDialog } from "@/components/LogDialog";
import { TodoPanel } from "@/components/TodoPanel";

export const Route = createFileRoute("/omrade/$id")({
  head: () => ({
    meta: [
      { title: "Område – Banloggen" },
      { name: "description", content: "Senaste skötsel, historik och att göra för området." },
      { property: "og:title", content: "Område – Banloggen" },
      { property: "og:description", content: "Senaste skötsel, historik och att göra för området." },
    ],
  }),
  component: AreaPage,
});

function AreaPage() {
  const { id } = Route.useParams();
  const { data: areas = [] } = useAreas();
  const { data: logs = [] } = useLogs(id);
  const del = useDeleteLog();
  const area = areas.find((a) => a.id === id);
  const latest = latestByType(logs);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" /> Hela banan</Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl font-bold">{area?.name ?? "…"}</h1>
        <LogDialog areaId={id}>
          <Button size="lg" className="h-12 text-base"><Plus className="h-5 w-5" /> Logga arbete här</Button>
        </LogDialog>
      </div>

      <section>
        <h2 className="mb-3 text-2xl font-bold">Senast gjort</h2>
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <table className="w-full text-left">
            <thead className="bg-muted text-sm text-muted-foreground">
              <tr><th className="p-3">Arbete</th><th className="p-3">Senast</th><th className="hidden p-3 sm:table-cell">Av</th><th className="hidden p-3 md:table-cell">Kommentar</th></tr>
            </thead>
            <tbody>
              {WORK_TYPES.map((t) => {
                const l = latest.get(t);
                return (
                  <tr key={t} className="border-t">
                    <td className="p-3 font-semibold">{t}</td>
                    <td className="p-3"><FreshPill at={l?.done_at} />{l && <div className="mt-1 text-xs text-muted-foreground">{formatDate(l.done_at)}</div>}<div className="text-xs sm:hidden">{l?.staff_name}</div></td>
                    <td className="hidden p-3 font-medium sm:table-cell">{l?.staff_name ?? "–"}</td>
                    <td className="hidden p-3 text-sm text-muted-foreground md:table-cell">{l?.comment ?? ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-2xl font-bold">Att göra här</h2>
          <TodoPanel areaId={id} />
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-bold">Historik</h2>
          {logs.length === 0 && <p className="text-muted-foreground">Inget loggat ännu.</p>}
          <ul className="space-y-2">
            {logs.map((l) => (
              <li key={l.id} className="flex gap-3 rounded-xl border bg-card p-3">
                <div className="flex-1">
                  <p className="font-semibold">{l.work_type} <span className="font-normal text-muted-foreground">av</span> {l.staff_name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(l.done_at)}</p>
                  {l.comment && <p className="mt-1 text-sm">{l.comment}</p>}
                </div>
                <Button size="icon" variant="ghost" aria-label="Ta bort" onClick={() => confirm("Ta bort loggen?") && del.mutate(l.id)}><Trash2 className="h-4 w-4" /></Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
