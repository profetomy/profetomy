'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Save, X, Trash, PlusCircle, Loader2 } from 'lucide-react';
import { Question } from '@/lib/types/exam';
import { createQuestion } from '@/app/actions/createQuestion';
import { updateQuestion } from '@/app/actions/updateQuestion';
import { deleteQuestion } from '@/app/actions/deleteQuestion';
import { getCategories } from '@/app/actions/getCategories';
import { Category } from '@/lib/types/category';

interface QuestionFormModalProps {
  /** null = crear una pregunta nueva */
  question: Question | null;
  onClose: () => void;
  onSaved: (mensaje: string) => void;
}

const inputClass =
  'w-full p-3 rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-[#63AEBF] outline-none';
const labelClass = 'block text-gray-700 dark:text-zinc-300 font-bold mb-2 text-sm';

export function QuestionFormModal({ question, onClose, onSaved }: QuestionFormModalProps) {
  const esEdicion = Boolean(question?.id);

  const [q, setQ] = useState(question?.q ?? '');
  const [statements, setStatements] = useState<string[]>(question?.statements ?? []);
  const [optionA, setOptionA] = useState(question?.a ?? '');
  const [optionB, setOptionB] = useState(question?.b ?? '');
  const [optionC, setOptionC] = useState(question?.c ?? '');
  const [correct, setCorrect] = useState<'a' | 'b' | 'c'>(question?.correct ?? 'a');
  const [doublePoints, setDoublePoints] = useState(question?.doublePoints ?? false);
  const [category, setCategory] = useState(question?.category ?? '');
  const [isPublished, setIsPublished] = useState(question?.isPublished ?? true);
  const [difficulty, setDifficulty] = useState(question?.difficulty ?? '');
  const [explanation, setExplanation] = useState(question?.explanation ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data ?? []));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const construirFormData = () => {
    const formData = new FormData();
    formData.append('question', q);
    const limpios = statements.map(s => s.trim()).filter(Boolean);
    if (limpios.length > 0) formData.append('statements', JSON.stringify(limpios));
    formData.append('optionA', optionA);
    formData.append('optionB', optionB);
    formData.append('optionC', optionC);
    formData.append('correct', correct);
    formData.append('doublePoints', String(doublePoints));
    formData.append('category', category ?? '');
    formData.append('difficulty', difficulty);
    formData.append('explanation', explanation);
    formData.append('isPublished', String(isPublished));
    formData.append('imageUrl', question?.image || '');
    if (imageFile) formData.append('imageFile', imageFile);
    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = construirFormData();
      const result = esEdicion
        ? await updateQuestion(question!.id!, formData)
        : await createQuestion(formData);

      if (result.error) throw new Error(result.error);

      onSaved(esEdicion ? 'Pregunta actualizada' : 'Pregunta creada');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado al guardar');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!question?.id) return;
    if (!confirm('¿Eliminar esta pregunta? Esta acción no se puede deshacer.')) return;

    setIsDeleting(true);
    setError(null);

    const result = await deleteQuestion(question.id);

    if (result.error) {
      setError(result.error);
      setIsDeleting(false);
      return;
    }

    onSaved('Pregunta eliminada');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-3xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 rounded-t-xl">
          <h2 className="text-xl font-extrabold text-[#033E8C] dark:text-zinc-100">
            {esEdicion ? 'Editar pregunta' : 'Nueva pregunta'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Enunciado</label>
            <textarea
              required
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={`${inputClass} min-h-[100px]`}
              placeholder="¿Qué significa esta señal?"
            />
          </div>

          <div>
            <label className={labelClass}>Afirmaciones I, II, III (opcional)</label>
            <div className="space-y-2">
              {statements.map((stmt, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <textarea
                    value={stmt}
                    onChange={(e) => {
                      const copia = [...statements];
                      copia[idx] = e.target.value;
                      setStatements(copia);
                    }}
                    className={`${inputClass} min-h-[60px]`}
                    placeholder={`Afirmación ${idx + 1} (sin el número, se agrega solo)`}
                  />
                  <button
                    type="button"
                    onClick={() => setStatements(statements.filter((_, i) => i !== idx))}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors mt-1"
                    title="Eliminar afirmación"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setStatements([...statements, ''])}
                className="text-sm font-bold text-[#63AEBF] hover:text-[#033E8C] flex items-center gap-1 transition-colors"
              >
                <PlusCircle size={16} />
                Agregar afirmación
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {([
              ['Alternativa A', optionA, setOptionA, 'a'],
              ['Alternativa B', optionB, setOptionB, 'b'],
              ['Alternativa C', optionC, setOptionC, 'c']
            ] as const).map(([label, value, setter, key]) => (
              <div key={key}>
                <label className={labelClass}>
                  {label}
                  {correct === key && (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                      CORRECTA
                    </span>
                  )}
                </label>
                <input
                  required
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Respuesta correcta</label>
              <select
                value={correct}
                onChange={(e) => setCorrect(e.target.value as 'a' | 'b' | 'c')}
                className={inputClass}
              >
                <option value="a">Alternativa A</option>
                <option value="b">Alternativa B</option>
                <option value="c">Alternativa C</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Categoría</label>
              <select
                value={category ?? ''}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                <option value="">Sin categoría asignada</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}{cat.isActive ? '' : ' (inactiva)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Estado</label>
              <select
                value={isPublished ? 'publicada' : 'borrador'}
                onChange={(e) => setIsPublished(e.target.value === 'publicada')}
                className={inputClass}
              >
                <option value="publicada">Publicada</option>
                <option value="borrador">Borrador (no entra a exámenes)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Dificultad</label>
              <select
                value={difficulty ?? ''}
                onChange={(e) => setDifficulty(e.target.value)}
                className={inputClass}
              >
                <option value="">Sin definir</option>
                <option value="facil">Fácil</option>
                <option value="media">Media</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Explicación (opcional)</label>
              <textarea
                value={explanation ?? ''}
                onChange={(e) => setExplanation(e.target.value)}
                className={`${inputClass} min-h-[80px]`}
                placeholder="Por qué la respuesta correcta es la correcta"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <label className={labelClass}>Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-600 dark:text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#FCD442] file:text-[#033E8C] hover:file:bg-[#eec531] cursor-pointer"
              />
              {question?.image && !imageFile && (
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
                  Ya tiene imagen. Subí una nueva solo si querés reemplazarla.
                </p>
              )}
            </div>

            {(question?.image || imageFile) && (
              <div className="relative h-32 w-full rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden bg-gray-50 dark:bg-zinc-800">
                <Image
                  src={imageFile ? URL.createObjectURL(imageFile) : question!.image!}
                  alt="Vista previa"
                  fill
                  sizes="300px"
                  className="object-contain"
                  unoptimized={Boolean(imageFile)}
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={doublePoints}
              onChange={(e) => setDoublePoints(e.target.checked)}
              className="w-5 h-5 accent-[#033E8C]"
            />
            <span className="text-gray-700 dark:text-zinc-300 font-bold text-sm">
              Doble puntaje (vale 2 puntos)
            </span>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
            {esEdicion ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-red-600 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash size={18} />}
                Eliminar
              </button>
            ) : <span />}

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
                className="px-4 py-2 rounded-lg font-bold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isDeleting}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold bg-[#033E8C] text-white hover:bg-[#034C8C] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
