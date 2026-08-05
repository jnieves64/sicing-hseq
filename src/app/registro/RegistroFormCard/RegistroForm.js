'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { registrarUsuario } from '@/services/usuariosService'

import RegistroTitle from './RegistroTitle'
import NombreField from './NombreField'
import EmailField from '../../login/EmailField'
import PasswordField from '../../login/PasswordField'
import CargoField from './CargoField'
import SubmitButton from '../../login/SubmitButton'

export default function RegistroForm() {

    const router = useRouter()

    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cargoId, setCargoId] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [enviado, setEnviado] = useState(false)

    const handleSubmit = async (event) => {

        event.preventDefault()
        setError('')

        if (!nombre.trim()) {
            setError('Debes ingresar tu nombre.')
            return
        }

        if (!email.trim()) {
            setError('Debes ingresar tu correo.')
            return
        }

        if (!password.trim()) {
            setError('Debes ingresar tu contraseña.')
            return
        }

        if (!cargoId) {
            setError('Debes seleccionar tu cargo.')
            return
        }

        setLoading(true)

        const { error } = await registrarUsuario({
            nombre,
            email,
            password,
            cargo_id: cargoId
        })

        setLoading(false)

        if (error) {
            setError('No se pudo completar el registro. Intenta de nuevo.')
            return
        }

        setEnviado(true)

    }

    if (enviado) {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-gray-700">
                    Tu solicitud fue enviada. Un administrador la revisará pronto.
                </p>
                <button
                    onClick={() => router.push('/login')}
                    className="text-blue-600 hover:underline text-sm"
                >
                    Volver a inicio de sesión
                </button>
            </div>
        )
    }

    return (

        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
        >

            <RegistroTitle />

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <NombreField
                value={nombre}
                disabled={loading}
                onChange={(event) => setNombre(event.target.value)}
            />

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

            <CargoField
                value={cargoId}
                disabled={loading}
                onChange={(event) => setCargoId(event.target.value)}
            />

            <div className="flex justify-center pt-2">
                <SubmitButton
                    loading={loading}
                    label="Registrarme"
                    loadingLabel="Registrando..."
                />
            </div>

        </form>

    )

}