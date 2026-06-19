'use client'

import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { supabase } from '@/lib/supabase'

import Header from '@/components/layout/Header'

import Breadcrumbs from '@/components/shared/Breadcrumbs'
import PageHeader from '@/components/shared/PageHeader'

import SummarySection from './SummarySection'
import Toolbar from './Toolbar'
import DocumentsContent from './DocumentsContent'

export default function DocumentosPage() {

  /*
    STATES
  */

  const [documents, setDocuments] =
    useState([])

  const [categories, setCategories] =
    useState([])

  const [selectedCategory, setSelectedCategory] =
    useState('all')

  const [viewMode, setViewMode] =
    useState('grid')

  const [loading, setLoading] =
    useState(true)

  /*
    LOAD DATA
  */

  useEffect(() => {

    const loadData = async () => {

      setLoading(true)

      /*
        DOCUMENTS
      */

      const {
        data: documentsData,
        error: documentsError
      } = await supabase

        .from('documentos')

        .select(`
          id,
          nombre,
          version,
          created_at,
          url_archivo,

          documento_categorias (
            categorias (
              id,
              nombre
            )
          )
        `)

        .order(
          'created_at',
          { ascending: false }
        )

      /*
        CATEGORIES
      */

      const {
        data: categoriesData,
        error: categoriesError
      } = await supabase

        .from('categorias')

        .select('*')

        .order(
          'nombre',
          { ascending: true }
        )

      /*
        ERRORS
      */

      if (documentsError) {

        console.error(
          'Error loading documents:',
          documentsError
        )

      }

      if (categoriesError) {

        console.error(
          'Error loading categories:',
          categoriesError
        )

      }

      /*
        TRANSFORM DOCUMENTS
      */

      const formattedDocuments = (documentsData || []).map((document) => {
        const categorias = (document.documento_categorias || [])
          .map((item) => item.categorias?.nombre)
          .filter(Boolean);

        return {
          id: document.id,
          nombre: document.nombre,
          version: document.version,
          fecha: new Date(document.created_at).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          url_archivo: document.url_archivo,
          categorias,
        };
      });

      /*
        SET STATES
      */

      setDocuments(
        formattedDocuments
      )

      setCategories(
        categoriesData || []
      )

      setLoading(false)

    }

    loadData()

  }, [])

  /*
    FILTERED DOCUMENTS
  */

  const filteredDocuments = useMemo(() => {

    if (selectedCategory === 'all') {
      return documents;
    }

    return documents.filter((document) =>
      document.categorias.includes(selectedCategory?.nombre)
    );

  }, [
    documents,
    selectedCategory
  ])

  /*
    LOADING
  */

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-100
        "
      >

        <p
          className="
            text-sm
            text-gray-500
          "
        >

          Cargando documentos...

        </p>

      </div>

    )

  }

  return (

    <div
      className="
        min-h-screen
        bg-gray-100
      "
    >

      {/* HEADER */}

      <Header />

      {/* CONTENT */}

      <main
        className="
          max-w-[1216px]
          mx-auto
          px-4
          py-8
          space-y-8
        "
      >

        {/* BREADCRUMBS */}

        <Breadcrumbs

          items={[

            {
              label: 'Inicio',
              href: '/'
            },

            {
              label: 'Documentos'
            }

          ]}

        />

        {/* PAGE HEADER */}

        <PageHeader

          title="Documentos"

          description="
            Consulta procedimientos,
            instructivos y documentación
            controlada disponible en el
            portal HSEQ.
          "

        />

        {/* SUMMARY */}

        <SummarySection

          documents={filteredDocuments}

        />

        {/* TOOLBAR */}

        <Toolbar

          categories={categories}

          selectedCategory={
            selectedCategory
          }

          setSelectedCategory={
            setSelectedCategory
          }

          viewMode={viewMode}

          setViewMode={
            setViewMode
          }

        />

        {/* DOCUMENTS */}

        <DocumentsContent

          documents={filteredDocuments}

          viewMode={viewMode}

        />

      </main>

    </div>

  )

}