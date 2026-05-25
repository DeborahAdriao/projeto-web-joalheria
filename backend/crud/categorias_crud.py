from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from backend.models import Categoria as CategoriaDB
from backend import schemas

def create_categoria(db: Session, categoria: schemas.CategoriaCreate):
    db_categoria = CategoriaDB(nome=categoria.nome)
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def listar_categoria(db: Session):
    return db.query(CategoriaDB).all()

def buscar_categoria(db: Session, categoria_id: int):
    return db.query(CategoriaDB).filter(CategoriaDB.id == categoria_id).first()

def atualizar_categoria(db: Session, categoria_id: int, categoria: schemas.CategoriaCreate):
    db_categoria = buscar_categoria(db, categoria_id)
    if db_categoria:
        db_categoria.nome = categoria.nome
        db.commit()
        db.refresh(db_categoria)
    return db_categoria

def deletar_categoria(db: Session, categoria_id: int):
    categoria = buscar_categoria(db, categoria_id)
    if not categoria:
        return None    
    try:
        db.delete(categoria)
        db.commit()
        return True
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível deletar esta categoria pois existem joias vinculadas a ela."
        )