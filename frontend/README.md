# Frontend

Interfaz React inicial para consumir la API del proyecto.

## Requisitos
- Node.js LTS
- Backend FastAPI ejecutandose en http://127.0.0.1:8000

## Ejecutar en desarrollo
Desde la carpeta frontend:

```bash
npm run dev
```

La aplicacion abre en http://127.0.0.1:5173.

## Build de produccion
```bash
npm run build
```

## Funcionalidades actuales
- Consulta en lenguaje natural (POST /consultas/natural).
- Verificacion de medida (POST /verificaciones/medida).
- Muestra respuesta simple y detalle tecnico opcional.
