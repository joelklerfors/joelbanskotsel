import { createFileRoute } from "@tanstack/react-router";
import { TodoPanel } from "@/components/TodoPanel";

export const Route = createFileRoute("/att-gora")({
  head: () => ({
    meta: [
      { title: "Att göra – Banloggen" },
      { name: "description", content: "Allt som behöver göras på banan, samlat i en lista." },
      { property: "og:title", content: "Att göra – Banloggen" },
      { property: "og:description", content: "Allt som behöver göras på banan, samlat i en lista." },
    ],
  }),
  component: () => (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <h1 className="text-4xl font-bold">Att göra</h1>
      <p className="text-muted-foreground">Bocka av när det är klart – har uppgiften ett område och en arbetstyp loggas den automatiskt.</p>
      <TodoPanel />
    </main>
  ),
});
