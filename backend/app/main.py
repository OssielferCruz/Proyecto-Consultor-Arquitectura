from fastapi import FastAPI, HTTPException

from .schemas.verification import VerificationRequest
from .services.prolog_client import PrologExecutionError, verificar_cumplimiento

app = FastAPI(
    title="API de Consultor de Normativas",
    version="0.1.0",
    description="API inicial para integrar FastAPI con el motor Prolog del proyecto.",
)


@app.get("/health")
def healthcheck() -> dict:
    return {"status": "ok", "service": "backend", "engine": "prolog"}


@app.post("/verificaciones/medida")
def verificar_medida(payload: VerificationRequest) -> dict:
    try:
        resultado = verificar_cumplimiento(
            elemento=payload.elemento,
            propiedad=payload.propiedad,
            valor=payload.valor,
            unidad=payload.unidad,
        )
    except PrologExecutionError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error

    return resultado
