from pydantic import BaseModel, Field

# SCHEMAS DE CATEGORIA

class CategoriaBase(BaseModel):
    nome: str = Field(min_length=1, strip_whitespace=True)

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaResponse(CategoriaBase):
    id: int

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

    class Config:
        from_attributes = True
