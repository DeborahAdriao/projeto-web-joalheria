import os
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType


load_dotenv()


conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_REMETENTE"),
    MAIL_PASSWORD=os.getenv("EMAIL_SENHA"),
    MAIL_FROM=os.getenv("EMAIL_REMETENTE"),
    MAIL_PORT=465,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def enviar_email_boas_vindas(email_destino: str, nome: str):
    """Monta a mensagem de boas vindas e dispara o e-mail"""
    
    html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Olá, {nome}! ✨</h2>
        <p>Seu cadastro na <strong>Joalheria</strong> foi realizado com sucesso!</p>
        <p>Ficamos muito felizes em ter você conosco.</p>
    </div>
    """

    message = MessageSchema(
        subject="Bem-vindo(a) à Joalheria!",
        recipients=[email_destino],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)