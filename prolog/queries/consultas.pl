:- module(consultas, [consultar_norma/6, consultar_norma_detallada/10, consultar_norma_por_id/10, verificar_cumplimiento/8]).

:- use_module('../knowledge/normas_base').
:- use_module('../rules/verificacion').

consultar_norma(Elemento, Propiedad, Categoria, Restriccion, Valor, Unidad) :-
	norma(_, Categoria, _, Elemento, Propiedad, Restriccion, Valor, Unidad, _, _).

consultar_norma_detallada(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente) :-
	norma(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente).

consultar_norma_por_id(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente) :-
	norma(Id, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Valor, Unidad, Jurisdiccion, Fuente).

verificar_cumplimiento(Elemento, Propiedad, Valor, Unidad, Resultado, NormaId, Explicacion, Sugerencia) :-
	verificar_medida(Elemento, Propiedad, Valor, Unidad, Resultado, NormaId, Explicacion, Sugerencia).
