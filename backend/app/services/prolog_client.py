from __future__ import annotations

import json
import subprocess
from pathlib import Path


class PrologExecutionError(RuntimeError):
    pass


PROJECT_ROOT = Path(__file__).resolve().parents[3]
API_BRIDGE_PATH = PROJECT_ROOT / "prolog" / "queries" / "api_bridge.pl"


def _quote_atom(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace("'", "\\'")
    return f"'{escaped}'"


def _run_prolog_goal(goal: str) -> dict:
    command = ["swipl", "-q", "-g", goal]
    process = subprocess.run(
        command,
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )

    if process.returncode != 0:
        raise PrologExecutionError(process.stderr.strip() or "No se pudo ejecutar SWI-Prolog")

    stdout = process.stdout.strip()
    if not stdout:
        raise PrologExecutionError("Prolog no devolvio una respuesta")

    try:
        return json.loads(stdout)
    except json.JSONDecodeError as error:
        raise PrologExecutionError(f"Respuesta JSON invalida de Prolog: {stdout}") from error


def verificar_cumplimiento(elemento: str, propiedad: str, valor: float, unidad: str) -> dict:
    goal = (
        f"['{API_BRIDGE_PATH.as_posix()}'], "
        f"verificar_cumplimiento_json({_quote_atom(elemento)}, {_quote_atom(propiedad)}, {valor}, {_quote_atom(unidad)}), "
        "halt."
    )

    return _run_prolog_goal(goal)


def listar_normas(elemento: str | None = None, propiedad: str | None = None) -> dict:
    if elemento is None and propiedad is None:
        goal = f"['{API_BRIDGE_PATH.as_posix()}'], listar_normas_json, halt."
        return _run_prolog_goal(goal)

    if elemento is None or propiedad is None:
        raise PrologExecutionError("Para filtrar normas debes indicar elemento y propiedad")

    goal = (
        f"['{API_BRIDGE_PATH.as_posix()}'], "
        f"consultar_normas_json({_quote_atom(elemento)}, {_quote_atom(propiedad)}), "
        "halt."
    )

    return _run_prolog_goal(goal)


def obtener_norma_por_id(norma_id: str) -> dict:
    goal = (
        f"['{API_BRIDGE_PATH.as_posix()}'], "
        f"consultar_norma_por_id_json({_quote_atom(norma_id)}), "
        "halt."
    )

    return _run_prolog_goal(goal)
