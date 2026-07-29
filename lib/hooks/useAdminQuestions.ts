'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAdminQuestions } from '@/app/actions/getAdminQuestions';
import { AdminQuestion, QuestionDifficultyFilter, QuestionStatusFilter } from '@/lib/types/adminQuestion';

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

/** Estado del listado de preguntas del panel: filtros, paginacion y recarga. */
export function useAdminQuestions() {
  const [items, setItems] = useState<AdminQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('todas');
  const [status, setStatus] = useState<QuestionStatusFilter>('todas');
  const [difficulty, setDifficulty] = useState<QuestionDifficultyFilter>('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [search]);

  // Cualquier cambio de filtro vuelve a la primera pagina.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, status, difficulty]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: loadError } = await getAdminQuestions({
      search: debouncedSearch,
      category,
      status,
      difficulty,
      page,
      pageSize: PAGE_SIZE
    });

    if (loadError) {
      setError(loadError);
      setItems([]);
      setTotal(0);
    } else if (data) {
      setItems(data.items);
      setTotal(data.total);
    }

    setLoading(false);
  }, [debouncedSearch, category, status, difficulty, page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    items,
    total,
    totalPages,
    page,
    setPage,
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    difficulty,
    setDifficulty,
    loading,
    error,
    reload: load
  };
}
