'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Plus, Search } from 'lucide-react';
import { useAdminQuestions } from '@/lib/hooks/useAdminQuestions';
import { AdminQuestion, QuestionStatusFilter } from '@/lib/types/adminQuestion';
import { Category } from '@/lib/types/category';
import { getCategories } from '@/app/actions/getCategories';
import { duplicateQuestion } from '@/app/actions/duplicateQuestion';
import { toggleQuestionPublished } from '@/app/actions/toggleQuestionPublished';
import { QuestionsTable } from '@/components/admin/QuestionsTable';
import { QuestionFormModal } from '@/components/admin/QuestionFormModal';
import { AdminToast } from '@/components/admin/AdminToast';

const selectClass =
  'p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 text-sm outline-none focus:ring-2 focus:ring-[#63AEBF]';

export function QuestionsSection() {
  const {
    items, total, totalPages, page, setPage,
    search, setSearch, category, setCategory, status, setStatus,
    loading, error, reload
  } = useAdminQuestions();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data ?? []));
  }, []);

  const [editing, setEditing] = useState<AdminQuestion | null>(null);
  const [creando, setCreando] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ mensaje: string; tipo: 'exito' | 'error' } | null>(null);

  const handleDuplicate = async (question: AdminQuestion) => {
    setBusyId(question.id);
    const result = await duplicateQuestion(question.id);
    setBusyId(null);

    if (result.error) {
      setToast({ mensaje: result.error, tipo: 'error' });
      return;
    }
    setToast({ mensaje: 'Pregunta duplicada como borrador', tipo: 'exito' });
    reload();
  };

  const handleTogglePublished = async (question: AdminQuestion) => {
    setBusyId(question.id);
    const result = await toggleQuestionPublished(question.id, !question.isPublished);
    setBusyId(null);

    if (result.error) {
      setToast({ mensaje: result.error, tipo: 'error' });
      return;
    }
    setToast({
      mensaje: question.isPublished ? 'Pregunta pasada a borrador' : 'Pregunta publicada',
      tipo: 'exito'
    });
    reload();
  };

  const handleSaved = (mensaje: string) => {
    setToast({ mensaje, tipo: 'exito' });
    reload();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#033E8C] dark:text-zinc-100">Preguntas</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {loading ? 'Cargando…' : `${total} preguntas coinciden con los filtros`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreando(true)}
          className="flex items-center gap-2 bg-[#FCD442] text-[#033E8C] px-4 py-2.5 rounded-lg font-bold hover:bg-[#eec531] transition-colors"
        >
          <Plus size={18} />
          Nueva pregunta
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en enunciados y alternativas…"
            className={`${selectClass} w-full pl-10`}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={selectClass}
        >
          <option value="todas">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as QuestionStatusFilter)}
          className={selectClass}
        >
          <option value="todas">Todos los estados</option>
          <option value="publicadas">Publicadas</option>
          <option value="borradores">Borradores</option>
        </select>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        {error && (
          <div className="p-6 text-center text-red-600 dark:text-red-400 font-medium">{error}</div>
        )}

        {!error && loading && (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        )}

        {!error && !loading && items.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-zinc-400">
            <p className="font-medium">No hay preguntas con estos filtros</p>
          </div>
        )}

        {!error && !loading && items.length > 0 && (
          <QuestionsTable
            questions={items}
            busyId={busyId}
            onEdit={setEditing}
            onDuplicate={handleDuplicate}
            onTogglePublished={handleTogglePublished}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {(editing || creando) && (
        <QuestionFormModal
          question={editing}
          onClose={() => { setEditing(null); setCreando(false); }}
          onSaved={handleSaved}
        />
      )}

      {toast && (
        <AdminToast
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
