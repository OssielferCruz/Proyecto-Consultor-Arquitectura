:- module(api_bridge, [
    verificar_cumplimiento_json/4,
    listar_normas_json/0,
    consultar_normas_json/2,
    consultar_norma_por_id_json/1,
    consultar_natural_json/1
]).

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

consultar_natural_json(Texto) :-
    (   interpretar_consulta_natural(Texto, Elemento, Propiedad)
    ->  findall(NormaDict, norma_dict_filtrada(Elemento, Propiedad, NormaDict), Normas),
        length(Normas, Total),
        json_write_dict(current_output, _{
            tipo: consulta_normativa,
            consulta_original: Texto,
            interpretacion: _{elemento: Elemento, propiedad: Propiedad},
            items: Normas,
            total: Total
        })
    ;   json_write_dict(current_output, _{
            tipo: consulta_normativa,
            consulta_original: Texto,
            error: 'No se pudo interpretar la consulta. Prueba con frases como: ancho minimo de puerta.'
        })
    ),
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

interpretar_consulta_natural(Texto, Elemento, Propiedad) :-
    downcase_atom(Texto, Normalizado),
    detectar_elemento(Normalizado, Elemento),
    detectar_propiedad(Normalizado, Propiedad).

detectar_elemento(Texto, puerta) :- contiene_alguno(Texto, [puerta, puertas]), !.
detectar_elemento(Texto, habitacion) :- contiene_alguno(Texto, [habitacion, habitaciones, cuarto, cuartos]), !.
detectar_elemento(Texto, pasillo) :- contiene_alguno(Texto, [pasillo, pasillos]), !.
detectar_elemento(Texto, rampa) :- contiene_alguno(Texto, [rampa, rampas]), !.
detectar_elemento(Texto, escalera) :- contiene_alguno(Texto, [escalera, escaleras]), !.
detectar_elemento(Texto, ventana) :- contiene_alguno(Texto, [ventana, ventanas]), !.

detectar_propiedad(Texto, ancho) :- contiene_alguno(Texto, [ancho, anchura]), !.
detectar_propiedad(Texto, altura) :- contiene_alguno(Texto, [altura, alto]), !.
detectar_propiedad(Texto, pendiente) :- contiene_alguno(Texto, [pendiente, inclinacion]), !.
detectar_propiedad(Texto, area) :- contiene_alguno(Texto, [area, superficie]), !.

contiene_alguno(Texto, [Termino | _]) :- sub_atom(Texto, _, _, _, Termino), !.
contiene_alguno(Texto, [_ | Resto]) :- contiene_alguno(Texto, Resto).
