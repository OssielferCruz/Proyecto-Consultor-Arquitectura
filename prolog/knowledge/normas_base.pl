:- module(normas_base, [norma/10]).

% norma(
%   Id,
%   Categoria,
%   Subcategoria,
%   Elemento,
%   Propiedad,
%   Restriccion,
%   Valor,
%   Unidad,
%   Jurisdiccion,
%   Fuente
% ).

norma(norma_puerta_ancho_minimo,
	accesibilidad,
	puertas,
	puerta,
	ancho,
	minimo,
	0.90,
	metros,
	general,
	manual_base).

norma(norma_habitacion_altura_minima,
	dimensiones,
	habitaciones,
	habitacion,
	altura,
	minimo,
	2.40,
	metros,
	general,
	manual_base).

norma(norma_pasillo_ancho_minimo,
	circulacion,
	pasillos,
	pasillo,
	ancho,
	minimo,
	1.20,
	metros,
	general,
	manual_base).

norma(norma_rampa_pendiente_maxima,
	accesibilidad,
	rampas,
	rampa,
	pendiente,
	maximo,
	8.00,
	porcentaje,
	general,
	manual_base).
