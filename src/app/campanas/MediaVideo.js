'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

import {
    detectarPlataforma,
    obtenerIdVideo,
    obtenerMiniatura,
    obtenerUrlEmbed
} from '@/lib/videoHelpers'

export default function MediaVideo({ url }) {

    const [reproduciendo, setReproduciendo] = useState(false)
    const [miniaturaRota, setMiniaturaRota] = useState(false)

    const plataforma = detectarPlataforma(url)
    const id = obtenerIdVideo(url)

    if (!plataforma || !id) return null

    if (reproduciendo) {
        return (
            <iframe
                src={obtenerUrlEmbed(url)}
                className="w-full aspect-[2/1]"
                allow="autoplay; encrypted-media"
                allowFullScreen
            />
        )
    }

    // Si la miniatura de alta resolución falla (maxresdefault no siempre
    // existe en YouTube), caemos a hqdefault, que sí existe siempre.
    const miniatura = miniaturaRota && plataforma === 'youtube'
        ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
        : obtenerMiniatura(url)

    return (
        <button
            onClick={() => setReproduciendo(true)}
            className="relative w-full aspect-[2/1] block"
        >

            <img
                src={miniatura}
                alt=""
                onError={() => setMiniaturaRota(true)}
                className="w-full h-full object-cover object-center"
            />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Play size={28} className="text-black ml-1" fill="black" />
                </div>
            </div>

            <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                Video
            </span>

        </button>
    )

}