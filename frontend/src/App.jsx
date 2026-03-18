import { useEffect, useState } from 'react'

const API_BASE = 'http://127.0.0.1:8000'

function capitalizar(texto) {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function textoRestriccion(restriccion) {
  if (restriccion === 'minimo') return 'minimo'
  if (restriccion === 'maximo') return 'maximo'
  return restriccion
}

function formatearNormaComoRespuesta(norma) {
  if (!norma) return 'No se encontraron normas para la consulta ingresada.'
  return `La ${norma.propiedad} ${textoRestriccion(norma.restriccion)} de ${norma.elemento} es ${norma.valor} ${norma.unidad}.`
}

function formatearVerificacion(data) {
  if (!data || data.error) return data?.error || 'No se pudo verificar la medida.'

  const detalle = data.explicacion
  const base = `${capitalizar(detalle.propiedad)} de ${detalle.elemento}: valor ingresado ${detalle.valor_ingresado} ${detalle.unidad}.`

  if (data.resultado === 'cumple') {
    return `${base} Cumple la norma ${detalle.norma_id}.`
  }

  const sugerencia = data.sugerencia
  if (sugerencia?.accion === 'reducir_hasta') {
    return `${base} No cumple. Debes reducir hasta ${sugerencia.objetivo} ${sugerencia.unidad}.`
  }

  if (sugerencia?.accion === 'aumentar_hasta') {
    return `${base} No cumple. Debes aumentar hasta ${sugerencia.objetivo} ${sugerencia.unidad}.`
  }

  return `${base} No cumple la norma ${detalle.norma_id}.`
}

function App() {
  const [modoTecnico, setModoTecnico] = useState(false)
  const [consulta, setConsulta] = useState('cual es el ancho minimo de puerta')
  const [historialConsultas, setHistorialConsultas] = useState([])
  const [respuestaNatural, setRespuestaNatural] = useState('')
  const [detalleNatural, setDetalleNatural] = useState(null)
  const [cargandoNatural, setCargandoNatural] = useState(false)

  const [elemento, setElemento] = useState('puerta')
  const [propiedad, setPropiedad] = useState('ancho')
  const [valor, setValor] = useState('0.95')
  const [unidad, setUnidad] = useState('metros')
  const [resultadoVerificacion, setResultadoVerificacion] = useState(null)
  const [mensajeVerificacion, setMensajeVerificacion] = useState('')
  const [cargandoVerificacion, setCargandoVerificacion] = useState(false)
  const [mensajeReporte, setMensajeReporte] = useState('')
  const [normasCatalogo, setNormasCatalogo] = useState([])
  const [cargandoCatalogo, setCargandoCatalogo] = useState(false)
  const [errorCatalogo, setErrorCatalogo] = useState('')
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroElemento, setFiltroElemento] = useState('todos')
  const [filtroPropiedad, setFiltroPropiedad] = useState('todos')
  const [filtroRestriccion, setFiltroRestriccion] = useState('todos')

  useEffect(() => {
    const guardado = localStorage.getItem('historial_consultas_normativas')
    if (!guardado) return

    try {
      const parsed = JSON.parse(guardado)
      if (Array.isArray(parsed)) {
        setHistorialConsultas(parsed.slice(0, 5))
      }
    } catch {
      // Si el contenido guardado esta corrupto se ignora y continua la app.
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('historial_consultas_normativas', JSON.stringify(historialConsultas))
  }, [historialConsultas])

  const cargarCatalogo = async () => {
    setCargandoCatalogo(true)
    setErrorCatalogo('')

    try {
      const response = await fetch(`${API_BASE}/normas`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'No se pudo cargar el catalogo de normas')
      }

      setNormasCatalogo(Array.isArray(data.items) ? data.items : [])
    } catch (error) {
      setErrorCatalogo(error.message)
      setNormasCatalogo([])
    } finally {
      setCargandoCatalogo(false)
    }
  }

  useEffect(() => {
    cargarCatalogo()
  }, [])

  const opcionesElemento = [...new Set(normasCatalogo.map((item) => item.elemento))].sort()
  const opcionesPropiedad = [...new Set(normasCatalogo.map((item) => item.propiedad))].sort()
  const opcionesRestriccion = [...new Set(normasCatalogo.map((item) => item.restriccion))].sort()

  const normasFiltradas = normasCatalogo.filter((norma) => {
    const cumpleElemento = filtroElemento === 'todos' || norma.elemento === filtroElemento
    const cumplePropiedad = filtroPropiedad === 'todos' || norma.propiedad === filtroPropiedad
    const cumpleRestriccion = filtroRestriccion === 'todos' || norma.restriccion === filtroRestriccion

    const textoBusqueda = filtroTexto.trim().toLowerCase()
    if (!textoBusqueda) {
      return cumpleElemento && cumplePropiedad && cumpleRestriccion
    }

    const textoNorma = [
      norma.id,
      norma.categoria,
      norma.subcategoria,
      norma.elemento,
      norma.propiedad,
      norma.restriccion,
      String(norma.valor),
      norma.unidad,
      norma.jurisdiccion,
      norma.fuente,
    ]
      .join(' ')
      .toLowerCase()

    return cumpleElemento && cumplePropiedad && cumpleRestriccion && textoNorma.includes(textoBusqueda)
  })

  const construirReporte = () => {
    const lineas = []
    const fecha = new Date().toLocaleString('es-MX')

    lineas.push('REPORTE TECNICO - CONSULTOR DE NORMATIVAS')
    lineas.push(`Fecha: ${fecha}`)
    lineas.push('')

    if (consulta.trim()) {
      lineas.push('Consulta natural')
      lineas.push(`- Pregunta: ${consulta}`)
      lineas.push(`- Respuesta: ${respuestaNatural || 'Sin respuesta registrada.'}`)
      if (detalleNatural) {
        lineas.push(`- Norma encontrada: ${detalleNatural.id}`)
        lineas.push(`- Restriccion: ${detalleNatural.restriccion} ${detalleNatural.valor} ${detalleNatural.unidad}`)
      }
      lineas.push('')
    }

    lineas.push('Verificacion de medida')
    lineas.push(`- Elemento: ${elemento}`)
    lineas.push(`- Propiedad: ${propiedad}`)
    lineas.push(`- Valor ingresado: ${valor} ${unidad}`)
    lineas.push(`- Resultado: ${mensajeVerificacion || 'Sin verificacion ejecutada.'}`)

    if (resultadoVerificacion?.explicacion) {
      lineas.push(`- Norma aplicada: ${resultadoVerificacion.explicacion.norma_id}`)
    }

    return lineas.join('\n')
  }

  const copiarReporte = async () => {
    const reporte = construirReporte()
    try {
      await navigator.clipboard.writeText(reporte)
      setMensajeReporte('Reporte copiado al portapapeles.')
    } catch {
      setMensajeReporte('No se pudo copiar el reporte automaticamente.')
    }
  }

  const descargarReporte = () => {
    const reporte = construirReporte()
    const blob = new Blob([reporte], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = 'reporte_normativas.txt'
    document.body.appendChild(enlace)
    enlace.click()
    document.body.removeChild(enlace)
    URL.revokeObjectURL(url)
    setMensajeReporte('Reporte descargado como archivo .txt.')
  }

  const registrarConsulta = (textoConsulta) => {
    const normalizada = textoConsulta.trim()
    if (!normalizada) return

    setHistorialConsultas((previo) => {
      const sinDuplicados = previo.filter((item) => item !== normalizada)
      return [normalizada, ...sinDuplicados].slice(0, 5)
    })
  }

  const consultarNatural = async (event) => {
    event.preventDefault()
    setCargandoNatural(true)
    setRespuestaNatural('')
    setDetalleNatural(null)

    try {
      const response = await fetch(`${API_BASE}/consultas/natural`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consulta }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'No se pudo procesar la consulta')
      }

      if (data.error) {
        setRespuestaNatural(data.error)
        registrarConsulta(consulta)
        return
      }

      const norma = data.items && data.items.length > 0 ? data.items[0] : null
      if (norma) {
        setRespuestaNatural(formatearNormaComoRespuesta(norma))
        setDetalleNatural(norma)
        registrarConsulta(consulta)
      } else {
        setRespuestaNatural('No se encontraron normas para la consulta ingresada.')
        registrarConsulta(consulta)
      }
    } catch (error) {
      setRespuestaNatural(error.message)
    } finally {
      setCargandoNatural(false)
    }
  }

  const verificarMedida = async (event) => {
    event.preventDefault()
    setCargandoVerificacion(true)
    setMensajeVerificacion('')
    setResultadoVerificacion(null)

    try {
      const response = await fetch(`${API_BASE}/verificaciones/medida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elemento,
          propiedad,
          valor: Number(valor),
          unidad,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail || 'No se pudo verificar la medida')
      }

      setResultadoVerificacion(data)
      setMensajeVerificacion(formatearVerificacion(data))
    } catch (error) {
      const errorData = { error: error.message }
      setResultadoVerificacion(errorData)
      setMensajeVerificacion(formatearVerificacion(errorData))
    } finally {
      setCargandoVerificacion(false)
    }
  }

  return (
    <main className="layout">
      <section className="card hero">
        <h1>Consultor de Normativas</h1>
        <p>Interfaz inicial para consultar normas y verificar medidas usando FastAPI + Prolog.</p>
        <div className="mode-toggle">
          <span>Modo de visualizacion:</span>
          <button type="button" className={modoTecnico ? 'ghost' : ''} onClick={() => setModoTecnico(false)}>
            Usuario
          </button>
          <button type="button" className={modoTecnico ? '' : 'ghost'} onClick={() => setModoTecnico(true)}>
            Tecnico
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Consulta en lenguaje natural</h2>
        <div className="quick-actions">
          <span>Ejemplos:</span>
          <button type="button" className="ghost" onClick={() => setConsulta('cual es el ancho minimo de puerta')}>
            ancho minimo de puerta
          </button>
          <button type="button" className="ghost" onClick={() => setConsulta('cual es la altura minima de habitacion')}>
            altura minima de habitacion
          </button>
          <button type="button" className="ghost" onClick={() => setConsulta('cual es la pendiente maxima de rampa')}>
            pendiente maxima de rampa
          </button>
        </div>
        <form onSubmit={consultarNatural} className="form-grid">
          <label>
            Pregunta
            <input value={consulta} onChange={(event) => setConsulta(event.target.value)} />
          </label>
          <button type="submit" disabled={cargandoNatural}>
            {cargandoNatural ? 'Consultando...' : 'Consultar'}
          </button>
        </form>
        {respuestaNatural ? <p className="result">{respuestaNatural}</p> : null}
        {modoTecnico && detalleNatural ? (
          <details className="detail-block">
            <summary>Ver detalle tecnico</summary>
            <pre className="detail">{JSON.stringify(detalleNatural, null, 2)}</pre>
          </details>
        ) : null}
        {historialConsultas.length > 0 ? (
          <div className="history-block">
            <h3>Consultas recientes</h3>
            <div className="history-list">
              {historialConsultas.map((item) => (
                <button key={item} type="button" className="history-item" onClick={() => setConsulta(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="card">
        <h2>Verificacion de medida</h2>
        <form onSubmit={verificarMedida} className="form-grid two-columns">
          <label>
            Elemento
            <input value={elemento} onChange={(event) => setElemento(event.target.value)} />
          </label>
          <label>
            Propiedad
            <input value={propiedad} onChange={(event) => setPropiedad(event.target.value)} />
          </label>
          <label>
            Valor
            <input value={valor} onChange={(event) => setValor(event.target.value)} />
          </label>
          <label>
            Unidad
            <input value={unidad} onChange={(event) => setUnidad(event.target.value)} />
          </label>
          <button type="submit" disabled={cargandoVerificacion}>
            {cargandoVerificacion ? 'Verificando...' : 'Verificar'}
          </button>
        </form>
        {mensajeVerificacion ? <p className="result">{mensajeVerificacion}</p> : null}
        {modoTecnico && resultadoVerificacion ? (
          <details className="detail-block">
            <summary>Ver detalle tecnico</summary>
            <pre className="detail">{JSON.stringify(resultadoVerificacion, null, 2)}</pre>
          </details>
        ) : null}
      </section>

      <section className="card">
        <h2>Catalogo de normas</h2>
        <p>Explora todas las normas disponibles y filtra por campos clave.</p>

        <div className="catalog-toolbar form-grid two-columns">
          <label>
            Buscar texto
            <input
              value={filtroTexto}
              onChange={(event) => setFiltroTexto(event.target.value)}
              placeholder="id, elemento, propiedad, fuente..."
            />
          </label>
          <label>
            Elemento
            <select value={filtroElemento} onChange={(event) => setFiltroElemento(event.target.value)}>
              <option value="todos">todos</option>
              {opcionesElemento.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Propiedad
            <select value={filtroPropiedad} onChange={(event) => setFiltroPropiedad(event.target.value)}>
              <option value="todos">todos</option>
              {opcionesPropiedad.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Restriccion
            <select value={filtroRestriccion} onChange={(event) => setFiltroRestriccion(event.target.value)}>
              <option value="todos">todos</option>
              {opcionesRestriccion.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="catalog-actions">
          <button type="button" className="secondary" onClick={cargarCatalogo} disabled={cargandoCatalogo}>
            {cargandoCatalogo ? 'Actualizando catalogo...' : 'Actualizar catalogo'}
          </button>
          <span>Total visible: {normasFiltradas.length}</span>
        </div>

        {errorCatalogo ? <p className="result">{errorCatalogo}</p> : null}

        <div className="catalog-grid">
          {normasFiltradas.map((norma) => (
            <article key={norma.id} className="norma-card">
              <header>
                <strong className="norma-id">{norma.id}</strong>
                <span className="norma-category">{norma.categoria}</span>
              </header>
              <p className="norma-main">
                {norma.propiedad} {norma.restriccion} de {norma.elemento}: <strong>{norma.valor} {norma.unidad}</strong>
              </p>
              <small className="norma-meta">{norma.subcategoria} | {norma.jurisdiccion}</small>
              {modoTecnico ? <small className="norma-meta">Fuente: {norma.fuente}</small> : null}
            </article>
          ))}
        </div>

        {!cargandoCatalogo && normasFiltradas.length === 0 ? (
          <p className="result">No hay normas que coincidan con los filtros actuales.</p>
        ) : null}
      </section>

      <section className="card">
        <h2>Modo reporte</h2>
        <p>Genera un resumen de la consulta y la verificacion para compartir evidencia tecnica.</p>
        <div className="report-actions">
          <button type="button" onClick={copiarReporte}>Copiar reporte</button>
          <button type="button" className="secondary" onClick={descargarReporte}>Descargar .txt</button>
        </div>
        {mensajeReporte ? <p className="result">{mensajeReporte}</p> : null}
        {modoTecnico ? (
          <details className="detail-block">
            <summary>Vista previa del reporte</summary>
            <pre className="detail">{construirReporte()}</pre>
          </details>
        ) : null}
      </section>
    </main>
  )
}

export default App
