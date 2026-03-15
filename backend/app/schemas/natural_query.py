from pydantic import BaseModel, Field


class NaturalQueryRequest(BaseModel):
    consulta: str = Field(..., description="Consulta en lenguaje natural simplificado")
