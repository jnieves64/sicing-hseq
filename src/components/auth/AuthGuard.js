'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import { getModuloByRuta } from '@/services/modulosService'

export default function AuthGuard({ ruta, children }) {

    const router = useRouter()

    const {
        loading: authLoading,
        isAuthenticated
    } = useAuth()

    // Estado de la consulta a la tabla `modulos`
    const [modulo, setModulo] = useState(null)
    const [moduloLoading, setModuloLoading] = useState(true)
    const [moduloError, setModuloError] = useState(false)

    useEffect(() => {

        let active = true

        const loadModulo = async () => {

            setModuloLoading(true)

            const { modulo, error } = await getModuloByRuta(ruta)

            if (!active) return

            if (error || !modulo) {
                setModulo(null)
                setModuloError(true)
                setModuloLoading(false)
                return
            }

            setModulo(modulo)
            setModuloError(false)
            setModuloLoading(false)

        }

        loadModulo()

        return () => {
            active = false
        }

    }, [ruta])

    // true si el módulo requiere sesión activa
    const requiresAuth = moduloError || modulo?.publico === false

    const loading = authLoading || moduloLoading

    useEffect(() => {

        if (loading) return

        if (requiresAuth && !isAuthenticated) {
            router.replace(`/login?redirect=${encodeURIComponent(ruta)}&reason=session_required`)
        }

    }, [loading, requiresAuth, isAuthenticated, router, ruta])

    if (loading) {
        return null
    }

    if (requiresAuth && !isAuthenticated) {
        return null
    }

    return children

}