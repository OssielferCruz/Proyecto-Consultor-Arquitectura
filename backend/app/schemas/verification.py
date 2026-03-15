from pydantic import BaseModel, Field


class VerificationRequest(BaseModel):
    elemento: str = Field(..., description="Elemento arquitectonico a verificar")
    propiedad: str = Field(..., description="Propiedad normativa del elemento")
    valor: float = Field(..., description="Valor ingresado por el usuario")
    unidad: str = Field(..., description="Unidad del valor ingresado")
