'use client';

import { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { Category } from '@/lib/types/category';
import { createCategory } from '@/app/actions/createCategory';
import { updateCategory } from '@/app/actions/updateCategory';

interface CategoryFormModalProps {
  /** null = crear una categoria nueva */
  category: Category | null;
  onClose: () => void;
  onSaved: (mensaje: string) => void;
}

const inputClass =
  'w-full p-3 rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-[#63AEBF] outline-none';
const labelClass = 'block text-gray-700 dark:text-zinc-300 font-bold mb-2 text-sm';

const generarSlug = (texto: string) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function CategoryFormModal({ category, onClose, onSaved }: CategoryFormModalProps) {
  const esEdicion = Boolean(category);

  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (valor: string) => {
    setName(valor);
    // El identificador se autocompleta solo al crear: cambiarlo despues romperia
    // la relacion con las preguntas ya asignadas.
    if (!esEdicion) setSlug(generarSlug(valor));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const input = { slug, name, description, sortOrder, isActive };
    const result = esEdicion
      ? await updateCategory(category!.id, input)
      : await createCategory(input);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    onSaved(esEdicion ? 'Categoría actualizada' : 'Categoría creada');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-xl font-extrabold text-[#033E8C] dark:text-zinc-100">
            {esEdicion ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Nombre</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClass}
              placeholder="Examen Final"
            />
          </div>

          <div>
            <label className={labelClass}>Identificador</label>
            <input
              required
              type="text"
              value={slug}
              onChange={(e) => setSlug(generarSlug(e.target.value))}
              disabled={esEdicion}
              className={`${inputClass} disabled:bg-gray-100 dark:disabled:bg-zinc-800 disabled:text-gray-500`}
              placeholder="examen-final"
            />
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              {esEdicion
                ? 'No se puede cambiar: las preguntas ya asignadas dependen de él.'
                : 'Se genera solo a partir del nombre.'}
            </p>
          </div>

          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-[80px]`}
              placeholder="Qué agrupa esta categoría"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Orden</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select
                value={isActive ? 'activa' : 'inactiva'}
                onChange={(e) => setIsActive(e.target.value === 'activa')}
                className={inputClass}
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg font-bold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold bg-[#033E8C] text-white hover:bg-[#034C8C] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
