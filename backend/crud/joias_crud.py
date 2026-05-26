from sqlalchemy.orm import Session
from backend.models import Joia as JoiaDB 
from backend import schemas

def criar_joia(db: Session, dados: schemas.JoiaCreate): 
    joia = JoiaDB(**dados.model_dump())
    db.add(joia)
    db.commit()
    db.refresh(joia)
    return joia

def listar_joias(db: Session):
    return db.query(JoiaDB).all()

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
