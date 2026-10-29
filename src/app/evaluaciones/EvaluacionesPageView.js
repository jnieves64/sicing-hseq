'use client'

import { useEffect, useMemo, useState } from 'react'

import Header from '@/components/layout/Header'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import PageHeader from '@/components/shared/PageHeader'
import Toolbar from '@/app/documentos/Toolbar'
import SummarySection from './SummarySection'
import EvaluacionesContent from './EvaluacionesContent'
import { getEvaluaciones } from '@/services/evaluacionesService'

export default function EvaluacionesPageView() {

  const [evaluaciones, setEvaluaciones] = useState([])
  const [categories, setCategories] = useState([])
  const [esAdmin, setEsAdmin] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const loadData = async () => {

      const { evaluaciones: data, esAdmin: admin, error: loadError } = await getEvaluaciones()

      if (loadError) {
        setError('No se pudieron cargar las evaluaciones.')
        setLoading(false)
        return
      }

      // Solo las categorías que están en uso, para no ofrecer filtros vacíos
      const mapa = new Map()
      data.forEach((e) => e.categorias.forEach((c) => mapa.set(c.id, c.nombre)))

      setCategories(
        Array.from(mapa, ([id, nombre]) => ({ id, nombre }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
      )

      // Las categorías pasan a ser nombres, igual que en Documentos
      setEvaluaciones(
        data.map((e) => ({ ...e, categorias: e.categorias.map((c) => c.nombre) }))
      )

      setEsAdmin(admin)
      setLoading(false)

    }

    loadData()

  }, [])

  const filteredEvaluaciones = useMemo(() => {

    const base = selectedCategory === 'all'
      ? evaluaciones
      : evaluaciones.filter((e) => e.categorias.includes(selectedCategory))

    // Las pendientes primero
    return [...base].sort(
      (a, b) => (a.estado === 'pendiente' ? 0 : 1) - (b.estado === 'pendiente' ? 0 : 1)
    )

  }, [evaluaciones, selectedCategory])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">Cargando evaluaciones...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-[1216px] mx-auto px-4 py-8 space-y-8">

        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Evaluaciones' }]} />

        <PageHeader
          title="Evaluaciones"
          description="Presenta las evaluaciones de conocimiento sobre los documentos del Sistema Integrado de Gestión."
        />

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <SummarySection evaluaciones={filteredEvaluaciones} esAdmin={esAdmin} />

        <Toolbar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <EvaluacionesContent evaluaciones={filteredEvaluaciones} viewMode={viewMode} />

      </main>
    </div>
  );
}