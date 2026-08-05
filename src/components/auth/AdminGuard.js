'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

export default function AdminGuard({ children }) {

    const router = useRouter()

    const {
        loading,
        isAuthenticated,
        profile
    } = useAuth()

    const isAdmin = profile?.rol?.nombre === 'administrador'

    useEffect(() => {

        if (loading) return

        if (!isAuthenticated) {
            router.replace('/login')
            return
        }

        if (!isAdmin) {
            router.replace('/')
        }

    }, [loading, isAuthenticated, isAdmin, router])

    if (loading) {
        return null
    }

    if (!isAuthenticated || !isAdmin) {
        return null
    }

    return children

}