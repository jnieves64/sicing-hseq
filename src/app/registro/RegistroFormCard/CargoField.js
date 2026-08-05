'use client'

import { useEffect, useState } from 'react'
import { getCargos } from '@/services/usuariosService'

export default function CargoField({ value, disabled, onChange }) {

    const [cargos, setCargos] = useState([])

    useEffect(() => {

        const loadCargos = async () => {
            const { cargos } = await getCargos()
            setCargos(cargos)
        }

        loadCargos()

    }, [])

    return (
        <div className="flex flex-col gap-2">

            <label
                htmlFor="cargo"
                className="text-sm font-medium text-black"
            >
                Cargo
            </label>

            <select
                id="cargo"
                value={value}
                disabled={disabled}
                onChange={onChange}
                className="
                    w-full
                    h-12
                    px-4
                    rounded-lg
                    border
                    border-gray-400
                    bg-gray-100
                    text-black
                    text-sm
                    outline-none
                    transition-colors
                    focus:border-primary
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                "
            >
                <option value="">Selecciona tu cargo</option>
                {cargos.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                        {cargo.nombre}
                    </option>
                ))}
            </select>

        </div>
    )

}