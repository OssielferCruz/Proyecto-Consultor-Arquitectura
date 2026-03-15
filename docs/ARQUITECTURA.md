# Arquitectura inicial del proyecto

## Capas
1. Frontend React
2. API Python
3. Motor Prolog
4. Datos normativos

## Responsabilidad por capa
### Frontend
- Recibir consultas del usuario.
- Mostrar resultados, explicaciones y sugerencias.
- No aplicar reglas normativas.

### Backend
- Validar entrada basica.
- Cargar datos relevantes desde la fuente externa.
- Traducir datos al formato que consumira Prolog.
- Invocar consultas Prolog.
- Devolver respuesta estructurada a la UI.

### Prolog
- Representar hechos normativos.
- Aplicar reglas de cumplimiento.
- Construir explicaciones.
- Generar sugerencias de correccion.

### Datos
- Almacenar normas clasificadas por categoria, subcategoria y vigencia.
- Permitir cambios futuros sin reescribir la logica principal.

## Regla de diseno
Si una decision depende de razonamiento normativo, debe implementarse en Prolog.
