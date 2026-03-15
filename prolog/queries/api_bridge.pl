:- module(api_bridge, [verificar_cumplimiento_json/4, listar_normas_json/0, consultar_normas_json/2, consultar_norma_por_id_json/1]).

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

listar_normas_json :-
    findall(NormaDict, norma_dict_desde_catalogo(_, _, _, _, _, _, _, _, _, _, NormaDict), Normas),
    length(Normas, Total),
    json_write_dict(current_output, _{items: Normas, total: Total}),
    nl.

consultar_normas_json(Elemento, Propiedad) :-
    findall(NormaDict, norma_dict_filtrada(Elemento, Propiedad, NormaDict), Normas),
    length(Normas, Total),
    json_write_dict(current_output, _{items: Normas, total: Total}),
    nl.

consultar_norma_por_id_json(Id) :-
    consultar_norma_por_id(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente),
    norma_to_dict(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente, NormaDict),
    json_write_dict(current_output, NormaDict),
    nl.

norma_dict_filtrada(Elemento, Propiedad, NormaDict) :-
    consultar_norma_detallada(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente),
    norma_to_dict(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente, NormaDict).

norma_dict_desde_catalogo(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente, NormaDict) :-
    consultar_norma_detallada(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente),
    norma_to_dict(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente, NormaDict).

norma_to_dict(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente,
    _{
        id: Id,
        categoria: Categoria,
        subcategoria: Subcategoria,
        elemento: Elemento,
        propiedad: Propiedad,
        restriccion: Restriccion,
        valor: Valor,
        unidad: Unidad,
        jurisdiccion: Jurisdiccion,
        fuente: Fuente
    }
).
