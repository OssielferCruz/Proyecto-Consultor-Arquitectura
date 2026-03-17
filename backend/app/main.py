from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas.natural_query import NaturalQueryRequest
from .schemas.verification import VerificationRequest
from .services.prolog_client import (
    PrologExecutionError,
    consultar_lenguaje_natural,
    listar_normas,
    obtener_norma_por_id,
    verificar_cumplimiento,
)

app = FastAPI(
    title="API de Consultor de Normativas",
    version="0.1.0",
    description="API inicial para integrar FastAPI con el motor Prolog del proyecto.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get("/health")
def healthcheck() -> dict:
    return {"status": "ok", "service": "backend", "engine": "prolog"}


@app.get("/normas")
def obtener_normas(elemento: str | None = None, propiedad: str | None = None) -> dict:
    try:
        resultado = listar_normas(elemento=elemento, propiedad=propiedad)
    except PrologExecutionError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    return resultado


@app.get("/normas/{norma_id}")
def obtener_norma(norma_id: str) -> dict:
    try:
        resultado = obtener_norma_por_id(norma_id)
    except PrologExecutionError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error

    return resultado


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


@app.post("/consultas/natural")
def consulta_natural(payload: NaturalQueryRequest) -> dict:
    try:
        resultado = consultar_lenguaje_natural(payload.consulta)
    except PrologExecutionError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    return resultado
