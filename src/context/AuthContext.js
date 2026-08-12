'use client'

import { createContext, useState, useEffect, useRef } from 'react'

export const AuthContext = createContext(null)

import {
    login as loginService,
    logout as logoutService,
    getSession,
    getProfile
} from '@/services/authService'

import { supabase } from '@/lib/supabase'

export function AuthProvider({ children }) {

    // Sesión de Supabase
    const [session, setSession] = useState(null)

    // Usuario autenticado (auth.users)
    const [authUser, setAuthUser] = useState(null)

    // Perfil de la tabla usuarios
    const [profile, setProfile] = useState(null)

    // Estado de carga inicial
    const [loading, setLoading] = useState(true)

    // Estado de autenticación
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Usuario autenticado en Supabase pero aún no aprobado por un administrador
    const [pendingApproval, setPendingApproval] = useState(false)

    const isManualAuthAction = useRef(false)

    const login = async (email, password) => {

        isManualAuthAction.current = true

        try {

            const { data, error } = await loginService(email, password)

            if (error || !data?.session) {
                return { error, pendingApproval: false }
            }

            const { profile, error: profileError } = await getProfile(data.session.user.id)

            if (profileError || !profile) {
                return { error: profileError, pendingApproval: false }
            }

            if (!profile.aprobado) {

                await logoutService()

                setSession(null)
                setAuthUser(null)
                setProfile(null)

                setIsAuthenticated(false)
                setPendingApproval(true)
                setLoading(false)

                return { error: null, pendingApproval: true }
            }

            setSession(data.session)
            setAuthUser(data.session.user)
            setProfile(profile)

            setIsAuthenticated(true)
            setPendingApproval(false)
            setLoading(false)

            return { error: null, pendingApproval: false }

        } finally {

            isManualAuthAction.current = false

        }

    }

    const logout = async () => {

        await logoutService()

    }

    const refreshSession = async (opciones = {}) => {

        const silencioso = opciones.silencioso === true

        if (!silencioso) {
            setLoading(true)
        }

        const {
            session,
            error
        } = await getSession()


        if (error || !session) {

            setSession(null)
            setAuthUser(null)
            setProfile(null)

            setIsAuthenticated(false)
            setPendingApproval(false)

            if (!silencioso) {
                setLoading(false)
            }

            return
        }

        const {
            profile,
            error: profileError
        } = await getProfile(session.user.id)


        if (profileError || !profile) {

            setSession(null)
            setAuthUser(null)
            setProfile(null)

            setIsAuthenticated(false)
            setPendingApproval(false)

            if (!silencioso) {
                setLoading(false)
            }

            return
        }

        if (!profile.aprobado) {

            await logoutService()

            setSession(null)
            setAuthUser(null)
            setProfile(null)

            setIsAuthenticated(false)
            setPendingApproval(true)

            if (!silencioso) {
                setLoading(false)
            }

            return
        }

        setSession(session)
        setAuthUser(session.user)

        setProfile(profile)

        setIsAuthenticated(true)
        setPendingApproval(false)

        if (!silencioso) {
            setLoading(false)
        }

    }

    useEffect(() => {

        // Única llamada que sí debe mostrar el estado de carga completo:
        // la verificación inicial de sesión al montar la app.
        refreshSession()

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((event) => {

            console.log(event)

            if (isManualAuthAction.current) {
                return
            }

            // Cualquier evento disparado por el listener después del montaje
            // inicial (incluyendo SIGNED_IN al recuperar el foco de la pestaña,
            // que es justamente nuestro caso) se maneja en silencio: actualiza
            // session/profile sin tocar `loading`, para no desmontar los guards
            // y perder el progreso del usuario en formularios abiertos.
            refreshSession({ silencioso: true })

        })

        return () => {
            subscription.unsubscribe()
        }

    }, [])

    const value = {

        // Estados

        session,
        authUser,
        profile,
        loading,
        isAuthenticated,

        // Setters
        // Se exponen para que authService pueda actualizar el contexto

        setSession,
        setAuthUser,
        setProfile,
        setLoading,
        setIsAuthenticated,

        // Funciones

        login,
        logout,
        refreshSession

    }

    return (
        <AuthContext.Provider
            value={{
                loading,
                session,
                profile,
                isAuthenticated,
                pendingApproval,
                refreshSession,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

