# Sistema de Gerenciamento de Joalheria - Sprint 1

Este é um projeto acadêmico desenvolvido para a disciplina de **Programação Web**, com o objetivo de gerenciar o catálogo de uma joalheria. O sistema possui um backend em Python e um frontend responsivo utilizando Bootstrap.

## Equipe
*   Deborah Adrião 
*   Raiany Mikhelli

## Tecnologias Utilizadas

### Backend
*   **Linguagem:** Python
*   **Framework:** FastAPI
*   **Banco de Dados:** SQLite
*   **Documentação:** Swagger (Auto-gerada)

### Frontend
*   **Estrutura:** HTML5 e CSS3
*   **Estilização:** Bootstrap 5.3.3
*   **Lógica/Consumo de API:** JavaScript (jQuery/Fetch API)

---

## Como Rodar o Projeto

### 1. Configurando o Backend (Python + FastAPI)
Certifique-se de ter o Python instalado em sua máquina.

1.  Abra o terminal na pasta raiz do projeto.
2.  Navegue até a pasta do backend:
    ```bash
    cd backend
    ```
3.  Instale as dependências necessárias:
    ```bash
    pip install fastapi uvicorn
    ```
4.  Inicie o servidor:
    ```bash
    uvicorn main:app --reload
    ```
5.  O backend estará disponível em `http://127.0.0.1:8000`. 
6.  Acesse a documentação **Swagger** em: `http://127.0.0.1:8000/docs`.

### 2. Configurando o Frontend (HTML + Bootstrap)
Não é necessário instalar dependências para o frontend, pois utilizamos CDNs para o Bootstrap e jQuery.

1.  Com o backend já rodando, navegue até o arquivo abaixo e abra-o diretamente em seu navegador (ou use a extensão Live Server):
    `frontend/categorias/index.html`