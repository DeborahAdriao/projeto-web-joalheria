from sqlalchemy.orm import Session
from backend.models import Joia as JoiaDB 
from backend import schemas



def criar_joia(db: Session, dados: JoiaCreate):
    db_joia = Joia(**dados.model_dump()) 
    db.add(db_joia)
    db.commit()
    db.refresh(db_joia) 
    return db_joia

def listar_joias(db: Session, nome: str = None, page: int = 1, limit: int = 10):
    query = db.query(models.Joia)
    
    if nome:
        query = query.filter(models.Joia.nome.ilike(f"%{nome}%"))

    total_registros = query.count()

    offset = (page - 1) * limit

    joias = query.offset(offset).limit(limit).all()
    
    import math
    total_paginas = math.ceil(total_registros / limit)
    
    return {
        "data": joias,
        "total": total_registros,
        "page": page,
        "limit": limit,
        "pages": total_paginas
    }

def buscar_joia(db: Session, joia_id: int):
    return db.query(JoiaDB).filter(JoiaDB.id == joia_id).first()

def atualizar_joia(db: Session, joia_id: int, joia: schemas.JoiaCreate):
    db_joia = buscar_joia(db, joia_id)
    if db_joia:
        db_joia.nome = joia.nome
        db_joia.preco = joia.preco
        db_joia.categoria_id = joia.categoria_id
        db.commit()
        db.refresh(db_joia)
    return db_joia

def deletar_joia(db: Session, joia_id: int):
    db_joia = buscar_joia(db, joia_id)
    if db_joia:
        db.delete(db_joia)
        db.commit()
    return db_joia