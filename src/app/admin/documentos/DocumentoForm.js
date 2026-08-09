'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import CategoriaCheckboxGroup from './CategoriaCheckboxGroup'

export default function DocumentoForm({
    documento,        // undefined = modo creación, objeto = modo edición
    categorias,
    onSubmit,          // recibe { nombre, descripcion, url_archivo, version, estado_publicacion, categoriaIds }
}) {

    const router = useRouter()
    const esEdicion = Boolean(documento)

    const [nombre, setNombre] = useState(documento?.nombre || '')
    const [descripcion, setDescripcion] = useState(documento?.descripcion || '')
    const [urlArchivo, setUrlArchivo] = useState(documento?.url_archivo || '')
    const [version, setVersion] = useState(documento?.version || '')
    const [estado, setEstado] = useState(documento?.estado_publicacion || 'activo')
    const [categoriaIds, setCategoriaIds] = useState(
        documento?.categorias?.map((c) => c.id) || []
    )

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {

        event.preventDefault()
        setError('')

        if (!nombre.trim()) {
            setError('Debes ingresar el nombre del documento.')
            return
        }

        if (!urlArchivo.trim()) {
            setError('Debes ingresar la URL del archivo.')
            return
        }

        if (categoriaIds.length === 0) {
            setError('Debes seleccionar al menos una categoría.')
            return
        }

        setLoading(true)

        const { error } = await onSubmit({
            nombre,
            descripcion,
            url_archivo: urlArchivo,
            version,
            estado_publicacion: estado,
            categoriaIds
        })

        setLoading(false)

        if (error) {
            setError('No se pudo guardar el documento. Intenta de nuevo.')
            return
        }

        router.push('/admin/documentos')

    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">

            {/* Información del documento */}
            <div className="space-y-5">

                <h2 className="text-base font-semibold text-black">Información del documento</h2>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Nombre del documento</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(event) => setNombre(event.target.value)}
                        disabled={loading}
                        placeholder="Ej. Procedimiento para trabajo seguro en alturas"
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(event) => setDescripcion(event.target.value)}
                        disabled={loading}
                        rows={3}
                        placeholder="Describe brevemente el contenido y propósito del documento..."
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60 resize-none"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">URL del archivo</label>
                    <input
                        type="url"
                        value={urlArchivo}
                        onChange={(event) => setUrlArchivo(event.target.value)}
                        disabled={loading}
                        placeholder="https://drive.google.com/..."
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                    />
                    <p className="text-xs text-gray-400">Ingresa el link público de Google Drive donde está el archivo.</p>
                </div>

            </div>

            {/* Configuración del documento */}
            <div className="space-y-5">

                <h2 className="text-base font-semibold text-black">Configuración del documento</h2>

                <div className="grid grid-cols-2 gap-6">

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Versión</label>
                        <input
                            type="text"
                            value={version}
                            onChange={(event) => setVersion(event.target.value)}
                            disabled={loading}
                            placeholder="Ej. 01"
                            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                        />
                        <p className="text-xs text-gray-400">Indica la versión actual del documento.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Estado de publicación</label>
                        <select
                            value={estado}
                            onChange={(event) => setEstado(event.target.value)}
                            disabled={loading}
                            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>

                </div>

            </div>

            {/* Categorías */}
            <div className="space-y-3">
                <h2 className="text-base font-semibold text-black">Categorías</h2>
                <p className="text-sm text-gray-500">Categoría del documento</p>

                <CategoriaCheckboxGroup
                    categorias={categorias}
                    selected={categoriaIds}
                    onChange={setCategoriaIds}
                />

                <p className="text-xs text-gray-400">Selecciona una o más categorías asociadas al documento.</p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.push('/admin/documentos')}
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
                        : esEdicion ? 'Guardar cambios' : 'Registrar documento'
                    }
                </button>
            </div>

        </form>
    )

}