import { Calendar } from 'lucide-react'

import MediaFotos from './MediaFotos'
import MediaVideo from './MediaVideo'

export default function PublicacionCard({ publicacion }) {

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

            {publicacion.tipo === 'video' ? (
                <MediaVideo url={publicacion.medios[0]?.url} />
            ) : (
                <MediaFotos urls={publicacion.medios.map((m) => m.url)} />
            )}

            <div className="p-5 space-y-3">

                <p className="text-sm text-gray-800 leading-relaxed">
                    {publicacion.descripcion}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={14} />
                    <span>Publicado el {publicacion.fecha}</span>
                </div>

            </div>

        </div>
    )

}