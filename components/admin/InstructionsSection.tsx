'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { AppContentItem, getAppContent } from '@/app/actions/getAppContent';
import { updateAppContent } from '@/app/actions/updateAppContent';
import { AdminToast } from '@/components/admin/AdminToast';

/** Nombre legible y ubicacion de cada texto editable. */
const DESCRIPCIONES: Record<string, { titulo: string; donde: string }> = {
  instrucciones_examen: {
    titulo: 'Instrucciones del examen',
    donde: 'Modal que se muestra antes de empezar cualquier examen'
  },
  resultado_aprobado: {
    titulo: 'Mensaje al aprobar',
    donde: 'Pantalla de resultados cuando el alumno aprueba'
  },
  resultado_reprobado: {
    titulo: 'Mensaje al reprobar',
    donde: 'Pantalla de resultados cuando el alumno reprueba'
  }
};

const inputClass =
  'w-full p-3 rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-[#63AEBF] outline-none';

export function InstructionsSection() {
  const [items, setItems] = useState<AppContentItem[]>([]);
  const [borradores, setBorradores] = useState<Record<string, AppContentItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<string | null>(null);
  const [toast, setToast] = useState<{ mensaje: string; tipo: 'exito' | 'error' } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await getAppContent();

    if (loadError) {
      setError(loadError);
    } else {
      setItems(data ?? []);
      const mapa: Record<string, AppContentItem> = {};
      for (const item of data ?? []) mapa[item.key] = { ...item };
      setBorradores(mapa);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (key: string) => {
    const borrador = borradores[key];
    if (!borrador) return;

    setGuardando(key);
    const result = await updateAppContent(key, borrador.title ?? '', borrador.body);
    setGuardando(null);

    if (result.error) return setToast({ mensaje: result.error, tipo: 'error' });
    setToast({ mensaje: 'Texto guardado', tipo: 'exito' });
    load();
  };

  const handleCancel = (key: string) => {
    const original = items.find(i => i.key === key);
    if (original) setBorradores(prev => ({ ...prev, [key]: { ...original } }));
  };

  const tieneCambios = (key: string) => {
    const original = items.find(i => i.key === key);
    const borrador = borradores[key];
    if (!original || !borrador) return false;
    return original.title !== borrador.title || original.body !== borrador.body;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-[#033E8C] dark:text-zinc-100">Instrucciones</h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Textos que ve el alumno. Los cambios aparecen sin necesidad de publicar de nuevo el sitio.
        </p>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {loading && !error && (
        <div className="p-12 flex justify-center text-gray-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      )}

      {!loading && !error && Object.values(borradores).map(item => {
        const meta = DESCRIPCIONES[item.key] ?? { titulo: item.key, donde: '' };
        const modificado = tieneCambios(item.key);

        return (
          <div
            key={item.key}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4"
          >
            <div>
              <h3 className="font-bold text-gray-900 dark:text-zinc-100">{meta.titulo}</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">{meta.donde}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 mb-1.5">Título</label>
              <input
                type="text"
                value={item.title ?? ''}
                onChange={(e) => setBorradores(prev => ({
                  ...prev,
                  [item.key]: { ...prev[item.key], title: e.target.value }
                }))}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 mb-1.5">
                Texto (cada línea se muestra por separado)
              </label>
              <textarea
                value={item.body}
                onChange={(e) => setBorradores(prev => ({
                  ...prev,
                  [item.key]: { ...prev[item.key], body: e.target.value }
                }))}
                className={`${inputClass} min-h-[140px] font-mono text-sm`}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleCancel(item.key)}
                disabled={!modificado || guardando === item.key}
                className="px-4 py-2 rounded-lg font-bold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSave(item.key)}
                disabled={!modificado || guardando === item.key}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold bg-[#033E8C] text-white hover:bg-[#034C8C] transition-colors disabled:opacity-40"
              >
                {guardando === item.key ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Guardar
              </button>
            </div>
          </div>
        );
      })}

      {toast && (
        <AdminToast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
