from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend import models, schemas
from backend.database import SessionLocal

def criar_usuario(db: Session, usuario: schemas.UsuarioCreate):
    # 1. Verifica se o e-mail já existe
    usuario_existente = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Este e-mail já está cadastrado em nosso sistema."
        )
    
    # Import local do login para evitar importação cíclica (nó no Python)
    from backend import login
    
    # 2. Criptografa a senha
    senha_criptografada = login.obter_hash_senha(usuario.senha)
    
    # 3. Cria e salva o usuário
    novo_usuario = models.Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=senha_criptografada
    )
    
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    
    return novo_usuario


def criar_usuario_admin_cron():
    """Cria o usuário administrador padrão se ele ainda não existir"""
    db = SessionLocal()
    try:
        from backend import login
        
        admin_existente = db.query(models.Usuario).filter(models.Usuario.email == "admin@joalheria.com").first()
        if not admin_existente:
            senha_criptografada = login.obter_hash_senha("admin123")
            novo_admin = models.Usuario(
                nome="Administrador",
                email="admin@joalheria.com",
                senha=senha_criptografada
            )
            db.add(novo_admin)
            db.commit()
            print("======= USUÁRIO ADMIN CRIADO COM SUCESSO =======")
    except Exception as e:
        print(f"Erro ao criar admin automático: {e}")
    finally:
        db.close()