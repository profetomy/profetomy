-- Permite mantener preguntas en borrador: solo los admins las ven hasta publicarlas.
alter table public.questions
  add column if not exists is_published boolean not null default true;

create index if not exists questions_is_published_idx on public.questions (is_published);

-- La lectura publica ahora excluye los borradores; los admins siguen viendo todo.
drop policy if exists "Permitir lectura publica" on public.questions;

create policy "Permitir lectura publica" on public.questions
  for select
  using (
    is_published
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
