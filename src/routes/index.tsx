import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAreas, useLogs, useTodos } from "@/lib/data";
import { latestByType, type WorkLog } from "@/lib/golf";
import { FreshPill, Legend } from "@/components/Fresh";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Banloggen – översikt av banan" },
      { name: "description", content: "Se när varje hål och övningsområde senast sköttes och av vem." },
      { property: "og:title", content: "Banloggen – översikt av banan" },
      { property: "og:description", content: "Se när varje hål och övningsområde senast sköttes och av vem." },
    ],
  }),
  component: Index,
});

const KEY = ["Klippning green", "Bunkerkratt", "Hålflytt"];

function Index() {
  const { data: areas = [] } = useAreas();
  const { data: logs = [] } = useLogs();
  const { data: todos = [] } = useTodos();

  const byArea = useMemo(() => {
    const m = new Map<string, WorkLog[]>();
    for (const l of logs) m.set(l.area_id, [...(m.get(l.area_id) ?? []), l]);
    return m;
  }, [logs]);

  const holes = areas.filter((a) => a.kind === "hole");
  const practice = areas.filter((a) => a.kind !== "hole");

  const Card = ({ id, name }: { id: string; name: string }) => {
    const al = byArea.get(id) ?? [];
    const latest = latestByType(al);
    const last = al[0];
    const openTodos = todos.filter((t) => t.area_id === id && !t.done).length;
    return (
      <Link to="/omrade/$id" params={{ id }} className="group rounded-2xl border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold">{name}</h3>
          {openTodos > 0 && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">{openTodos} att göra</span>}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {last ? `Senast: ${last.work_type} · ${last.staff_name}` : "Inget loggat ännu"}
        </p>
        <ul className="mt-3 space-y-1.5">
          {KEY.map((k) => (
            <li key={k} className="flex items-center justify-between text-sm">
              <span>{k}</span>
              <FreshPill at={latest.get(k)?.done_at} />
            </li>
          ))}
        </ul>
      </Link>
    );
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Banan idag</h1>
          <p className="mt-1 text-muted-foreground">Tryck på ett område för all historik och att göra.</p>
        </div>
        <Legend />
      </div>
      <section>
        <h2 className="mb-3 text-2xl font-bold">18 hål</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {holes.map((a) => <Card key={a.id} id={a.id} name={a.name} />)}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-2xl font-bold">Övningsområden</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {practice.map((a) => <Card key={a.id} id={a.id} name={a.name} />)}
        </div>
      </section>
    </main>
  );
}
