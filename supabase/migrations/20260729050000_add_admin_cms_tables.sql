-- ============================================================================
-- Habilita las secciones Categorias, Instrucciones y Configuracion del panel.
-- APLICADA EN PRODUCCION el 2026-07-29.
-- ============================================================================

-- 1. Categorias administrables -----------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categorias visibles para todos" on public.categories
  for select using (is_active or exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

create policy "Solo admins modifican categorias" on public.categories
  for all to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

-- Semilla con las categorias que hoy existen de hecho.
insert into public.categories (slug, name, description, sort_order) values
  ('examen-final',   'Examen Final',   'Set curado del examen final, en orden fijo', 1),
  ('doble-puntaje',  'Doble Puntaje',  'Preguntas que valen 2 puntos',               2),
  ('senaleticas',    'Señaléticas',    'Preguntas sobre señalética vial',            3),
  ('matematicas',    'Matemáticas',    'Cálculos y física de tránsito',              4)
on conflict (slug) do nothing;

alter table public.questions
  add column if not exists category_id uuid references public.categories(id) on delete set null;

-- Backfill de lo que ya esta marcado en la columna de texto `category`.
update public.questions q
set category_id = c.id
from public.categories c
where q.category = c.slug and q.category_id is null;

-- 2. Dificultad y explicacion por pregunta -----------------------------------
alter table public.questions
  add column if not exists difficulty text check (difficulty in ('facil', 'media', 'dificil')),
  add column if not exists explanation text;

-- 3. Textos editables del simulador ------------------------------------------
create table if not exists public.app_content (
  key text primary key,
  title text,
  body text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_content enable row level security;

create policy "Contenido visible para todos" on public.app_content
  for select using (true);

create policy "Solo admins editan contenido" on public.app_content
  for all to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

insert into public.app_content (key, title, body) values
  ('instrucciones_examen', 'Instrucciones del Examen',
   '• Tiempo: 45 minutos
• Preguntas: 35 preguntas aleatorias
• Puntuación: 3 preguntas valen doble puntaje
• Aprobación: Menos de 6 puntos incorrectos
• Navegación: Puedes ir a cualquier pregunta usando la cuadrícula
• Colores: Borde naranja = doble puntaje, Borde negro = respondida
• Modo Corrección: Disponible después de finalizar el examen'),
  ('resultado_aprobado',  '¡APROBADO!', 'Aprobado (menos de 6 puntos incorrectos)'),
  ('resultado_reprobado', 'REPROBADO',  'Reprobado (6 o más puntos incorrectos)')
on conflict (key) do nothing;

-- 4. Parametros del simulador ------------------------------------------------
create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

create policy "Configuracion visible para todos" on public.app_settings
  for select using (true);

create policy "Solo admins editan configuracion" on public.app_settings
  for all to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

insert into public.app_settings (key, value) values
  ('duracion_examen_minutos', '45'),
  ('preguntas_por_examen',    '35'),
  ('max_puntos_incorrectos',  '6')
on conflict (key) do nothing;
