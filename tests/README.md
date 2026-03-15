# Pruebas

Este directorio contendra pruebas del motor Prolog, de la API y pruebas de integracion.

## Ejecutar pruebas Prolog

Desde la raiz del proyecto:

```bash
swipl -q -g "['tests/prolog/verificacion_base_tests.pl'], run_tests, halt."
```

Si todas las pruebas pasan, Prolog terminara sin errores.
