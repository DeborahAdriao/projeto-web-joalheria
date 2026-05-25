from pydantic import BaseModel

# ==========================
# SCHEMAS DE CATEGORIA
# ==========================
class CategoriaBase(BaseModel):
    nome: str

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaResponse(CategoriaBase):
    id: int

    class Config:
        from_attributes = True

# ==========================
# SCHEMAS DE JÓIA
# ==========================
class JoiaBase(BaseModel):
    nome: str
    preco: float
    categoria_id: int

class JoiaCreate(JoiaBase):
    pass

class JoiaResponse(JoiaBase):
    id: int

    class Config:
        from_attributes = True