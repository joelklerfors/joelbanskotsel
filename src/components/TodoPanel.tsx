import { useState } from "react";
import { toast } from "sonner";
import { Check, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddLogs, useAddTodo, useAreas, useDeleteTodo, useTodos, useUpdateTodo } from "@/lib/data";
import { WORK_TYPES, formatDate, type Todo } from "@/lib/golf";
import { useMe } from "@/lib/me";

const selectCls = "h-11 rounded-md border border-input bg-card px-3 text-sm";

export function TodoPanel({ areaId }: { areaId?: string }) {
  const { data: todos = [] } = useTodos();
  const { data: areas = [] } = useAreas();
  const { me } = useMe();
  const add = useAddTodo();
  const upd = useUpdateTodo();
  const del = useDeleteTodo();
  const addLogs = useAddLogs();
  
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [area, setArea] = useState(areaId ?? "");
  const [type, setType] = useState("");
  const [showDone, setShowDone] = useState(false);

  // --- NYA STATES ---
  const [filterType, setFilterType] = useState(""); // Håller koll på sorteringen
  const [applyAllHoles, setApplyAllHoles] = useState(false); // Håller koll på "Alla hål"-checkboxen

  const areaName = (id: string | null) => areas.find((a) => a.id === id)?.name ?? "Hela banan";
  
  // --- UPPDATERAD LOGIK FÖR ATT FILTRERA ---
  const list = todos.filter((t) => {
    const matchArea = areaId ? t.area_id === areaId : true;
    const matchType = filterType ? t.work_type === filterType : true;
    return matchArea && matchType;
  });
  
  const open = list.filter((t) => !t.done);
  const done = list.filter((t) => t.done);

  // --- UPPDATERAD SKAPA-FUNKTION (ALLA HÅL) ---
  const create = async () => {
    if (!me) return toast.error("Välj vem du är högst upp först");
    if (!title.trim()) return;

    if (applyAllHoles) {
      // Filtrera ut alla områden som faktiskt är golfhål
      const holeAreas = areas.filter((a) => a.kind === "hole");
      
      if (holeAreas.length === 0) return toast.error("Kunde inte hitta några hål");

      // Skapa en array med promises för att skicka in allt samtidigt
      const promises = holeAreas.map((hole) => 
        add.mutateAsync({ 
          title: title.trim(), 
          comment: comment.trim() || null, 
          area_id: hole.id, 
          work_type: type || null, 
          created_by: me 
        })
      );
      
      await Promise.all(promises);
      toast.success(`Tillagd på ${holeAreas.length} hål!`);
    } else {
      // Skapa som vanligt för ett specifikt område
      await add.mutateAsync({ 
        title: title.trim(), 
        comment: comment.trim() || null, 
        area_id: area || null, 
        work_type: type || null, 
        created_by: me 
      });
      toast.success("Tillagd i att göra-listan");
    }

    setTitle(""); setComment(""); setType(""); setApplyAllHoles(false);
    if (!areaId) setArea("");
  };

  const complete = async (t: Todo) => {
    if (!me) return toast.error("Välj vem du är högst upp först");
    await upd.mutateAsync({ id: t.id, done: true, done_by: me, done_at: new Date().toISOString() });
    if (t.area_id && t.work_type) {
      await addLogs.mutateAsync([{ area_id: t.area_id, work_type: t.work_type, staff_name: me, comment: t.title + (t.comment ? ` – ${t.comment}` : ""), done_at: new Date().toISOString() }]);
    }
    toast.success("Klart! Bra jobbat");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-4 shadow-card">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <Input className="h-11" placeholder="Vad behöver göras?" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} />
          {!areaId && (
            <select className={selectCls} value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">Hela banan</option>
              {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          )}
          <select className={selectCls} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Typ av arbete</option>
            {WORK_TYPES.map((w) => <option key={w}>{w}</option>)}
          </select>
        </div>
        
        <div className="mt-2 flex gap-2">
          <Input className="h-11" placeholder="Kommentar (valfritt)" value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button className="h-11" onClick={create} disabled={add.isPending}>Lägg till</Button>
        </div>

        {/* --- NYTT: Checkbox för alla hål --- */}
        {!areaId && (
          <div className="mt-4 flex items-center gap-2 px-1">
            <input 
              type="checkbox" 
              id="all-holes" 
              className="h-4 w-4 cursor-pointer rounded border-muted-foreground accent-primary" 
              checked={applyAllHoles} 
              onChange={(e) => setApplyAllHoles(e.target.checked)} 
            />
            <label htmlFor="all-holes" className="cursor-pointer text-sm font-medium">
              Lägg till på alla 18 hål
            </label>
          </div>
        )}
      </div>

      {/* --- NYTT: Filter-dropdown ovanför listan --- */}
      <div className="flex justify-end pt-2">
        <select className={selectCls} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Visa alla sysslor</option>
          {WORK_TYPES.map((w) => <option key={w} value={w}>Visa endast {w}</option>)}
        </select>
      </div>

      {open.length === 0 && <p className="py-6 text-center text-muted-foreground">Inget kvar att göra här 🎉</p>}
      <ul className="space-y-2">
        {open.map((t) => (
          <li key={t.id} className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-card">
            <Button size="icon" variant="outline" className="h-12 w-12 shrink-0 rounded-full" aria-label="Markera som klar" onClick={() => complete(t)}>
              <Check className="h-6 w-6" />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold leading-tight">{t.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {!areaId && <span className="font-medium text-foreground">{areaName(t.area_id)} · </span>}
                {t.work_type && <span>{t.work_type} · </span>}
                Tillagd av {t.created_by}, {formatDate(t.created_at)}
              </p>
              {t.comment && <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-sm">{t.comment}</p>}
            </div>
            <Button size="icon" variant="ghost" aria-label="Ta bort" onClick={() => confirm("Ta bort uppgiften?") && del.mutate(t.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>

      {done.length > 0 && (
        <div>
          <button className="text-sm font-medium text-primary underline" onClick={() => setShowDone(!showDone)}>
            {showDone ? "Dölj" : "Visa"} klara ({done.length})
          </button>
          {showDone && (
            <ul className="mt-2 space-y-2">
              {done.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-xl border bg-muted/50 p-3">
                  <Check className="h-5 w-5 text-fresh" />
                  <div className="flex-1">
                    <p className="font-medium line-through opacity-70">{t.title}</p>
                    <p className="text-xs text-muted-foreground">Klar av {t.done_by} · {t.done_at && formatDate(t.done_at)}</p>
                  </div>
                  <Button size="icon" variant="ghost" aria-label="Ångra" onClick={() => upd.mutate({ id: t.id, done: false, done_by: null, done_at: null })}>
                    <Undo2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
