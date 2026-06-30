from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend import models, schemas
from backend.database import SessionLocal

def criar_usuario(db: Session, usuario: schemas.UsuarioCreate):
    # Verificação de e-mail duplicad
    usuario_existente = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Este e-mail já está cadastrado em nosso sistema."
        )
    
    
    from backend import login
    
  
    senha_criptografada = login.obter_hash_senha(usuario.senha)
    
    
    novo_usuario = models.Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=senha_criptografada
    )
    
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    
    return novo_usuario

#vai ser criado toda vez que forçar um deploy para iniciar já no BD e a gente conseguir usar o sistema
def criar_usuario_admin_cron():
    """Cria o usuário administrador padrão quando inicializa o sistema"""
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