from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend import models, login
import backend.schemas as schemas  # 💡 Importando diretamente para evitar confusão do Python
from pydantic import BaseModel, Field
from typing import List, Optional

# AGORA SIM os modelos podem vir logo abaixo:
class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str

class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: str

    class Config:
        from_attributes = True
class CategoriaBase(BaseModel):
    nome: str = Field(min_length=1, strip_whitespace=True)

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaResponse(CategoriaBase):
    id: int
    nome: str

    class Config:
        from_attributes = True


# SCHEMAS DE JÓIA

class JoiaBase(BaseModel):
    nome: str
    preco: float
    categoria_id: int
    descricao: Optional[str] = None
    imagem: Optional[str] = None

class JoiaCreate(JoiaBase):
    pass

class JoiaResponse(JoiaBase):
    id: int
    categoria: CategoriaResponse 

    class Config:
        from_attributes = True
        
class JoiaPaginada(BaseModel):
    data: List[JoiaResponse] 
    total: int               
    page: int                
    limit: int               
    pages: int               

    class Config:
        from_attributes = True

