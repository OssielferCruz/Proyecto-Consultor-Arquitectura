# Backend

API minima en FastAPI para exponer el motor Prolog.

## Endpoints iniciales
- GET /health
- POST /verificaciones/medida

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

## Idea de integracion
La API delega la decision normativa a Prolog mediante una consulta ejecutada con SWI-Prolog.
