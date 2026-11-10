import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'

export async function GET(request, { params }) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const evaluacionId = Number(id)

    if (!Number.isInteger(evaluacionId)) {
        return NextResponse.json({ error: 'Identificador no válido' }, { status: 400 })
    }

    const {
        data: evaluacion,
        error: evaluacionError
    } = await supabaseAdmin
        .from('evaluaciones')
        .select('id, titulo, codigo, activo, min_correctas, preguntas ( id )')
        .eq('id', evaluacionId)
        .maybeSingle()

    if (evaluacionError) {
        return NextResponse.json({ error: evaluacionError.message }, { status: 400 })
    }

    if (!evaluacion) {
        return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 })
    }

    const [intentosRes, usuariosRes, cargosRes] = await Promise.all([
        supabaseAdmin
            .from('intentos')
            .select('id, usuario_id, puntaje, puntaje_maximo, aprobado, anulado, respuestas, created_at')
            .eq('evaluacion_id', evaluacionId)
            .order('created_at', { ascending: false }),
        supabaseAdmin
            .from('usuarios')
            .select('id, nombre, cargo_id, roles(nombre)')
            .eq('aprobado', true),
        supabaseAdmin
            .from('cargos')
            .select('id, nombre')
    ])

    const errorConsulta = intentosRes.error || usuariosRes.error || cargosRes.error

    if (errorConsulta) {
        return NextResponse.json({ error: errorConsulta.message }, { status: 400 })
    }

    const cargos = new Map(cargosRes.data.map((c) => [c.id, c.nombre]))
    const usuarios = new Map(usuariosRes.data.map((u) => [u.id, u]))

    const cargoDe = (usuario) => (usuario ? cargos.get(usuario.cargo_id) || null : null)

    // Intentos anulados por usuario (historial)
    const previos = new Map()

    intentosRes.data
        .filter((i) => i.anulado)
        .forEach((i) => previos.set(i.usuario_id, (previos.get(i.usuario_id) || 0) + 1))

    const vigentes = intentosRes.data.filter((i) => !i.anulado)
    const conVigente = new Set(vigentes.map((i) => i.usuario_id))

    const resultados = vigentes.map((i) => {

        const usuario = usuarios.get(i.usuario_id)

        return {
            intento_id: i.id,
            usuario_id: i.usuario_id,
            nombre: usuario?.nombre || 'Usuario no disponible',
            cargo: cargoDe(usuario),
            puntaje: i.puntaje,
            puntaje_maximo: i.puntaje_maximo,
            aprobado: i.aprobado,
            fecha: i.created_at,
            intentos_previos: previos.get(i.usuario_id) || 0,
            respuestas: Array.isArray(i.respuestas) ? i.respuestas : []
        }

    })

    // Pendientes: usuarios aprobados con rol visualizador sin resultado vigente
    const pendientes = usuariosRes.data
        .filter((u) => u.roles?.nombre === 'visualizador' && !conVigente.has(u.id))
        .map((u) => ({
            usuario_id: u.id,
            nombre: u.nombre,
            cargo: cargoDe(u),
            intentos_previos: previos.get(u.id) || 0
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

    return NextResponse.json({
        evaluacion: {
            id: evaluacion.id,
            titulo: evaluacion.titulo,
            codigo: evaluacion.codigo,
            activo: evaluacion.activo,
            min_correctas: evaluacion.min_correctas,
            total_preguntas: evaluacion.preguntas.length
        },
        resultados,
        pendientes
    })

}