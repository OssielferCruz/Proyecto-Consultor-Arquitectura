# Backend

API minima en FastAPI para exponer el motor Prolog.

## Endpoints iniciales
- GET /health
- GET /normas
- GET /normas/{norma_id}
- POST /verificaciones/medida
- POST /consultas/natural

## Dependencias
Instalar Python 3.11+ y luego:

```bash
pip install -r backend/requirements.txt
```

## Ejecutar localmente
Desde la raiz del proyecto:

```bash
uvicorn backend.app.main:app --reload
```

## Ejemplo de body
```json
{
  "elemento": "puerta",
  "propiedad": "ancho",
  "valor": 0.95,
  "unidad": "metros"
}
```

## Ejemplos de consulta

Obtener todas las normas:

```bash
curl http://127.0.0.1:8000/normas
```

Filtrar por elemento y propiedad:

```bash
curl "http://127.0.0.1:8000/normas?elemento=puerta&propiedad=ancho"
```

Consultar una norma por id:

```bash
curl http://127.0.0.1:8000/normas/norma_puerta_ancho_minimo
```

Consulta en lenguaje natural simplificado:

```bash
curl -X POST http://127.0.0.1:8000/consultas/natural \
  -H "Content-Type: application/json" \
  -d '{"consulta":"cual es el ancho minimo de puerta"}'
```

## Idea de integracion
La API delega la decision normativa a Prolog mediante una consulta ejecutada con SWI-Prolog.
