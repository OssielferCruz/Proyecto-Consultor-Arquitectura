:- module(verificacion, [verificar_medida/8]).

:- use_module('../knowledge/normas_base').

verificar_medida(Elemento, Propiedad, Valor, Unidad, Resultado, NormaId, Explicacion, Sugerencia) :-
	norma(NormaId, Categoria, Subcategoria, Elemento, Propiedad, Restriccion, Limite, Unidad, Jurisdiccion, Fuente),
	evaluar_restriccion(Restriccion, Valor, Limite, Resultado),
	construir_explicacion(
		NormaId,
		Categoria,
		Subcategoria,
		Elemento,
		Propiedad,
		Restriccion,
		Limite,
		Unidad,
		Jurisdiccion,
		Fuente,
		Valor,
		Resultado,
		Explicacion
	),
	construir_sugerencia(Restriccion, Limite, Unidad, Valor, Resultado, Sugerencia).

evaluar_restriccion(minimo, Valor, Limite, cumple) :-
	Valor >= Limite,
	!.
evaluar_restriccion(minimo, _, _, incumple).

evaluar_restriccion(maximo, Valor, Limite, cumple) :-
	Valor =< Limite,
	!.
evaluar_restriccion(maximo, _, _, incumple).

construir_explicacion(
	NormaId,
	Categoria,
	Subcategoria,
	Elemento,
	Propiedad,
	Restriccion,
	Limite,
	Unidad,
	Jurisdiccion,
	Fuente,
	Valor,
	Resultado,
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
		valor_ingresado(Valor),
		resultado(Resultado)
	)
).

construir_sugerencia(_, _, _, _, cumple, sin_cambios).
construir_sugerencia(minimo, Limite, Unidad, Valor, incumple,
	sugerencia(aumentar_hasta, Limite, Unidad, diferencia_necesaria(Diferencia))) :-
	Diferencia is Limite - Valor.
construir_sugerencia(maximo, Limite, Unidad, Valor, incumple,
	sugerencia(reducir_hasta, Limite, Unidad, diferencia_necesaria(Diferencia))) :-
	Diferencia is Valor - Limite.
