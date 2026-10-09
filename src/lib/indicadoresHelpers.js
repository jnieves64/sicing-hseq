const FORMATO_NUMERO = {
    maximumFractionDigits: 2,
    useGrouping: 'always'   // fuerza el separador de miles también en números de 4 cifras (1.500, no 1500)
}

/**
 * Formatea un valor según el formato de su columna, usando el formato colombiano
 * (punto para miles, coma para decimales).
 */
export function formatearValor(valor, formato) {

    if (valor === null || valor === undefined || valor === '') return ''

    const numero = Number(valor)

    if (formato === 'texto' || formato === undefined || Number.isNaN(numero)) {
        return String(valor)
    }

    const texto = new Intl.NumberFormat('es-CO', FORMATO_NUMERO).format(Math.abs(numero))
    const signo = numero < 0 ? '-' : ''

    if (formato === 'moneda') return `${signo}$${texto}`
    if (formato === 'porcentaje') return `${signo}${texto}%`

    return `${signo}${texto}`   // 'numero'

}

/**
 * Formato compacto para las marcas del eje Y de las gráficas (120 mil, 1,2 M).
 */
export function formatearTick(valor, formato) {

    const numero = Number(valor)

    if (Number.isNaN(numero)) return String(valor)

    const compacto = new Intl.NumberFormat('es-CO', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(numero)

    return formato === 'porcentaje' ? `${compacto}%` : compacto

}

/**
 * Fecha corta para mostrar "Actualizado el ...".
 */
export function formatearFecha(valor) {

    if (!valor) return ''

    return new Date(valor).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })

}

export const ETIQUETAS_TIPO_GRAFICA = {
    line: 'Líneas',
    bar: 'Barras',
    pie: 'Torta'
}

/**
 * Devuelve las etiquetas (sin repetir) de los tipos de gráfica que usa un indicador.
 */
export function etiquetasDeGraficas(graficas = []) {

    const tipos = [...new Set(graficas.map((grafica) => grafica.tipo))]

    return tipos
        .map((tipo) => ETIQUETAS_TIPO_GRAFICA[tipo])
        .filter(Boolean)

}

/* ============================================================
   Conversión de datos del editor de indicadores
   ============================================================ */

export const OPCIONES_FORMATO = [
    { valor: 'texto', etiqueta: 'Texto' },
    { valor: 'numero', etiqueta: 'Número' },
    { valor: 'moneda', etiqueta: 'Moneda' },
    { valor: 'porcentaje', etiqueta: 'Porcentaje' }
]

/**
 * Convierte un texto en número entendiendo el formato colombiano
 * ("$18.500,00", "-7,50%", "(1.500)") y, cuando es inequívoco, el inglés ("1,234.56").
 * Devuelve null si el texto no es un número.
 */
export function parsearNumero(entrada) {

    if (entrada === null || entrada === undefined) return null

    if (typeof entrada === 'number') {
        return Number.isFinite(entrada) ? entrada : null
    }

    let texto = String(entrada).trim()

    if (texto === '') return null

    const entreParentesis = /^\(.*\)$/.test(texto)

    // Quita símbolo de moneda, porcentaje, espacios (incluidos los duros) y paréntesis
    texto = texto.replace(/[\s$%()]/g, '')

    if (!/^-?[0-9.,]+$/.test(texto)) return null

    const negativo = entreParentesis || texto.startsWith('-')
    texto = texto.replace('-', '')

    const formatoIngles =
        /^\d{1,3}(,\d{3})+\.\d+$/.test(texto) ||
        /^\d{1,3}(,\d{3}){2,}$/.test(texto)

    if (formatoIngles) {
        texto = texto.replace(/,/g, '')
    } else if (texto.includes(',')) {
        // Coma decimal y puntos de miles: 1.234,56
        texto = texto.replace(/\./g, '').replace(',', '.')
    } else if (/^\d{1,3}(\.\d{3})+$/.test(texto)) {
        // Solo puntos en grupos de 3 dígitos: miles (18.500)
        texto = texto.replace(/\./g, '')
    }

    const numero = Number(texto)

    if (texto === '' || Number.isNaN(numero)) return null

    return negativo ? -numero : numero

}

/**
 * Número -> texto editable en la grilla (coma decimal, sin separador de miles).
 */
export function valorAEditable(valor) {

    if (valor === null || valor === undefined) return ''

    return typeof valor === 'number'
        ? String(valor).replace('.', ',')
        : String(valor)

}

/**
 * Si el texto es un número válido devuelve su forma editable canónica
 * ("$18.500,00" -> "18500"); si no, lo deja tal cual para que se vea el error.
 */
export function normalizarTextoNumerico(texto) {

    const numero = parsearNumero(texto)

    return numero === null ? texto : valorAEditable(numero)

}

/**
 * Detecta el formato de una columna a partir de los textos pegados.
 */
export function inferirFormato(textos = []) {

    const valores = textos
        .map((texto) => String(texto ?? '').trim())
        .filter((texto) => texto !== '')

    if (valores.length === 0) return 'texto'

    const numeros = valores.map(parsearNumero)

    if (numeros.some((numero) => numero === null)) return 'texto'

    // Una columna de años (2023, 2024...) es una categoría, no una cantidad
    if (valores.every((valor) => /^\d{4}$/.test(valor)) &&
        numeros.every((numero) => numero >= 1900 && numero <= 2100)) {
        return 'texto'
    }

    if (valores.every((valor) => valor.includes('%'))) return 'porcentaje'
    if (valores.every((valor) => valor.includes('$'))) return 'moneda'

    return 'numero'

}

/**
 * Texto copiado desde Excel/Sheets/una tabla web (celdas separadas por tabulación,
 * filas por salto de línea) -> matriz de textos.
 */
export function parsearPegado(texto) {

    if (!texto) return []

    const filas = texto
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')

    while (filas.length > 0 && filas[filas.length - 1].trim() === '') {
        filas.pop()
    }

    return filas.map((fila) =>
        fila.split('\t').map((celda) => {
            const limpia = celda.trim()
            if (limpia.length >= 2 && limpia.startsWith('"') && limpia.endsWith('"')) {
                return limpia.slice(1, -1).replace(/""/g, '"')
            }
            return limpia
        })
    )

}

/**
 * ¿La primera fila pegada son encabezados? Sí si toda es texto no numérico
 * y la segunda fila trae al menos un número.
 */
export function parecenEncabezados(primeraFila = [], segundaFila = []) {

    const todaEsTexto =
        primeraFila.length > 0 &&
        primeraFila.every((celda) => celda.trim() !== '' && parsearNumero(celda) === null)

    const segundaTieneNumeros = segundaFila.some((celda) => parsearNumero(celda) !== null)

    return todaEsTexto && segundaTieneNumeros

}

/**
 * Siguiente key libre para una columna nueva (col_1, col_2, ...).
 */
export function generarKeyColumna(columnas = []) {

    const maximo = columnas.reduce((max, columna) => {
        const numero = parseInt(String(columna.key).replace('col_', ''), 10)
        return Number.isNaN(numero) ? max : Math.max(max, numero)
    }, 0)

    return `col_${maximo + 1}`

}

/**
 * Filas con valores tipados (como se guardan) -> filas con textos editables.
 */
export function filasATexto(columnas = [], filas = []) {

    return filas.map((fila) => {
        const filaTexto = {}
        columnas.forEach((columna) => {
            filaTexto[columna.key] = valorAEditable(fila[columna.key])
        })
        return filaTexto
    })

}

/**
 * Valida y convierte lo que hay en la grilla a lo que se guarda en la base de datos:
 * descarta filas totalmente vacías y convierte los textos numéricos a números.
 * Devuelve { columnas, filas } o { error }.
 */
export function prepararDatosParaGuardar(columnas, filas) {

    if (columnas.some((columna) => !columna.label.trim())) {
        return { error: 'Todas las columnas deben tener un nombre.' }
    }

    const filasConDatos = filas
        .map((fila, indice) => ({ fila, numero: indice + 1 }))
        .filter(({ fila }) =>
            columnas.some((columna) => String(fila[columna.key] ?? '').trim() !== '')
        )

    if (filasConDatos.length === 0) {
        return { error: 'Agrega al menos una fila con datos.' }
    }

    const filasListas = []

    for (const { fila, numero } of filasConDatos) {

        const filaLista = {}

        for (const columna of columnas) {

            const texto = String(fila[columna.key] ?? '').trim()

            if (columna.formato === 'texto') {
                filaLista[columna.key] = texto
                continue
            }

            if (texto === '') {
                filaLista[columna.key] = null
                continue
            }

            const valor = parsearNumero(texto)

            if (valor === null) {
                return {
                    error: `Fila ${numero}, columna "${columna.label.trim()}": "${texto}" no es un número válido.`
                }
            }

            filaLista[columna.key] = valor

        }

        filasListas.push(filaLista)

    }

    return {
        columnas: columnas.map((columna) => ({
            key: columna.key,
            label: columna.label.trim(),
            formato: columna.formato
        })),
        filas: filasListas,
        error: null
    }

}

/**
 * Quita de las gráficas las referencias a columnas que ya no existen.
 */
export function limpiarGraficas(graficas = [], columnas = []) {

    const keys = new Set(columnas.map((columna) => columna.key))

    return graficas.map((grafica) => ({
        ...grafica,
        x: keys.has(grafica.x) ? grafica.x : '',
        series: (grafica.series || []).filter((key) => keys.has(key))
    }))

}