'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import Header from '@/components/layout/Header'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import PageHeader from '@/components/shared/PageHeader'
import PreguntaPresentar from './PreguntaPresentar'
import ResultadoEvaluacion from './ResultadoEvaluacion'
import {
  getEvaluacionParaPresentar,
  enviarRespuestas
} from '@/services/evaluacionesService'

export default function PresentarEvaluacionView() {

  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [data, setData] = useState(null)

  const [respuestas, setRespuestas] = useState({})   // { [preguntaId]: opcionId }
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [resultadoFinal, setResultadoFinal] = useState(null)

  const cargar = useCallback(async () => {

    const { dato, error, status } = await getEvaluacionParaPresentar(id)

    if (error) {
      setErrorCarga(
        status === 404
          ? 'Esta evaluación no está disponible.'
          : 'No se pudo cargar la evaluación.'
      )
      setLoading(false)
      return
    }

    setData(dato)
    setRespuestas({})
    setResultadoFinal(null)
    setLoading(false)

  }, [id])

  useEffect(() => {
    cargar()
  }, [cargar])

  const irAlInicio = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">Cargando evaluación...</p>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <p className="text-sm text-red-600">{errorCarga}</p>
          <Link href="/evaluaciones" className="text-sm font-medium text-primary hover:underline">
            Volver a evaluaciones
          </Link>
        </main>
      </div>
    );
  }

  const { evaluacion, preguntas, esAdmin } = data
  const resultado = resultadoFinal || data.resultado

  const total = preguntas?.length || 0
  const respondidas = Object.keys(respuestas).length
  const faltan = total - respondidas

  const handleSeleccionar = (preguntaId, opcionId) => {
    setRespuestas((actuales) => ({ ...actuales, [preguntaId]: opcionId }))
  }

  const handleEnviar = async () => {

    if (faltan > 0 || enviando) return

    if (!esAdmin && !window.confirm(
      'Solo tienes un intento para esta evaluación y no podrás cambiar tus respuestas. ¿Enviar ahora?'
    )) {
      return
    }

    setEnviando(true)
    setErrorEnvio('')

    const payload = preguntas.map((p) => ({
      preguntaId: p.id,
      opcionIds: [respuestas[p.id]]
    }))

    const { dato, error, status } = await enviarRespuestas(id, payload)

    setEnviando(false)

    if (error) {

      // Ya existía un intento (por ejemplo, otra pestaña): se muestra su resultado
      if (status === 409) {
        await cargar()
        return
      }

      setErrorEnvio(error)
      return

    }

    setResultadoFinal(dato.resultado)
    irAlInicio()

  }

  const handleReiniciar = () => {
    setResultadoFinal(null)
    setRespuestas({})
    setErrorEnvio('')
    irAlInicio()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Evaluaciones', href: '/evaluaciones' },
            { label: evaluacion.titulo }
          ]}
        />

        <PageHeader
          title={evaluacion.titulo}
          description={evaluacion.descripcion || ''}
        />

        {/* Aviso para administradores */}
        {esAdmin && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            Vista previa para administradores: tus respuestas no se guardan.
            {!evaluacion.activo && ' Esta evaluación está en borrador y los usuarios todavía no la ven.'}
          </div>
        )}

        {resultado ? (

          <ResultadoEvaluacion
            resultado={resultado}
            onReintentar={resultado.vistaPrevia ? handleReiniciar : null}
          />

        ) : (

          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleEnviar()
            }}
            className="space-y-6"
          >

            <p className="text-sm text-gray-600">
              {total} pregunta{total === 1 ? '' : 's'}. Para aprobar debes responder correctamente todas.
              {!esAdmin && ' Solo tienes un intento.'}
            </p>

            {preguntas.map((pregunta, index) => (
              <PreguntaPresentar
                key={pregunta.id}
                pregunta={pregunta}
                numero={index + 1}
                seleccionada={respuestas[pregunta.id]}
                onSeleccionar={(opcionId) => handleSeleccionar(pregunta.id, opcionId)}
                disabled={enviando}
              />
            ))}

            {errorEnvio && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {errorEnvio}
              </div>
            )}

            <div
              className="
                bg-white

                border
                border-gray-300

                rounded-2xl

                p-5

                flex
                flex-col
                sm:flex-row

                sm:items-center
                sm:justify-between

                gap-4
              "
            >

              <p className="text-sm text-gray-600">
                {faltan > 0
                  ? `Respondidas ${respondidas} de ${total}. Faltan ${faltan}.`
                  : `Respondidas ${respondidas} de ${total}. Ya puedes enviar.`}
              </p>

              <button
                type="submit"
                disabled={faltan > 0 || enviando}
                className="
                  h-11

                  px-6

                  rounded-xl

                  bg-primary

                  text-sm
                  font-medium
                  text-white

                  transition-all
                  duration-200

                  hover:opacity-90

                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                {enviando ? 'Enviando...' : 'Enviar evaluación'}
              </button>

            </div>

          </form>

        )}

      </main>
    </div>
  );
}