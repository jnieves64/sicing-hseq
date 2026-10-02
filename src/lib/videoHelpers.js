/**
 * Detecta si una URL es de YouTube o de Google Drive.
 * Retorna 'youtube', 'drive', o null si no coincide con ninguno.
 */
export function detectarPlataforma(url) {

    if (!url) return null

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'youtube'
    }

    if (url.includes('drive.google.com')) {
        return 'drive'
    }

    return null

}

/**
 * Extrae el ID del video de una URL de YouTube.
 * Soporta los formatos comunes: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
function extraerIdYoutube(url) {

    const patrones = [
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtu\.be\/([^?]+)/,
        /youtube\.com\/embed\/([^?]+)/
    ]

    for (const patron of patrones) {
        const match = url.match(patron)
        if (match) return match[1]
    }

    return null

}

/**
 * Extrae el ID del archivo de una URL de Google Drive.
 * Soporta el formato: drive.google.com/file/d/ID/view (o /preview, etc.)
 */
function extraerIdDrive(url) {

    const match = url.match(/\/file\/d\/([^/]+)/)
    return match ? match[1] : null

}

/**
 * Obtiene el ID del video/archivo según la plataforma detectada.
 */
export function obtenerIdVideo(url) {

    const plataforma = detectarPlataforma(url)

    if (plataforma === 'youtube') return extraerIdYoutube(url)
    if (plataforma === 'drive') return extraerIdDrive(url)

    return null

}

/**
 * Construye la URL de la miniatura del video.
 */
export function obtenerMiniatura(url) {

    const plataforma = detectarPlataforma(url)
    const id = obtenerIdVideo(url)

    if (!id) return null

    if (plataforma === 'youtube') {
        return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    }

    if (plataforma === 'drive') {
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
    }

    return null

}

/**
 * Construye la URL de embed para reproducir el video dentro de un iframe.
 */
export function obtenerUrlEmbed(url) {

    const plataforma = detectarPlataforma(url)
    const id = obtenerIdVideo(url)

    if (!id) return null

    if (plataforma === 'youtube') {
        return `https://www.youtube.com/embed/${id}?autoplay=1`
    }

    if (plataforma === 'drive') {
        return `https://drive.google.com/file/d/${id}/preview`
    }

    return null

}