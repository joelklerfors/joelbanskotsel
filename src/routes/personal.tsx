import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddStaff, useDeleteStaff, useStaff } from "@/lib/data";

export const Route = createFileRoute("/personal")({
  head: () => ({
    meta: [
      { title: "Personal – Banloggen" },
      { name: "description", content: "Hantera namnen på greenkeepers som loggar arbete." },
      { property: "og:title", content: "Personal – Banloggen" },
      { property: "og:description", content: "Hantera namnen på greenkeepers som loggar arbete." },
    ],
  }),
  component: Staff,
});

function Staff() {
  const { data: staff = [] } = useStaff();
  const add = useAddStaff();
  const del = useDeleteStaff();
  const [name, setName] = useState("");
  const submit = async () => {
    if (!name.trim()) return;
    try { await add.mutateAsync(name.trim()); setName(""); } catch { toast.error("Namnet finns redan"); }
  };
  return (
    <main className="mx-auto max-w-xl space-y-4 px-4 py-8">
      <h1 className="text-4xl font-bold">Personal</h1>
      <div className="flex gap-2">
        <Input className="h-11" placeholder="Nytt namn" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        <Button className="h-11" onClick={submit}>Lägg till</Button>
      </div>
      <ul className="space-y-2">
        {staff.map((s) => (
          <li key={s.id} className="flex items-center justify-between rounded-xl border bg-card p-3 text-lg font-semibold">
            {s.name}
            <Button size="icon" variant="ghost" aria-label="Ta bort" onClick={() => confirm(`Ta bort ${s.name}?`) && del.mutate(s.id)}><Trash2 className="h-4 w-4" /></Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
