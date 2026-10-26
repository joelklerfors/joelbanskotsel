import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WORK_TYPES } from "@/lib/golf";
import { useAddLogs, useAreas } from "@/lib/data";
import { useMe } from "@/lib/me";
import { cn } from "@/lib/utils";

export function LogDialog({ areaId, children }: { areaId?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: areas = [] } = useAreas();
  const { me } = useMe();
  const add = useAddLogs();
  const [selAreas, setSelAreas] = useState<string[]>(areaId ? [areaId] : []);
  const [types, setTypes] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [when, setWhen] = useState("");

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const reset = () => {
    setSelAreas(areaId ? [areaId] : []);
    setTypes([]);
    setComment("");
    setWhen("");
  };

  const submit = async () => {
    if (!me) return toast.error("Välj vem du är högst upp först");
    if (!selAreas.length || !types.length) return toast.error("Välj minst ett område och ett arbete");
    const done_at = when ? new Date(when).toISOString() : new Date().toISOString();
    const rows = selAreas.flatMap((a) =>
      types.map((t) => ({ area_id: a, work_type: t, staff_name: me, comment: comment.trim() || null, done_at })),
    );
    try {
      await add.mutateAsync(rows);
      toast.success(`${rows.length} arbete${rows.length > 1 ? "n" : ""} loggat`);
      reset();
      setOpen(false);
    } catch {
      toast.error("Kunde inte spara, försök igen");
    }
  };

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary",
    );

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Logga utfört arbete</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label className="mb-2 block text-base">1. Var?</Label>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <button key={a.id} type="button" className={chip(selAreas.includes(a.id))} onClick={() => toggle(selAreas, a.id, setSelAreas)}>
                  {a.name}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 text-sm font-medium text-primary underline"
              onClick={() => setSelAreas(areas.filter((a) => a.kind === "hole").map((a) => a.id))}
            >
              Välj alla 18 hål
            </button>
          </div>
          <div>
            <Label className="mb-2 block text-base">2. Vad gjordes?</Label>
            <div className="flex flex-wrap gap-2">
              {WORK_TYPES.map((t) => (
                <button key={t} type="button" className={chip(types.includes(t))} onClick={() => toggle(types, t, setTypes)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="c" className="mb-2 block text-base">3. Kommentar (valfritt)</Label>
            <Textarea id="c" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="T.ex. klipphöjd 3,5 mm, torrt vid green 7…" />
          </div>
          <div>
            <Label htmlFor="w" className="mb-2 block text-base">När? (lämna tomt = nu)</Label>
            <Input id="w" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
          </div>
          <Button size="lg" className="h-14 w-full text-lg" onClick={submit} disabled={add.isPending}>
            Spara som {me ?? "…"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
