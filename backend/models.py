from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, index=True)

    # Relação com as joias
    joias = relationship("Joia", back_populates="categoria")

class Joia(Base):
    __tablename__ = "joias"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    preco = Column(Float)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))

    # Relação com a categoria
    categoria = relationship("Categoria", back_populates="joias")