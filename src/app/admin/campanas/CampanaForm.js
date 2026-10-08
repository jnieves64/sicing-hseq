'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'

export default function CampanaForm({
    campana,
    onSubmit,
}) {

    const router = useRouter()
    const esEdicion = Boolean(campana)

    const [descripcion, setDescripcion] = useState(campana?.descripcion || '')
    const [tipo, setTipo] = useState(campana?.tipo || 'foto')
    const [activo, setActivo] = useState(campana?.activo ?? true)
    const [urls, setUrls] = useState(
        campana?.medios?.length > 0
            ? campana.medios.map((m) => m.url)
            : ['']
    )

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleTipoChange = (nuevoTipo) => {
        setTipo(nuevoTipo)
        // Al cambiar a video, solo debe quedar un input de URL
        if (nuevoTipo === 'video') {
            setUrls([urls[0] || ''])
        }
    }

    const handleUrlChange = (index, value) => {
        const nuevasUrls = [...urls]
        nuevasUrls[index] = value
        setUrls(nuevasUrls)
    }

    const agregarUrl = () => {
        setUrls([...urls, ''])
    }

    const quitarUrl = (index) => {
        setUrls(urls.filter((_, i) => i !== index))
    }

    const handleSubmit = async (event) => {

        event.preventDefault()
        setError('')

        if (!descripcion.trim()) {
            setError('Debes ingresar una descripción.')
            return
        }

        const urlsLimpias = urls.map((u) => u.trim()).filter(Boolean)

        if (urlsLimpias.length === 0) {
            setError(tipo === 'video' ? 'Debes ingresar la URL del video.' : 'Debes ingresar al menos una URL de foto.')
            return
        }

        setLoading(true)

        const { error } = await onSubmit({
            descripcion,
            tipo,
            activo,
            urls: urlsLimpias
        })

        setLoading(false)

        if (error) {
            setError('No se pudo guardar la publicación. Intenta de nuevo.')
            return
        }

        router.push('/admin/campanas')

    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 space-y-8">

            {/* Información de la publicación */}
            <div className="space-y-5">

                <h2 className="text-base font-semibold text-black">Información de la publicación</h2>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(event) => setDescripcion(event.target.value)}
                        disabled={loading}
                        rows={3}
                        placeholder="Describe brevemente el contenido de la publicación..."
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60 resize-none"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <select
                        value={activo ? 'activo' : 'inactivo'}
                        onChange={(event) => setActivo(event.target.value === 'activo')}
                        disabled={loading}
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60 max-w-xs"
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

            </div>

            {/* Contenido multimedia */}
            <div className="space-y-5">

                <h2 className="text-base font-semibold text-black">Contenido multimedia</h2>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Tipo de contenido</label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => handleTipoChange('foto')}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                tipo === 'foto'
                                    ? 'border-[#ebbb18] bg-[#ebbb18]/10 text-black'
                                    : 'border-gray-300 text-gray-600'
                            }`}
                        >
                            Fotos
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTipoChange('video')}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                tipo === 'video'
                                    ? 'border-[#ebbb18] bg-[#ebbb18]/10 text-black'
                                    : 'border-gray-300 text-gray-600'
                            }`}
                        >
                            Video
                        </button>
                    </div>
                </div>

                {tipo === 'foto' ? (
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-gray-700">URLs de las fotos</label>

                        {urls.map((url, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(event) => handleUrlChange(index, event.target.value)}
                                    disabled={loading}
                                    placeholder="https://..."
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                                />
                                {urls.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => quitarUrl(index)}
                                        disabled={loading}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 shrink-0"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={agregarUrl}
                            disabled={loading}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black w-fit"
                        >
                            <Plus size={16} />
                            Agregar otra foto
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">URL del video</label>
                        <input
                            type="url"
                            value={urls[0] || ''}
                            onChange={(event) => handleUrlChange(0, event.target.value)}
                            disabled={loading}
                            placeholder="https://youtube.com/watch?v=... o https://drive.google.com/file/d/..."
                            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                        />
                        <p className="text-xs text-gray-400">Soporta links de YouTube o Google Drive.</p>
                    </div>
                )}

            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.push('/admin/campanas')}
                    disabled={loading}
                    className="text-sm font-medium px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="text-sm font-medium px-6 py-2.5 rounded-lg bg-[#ebbb18] hover:brightness-95 disabled:opacity-60"
                >
                    {loading
                        ? 'Guardando...'
                        : esEdicion ? 'Guardar cambios' : 'Publicar'
                    }
                </button>
            </div>

        </form>
    )

}