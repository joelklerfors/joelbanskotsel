import { Link } from "@tanstack/react-router";
import { Flag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStaff } from "@/lib/data";
import { useMe } from "@/lib/me";
import { LogDialog } from "./LogDialog";

const nav = [
  { to: "/", label: "Banan" },
  { to: "/att-gora", label: "Att göra" },
  { to: "/historik", label: "Historik" },
  { to: "/personal", label: "Personal" },
] as const;

export function Header() {
  const { me, setMe } = useMe();
  const { data: staff = [] } = useStaff();
  return (
    <header className="bg-turf text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <Flag className="h-6 w-6" /> Banloggen
        </Link>
        <nav className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-semibold opacity-80 hover:opacity-100 data-[status=active]:bg-primary-foreground data-[status=active]:text-primary data-[status=active]:opacity-100"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <select
            aria-label="Vem är du?"
            className="h-10 rounded-full border border-primary-foreground/40 bg-primary-foreground/10 px-3 text-sm font-semibold"
            value={me ?? ""}
            onChange={(e) => setMe(e.target.value || null)}
          >
            <option value="" className="text-foreground">Vem är du?</option>
            {staff.map((s) => (
              <option key={s.id} value={s.name} className="text-foreground">{s.name}</option>
            ))}
          </select>
          <LogDialog>
            <Button variant="secondary" className="h-10 rounded-full font-bold">
              <Plus className="h-4 w-4" /> Logga arbete
            </Button>
          </LogDialog>
        </div>
      </div>
      {!me && (
        <div className="bg-accent px-4 py-2 text-center text-sm font-semibold text-accent-foreground">
          👋 Välj ditt namn uppe till höger så vet alla vem som gjort vad.
        </div>
      )}
    </header>
  );
}
