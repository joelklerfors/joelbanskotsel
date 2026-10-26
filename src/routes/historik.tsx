import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAreas, useLogs, useStaff } from "@/lib/data";
import { WORK_TYPES, formatDate } from "@/lib/golf";

export const Route = createFileRoute("/historik")({
  head: () => ({
    meta: [
      { title: "Historik – Banloggen" },
      { name: "description", content: "Allt utfört arbete på banan, filtrerbart per område, arbete och person." },
      { property: "og:title", content: "Historik – Banloggen" },
      { property: "og:description", content: "Allt utfört arbete på banan, filtrerbart per område, arbete och person." },
    ],
  }),
  component: History,
});

const sel = "h-11 rounded-md border border-input bg-card px-3 text-sm";

function History() {
  const { data: logs = [] } = useLogs();
  const { data: areas = [] } = useAreas();
  const { data: staff = [] } = useStaff();
  const [a, setA] = useState("");
  const [t, setT] = useState("");
  const [p, setP] = useState("");
  const name = (id: string) => areas.find((x) => x.id === id)?.name ?? "";
  const rows = logs.filter((l) => (!a || l.area_id === a) && (!t || l.work_type === t) && (!p || l.staff_name === p));

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <h1 className="text-4xl font-bold">Historik</h1>
      <div className="flex flex-wrap gap-2">
        <select className={sel} value={a} onChange={(e) => setA(e.target.value)}><option value="">Alla områden</option>{areas.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
        <select className={sel} value={t} onChange={(e) => setT(e.target.value)}><option value="">Alla arbeten</option>{WORK_TYPES.map((w) => <option key={w}>{w}</option>)}</select>
        <select className={sel} value={p} onChange={(e) => setP(e.target.value)}><option value="">Alla personer</option>{staff.map((s) => <option key={s.id}>{s.name}</option>)}</select>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground"><tr><th className="p-3">När</th><th className="p-3">Var</th><th className="p-3">Vad</th><th className="p-3">Vem</th><th className="hidden p-3 md:table-cell">Kommentar</th></tr></thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} className="border-t align-top">
                <td className="whitespace-nowrap p-3">{formatDate(l.done_at)}</td>
                <td className="p-3"><Link to="/omrade/$id" params={{ id: l.area_id }} className="font-semibold text-primary underline-offset-2 hover:underline">{name(l.area_id)}</Link></td>
                <td className="p-3">{l.work_type}</td>
                <td className="p-3 font-medium">{l.staff_name}</td>
                <td className="hidden p-3 text-muted-foreground md:table-cell">{l.comment}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Inget att visa.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
