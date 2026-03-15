# Proyecto Consultor de Normativas de Construccion

Aplicacion modular para consultar y verificar normativas de construccion usando Prolog como motor de inferencia principal, Python como API de integracion y React como interfaz web.

## Objetivo
- Consultar normas de construccion.
- Verificar cumplimiento de parametros de diseno.
- Explicar el razonamiento del sistema.
- Sugerir correcciones cuando no se cumpla una norma.

## Estructura inicial
- frontend/: interfaz web en React.
- backend/: API en Python.
- prolog/: conocimiento, reglas y consultas del motor logico.
- data/: fuentes de normas y datos auxiliares.
- docs/: decisiones de arquitectura y plan del proyecto.
- tests/: pruebas del sistema.

## Principio de arquitectura
La logica normativa debe residir en Prolog. La API y la UI no deben tomar decisiones normativas.

## Primer alcance
La primera fase se enfocara en dejar la estructura base y despues implementar un MVP con normas iniciales de puertas, habitaciones, pasillos, rampas, escaleras y ventanas.
