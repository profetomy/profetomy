'use client';

import { useState } from 'react';
import {
  FileQuestion, LayoutDashboard, ListTree, Settings, SlidersHorizontal, Users
} from 'lucide-react';
import { DashboardSection } from '@/components/admin/DashboardSection';
import { QuestionsSection } from '@/components/admin/QuestionsSection';
import { UsersSection } from '@/components/admin/UsersSection';
import { CategoriesSection } from '@/components/admin/CategoriesSection';
import { InstructionsSection } from '@/components/admin/InstructionsSection';
import { SettingsSection } from '@/components/admin/SettingsSection';

type SeccionId = 'dashboard' | 'preguntas' | 'categorias' | 'instrucciones' | 'usuarios' | 'configuracion';

const SECCIONES = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'preguntas', label: 'Preguntas', icon: FileQuestion },
  { id: 'categorias', label: 'Categorías', icon: ListTree },
  { id: 'instrucciones', label: 'Instrucciones', icon: SlidersHorizontal },
  { id: 'usuarios', label: 'Usuarios', icon: Users },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
] as const;

export function AdminPanel() {
  const [seccion, setSeccion] = useState<SeccionId>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8 flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-56 shrink-0">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-zinc-600 mb-3 px-3">
            Administración
          </p>
          <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {SECCIONES.map(({ id, label, icon: Icon }) => (
              <li key={id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setSeccion(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                    seccion === id
                      ? 'bg-[#033E8C] text-white'
                      : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 min-w-0">
          {seccion === 'dashboard' && <DashboardSection />}
          {seccion === 'preguntas' && <QuestionsSection />}
          {seccion === 'usuarios' && <UsersSection />}
          {seccion === 'categorias' && <CategoriesSection />}
          {seccion === 'instrucciones' && <InstructionsSection />}
          {seccion === 'configuracion' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}
