from pydantic import BaseModel, Field
from typing import List

# SCHEMAS DE CATEGORIA

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
    nome: str = Field(min_length=1, strip_whitespace=True)
    preco: float
    categoria_id: int

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

   