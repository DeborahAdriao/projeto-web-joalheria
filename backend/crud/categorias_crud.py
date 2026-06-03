from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend import models, schemas

def create_categoria(db: Session, categoria: schemas.CategoriaCreate):
    db_categoria = models.Categoria(nome=categoria.nome)
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def listar_categoria(db: Session):
    return db.query(models.Categoria).all()

def buscar_categoria(db: Session, categoria_id: int):
    return db.query(models.Categoria).filter(models.Categoria.id == categoria_id).first()

def atualizar_categoria(db: Session, categoria_id: int, categoria: schemas.CategoriaCreate):
    db_categoria = buscar_categoria(db, categoria_id)
    if db_categoria:
        db_categoria.nome = categoria.nome
        db.commit()
        db.refresh(db_categoria)
    return db_categoria

def deletar_categoria(db: Session, categoria_id: int):
    db_categoria = db.query(models.Categoria).filter(models.Categoria.id == categoria_id).first()
    
    if not db_categoria:
        return None
    joias_vinculadas = db.query(models.Joia).filter(models.Joia.categoria_id == categoria_id).first()
    
    if joias_vinculadas:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível deletar esta categoria pois existem joias vinculadas a ela."
        )
        
    db.delete(db_categoria)
    db.commit()
    return True