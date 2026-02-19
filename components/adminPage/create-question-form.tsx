"use client";

import { useState } from "react";
import { PlusCircle, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CreateQuestionForm() {
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [correct, setCorrect] = useState<'a' | 'b' | 'c'>("a");
  const [doublePoints, setDoublePoints] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('question', question);
      formData.append('optionA', optionA);
      formData.append('optionB', optionB);
      formData.append('optionC', optionC);
      formData.append('correct', correct);
      formData.append('doublePoints', String(doublePoints));
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      // Use Server Action
      const { createQuestion } = await import('@/app/actions/createQuestion');
      const result = await createQuestion(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      // 3. Reset Form on success
      setMessage({ type: 'success', text: 'Pregunta creada exitosamente' });
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setCorrect("a");
      setDoublePoints(false);
      setImageFile(null);
      // Reset file input manually if needed (controlled input)
      // Note: File input reset is tricky in React without ref, but user can re-select if needed.
      // We can add a key to force re-render if strict reset is needed.

    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-[#033E8C] mb-6 flex items-center gap-2">
        <PlusCircle size={28} />
        Agregar Nueva Pregunta
      </h2>

      {message && (
        <div className={`p-4 mb-6 rounded-lg font-medium text-center ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Text */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Enunciado de la Pregunta</label>
          <textarea
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63AEBF] focus:border-transparent min-h-[100px]"
            placeholder="Escribe aquí la pregunta..."
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Opción A</label>
            <input
              required
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63AEBF]"
              placeholder="Respuesta A"
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
              placeholder="Respuesta B"
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
              placeholder="Respuesta C"
            />
          </div>
        </div>

        {/* Correct Answer & Double Points */}
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
             {imageFile && (
              <p className="text-xs text-gray-500 mt-1">Archivo: {imageFile.name}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#033E8C] hover:bg-[#022c63]'
            }`}
          >
            <Save size={24} />
            {isSubmitting ? 'Guardando...' : 'Guardar Pregunta'}
          </button>
        </div>
      </form>
    </div>
  );
}
