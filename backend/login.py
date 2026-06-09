import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm 
from sqlalchemy.orm import Session 
from backend import models 
from backend.database import get_db

SECRET_KEY = "chave_secreta_joalheria"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def autenticar_usuario(dados: OAuth2PasswordRequestForm, db: Session):
    """Valida as credenciais consultando o banco de dados e gera o token JWT real"""
    
    usuario_db = db.query(models.Usuario).filter(models.Usuario.email == dados.username).first()
    
    if not usuario_db or usuario_db.senha != dados.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos."
        )
        
    tempo_expiracao = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": usuario_db.email, "exp": tempo_expiracao}
    
    token_real = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {
        "access_token": token_real,
        "token_type": "bearer",
        "status": "sucesso"
    }

def verificar_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Injetável (Dependência) para proteger as rotas verificando no banco"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )
            
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado ou inválido"
        )

    usuario_db = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    
    if not usuario_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado no sistema"
        )
        
    return usuario_db.email