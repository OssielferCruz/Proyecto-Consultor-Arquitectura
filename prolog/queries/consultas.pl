:- module(consultas, [consultar_norma/6, verificar_cumplimiento/8]).

:- use_module('../knowledge/normas_base').
:- use_module('../rules/verificacion').

consultar_norma(Elemento, Propiedad, Categoria, Restriccion, Valor, Unidad) :-
	norma(_, Categoria, _, Elemento, Propiedad, Restriccion, Valor, Unidad, _, _).

verificar_cumplimiento(Elemento, Propiedad, Valor, Unidad, Resultado, NormaId, Explicacion, Sugerencia) :-
	verificar_medida(Elemento, Propiedad, Valor, Unidad, Resultado, NormaId, Explicacion, Sugerencia).
