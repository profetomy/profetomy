'use client';

import { useEffect } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';

interface AdminToastProps {
  mensaje: string;
  tipo: 'exito' | 'error';
  onClose: () => void;
}

const AUTO_CIERRE_MS = 4000;

export function AdminToast({ mensaje, tipo, onClose }: AdminToastProps) {
  useEffect(() => {
    const id = setTimeout(onClose, AUTO_CIERRE_MS);
    return () => clearTimeout(id);
  }, [onClose, mensaje]);

  const esExito = tipo === 'exito';

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-bold ${
        esExito
          ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-200'
          : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-200'
      }`}
    >
      {esExito ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      <span className="max-w-xs">{mensaje}</span>
      <button type="button" onClick={onClose} aria-label="Cerrar" className="opacity-60 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}
