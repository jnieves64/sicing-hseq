'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function MediaFotos({ urls = [] }) {

    const [indice, setIndice] = useState(0)

    if (urls.length === 0) return null

    const esCarrusel = urls.length > 1

    const anterior = () => setIndice((i) => (i === 0 ? urls.length - 1 : i - 1))
    const siguiente = () => setIndice((i) => (i === urls.length - 1 ? 0 : i + 1))

    return (
        <div className="relative">

            <img
                src={urls[indice]}
                alt=""
                className="w-full aspect-[2/1] object-cover object-center"
            />

            {esCarrusel && (
                <>
                    <button
                        onClick={anterior}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={siguiente}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow"
                    >
                        <ChevronRight size={18} />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {urls.map((_, i) => (
                            <span
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${i === indice ? 'bg-white' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}

        </div>
    )

}