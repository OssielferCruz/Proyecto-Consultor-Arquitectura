:- begin_tests(verificacion_base).

:- use_module('../../prolog/queries/consultas').

test(consulta_norma_puerta) :-
    once(consultar_norma(puerta, ancho, Categoria, Restriccion, Valor, Unidad)),
    assertion(Categoria == accesibilidad),
    assertion(Restriccion == minimo),
    assertion(Valor =:= 0.90),
    assertion(Unidad == metros).

test(consulta_norma_detallada_escalera) :-
    once(consultar_norma_detallada(Id, Categoria, Subcategoria, escalera, ancho, Restriccion, Valor, Unidad, Jurisdiccion, Fuente)),
    assertion(Id == norma_escalera_ancho_minimo),
    assertion(Categoria == circulacion),
    assertion(Subcategoria == escaleras),
    assertion(Restriccion == minimo),
    assertion(Valor =:= 1.00),
    assertion(Unidad == metros),
    assertion(Jurisdiccion == general),
    assertion(Fuente == manual_base).

test(consulta_norma_por_id_rampa) :-
    once(consultar_norma_por_id(norma_rampa_pendiente_maxima, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente)),
    assertion(Categoria == accesibilidad),
    assertion(Subcategoria == rampas),
    assertion(Elemento == rampa),
    assertion(Propiedad == pendiente),
    assertion(Restriccion == maximo),
    assertion(Valor =:= 8.00),
    assertion(Unidad == porcentaje),
    assertion(Jurisdiccion == general),
    assertion(Fuente == manual_base).

test(verificacion_puerta_cumple) :-
    once(verificar_cumplimiento(puerta, ancho, 0.95, metros, Resultado, NormaId, Explicacion, Sugerencia)),
    assertion(Resultado == cumple),
    assertion(NormaId == norma_puerta_ancho_minimo),
    assertion(Explicacion == explicacion(
        norma_id(norma_puerta_ancho_minimo),
        categoria(accesibilidad),
        subcategoria(puertas),
        elemento(puerta),
        propiedad(ancho),
        restriccion(minimo),
        limite(0.9),
        unidad(metros),
        jurisdiccion(general),
        fuente(manual_base),
        valor_ingresado(0.95),
        resultado(cumple)
    )),
    assertion(Sugerencia == sin_cambios).

test(verificacion_rampa_incumple) :-
    once(verificar_cumplimiento(rampa, pendiente, 10.0, porcentaje, Resultado, NormaId, Explicacion, Sugerencia)),
    assertion(Resultado == incumple),
    assertion(NormaId == norma_rampa_pendiente_maxima),
    assertion(Explicacion == explicacion(
        norma_id(norma_rampa_pendiente_maxima),
        categoria(accesibilidad),
        subcategoria(rampas),
        elemento(rampa),
        propiedad(pendiente),
        restriccion(maximo),
        limite(8.0),
        unidad(porcentaje),
        jurisdiccion(general),
        fuente(manual_base),
        valor_ingresado(10.0),
        resultado(incumple)
    )),
    assertion(Sugerencia == sugerencia(reducir_hasta, 8.0, porcentaje, diferencia_necesaria(2.0))).

:- end_tests(verificacion_base).
