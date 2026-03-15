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


def verificar_cumplimiento(elemento: str, propiedad: str, valor: float, unidad: str) -> dict:
    goal = (
        f"['{API_BRIDGE_PATH.as_posix()}'], "
        f"verificar_cumplimiento_json({_quote_atom(elemento)}, {_quote_atom(propiedad)}, {valor}, {_quote_atom(unidad)}), "
        "halt."
    )

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
