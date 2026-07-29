-- Una pregunta puede pertenecer a varias categorias a la vez.
-- Antes: una sola categoria guardada (questions.category) mas dos reglas
-- automaticas sobre el texto, que no se podian corregir a mano.
-- APLICADA EN PRODUCCION el 2026-07-29.

create table if not exists public.question_categories (
  question_id uuid not null references public.questions(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (question_id, category_id)
);

create index if not exists question_categories_category_idx
  on public.question_categories (category_id);

alter table public.question_categories enable row level security;

create policy "Asignaciones visibles para todos" on public.question_categories
  for select using (true);

create policy "Solo admins asignan categorias" on public.question_categories
  for all to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

-- Backfill 1: examen final, desde la columna de texto que se usaba antes.
insert into public.question_categories (question_id, category_id)
select q.id, c.id
from public.questions q
join public.categories c on c.slug = 'examen-final'
where q.category = 'examen-final'
on conflict do nothing;

-- Backfill 2: senaleticas, con el mismo criterio que usaba la regla automatica.
insert into public.question_categories (question_id, category_id)
select q.id, c.id
from public.questions q
join public.categories c on c.slug = 'senaleticas'
where q.image_url is not null and q.question ilike '%señal%'
on conflict do nothing;

-- Backfill 3: matematicas, replicando la regla (menciona distancia, tiene una
-- velocidad o una suma, y alguna alternativa en metros).
insert into public.question_categories (question_id, category_id)
select q.id, c.id
from public.questions q
join public.categories c on c.slug = 'matematicas'
where q.question ilike '%distancia%'
  and (q.question ~* '\d+\s*km/h' or q.question like '%+%')
  and (q.option_a ~* '\d+\s*metros' or q.option_b ~* '\d+\s*metros' or q.option_c ~* '\d+\s*metros')
on conflict do nothing;

-- Doble puntaje no es una categoria: es cuanto vale la pregunta (columna double_points).
delete from public.categories where slug = 'doble-puntaje';

-- NOTA: questions.category y questions.category_id quedan por compatibilidad
-- con la version desplegada. Se pueden borrar despues del proximo deploy.
