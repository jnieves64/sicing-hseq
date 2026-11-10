import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'
import {
    texto,
    validarPreguntas,
    validarCategorias,
    validarMinimo,
    guardarCategorias,
    reemplazarPreguntas,
    limpiarEvaluacion
} from '@/lib/evaluacionesServer'

export async function GET(request) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const {
        data,
        error
    } = await supabaseAdmin
        .from('evaluaciones')
        .select(`
            id,
            titulo,
            descripcion,
            codigo,
            activo,
            created_at,
            updated_at,
            evaluacion_categorias ( categorias ( id, nombre ) ),
            preguntas ( id ),
            intentos ( id, aprobado, anulado )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const evaluaciones = data.map((e) => {

        const vigentes = e.intentos.filter((i) => !i.anulado)

        return {
            id: e.id,
            titulo: e.titulo,
            descripcion: e.descripcion,
            codigo: e.codigo,
            activo: e.activo,
            created_at: e.created_at,
            updated_at: e.updated_at,
            categorias: e.evaluacion_categorias.map((ec) => ec.categorias).filter(Boolean),
            total_preguntas: e.preguntas.length,
            total_intentos: vigentes.length,
            total_aprobados: vigentes.filter((i) => i.aprobado).length,
            total_historial: e.intentos.length
        }

    })

    return NextResponse.json({ evaluaciones })

}

export async function POST(request) {

    const { autorizado, usuarioId } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()

    const titulo = texto(body.titulo)

    if (!titulo) {
        return NextResponse.json({ error: 'Debes ingresar el título.' }, { status: 400 })
    }

    const errorPreguntas = validarPreguntas(body.preguntas)

    if (errorPreguntas) {
        return NextResponse.json({ error: errorPreguntas }, { status: 400 })
    }

    const errorCategorias = validarCategorias(body.categorias)

    if (errorCategorias) {
        return NextResponse.json({ error: errorCategorias }, { status: 400 })
    }

    // Si no se envía el mínimo, se exige acertar todas las preguntas
    const totalPreguntas = body.preguntas.length
    const minimo = body.min_correctas === undefined
        ? totalPreguntas
        : Number(body.min_correctas)

    const errorMinimo = validarMinimo(minimo, totalPreguntas)

    if (errorMinimo) {
        return NextResponse.json({ error: errorMinimo }, { status: 400 })
    }

    const {
        data: evaluacion,
        error: evaluacionError
    } = await supabaseAdmin
        .from('evaluaciones')
        .insert({
            titulo,
            descripcion: texto(body.descripcion) || null,
            codigo: texto(body.codigo) || null,
            activo: body.activo === true,
            min_correctas: minimo,
            creado_por: usuarioId
        })
        .select()
        .single()

    if (evaluacionError) {
        return NextResponse.json({ error: evaluacionError.message }, { status: 400 })
    }

    const { error: categoriasError } = await guardarCategorias(
        evaluacion.id,
        body.categorias || []
    )

    if (categoriasError) {
        await limpiarEvaluacion(evaluacion.id)
        return NextResponse.json({ error: categoriasError }, { status: 400 })
    }

    const { error: preguntasError } = await reemplazarPreguntas(
        evaluacion.id,
        body.preguntas
    )

    if (preguntasError) {
        await limpiarEvaluacion(evaluacion.id)
        return NextResponse.json({ error: preguntasError }, { status: 400 })
    }

    return NextResponse.json({ evaluacion })

}