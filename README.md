# Sistema de Gerenciamento de Joalheria - Sprint 2

Este é um projeto acadêmico desenvolvido para a disciplina de **Programação Web**, com o objetivo de gerenciar o catálogo de uma joalheria. O sistema possui um backend em Python e um frontend responsivo utilizando Bootstrap.

## Equipe
* Deborah Adrião 
* Raiany Mikhelli

---

## Credenciais de Acesso (Avaliação Sprint 2)
Para testar os requisitos de autenticação e operações restritas (Criar, Editar e Excluir), utilize o usuário administrador já configurado no banco de dados:
* **E-mail:** `admin@joalheria.com`
* **Senha:** `admin123`

---

## Tecnologias Utilizadas

### Backend
* **Linguagem:** Python
* **Framework:** FastAPI
* **Banco de Dados:** SQLite
* **Segurança:** PyJWT (Tokens JWT) e OAuth2
* **Documentação:** Swagger (Auto-gerada)

### Frontend
* **Estrutura:** HTML5 e CSS3
* **Estilização:** Bootstrap 5.3.3
* **Lógica/Consumo de API:** JavaScript (jQuery/Fetch API)

---

## Como Rodar o Projeto

### 1. Configurando o Backend (Python + FastAPI)

Certifique-se de ter o Python instalado em sua máquina. Abra o terminal na pasta raiz do projeto.

**Passo A: Criar e ativar o ambiente virtual**
* No Windows:
  ```
  python -m venv .venv
  .\.venv\Scripts\activate
  ```

  * No Mac/Linux:
  ```
  python3 -m venv .venv
  source .venv/bin/activate
  ```

**Passo B: Instalar as dependências necessárias (Atualizado)**
Com o ambiente ativado, rode:
```
pip install fastapi uvicorn sqlalchemy pydantic PyJWT python-multipart passlib bcrypt==4.0.1 python-dotenv fastapi-mail
```

**Passo C: Configurar Variáveis de Ambiente (.env)**
Para que o envio de e-mails de boas-vindas funcione corretamente no cadastro, crie um arquivo chamado `.env` na raiz do backend e adicione as credenciais fornecidas pela equipe:
`EMAIL_REMETENTE=email_de_teste@gmail.com`
`EMAIL_SENHA=senha_de_app`

**Passo D: Limpeza do Banco de Dados (Importante)**
Como a estrutura das tabelas foi atualizada nesta Sprint (adição de imagens e descrições), exclua o arquivo joalheria.db (caso exista de execuções anteriores) antes de rodar o servidor. O sistema recriará o banco automaticamente.

**Passo E: Iniciar o servidor**
Ainda na pasta raiz, execute o comando:
```
uvicorn backend.main:app --reload
```
---

* **O backend estará disponível em:** http://127.0.0.1:8000
* **Acesse a documentação interativa (Swagger) em:** http://127.0.0.1:8000/docs

### 2. Configurando o Frontend (HTML + Bootstrap)
Não é necessário instalar dependências para o frontend, pois utilizamos CDNs para o Bootstrap e jQuery. Com o backend já rodando em segundo plano:

* Navegue até a pasta frontend pelo seu explorador de arquivos.
* Abra o arquivo login.html (para acessar o sistema como administrador) ou joias/index.html (para visualização pública da vitrine) diretamente em seu navegador, ou utilize a extensão Live Server do VS Code.

---

## Links em Produção
* **O backend estará disponível em:** http://127.0.0.1:8000
* **Acesse a documentação interativa (Swagger) em:** http://127.0.0.1:8000/docs
* **Frontend da Aplicação:** [COLOCAR]
* **Backend (API):** [COLOCAR]
