import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Area, Todo, WorkLog } from "./golf";

export function useAreas() {
  return useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("areas").select("*").order("sort");
      if (error) throw error;
      return data as Area[];
    },
  });
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").order("name");
      if (error) throw error;
      return data as { id: string; name: string }[];
    },
  });
}

export function useLogs(areaId?: string) {
  return useQuery({
    queryKey: ["logs", areaId ?? "all"],
    queryFn: async () => {
      let q = supabase.from("work_logs").select("*").order("done_at", { ascending: false }).limit(1000);
      if (areaId) q = q.eq("area_id", areaId);
      const { data, error } = await q;
      if (error) throw error;
      return data as WorkLog[];
    },
  });
}

export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("todos").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Todo[];
    },
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
}

export function useAddLogs() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: async (rows: Omit<WorkLog, "id">[]) => {
      const { error } = await supabase.from("work_logs").insert(rows);
      if (error) throw error;
    },
    onSuccess: inv,
  });
}

export function useDeleteLog() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("work_logs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });
}

export function useAddTodo() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: async (row: { area_id: string | null; work_type: string | null; title: string; comment: string | null; created_by: string }) => {
      const { error } = await supabase.from("todos").insert(row);
      if (error) throw error;
    },
    onSuccess: inv,
  });
}

export function useUpdateTodo() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Todo> & { id: string }) => {
      const { error } = await supabase.from("todos").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });
}

export function useDeleteTodo() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });
}

export function useAddStaff() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("staff").insert({ name });
      if (error) throw error;
    },
    onSuccess: inv,
  });
}

export function useDeleteStaff() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });
}
