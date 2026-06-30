'use client'

import { useState } from 'react'

export default function PasswordField({
  value,
  onChange,
  disabled = false
}) {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-2">

      <label
        htmlFor="password"
        className="text-sm font-medium text-black"
      >
        Contraseña
      </label>

      <div className="relative">

        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="Ingresa tu contraseña"
          autoComplete="current-password"
          className="
            w-full
            h-12
            px-4
            pr-12
            rounded-lg
            border
            border-gray-400
            bg-gray-100
            text-black
            text-sm
            outline-none
            transition-colors
            focus:border-primary
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword(!showPassword)}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-gray-600
            hover:text-black
            transition-colors
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          aria-label={
            showPassword
              ? 'Ocultar contraseña'
              : 'Mostrar contraseña'
          }
        >

          {showPassword ? (

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83M9.88 5.09A10.94 10.94 0 0112 4.91c5.05 0 9.27 3.11 10.5 7.5a11.8 11.8 0 01-2.21 3.59M6.23 6.23A11.76 11.76 0 001.5 12.41c1.23 4.39 5.45 7.5 10.5 7.5 1.61 0 3.15-.31 4.55-.88"
              />
            </svg>

          ) : (

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12S5.25 5.25 12 5.25 21.75 12 21.75 12 18.75 18.75 12 18.75 2.25 12 2.25 12z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

          )}

        </button>

      </div>

    </div>
  )

}