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

  const [documents, setDocuments] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all categories and create a Map for quick lookup
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categorias')
          .select('id, nombre');
        if (categoriesError) throw categoriesError;
        const categoryMap = new Map(categoriesData.map(c => [c.id, c.nombre]));

        // 2. Fetch the join table data
        const { data: joinData, error: joinError } = await supabase
          .from('documento_categorias')
          .select('documento_id, categoria_id');
        if (joinError) throw joinError;

        // 3. Fetch all documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('documentos')
          .select('id, nombre, version, created_at, url_archivo')
          .order('created_at', { ascending: false });
        if (documentsError) throw documentsError;

        // 4. Manually join the data in JavaScript
        const formattedDocuments = (documentsData || []).map(doc => {
          const categoryIds = (joinData || [])
            .filter(j => j.documento_id == doc.id) // Use == for type coercion
            .map(j => j.categoria_id);
          const categorias = categoryIds.map(id => categoryMap.get(id)).filter(Boolean);

          return {
            id: doc.id,
            nombre: doc.nombre,
            version: doc.version,
            fecha: new Date(doc.created_at).toLocaleDateString('es-CO', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            url_archivo: doc.url_archivo,
            categorias,
          };
        });

        setDocuments(formattedDocuments);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error loading documents data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredDocuments = useMemo(() => {
    if (selectedCategory === 'all') {
      return documents;
    }
    return documents.filter((document) =>
      document.categorias.includes(selectedCategory)
    );
  }, [documents, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">Cargando documentos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-[1216px] mx-auto px-4 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Documentos' }]} />
        <PageHeader title="Documentos" description="Consulta procedimientos, instructivos y documentación controlada disponible en el portal HSEQ." />
        <SummarySection documents={filteredDocuments} />
        <Toolbar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <DocumentsContent documents={filteredDocuments} viewMode={viewMode} />
      </main>
    </div>
  );

}