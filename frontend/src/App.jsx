import { useState } from 'react'

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
  const [consulta, setConsulta] = useState('cual es el ancho minimo de puerta')
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
        return
      }

      const norma = data.items && data.items.length > 0 ? data.items[0] : null
      if (norma) {
        setRespuestaNatural(formatearNormaComoRespuesta(norma))
        setDetalleNatural(norma)
      } else {
        setRespuestaNatural('No se encontraron normas para la consulta ingresada.')
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
      </section>

      <section className="card">
        <h2>Consulta en lenguaje natural</h2>
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
        {detalleNatural ? (
          <details className="detail-block">
            <summary>Ver detalle tecnico</summary>
            <pre className="detail">{JSON.stringify(detalleNatural, null, 2)}</pre>
          </details>
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
        {resultadoVerificacion ? (
          <details className="detail-block">
            <summary>Ver detalle tecnico</summary>
            <pre className="detail">{JSON.stringify(resultadoVerificacion, null, 2)}</pre>
          </details>
        ) : null}
      </section>
    </main>
  )
}

export default App
