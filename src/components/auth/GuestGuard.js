'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

export default function GuestGuard({ children }) {

    const router = useRouter()
    const searchParams = useSearchParams()

    const {
        loading,
        isAuthenticated
    } = useAuth()

    useEffect(() => {

        if (!loading && isAuthenticated) {

            const redirect = searchParams.get('redirect')

            router.replace(redirect || '/')

        }

    }, [loading, isAuthenticated, router, searchParams])

    if (loading) {
        return null
    }

    if (isAuthenticated) {
        return null
    }

    return children

}