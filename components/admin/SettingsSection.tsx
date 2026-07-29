'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { AppSettings, getAppSettings } from '@/app/actions/getAppSettings';
import { updateAppSettings } from '@/app/actions/updateAppSettings';
import { AdminToast } from '@/components/admin/AdminToast';

const CAMPOS = [
  {
    key: 'duracion_examen_minutos',
    label: 'Duración del examen (minutos)',
    ayuda: 'Tiempo del cronómetro en todos los exámenes'
  },
  {
    key: 'preguntas_por_examen',
    label: 'Preguntas por examen',
    ayuda: 'Cuántas preguntas trae un examen aleatorio'
  },
  {
    key: 'max_puntos_incorrectos',
    label: 'Máximo de puntos incorrectos para aprobar',
    ayuda: 'Con esta cantidad o más, el examen se reprueba'
  }
];

const inputClass =
  'w-full p-3 rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-[#63AEBF] outline-none';

export function SettingsSection() {
  const [original, setOriginal] = useState<AppSettings>({});
  const [valores, setValores] = useState<AppSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState<{ mensaje: string; tipo: 'exito' | 'error' } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await getAppSettings();

    if (loadError) setError(loadError);
    else {
      setOriginal(data ?? {});
      setValores(data ?? {});
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const modificado = CAMPOS.some(campo => (valores[campo.key] ?? '') !== (original[campo.key] ?? ''));

  const handleSave = async () => {
    const invalido = CAMPOS.find(campo => {
      const valor = Number(valores[campo.key]);
      return !Number.isFinite(valor) || valor <= 0;
    });

    if (invalido) {
      return setToast({ mensaje: `"${invalido.label}" debe ser un número mayor que 0`, tipo: 'error' });
    }

    setGuardando(true);
    const result = await updateAppSettings(valores);
    setGuardando(false);

    if (result.error) return setToast({ mensaje: result.error, tipo: 'error' });
    setToast({ mensaje: 'Configuración guardada', tipo: 'exito' });
    load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-[#033E8C] dark:text-zinc-100">Configuración</h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Parámetros del simulador. Aplican a todos los exámenes.
        </p>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {loading && !error && (
        <div className="p-12 flex justify-center text-gray-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-5">
          {CAMPOS.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1.5">
                {campo.label}
              </label>
              <input
                type="number"
                min={1}
                value={valores[campo.key] ?? ''}
                onChange={(e) => setValores(prev => ({ ...prev, [campo.key]: e.target.value }))}
                className={`${inputClass} max-w-xs`}
              />
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{campo.ayuda}</p>
            </div>
          ))}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setValores(original)}
              disabled={!modificado || guardando}
              className="px-4 py-2 rounded-lg font-bold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!modificado || guardando}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold bg-[#033E8C] text-white hover:bg-[#034C8C] transition-colors disabled:opacity-40"
            >
              {guardando ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Guardar
            </button>
          </div>
        </div>
      )}

      {toast && (
        <AdminToast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
