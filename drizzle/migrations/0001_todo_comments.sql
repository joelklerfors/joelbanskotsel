CREATE TABLE public.todo_comments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), todo_id uuid NOT NULL REFERENCES public.todos(id) ON DELETE CASCADE, author text NOT NULL, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.todo_comments TO anon, authenticated;
GRANT ALL ON public.todo_comments TO service_role;
ALTER TABLE public.todo_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all todo comments" ON public.todo_comments FOR ALL USING (true) WITH CHECK (true);