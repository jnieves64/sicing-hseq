const FORMATO_NUMERO = {
    maximumFractionDigits: 2,
    useGrouping: 'always'   // fuerza el separador de miles también en números de 4 cifras (1.500, no 1500)
}

const REGEX_ERROR_HOJA = /^#(¡|¿)?(DIV\/0|N\/A|N\/D|VALUE|VALOR|REF|NAME|NOMBRE|NUM|NULL|NULO)(!|\?)?$/i

/**
 * ¿Es un error de fórmula de Excel/Sheets? (#¡DIV/0!, #N/A, #VALUE!...)
 */
export function esErrorDeHoja(texto) {
    return REGEX_ERROR_HOJA.test(String(texto ?? '').trim())
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

            let limpia = celda.trim()

            if (limpia.length >= 2 && limpia.startsWith('"') && limpia.endsWith('"')) {
                limpia = limpia.slice(1, -1).replace(/""/g, '"')
            }

            return esErrorDeHoja(limpia) ? '' : limpia

        })
    )

}

/**
 * ¿La primera fila pegada son encabezados? Sí si toda es texto no numérico
 * y la segunda fila trae al menos un número.
 */
export function parecenEncabezados(primeraFila = [], segundaFila = []) {

    if (primeraFila.length < 2) return false

    const esAnio = (celda) => /^(19|20)\d{2}$/.test(celda.trim())
    const esEtiqueta = (celda) =>
        celda.trim() !== '' && (parsearNumero(celda) === null || esAnio(celda))

    const primera = primeraFila[0]
    const primeraEsValida = primera.trim() === '' || parsearNumero(primera) === null
    const restoEsValido = primeraFila.slice(1).every(esEtiqueta)
    const segundaTieneNumeros = segundaFila.some((celda) => parsearNumero(celda) !== null)

    return primeraEsValida && restoEsValido && segundaTieneNumeros

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
/**
 * Quita de las gráficas las referencias a columnas que ya no existen
 * (o que dejaron de ser numéricas, en el caso de las series).
 */
/**
 * Deja las gráficas consistentes con las tablas: elimina las gráficas cuya tabla
 * ya no existe y quita referencias a columnas/filas que ya no existen.
 * Funciona con tablas en texto (editor) y con tablas ya tipadas.
 */
export function limpiarGraficas(graficas = [], tablas = []) {

    const resultado = []

    for (const grafica of graficas) {

        // Sin tabla indicada = primera tabla (gráficas creadas con el editor anterior)
        const tabla = grafica.tabla
            ? tablas.find((t) => t.id === grafica.tabla)
            : tablas[0]

        if (!tabla) continue

        const columnas = tabla.columnas || []
        const todas = new Set(columnas.map((columna) => columna.key))
        const datos = new Set(
            columnas.filter((columna) => columna.formato !== 'texto').map((columna) => columna.key)
        )
        const idsFilas = new Set(
            (tabla.filas || []).filter((fila) => !esFilaSeccion(fila)).map((fila) => fila._id)
        )

        if (grafica.orientacion === 'filas') {

            resultado.push({
                ...grafica,
                tabla: tabla.id,
                etiquetas: todas.has(grafica.etiquetas) ? grafica.etiquetas : '',
                columnas: (grafica.columnas || []).filter((key) => datos.has(key)),
                filas: (grafica.filas || []).filter((id) => idsFilas.has(id))
            })

        } else {

            resultado.push({
                ...grafica,
                tabla: tabla.id,
                x: todas.has(grafica.x) ? grafica.x : '',
                series: (grafica.series || []).filter((key) => datos.has(key))
            })

        }

    }

    return resultado

}
/**
 * Filas tipadas "a la ligera" para la vista previa de las gráficas:
 * ignora filas vacías y deja en null lo que no se pueda leer como número,
 * sin lanzar errores mientras el admin todavía está escribiendo.
 */
export function filasParaVistaPrevia(columnas = [], filas = []) {

    return filas
        .filter((fila) =>
            columnas.some((columna) => String(fila[columna.key] ?? '').trim() !== '')
        )
        .map((fila) => {
            const tipada = {}
            columnas.forEach((columna) => {
                const texto = String(fila[columna.key] ?? '').trim()
                tipada[columna.key] = columna.formato === 'texto' ? texto : parsearNumero(texto)
            })
            return tipada
        })

}

/**
 * Siguiente id libre para una gráfica nueva (g1, g2, ...).
 */
export function generarIdGrafica(graficas = []) {

    const maximo = graficas.reduce((max, grafica) => {
        const numero = parseInt(String(grafica.id).replace('g', ''), 10)
        return Number.isNaN(numero) ? max : Math.max(max, numero)
    }, 0)

    return `g${maximo + 1}`

}

/**
 * Revisa que cada gráfica esté completa antes de guardar.
 * Devuelve un mensaje de error o null si todo está bien.
 */
export function validarGraficas(graficas = []) {

    for (let i = 0; i < graficas.length; i++) {

        const grafica = graficas[i]
        const nombre = `Gráfica ${i + 1}`
        const esTorta = grafica.tipo === 'pie'

        if (!grafica.titulo || !grafica.titulo.trim()) {
            return `${nombre}: escribe un título.`
        }

        // Gráficas por filas: cada serie es una fila y las categorías son encabezados de columnas
        if (grafica.orientacion === 'filas') {

            if (!grafica.etiquetas) {
                return `${nombre}: elige la columna que contiene los nombres de las filas.`
            }

            if ((grafica.columnas || []).length < 1) {
                return `${nombre}: elige al menos una columna.`
            }

            if (esTorta && (grafica.filas || []).length !== 1) {
                return `${nombre}: elige una fila.`
            }

            if (!esTorta && (grafica.filas || []).length < 1) {
                return `${nombre}: elige al menos una fila.`
            }

            continue

        }

        // Gráficas por columnas
        const tortaPorColumnas = esTorta && grafica.modoTorta === 'columnas'

        if (!tortaPorColumnas && !grafica.x) {
            return `${nombre}: elige la columna de categorías.`
        }

        if (esTorta && !tortaPorColumnas && grafica.series.length !== 1) {
            return `${nombre}: elige la columna de valores.`
        }

        if (tortaPorColumnas && grafica.series.length < 2) {
            return `${nombre}: elige al menos dos columnas para comparar en la torta.`
        }

        if (!esTorta && grafica.series.length < 1) {
            return `${nombre}: elige al menos una columna de valores.`
        }

    }

    return null

}

/* ============================================================
   Tablas con varias secciones, formato por fila y filas de sección
   ============================================================ */

export function esFilaSeccion(fila) {
    return fila?._tipo === 'seccion'
}

/**
 * Formato real de una celda. En una tabla "por fila" lo define la fila (`_formato`),
 * excepto en las columnas de texto (las que llevan los nombres de las filas).
 * En una tabla normal lo define la columna.
 */
export function formatoDeCelda(tabla, fila, columna) {

    if (tabla?.formatoPor === 'fila' && columna?.formato !== 'texto') {
        return fila?._formato || 'numero'
    }

    return columna?.formato || 'texto'

}

/**
 * Título que se muestra sobre cada tabla del indicador.
 */
export function tituloDeTabla(tabla, indice, total) {

    if (tabla?.titulo && tabla.titulo.trim()) return tabla.titulo

    return total === 1 ? 'Datos completos' : `Tabla ${indice + 1}`

}

/**
 * ¿El editor actual (una sola tabla, gráficas por columnas) puede editar este indicador
 * sin perder información? Es temporal: desaparece cuando el editor soporte todo.
 */
export function editorSimpleSoportaIndicador(indicador) {

    const tablas = indicador?.tablas || []

    if (tablas.length > 1) return false

    const tabla = tablas[0]

    if (tabla && (tabla.formatoPor === 'fila' || (tabla.filas || []).some(esFilaSeccion))) {
        return false
    }

    if ((indicador?.graficas || []).some((grafica) => grafica.orientacion === 'filas')) {
        return false
    }

    return true

}

/* ============================================================
   Editor de indicadores con varias tablas
   ============================================================ */

let contadorIds = 0

/**
 * Id único que nunca se reutiliza (t_..., col_..., f_...). Así una gráfica
 * jamás queda apuntando por error a una fila o columna nueva que ocupó un lugar viejo.
 */
export function generarIdUnico(prefijo) {
    contadorIds += 1
    return `${prefijo}_${Date.now().toString(36)}${contadorIds.toString(36)}`
}

/**
 * Tabla nueva con una cuadrícula vacía de 3 columnas por 5 filas.
 */
export function crearTablaVacia(id) {

    return {
        id: id || generarIdUnico('t'),
        titulo: '',
        formatoPor: 'columna',
        columnas: [
            { key: 'col_1', label: 'Columna 1', formato: 'texto' },
            { key: 'col_2', label: 'Columna 2', formato: 'numero' },
            { key: 'col_3', label: 'Columna 3', formato: 'numero' }
        ],
        filas: Array.from({ length: 5 }, () => ({
            _id: generarIdUnico('f'),
            col_1: '',
            col_2: '',
            col_3: ''
        }))
    }

}

/**
 * Tabla guardada (valores tipados) -> tabla del editor (todo en texto).
 * Asigna id a las filas que no lo tengan.
 */
export function tablaATexto(tabla) {

    const formatoPor = tabla.formatoPor === 'fila' ? 'fila' : 'columna'
    const columnas = (tabla.columnas || []).map((columna) => ({ ...columna }))

    const filas = (tabla.filas || []).map((fila) => {

        const _id = fila._id || generarIdUnico('f')

        if (esFilaSeccion(fila)) {
            return { _id, _tipo: 'seccion', texto: fila.texto ?? '' }
        }

        const filaTexto = { _id }

        if (formatoPor === 'fila') filaTexto._formato = fila._formato || 'numero'

        columnas.forEach((columna) => {
            filaTexto[columna.key] = valorAEditable(fila[columna.key])
        })

        return filaTexto

    })

    return {
        id: tabla.id || generarIdUnico('t'),
        titulo: tabla.titulo ?? '',
        formatoPor,
        columnas,
        filas
    }

}

/**
 * Tabla del editor -> tabla con valores tipados "a la ligera" para las vistas previas
 * (sin errores mientras se escribe).
 */
export function tablaParaVistaPrevia(tabla) {

    const filas = tabla.filas
        .filter((fila) =>
            esFilaSeccion(fila) ||
            tabla.columnas.some((columna) => String(fila[columna.key] ?? '').trim() !== '')
        )
        .map((fila) => {

            if (esFilaSeccion(fila)) return fila

            const tipada = { _id: fila._id, _formato: fila._formato }

            tabla.columnas.forEach((columna) => {
                const texto = String(fila[columna.key] ?? '').trim()
                tipada[columna.key] =
                    formatoDeCelda(tabla, fila, columna) === 'texto' ? texto : parsearNumero(texto)
            })

            return tipada

        })

    return { id: tabla.id, formatoPor: tabla.formatoPor, columnas: tabla.columnas, filas }

}

/**
 * Valida y convierte las tablas del editor a lo que se guarda en la base de datos:
 * descarta filas vacías, convierte textos a números y revisa cada celda numérica.
 * Devuelve { tablas } o { error }.
 */
export function prepararTablasParaGuardar(tablas = []) {

    const resultado = []

    for (let i = 0; i < tablas.length; i++) {

        const tabla = tablas[i]
        const nombreTabla = tabla.titulo?.trim() ? `Tabla "${tabla.titulo.trim()}"` : `Tabla ${i + 1}`

        if (tabla.columnas.some((columna) => !columna.label.trim())) {
            return { error: `${nombreTabla}: todas las columnas deben tener un nombre.` }
        }

        const filasListas = []
        let hayDatos = false

        for (let r = 0; r < tabla.filas.length; r++) {

            const fila = tabla.filas[r]

            if (esFilaSeccion(fila)) {
                const texto = String(fila.texto ?? '').trim()
                if (texto !== '') filasListas.push({ _id: fila._id, _tipo: 'seccion', texto })
                continue
            }

            const celdas = tabla.columnas.map((columna) => String(fila[columna.key] ?? '').trim())

            // Fila totalmente vacía: se descarta
            if (celdas.every((celda) => celda === '')) continue

            const filaLista = { _id: fila._id }

            if (tabla.formatoPor === 'fila') filaLista._formato = fila._formato || 'numero'

            for (const columna of tabla.columnas) {

                const texto = String(fila[columna.key] ?? '').trim()

                if (formatoDeCelda(tabla, fila, columna) === 'texto') {
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
                        error: `${nombreTabla}, fila ${r + 1}, columna "${columna.label.trim()}": "${texto}" no es un número válido.`
                    }
                }

                filaLista[columna.key] = valor

            }

            filasListas.push(filaLista)
            hayDatos = true

        }

        if (!hayDatos) {
            return { error: `${nombreTabla}: agrega al menos una fila con datos.` }
        }

        resultado.push({
            id: tabla.id,
            titulo: (tabla.titulo ?? '').trim(),
            formatoPor: tabla.formatoPor,
            columnas: tabla.columnas.map(({ key, label, formato }) => ({
                key,
                label: label.trim(),
                formato
            })),
            filas: filasListas
        })

    }

    return { tablas: resultado, error: null }

}

/**
 * Cambia una tabla entre "formato por columna" y "formato por fila" convirtiendo
 * los formatos para no perder el sentido de los datos.
 */
export function cambiarFormatoPorTabla(tabla, nuevoModo) {

    if (tabla.formatoPor === nuevoModo) return tabla

    if (nuevoModo === 'fila') {

        // Solo la primera columna, si es de texto, se conserva como columna de nombres;
        // las demás pasan a ser columnas de datos.
        const esEtiqueta = (columna, indice) => indice === 0 && columna.formato === 'texto'
        const columnasDatos = tabla.columnas.filter((columna, i) => !esEtiqueta(columna, i))
        const formatosColumnas = new Set(columnasDatos.map((columna) => columna.formato))
        const compartido = formatosColumnas.size === 1 ? [...formatosColumnas][0] : null

        return {
            ...tabla,
            formatoPor: 'fila',
            columnas: tabla.columnas.map((columna, i) =>
                esEtiqueta(columna, i) ? columna : { ...columna, formato: 'numero' }
            ),
            filas: tabla.filas.map((fila) => {

                if (esFilaSeccion(fila)) return fila

                // Si todas las columnas de datos compartían un formato, la fila lo hereda;
                // si no, se deduce de lo que contiene.
                let formato = compartido && compartido !== 'texto' ? compartido : null

                if (!formato) {
                    const valores = columnasDatos
                        .map((columna) => String(fila[columna.key] ?? '').trim())
                        .filter((texto) => texto !== '')
                    formato = valores.length > 0 ? inferirFormato(valores) : 'numero'
                }

                const nueva = { ...fila, _formato: formato }

                if (formato !== 'texto') {
                    columnasDatos.forEach((columna) => {
                        nueva[columna.key] = normalizarTextoNumerico(nueva[columna.key] ?? '')
                    })
                }

                return nueva

            })
        }

    }

    // De "por fila" a "por columna": cada columna de datos toma el formato de sus filas
    const filasDatos = tabla.filas.filter((fila) => !esFilaSeccion(fila))

    return {
        ...tabla,
        formatoPor: 'columna',
        columnas: tabla.columnas.map((columna) => {

            if (columna.formato === 'texto') return columna

            const formatos = new Set(
                filasDatos
                    .filter((fila) => String(fila[columna.key] ?? '').trim() !== '')
                    .map((fila) => fila._formato || 'numero')
            )

            let formato = 'numero'

            if (formatos.has('texto')) formato = 'texto'
            else if (formatos.size === 1) formato = [...formatos][0]

            return { ...columna, formato }

        }),
        filas: tabla.filas.map((fila) => {
            if (esFilaSeccion(fila)) return fila
            const { _formato, ...resto } = fila
            return resto
        })
    }

}

/**
 * Configuración de partida de una gráfica para una tabla y orientación dadas
 * (al crear una gráfica, al cambiar de tabla o al cambiar de orientación).
 */
export function configuracionInicialGrafica(tabla, base = {}) {

    const columnas = tabla?.columnas || []
    const columnasDatos = columnas.filter((columna) => columna.formato !== 'texto')
    const primeraDeTexto = columnas.find((columna) => columna.formato === 'texto')
    const { id, tipo = 'line', titulo = '', orientacion = 'columnas' } = base

    if (orientacion === 'filas') {
        return {
            id,
            tipo,
            titulo,
            tabla: tabla?.id,
            orientacion: 'filas',
            etiquetas: primeraDeTexto?.key ?? '',
            columnas: columnasDatos.map((columna) => columna.key),
            filas: []
        }
    }

    return {
        id,
        tipo,
        titulo,
        tabla: tabla?.id,
        orientacion: 'columnas',
        x: (primeraDeTexto ?? columnas[0])?.key ?? '',
        series: columnasDatos.length > 0 ? [columnasDatos[0].key] : [],
        ...(tipo === 'pie' ? { modoTorta: 'filas' } : {})
    }

}

/**
 * Agrupa las filas de datos de una tabla bajo el título de la franja de sección
 * que las precede: [{ titulo, filas: [...] }]. Las filas anteriores a la primera
 * franja quedan en un grupo sin título.
 */
export function agruparFilasPorSeccion(tabla) {

    const grupos = []
    let actual = { titulo: '', filas: [] }

    for (const fila of tabla?.filas || []) {

        if (esFilaSeccion(fila)) {
            if (actual.filas.length > 0) grupos.push(actual)
            actual = { titulo: fila.texto || '', filas: [] }
        } else {
            actual.filas.push(fila)
        }

    }

    if (actual.filas.length > 0) grupos.push(actual)

    return grupos

}