import { supabase } from '@/lib/supabase'

/**
 * Obtiene la configuración de un módulo según su ruta.
 */
export async function getModuloByRuta(ruta) {

    const {
        data: modulo,
        error
    } = await supabase
        .from('modulos')
        .select('id, nombre, ruta, publico, activo')
        .eq('ruta', ruta)
        .single()

    return {
        modulo,
        error
    }

}