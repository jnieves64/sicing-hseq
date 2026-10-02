import { supabase } from '@/lib/supabase'

/**
 * Obtiene todas las publicaciones activas de Campañas, junto con
 * sus medios (fotos o video), ordenadas de más reciente a más antigua.
 */
export async function getCampanas() {

    const {
        data: campanas,
        error
    } = await supabase
        .from('campanas')
        .select(`
            id,
            descripcion,
            tipo,
            created_at,
            campana_medios (
                id,
                url,
                orden
            )
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false })

    if (error) {
        return { campanas: [], error }
    }

    const campanasFormateadas = campanas.map((campana) => ({
        id: campana.id,
        descripcion: campana.descripcion,
        tipo: campana.tipo,
        medios: [...campana.campana_medios].sort((a, b) => a.orden - b.orden),
        fecha: new Date(campana.created_at).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }))

    return { campanas: campanasFormateadas, error: null }

}