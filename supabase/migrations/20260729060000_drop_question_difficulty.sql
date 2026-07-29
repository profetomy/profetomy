-- La dificultad no aporta al simulador: se saca del panel y de la base.
-- Ninguna pregunta tenia valor cargado, asi que no se pierde informacion.
-- APLICADA EN PRODUCCION el 2026-07-29.
alter table public.questions drop column if exists difficulty;
