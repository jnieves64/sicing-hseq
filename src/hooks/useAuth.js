'use client'

import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

export default function useAuth() {

    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            'useAuth debe utilizarse dentro de un AuthProvider'
        )
    }

    return context

}