'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { showToast } from 'nextjs-toast-notify'

export default function LoginNotice() {

    const searchParams = useSearchParams()

    useEffect(() => {

        const reason = searchParams.get('reason')

        if (reason === 'session_required') {

            showToast.warning('Debes iniciar sesión para acceder a este módulo.', {
                position: 'top-center',
                progress: true
            })

        }

    }, [searchParams])

    return null

}