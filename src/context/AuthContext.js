'use client'

import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

import { useEffect } from 'react'

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

    const login = async (email, password) => {

        const { data, error } = await loginService(
            email,
            password
        )

        return {
            data,
            error
        }

    }

    const logout = async () => {

        await logoutService()
    
    }

    const refreshSession = async () => {

        setLoading(true)

        const {
            session,
            error
        } = await getSession()


        if (error || !session) {

            setSession(null)
            setAuthUser(null)
            setProfile(null)

            setIsAuthenticated(false)
            setLoading(false)

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
            setLoading(false)

            return
        }

        setSession(session)
        setAuthUser(session.user)

        setProfile(profile)

        setIsAuthenticated(true)

        setLoading(false)

    }

    useEffect(() => {

        // Verifica si existe una sesión al iniciar la aplicación
        refreshSession()

        // Escucha cambios en la autenticación
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((event) => {

            console.log(event)

            refreshSession()

        })

        // Limpia la suscripción al desmontar el Provider
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
                refreshSession,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

