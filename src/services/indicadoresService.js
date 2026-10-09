import { supabase } from '@/lib/supabase'

/**
 * Lista de indicadores activos, del más recientemente actualizado al más antiguo.
 */
export async function getIndicadores() {

    const {
        data: indicadores,
        error
    } = await supabase
        .from('indicadores')
        .select('id, titulo, descripcion, graficas, updated_at')
        .eq('activo', true)
        .order('updated_at', { ascending: false })

    return { indicadores: indicadores || [], error }

}

/**
 * Un indicador completo (datos + configuración de gráficas).
 */
export async function getIndicadorPorId(id) {

    const {
        data: indicador,
        error
    } = await supabase
        .from('indicadores')
        .select('id, titulo, descripcion, columnas, filas, graficas, updated_at')
        .eq('id', id)
        .eq('activo', true)
        .single()

    return { indicador, error }

}