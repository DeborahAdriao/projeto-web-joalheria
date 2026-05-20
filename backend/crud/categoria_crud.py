from sqlalchemy.orm import Session
from backend.models import Categoria
from backend.schemas import CategoriaCreate, CategoriaUpdate


def create_categoria(db: Session, categoria: CategoriaCreate) -> Categoria:
    db_categoria = Categoria(nome=categoria.nome)
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def listar_categoria(db:Session):
    return db.query(Categoria).all()

def buscar_categoria(db: Session, categoria_id: int) -> Categoria:
    return db.query(Categoria).filter(Categoria.id == categoria_id).first()

def atualizar_categoria(db: Session, categoria_id: int, categoria: CategoriaUpdate) -> Categoria:
    db_categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if db_categoria:
        db_categoria.nome = categoria.nome
        db.commit()
        db.refresh(db_categoria)
    return db_categoria

def deletar_categoria(db: Session. categoria_id: int):
    db_categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if db_categoria:
        db.delete(db_categoria)
        db.commit()
    return db_categoria