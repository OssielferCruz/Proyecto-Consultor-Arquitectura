# Guia de trabajo con Git y GitHub

Este documento define como trabajar el proyecto de forma modular, con cambios futuros, y manteniendo buenas practicas.

## 1. Objetivo del flujo
- Permitir agregar o quitar requerimientos sin romper lo existente.
- Mantener historial claro y facil de revisar.
- Facilitar trabajo individual ahora y colaborativo despues.

## 2. Estructura de ramas recomendada
- main: codigo estable y listo para demo/entrega.
- feature/*: trabajo temporal de una funcionalidad concreta.
- fix/*: trabajo temporal para correcciones puntuales.
- docs/*: trabajo temporal para cambios de documentacion importantes.

Nota para este proyecto:
- No se usara develop como flujo principal.
- Si develop existe en remoto, se puede ignorar o eliminar mas adelante.

Ejemplos:
- feature/verificacion-rampas
- feature/ui-consulta-normas
- fix/error-explicacion-pasillos
- docs/actualizar-checklist-entrega

## 3. Cuando crear una rama
Crea una rama nueva cuando:
- Vas a agregar una funcionalidad nueva.
- Vas a cambiar comportamiento existente.
- Vas a corregir un bug.
- Vas a hacer refactor que no sea trivial.

No hace falta rama nueva para:
- Cambio pequeno de typo local que no afecta logica.
- Ajuste rapido de documentacion menor.

Regla practica:
- Si el cambio afecta Prolog, API o UI de forma real, crea rama.
- Si el cambio toma mas de unos minutos o quieres poder revertirlo con claridad, crea rama.
- Si el cambio es minimo y estas trabajando solo, puedes hacerlo directo en main.

## 3.1. Cuando borrar una rama
Borra una rama temporal cuando:
- Ya fue fusionada en main.
- Su objetivo ya quedo integrado.
- No la vas a seguir usando para ese cambio puntual.

No borres una rama si:
- Todavia no haces merge.
- Aun la estas probando.
- La vas a usar para abrir o actualizar un Pull Request.

## 4. Regla simple de commits
Haz commit cuando cierres una unidad de trabajo pequena y verificable.

Buenas senales para commitear:
- Compila o ejecuta.
- Prueba manual basica pasada.
- Cambio tiene sentido por si solo.

Evita:
- Commits gigantes con 20 cosas mezcladas.
- Commits con archivos no relacionados.

## 5. Formato recomendado de mensajes de commit
Usar estilo tipo Conventional Commits:
- feat: nueva funcionalidad
- fix: correccion de error
- refactor: mejora interna sin cambiar comportamiento externo
- docs: documentacion
- test: pruebas
- chore: tareas de mantenimiento

Ejemplos:
- feat(prolog): agregar regla de pendiente maxima de rampa
- feat(api): endpoint para verificar cumplimiento
- fix(prolog): corregir comparacion de ancho minimo de pasillo
- docs: agregar guia de exposicion academica

## 6. Flujo de trabajo diario
1. Ir a main.
2. Actualizar main.
3. Crear rama feature, fix o docs.
4. Implementar cambio pequeno.
5. Probar localmente.
6. Commit con mensaje claro.
7. Push de la rama.
8. Abrir Pull Request hacia main o hacer merge si trabajas solo.
9. Borrar la rama temporal cuando ya este integrada.

Ejemplo simple:
1. git checkout main
2. git pull
3. git checkout -b feature/base-prolog
4. trabajar
5. git add .
6. git commit -m "feat(prolog): agregar base inicial de reglas"
7. git push -u origin feature/base-prolog
8. merge a main
9. borrar feature/base-prolog

## 7. Politica para cambios de requerimientos
Cuando cambie un requerimiento:
1. Crear issue explicando el cambio.
2. Marcar impacto (Prolog, API, UI, datos).
3. Crear rama feature o fix ligada al issue.
4. Implementar en orden: Prolog -> API -> UI.
5. Agregar prueba o caso de validacion.
6. Abrir PR con resumen de impacto.

Cuando se elimine un requerimiento:
1. Crear issue de deprecacion.
2. Quitar uso en UI.
3. Quitar endpoint o marcarlo deprecated.
4. Quitar reglas/consultas Prolog asociadas.
5. Mantener registro en CHANGELOG.

## 8. Checklist minimo antes de merge
- Regla Prolog nueva o modificada documentada.
- API sin logica normativa hardcodeada.
- UI muestra resultado y explicacion.
- No hay secretos ni credenciales en el repo.
- Cambio acotado a un objetivo.

## 9. Publicacion correcta en GitHub (paso a paso)
Si aun no hay repo Git local:
1. git init
2. git add .
3. git commit -m "chore: inicializar estructura del proyecto"
4. Crear repositorio vacio en GitHub.
5. git remote add origin URL_DEL_REPO
6. git branch -M main
7. git push -u origin main

Para cada funcionalidad nueva:
1. git checkout main
2. git pull
3. git checkout -b feature/nombre-corto
4. trabajar y commitear
5. git push -u origin feature/nombre-corto
6. abrir Pull Request a main

Para borrar una rama despues del merge:
1. git branch -d feature/nombre-corto
2. git push origin --delete feature/nombre-corto

## 10. Recomendacion para tu caso academico
- Mantener Prolog como fuente de verdad de la logica.
- Toda decision de cumplimiento debe provenir de Prolog.
- En cada PR incluir evidencia de que el cambio pasa por Prolog.

## 11. Primeras ramas sugeridas para arrancar
- feature/base-prolog-reglas-iniciales
- feature/api-fastapi-integracion-prolog
- feature/ui-react-consultas-verificacion
- docs/arquitectura-y-defensa-prolog

## 12. Resumen corto para no confundirse
- main es tu version estable.
- feature/* sirve para desarrollar una tarea puntual.
- fix/* sirve para corregir algo puntual.
- cuando la tarea entra a main, la rama temporal se borra.
- si mas adelante hay otro cambio, se crea otra rama nueva.
