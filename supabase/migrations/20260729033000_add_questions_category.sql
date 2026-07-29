-- Categoria explicita de pregunta. Las demas categorias del sitio se derivan por heuristica;
-- "examen-final" es un set curado y fijo, asi que necesita marca propia.
alter table public.questions
  add column if not exists category text;

create index if not exists questions_category_idx on public.questions (category);
