import { useState } from 'react'

const API_BASE = 'http://127.0.0.1:8000'

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
        setRespuestaNatural(
          `La ${norma.propiedad} de ${norma.elemento} tiene una restriccion de tipo ${norma.restriccion} con valor ${norma.valor} ${norma.unidad}.`,
        )
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
    } catch (error) {
      setResultadoVerificacion({ error: error.message })
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
          <pre className="detail">{JSON.stringify(detalleNatural, null, 2)}</pre>
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
        {resultadoVerificacion ? (
          <pre className="detail">{JSON.stringify(resultadoVerificacion, null, 2)}</pre>
        ) : null}
      </section>
    </main>
  )
}

export default App
