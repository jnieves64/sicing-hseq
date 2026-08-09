import { supabase } from '@/lib/supabase'

/**
 * Obtiene todos los documentos junto con sus categorías asociadas,
 * para el listado administrativo.
 */
export async function getDocumentos() {

    const {
        data: documentos,
        error
    } = await supabase
        .from('documentos')
        .select(`
            id,
            nombre,
            descripcion,
            url_archivo,
            version,
            estado_publicacion,
            creado_por,
            created_at,
            documento_categorias (
                categorias ( id, nombre )
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        return { documentos: [], error }
    }

    // Aplanamos la relación anidada documento_categorias -> categorias
    // para que cada documento tenga directamente documento.categorias = [{id, nombre}, ...]
    const documentosConCategorias = documentos.map((documento) => ({
        ...documento,
        categorias: documento.documento_categorias.map((dc) => dc.categorias)
    }))

    return { documentos: documentosConCategorias, error: null }

}

/**
 * Obtiene un documento específico por id, con sus categorías,
 * para precargar el formulario de edición.
 */
export async function getDocumentoPorId(documentoId) {

    const {
        data: documento,
        error
    } = await supabase
        .from('documentos')
        .select(`
            id,
            nombre,
            descripcion,
            url_archivo,
            version,
            estado_publicacion,
            documento_categorias (
                categorias ( id, nombre )
            )
        `)
        .eq('id', documentoId)
        .single()

    if (error) {
        return { documento: null, error }
    }

    return {
        documento: {
            ...documento,
            categorias: documento.documento_categorias.map((dc) => dc.categorias)
        },
        error: null
    }

}

/**
 * Elimina un documento y sus vínculos en documento_categorias.
 */
export async function eliminarDocumento(documentoId) {

    // Primero borramos los vínculos de categorías (aunque con ON DELETE CASCADE
    // en la FK no sería estrictamente necesario, lo hacemos explícito por
    // claridad y por si esa FK no tiene cascade configurado).
    const {
        error: relacionesError
    } = await supabase
        .from('documento_categorias')
        .delete()
        .eq('documento_id', documentoId)

    if (relacionesError) {
        return { error: relacionesError }
    }

    const {
        error: documentoError
    } = await supabase
        .from('documentos')
        .delete()
        .eq('id', documentoId)

    if (documentoError) {
        return { error: documentoError }
    }

    return { error: null }

}

/**
 * Obtiene todas las categorías disponibles, para el filtro
 * y para el formulario de creación/edición.
 */
export async function getCategorias() {

    const {
        data: categorias,
        error
    } = await supabase
        .from('categorias')
        .select('id, nombre')
        .order('nombre', { ascending: true })

    return { categorias: categorias || [], error }

}

/**
 * Crea un nuevo documento y vincula las categorías seleccionadas.
 */
export async function crearDocumento({
    nombre,
    descripcion,
    url_archivo,
    version,
    estado_publicacion,
    categoriaIds
}) {

    // Necesitamos el id del admin autenticado (creado_por),
    // buscando su fila en usuarios a partir de la sesión actual.
    const {
        data: { session }
    } = await supabase.auth.getSession()

    const {
        data: usuarioActual,
        error: usuarioError
    } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', session?.user?.id)
        .single()

    if (usuarioError || !usuarioActual) {
        return { error: usuarioError || new Error('No se pudo identificar al usuario actual.') }
    }

    const {
        data: documento,
        error: documentoError
    } = await supabase
        .from('documentos')
        .insert({
            nombre,
            descripcion,
            url_archivo,
            version,
            estado_publicacion,
            creado_por: usuarioActual.id
        })
        .select()
        .single()

    if (documentoError) {
        return { error: documentoError }
    }

    const vinculos = categoriaIds.map((categoriaId) => ({
        documento_id: documento.id,
        categoria_id: categoriaId
    }))

    const {
        error: vinculosError
    } = await supabase
        .from('documento_categorias')
        .insert(vinculos)

    if (vinculosError) {
        return { error: vinculosError }
    }

    return { documento, error: null }

}

/**
 * Actualiza un documento existente y resincroniza sus categorías
 * (borra todos los vínculos viejos e inserta los nuevos).
 */
export async function actualizarDocumento(documentoId, {
    nombre,
    descripcion,
    url_archivo,
    version,
    estado_publicacion,
    categoriaIds
}) {

    const {
        error: documentoError
    } = await supabase
        .from('documentos')
        .update({
            nombre,
            descripcion,
            url_archivo,
            version,
            estado_publicacion
        })
        .eq('id', documentoId)

    if (documentoError) {
        return { error: documentoError }
    }

    const {
        error: borrarVinculosError
    } = await supabase
        .from('documento_categorias')
        .delete()
        .eq('documento_id', documentoId)

    if (borrarVinculosError) {
        return { error: borrarVinculosError }
    }

    const vinculos = categoriaIds.map((categoriaId) => ({
        documento_id: documentoId,
        categoria_id: categoriaId
    }))

    const {
        error: vinculosError
    } = await supabase
        .from('documento_categorias')
        .insert(vinculos)

    if (vinculosError) {
        return { error: vinculosError }
    }

    return { error: null }

}