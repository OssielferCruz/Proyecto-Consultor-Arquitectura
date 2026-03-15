:- module(verificacion, [verificar_medida/8]).

:- use_module('../knowledge/normas_base').

verificar_medida(Elemento, Propiedad, Valor, Unidad, Resultado, NormaId, Explicacion, Sugerencia) :-
	norma(NormaId, _, _, Elemento, Propiedad, Restriccion, Limite, Unidad, _, _),
	evaluar_restriccion(Restriccion, Valor, Limite, Resultado),
	construir_explicacion(NormaId, Restriccion, Limite, Unidad, Valor, Resultado, Explicacion),
	construir_sugerencia(Restriccion, Limite, Unidad, Resultado, Sugerencia).

evaluar_restriccion(minimo, Valor, Limite, cumple) :-
	Valor >= Limite,
	!.
evaluar_restriccion(minimo, _, _, incumple).

evaluar_restriccion(maximo, Valor, Limite, cumple) :-
	Valor =< Limite,
	!.
evaluar_restriccion(maximo, _, _, incumple).

construir_explicacion(NormaId, Restriccion, Limite, Unidad, Valor, Resultado,
	explicacion(NormaId, Restriccion, Limite, Unidad, Valor, Resultado)).

construir_sugerencia(_, _, _, cumple, sin_cambios).
construir_sugerencia(minimo, Limite, Unidad, incumple,
	sugerencia(aumentar_hasta, Limite, Unidad)).
construir_sugerencia(maximo, Limite, Unidad, incumple,
	sugerencia(reducir_hasta, Limite, Unidad)).
