:- module(api_bridge, [verificar_cumplimiento_json/4]).

:- use_module(library(http/json)).
:- use_module('consultas').

verificar_cumplimiento_json(Elemento, Propiedad, Valor, Unidad) :-
    verificar_cumplimiento(Elemento, Propiedad, Valor, Unidad, Resultado, NormaId, Explicacion, Sugerencia),
    build_response_dict(Resultado, NormaId, Explicacion, Sugerencia, Response),
    json_write_dict(current_output, Response),
    nl.

build_response_dict(Resultado, NormaId, Explicacion, Sugerencia, _{
    resultado: Resultado,
    norma_id: NormaId,
    explicacion: ExplicacionDict,
    sugerencia: SugerenciaDict
}) :-
    explicacion_to_dict(Explicacion, ExplicacionDict),
    sugerencia_to_dict(Sugerencia, SugerenciaDict).

explicacion_to_dict(
    explicacion(
        norma_id(NormaId),
        categoria(Categoria),
        subcategoria(Subcategoria),
        elemento(Elemento),
        propiedad(Propiedad),
        restriccion(Restriccion),
        limite(Limite),
        unidad(Unidad),
        jurisdiccion(Jurisdiccion),
        fuente(Fuente),
        valor_ingresado(ValorIngresado),
        resultado(Resultado)
    ),
    _{
        norma_id: NormaId,
        categoria: Categoria,
        subcategoria: Subcategoria,
        elemento: Elemento,
        propiedad: Propiedad,
        restriccion: Restriccion,
        limite: Limite,
        unidad: Unidad,
        jurisdiccion: Jurisdiccion,
        fuente: Fuente,
        valor_ingresado: ValorIngresado,
        resultado: Resultado
    }
).

sugerencia_to_dict(sin_cambios, _{accion: sin_cambios}).
sugerencia_to_dict(
    sugerencia(Accion, Objetivo, Unidad, diferencia_necesaria(Diferencia)),
    _{
        accion: Accion,
        objetivo: Objetivo,
        unidad: Unidad,
        diferencia_necesaria: Diferencia
    }
).
