'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import useAuth from '@/hooks/useAuth'
import DropdownMenu from './DropdownMenu'

export default function UserMenu() {

    const {
        loading,
        isAuthenticated,
        profile,
        logout
    } = useAuth()

    const [open, setOpen] = useState(false)

    const menuRef = useRef(null)

    /**
     * Cerrar menú al hacer click fuera
     */
    useEffect(() => {

        function handleClickOutside(event) {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false)
            }

        }

        document.addEventListener(
            'mousedown',
            handleClickOutside
        )

        return () =>
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            )

    }, [])

    /**
     * Skeleton mientras carga sesión
     */
    if (loading) {

        return (
            <div className="h-[36px] w-[140px] rounded-xl bg-gray-200 animate-pulse" />
        )

    }

    /**
     * Sin autenticación
     */
    if (!isAuthenticated) {

        return (

            <Link
                href="/login"
                className="
                    h-[36px]
                    px-4
                    rounded-xl
                    border
                    border-gray-300
                    text-sm
                    font-medium
                    hover:bg-gray-100
                    transition-all
                    flex
                    items-center
                    justify-center
                "
            >
                Iniciar Sesión
            </Link>

        )

    }

    /**
     * Usuario autenticado
     */
    return (

        <div
            ref={menuRef}
            className="relative"
        >

            <button
                onClick={() => setOpen(!open)}
                className="
                    h-[36px]
                    flex
                    items-center
                    gap-3
                    hover:bg-gray-100
                    px-2
                    rounded-xl
                    transition-all
                "
            >

                <div className="flex flex-col items-end leading-tight">

                    <span className="text-sm font-medium text-gray-900">
                        {profile?.nombre}
                    </span>

                    <span className="text-xs text-gray-500">
                        {profile?.rol?.nombre}
                    </span>

                </div>

                <div
                    className="
                        w-9
                        h-9
                        rounded-full
                        bg-gray-200
                        flex
                        items-center
                        justify-center
                        text-sm
                        font-medium
                        text-gray-600
                    "
                >

                    {profile?.nombre
                        ?.split(' ')
                        .map(nombre => nombre[0])
                        .slice(0, 2)
                        .join('')}

                </div>

                <ChevronDown
                    size={18}
                    className={`
                        text-gray-500
                        transition-transform
                        duration-200
                        ${open ? 'rotate-180' : ''}
                    `}
                />

            </button>

            {
                open && (
                    <DropdownMenu
                        onLogout={logout}
                    />
                )
            }

        </div>

    )

}