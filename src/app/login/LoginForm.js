'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import useAuth from '@/hooks/useAuth'

import LoginTitle from './LoginTitle'
import EmailField from './EmailField'
import PasswordField from './PasswordField'
import SubmitButton from './SubmitButton'

export default function LoginForm() {

    const router = useRouter()

    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {

        event.preventDefault()

        setError('')

        if (!email.trim()) {
            setError('Debes ingresar tu correo.')
            return
        }

        if (!password.trim()) {
            setError('Debes ingresar tu contraseña.')
            return
        }

        setLoading(true)

        const { error } = await login(email, password)

        setLoading(false)

        if (error) {
            setError('Correo o contraseña incorrectos.')
            return
        }

        router.push('/')

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
        >

            <LoginTitle />

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <EmailField
                value={email}
                disabled={loading}
                onChange={(event) => setEmail(event.target.value)}
            />

            <PasswordField
                value={password}
                disabled={loading}
                onChange={(event) => setPassword(event.target.value)}
            />

            <div className="flex justify-center pt-2">

                <SubmitButton
                    loading={loading}
                />

            </div>

        </form>

    )

}