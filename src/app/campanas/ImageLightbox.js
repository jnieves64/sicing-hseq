'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ImageLightbox({ urls, indiceInicial, onClose }) {

    const [indice, setIndice] = useState(indiceInicial)

    const anterior = () => setIndice((i) => (i === 0 ? urls.length - 1 : i - 1))
    const siguiente = () => setIndice((i) => (i === urls.length - 1 ? 0 : i + 1))

    useEffect(() => {

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose()
            if (event.key === 'ArrowLeft') anterior()
            if (event.key === 'ArrowRight') siguiente()
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)

    }, [])

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
        >

            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
                <X size={22} />
            </button>

            <img
                src={urls[indice]}
                alt=""
                onClick={(event) => event.stopPropagation()}
                className="max-w-full max-h-full object-contain"
            />

            {urls.length > 1 && (
                <>
                    <button
                        onClick={(event) => { event.stopPropagation(); anterior() }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <button
                        onClick={(event) => { event.stopPropagation(); siguiente() }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                        <ChevronRight size={22} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {urls.map((_, i) => (
                            <span
                                key={i}
                                className={`w-2 h-2 rounded-full ${i === indice ? 'bg-white' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                </>
            )}

        </div>
    )

}