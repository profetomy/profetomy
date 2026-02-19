"use client";

import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { Question } from "@/lib/types/exam";
import { updateQuestion } from "@/app/actions/updateQuestion";

interface EditQuestionModalProps {
  question: Question;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditQuestionModal({ question, onClose, onSuccess }: EditQuestionModalProps) {
  const [q, setQ] = useState(question.q);
  const [optionA, setOptionA] = useState(question.a);
  const [optionB, setOptionB] = useState(question.b);
  const [optionC, setOptionC] = useState(question.c);
  const [correct, setCorrect] = useState<'a' | 'b' | 'c'>(question.correct);
  const [doublePoints, setDoublePoints] = useState(question.doublePoints || false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!question.id) throw new Error("ID de pregunta faltante");

      const formData = new FormData();
      formData.append('question', q);
      formData.append('optionA', optionA);
      formData.append('optionB', optionB);
      formData.append('optionC', optionC);
      formData.append('correct', correct);
      formData.append('doublePoints', String(doublePoints));
      // Keep existing image URL unless new file provided
      // If we want to allow deleting image, we'd need another flag. For now, just update or keep.
      formData.append('imageUrl', question.image || '');
      
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const result = await updateQuestion(question.id, formData);

      if (result.error) {
        throw new Error(result.error);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#033E8C] flex items-center gap-2">
            <Edit2 size={24} />
            Editar Pregunta
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Enunciado</label>
              <textarea
                required
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63AEBF] min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Opción A</label>
                <input
                  required
                  type="text"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63AEBF]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Opción B</label>
                <input
                  required
                  type="text"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63AEBF]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Opción C</label>
                <input
                  required
                  type="text"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63AEBF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Respuesta Correcta</label>
                <select
                  value={correct}
                  onChange={(e) => setCorrect(e.target.value as 'a' | 'b' | 'c')}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63AEBF]"
                >
                  <option value="a">Opción A</option>
                  <option value="b">Opción B</option>
                  <option value="c">Opción C</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doublePoints}
                    onChange={(e) => setDoublePoints(e.target.checked)}
                    className="w-5 h-5 text-[#033E8C] rounded focus:ring-[#63AEBF]"
                  />
                  <span className="text-gray-700 font-bold">¿Doble Puntaje?</span>
                </label>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Imagen (Opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E0F2F5] file:text-[#034C8C] hover:file:bg-[#d1e9ed]"
                />
                {question.image && !imageFile && (
                  <p className="text-xs text-green-600 mt-1 truncate">Imagen actual: {question.image.split('/').pop()}</p>
                )}
                {imageFile && (
                  <p className="text-xs text-gray-500 mt-1 truncate">Nuevo archivo: {imageFile.name}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg text-white font-bold flex items-center gap-2 shadow-sm transition-all ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#033E8C] hover:bg-[#022c63]'
                }`}
              >
                <Save size={20} />
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
