CREATE TABLE public.areas (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, kind text NOT NULL DEFAULT 'hole', sort int NOT NULL DEFAULT 0);
CREATE TABLE public.staff (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.work_logs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), area_id uuid NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE, work_type text NOT NULL, staff_name text NOT NULL, comment text, done_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.todos (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), area_id uuid REFERENCES public.areas(id) ON DELETE CASCADE, work_type text, title text NOT NULL, comment text, created_by text NOT NULL, done boolean NOT NULL DEFAULT false, done_by text, done_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());

GRANT SELECT ON public.areas TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff, public.work_logs, public.todos TO anon, authenticated;
GRANT ALL ON public.areas, public.staff, public.work_logs, public.todos TO service_role;

ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read areas" ON public.areas FOR SELECT USING (true);
CREATE POLICY "all staff" ON public.staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all logs" ON public.work_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all todos" ON public.todos FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.areas (name, kind, sort)
SELECT 'Hål ' || g, 'hole', g FROM generate_series(1,18) g;
INSERT INTO public.areas (name, kind, sort) VALUES
('Range','practice',19),('Humlegården','practice',20),('Puttinggreen','practice',21),('Övningsbunker','practice',22),('Korthålsbana','practice',23);
INSERT INTO public.staff (name) VALUES ('Anna'),('Erik'),('Johan');