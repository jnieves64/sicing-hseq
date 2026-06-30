"use client";

import { LogOut } from "lucide-react";
import { useRouter } from 'next/navigation'

export default function DropdownMenu({
    onLogout
}) {

    const router = useRouter()

    const handleLogout = async () => {

        await onLogout()
    
        router.push('/')
    
    }

    return (
        <div
            className="
                absolute
                top-full
                right-0
                mt-2
                w-64
                bg-white
                rounded-2xl
                shadow-xl
                border
                border-gray-200
                overflow-hidden
                z-50
            "
        >

            {/* Encabezado (reservado para futuras opciones) */}
            <div
                className="
                    px-5
                    py-3
                    border-b
                    border-gray-100
                "
            >
                <span className="text-sm font-medium text-gray-800">
                    Mi Cuenta
                </span>
            </div>

            {/* Acciones */}
            <div className="py-2">

                <button
                    onClick={handleLogout}
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-5
                        py-3
                        text-red-600
                        hover:bg-red-50
                        transition-colors
                    "
                >
                    <LogOut size={18} />

                    <span className="text-sm font-medium">
                        Cerrar Sesión
                    </span>

                </button>

            </div>

        </div>
    );

}