:- begin_tests(verificacion_base).

:- use_module('../../prolog/queries/consultas').

test(consulta_norma_puerta) :-
    once(consultar_norma(puerta, ancho, Categoria, Restriccion, Valor, Unidad)),
    assertion(Categoria == accesibilidad),
    assertion(Restriccion == minimo),
    assertion(Valor =:= 0.90),
    assertion(Unidad == metros).

test(verificacion_puerta_cumple) :-
    once(verificar_cumplimiento(puerta, ancho, 0.95, metros, Resultado, NormaId, Explicacion, Sugerencia)),
    assertion(Resultado == cumple),
    assertion(NormaId == norma_puerta_ancho_minimo),
    assertion(Explicacion == explicacion(norma_puerta_ancho_minimo, minimo, 0.9, metros, 0.95, cumple)),
    assertion(Sugerencia == sin_cambios).

test(verificacion_rampa_incumple) :-
    once(verificar_cumplimiento(rampa, pendiente, 10.0, porcentaje, Resultado, NormaId, Explicacion, Sugerencia)),
    assertion(Resultado == incumple),
    assertion(NormaId == norma_rampa_pendiente_maxima),
    assertion(Explicacion == explicacion(norma_rampa_pendiente_maxima, maximo, 8.0, porcentaje, 10.0, incumple)),
    assertion(Sugerencia == sugerencia(reducir_hasta, 8.0, porcentaje)).

:- end_tests(verificacion_base).
