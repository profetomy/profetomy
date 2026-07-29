'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Plus, Trash } from 'lucide-react';
import { Category } from '@/lib/types/category';
import { getCategories } from '@/app/actions/getCategories';
import { updateCategory } from '@/app/actions/updateCategory';
import { deleteCategory } from '@/app/actions/deleteCategory';
import { CategoryFormModal } from '@/components/admin/CategoryFormModal';
import { AdminToast } from '@/components/admin/AdminToast';

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creando, setCreando] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ mensaje: string; tipo: 'exito' | 'error' } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await getCategories();
    if (loadError) setError(loadError);
    else setCategories(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggleActive = async (category: Category) => {
    setBusyId(category.id);
    const result = await updateCategory(category.id, { isActive: !category.isActive });
    setBusyId(null);

    if (result.error) return setToast({ mensaje: result.error, tipo: 'error' });
    setToast({ mensaje: category.isActive ? 'Categoría desactivada' : 'Categoría activada', tipo: 'exito' });
    load();
  };

  /** Intercambia el orden con la categoria vecina. */
  const handleMove = async (index: number, direccion: -1 | 1) => {
    const actual = categories[index];
    const vecina = categories[index + direccion];
    if (!vecina) return;

    setBusyId(actual.id);
    const [a, b] = await Promise.all([
      updateCategory(actual.id, { sortOrder: vecina.sortOrder }),
      updateCategory(vecina.id, { sortOrder: actual.sortOrder })
    ]);
    setBusyId(null);

    const fallo = a.error || b.error;
    if (fallo) return setToast({ mensaje: fallo, tipo: 'error' });
    load();
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`¿Eliminar la categoría "${category.name}"? Las preguntas no se borran: solo dejan de pertenecer a esta categoría.`)) return;

    setBusyId(category.id);
    const result = await deleteCategory(category.id);
    setBusyId(null);

    if (result.error) return setToast({ mensaje: result.error, tipo: 'error' });
    setToast({
      mensaje: `Categoría eliminada. ${result.preguntasLiberadas} pregunta(s) dejaron de pertenecer a ella.`,
      tipo: 'exito'
    });
    load();
  };

  const handleSaved = (mensaje: string) => {
    setToast({ mensaje, tipo: 'exito' });
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#033E8C] dark:text-zinc-100">Categorías</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Una pregunta puede estar en varias categorías a la vez. El doble puntaje no
            se maneja acá: es una casilla dentro de cada pregunta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreando(true)}
          className="flex items-center gap-2 bg-[#FCD442] text-[#033E8C] px-4 py-2.5 rounded-lg font-bold hover:bg-[#eec531] transition-colors"
        >
          <Plus size={18} />
          Nueva categoría
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        {error && <div className="p-6 text-center text-red-600 font-medium">{error}</div>}

        {loading && !error && (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-zinc-400">
            Todavía no hay categorías
          </div>
        )}

        {!loading && !error && categories.map((category, index) => (
          <div
            key={category.id}
            className="flex items-center gap-4 p-4 border-b last:border-b-0 border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => handleMove(index, -1)}
                disabled={index === 0 || busyId === category.id}
                className="p-0.5 text-gray-400 hover:text-[#033E8C] disabled:opacity-30"
                title="Subir"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 1)}
                disabled={index === categories.length - 1 || busyId === category.id}
                className="p-0.5 text-gray-400 hover:text-[#033E8C] disabled:opacity-30"
                title="Bajar"
              >
                <ArrowDown size={14} />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 dark:text-zinc-100">{category.name}</span>
                <code className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 font-mono">
                  {category.slug}
                </code>
                <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                  {category.questionCount} pregunta{category.questionCount === 1 ? '' : 's'}
                </span>
                {!category.isActive && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300">
                    INACTIVA
                  </span>
                )}
              </div>
              {category.description && (
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                  {category.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleActive(category)}
                disabled={busyId === category.id}
                title={category.isActive ? 'Desactivar' : 'Activar'}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:opacity-40"
              >
                {category.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                type="button"
                onClick={() => setEditing(category)}
                title="Editar"
                className="p-2 rounded-lg text-[#033E8C] hover:bg-[#FCD442] dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(category)}
                disabled={busyId === category.id}
                title="Eliminar"
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-40"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editing || creando) && (
        <CategoryFormModal
          category={editing}
          onClose={() => { setEditing(null); setCreando(false); }}
          onSaved={handleSaved}
        />
      )}

      {toast && (
        <AdminToast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
