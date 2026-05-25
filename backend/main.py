from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware # <-- 1. NOVO IMPORT AQUI NO TOPO
from sqlalchemy.orm import Session
from typing import List

from backend import models, schemas
from backend.database import engine, get_db

import backend.crud.categorias_crud as categoria_crud
import backend.crud.joias_crud as joias_crud

app = FastAPI(title="API Joalheria - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

#Rota para categoria

@app.post("/categorias", response_model=schemas.CategoriaResponse, status_code=status.HTTP_201_CREATED, tags=["Categorias"])
def rota_criar_categoria(categoria: schemas.CategoriaCreate, db: Session = Depends(get_db)):
    return categoria_crud.create_categoria(db=db, categoria=categoria)

@app.get("/categorias", response_model=List[schemas.CategoriaResponse], tags=["Categorias"])
def rota_listar_categorias(db: Session = Depends(get_db)):
    return categoria_crud.listar_categoria(db=db)

@app.get("/categorias/{categoria_id}", response_model=schemas.CategoriaResponse, tags=["Categorias"])
def rota_buscar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    db_categoria = categoria_crud.buscar_categoria(db=db, categoria_id=categoria_id)
    if not db_categoria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoria não encontrada.")
    return db_categoria

@app.put("/categorias/{categoria_id}", response_model=schemas.CategoriaResponse, tags=["Categorias"])
def rota_atualizar_categoria(categoria_id: int, categoria: schemas.CategoriaCreate, db: Session = Depends(get_db)):
    db_categoria = categoria_crud.atualizar_categoria(db=db, categoria_id=categoria_id, categoria=categoria)
    if not db_categoria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoria não encontrada.")
    return db_categoria

@app.delete("/categorias/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Categorias"])
def rota_deletar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    sucesso = categoria_crud.deletar_categoria(db=db, categoria_id=categoria_id)
    if sucesso is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoria não encontrada.")
    return None

#Rota para Joia

@app.post("/joias", response_model=schemas.JoiaResponse, status_code=status.HTTP_201_CREATED, tags=["Jóias"])
def rota_criar_joia(joia: schemas.JoiaCreate, db: Session = Depends(get_db)):
    categoria_existe = categoria_crud.buscar_categoria(db=db, categoria_id=joia.categoria_id)
    if not categoria_existe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoria inválida.")
    return joias_crud.criar_joia(db=db, dados=joia)

@app.get("/joias", response_model=List[schemas.JoiaResponse], tags=["Jóias"])
def rota_listar_joias(db: Session = Depends(get_db)):
    return joias_crud.listar_joias(db=db)

@app.get("/joias/{joia_id}", response_model=schemas.JoiaResponse, tags=["Jóias"])
def rota_buscar_joia(joia_id: int, db: Session = Depends(get_db)):
    db_joia = joias_crud.buscar_joia(db=db, joia_id=joia_id)
    if not db_joia:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jóia não encontrada.")
    return db_joia

@app.put("/joias/{joia_id}", response_model=schemas.JoiaResponse, tags=["Jóias"])
def rota_atualizar_joia(joia_id: int, joia: schemas.JoiaCreate, db: Session = Depends(get_db)):
    categoria_existe = categoria_crud.buscar_categoria(db=db, categoria_id=joia.categoria_id)
    if not categoria_existe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoria inválida.")
    db_joia = joias_crud.atualizar_joia(db=db, joia_id=joia_id, joia=joia)
    if not db_joia:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jóia não encontrada.")
    return db_joia

@app.delete("/joias/{joia_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Jóias"])
def rota_deletar_joia(joia_id: int, db: Session = Depends(get_db)):
    db_joia = joias_crud.deletar_joia(db=db, joia_id=joia_id)
    if not db_joia:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jóia não encontrada.")
    return None