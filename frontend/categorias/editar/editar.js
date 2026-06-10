if (!localStorage.getItem('token')) {
    window.location.href = '../../login.html'; 
}

const API_URL = 'http://127.0.0.1:8000/categorias';

$(document).ready(function() {

    const emailUsuario = localStorage.getItem('email_usuario');
    if (emailUsuario) {
        $('#usuario-logado').text(emailUsuario).removeClass('d-none');
    }
    
    $('#btn-sair').click(function() {
        localStorage.removeItem('token');
        localStorage.removeItem('email_usuario');
        window.location.href = '../../login.html';
    });

    const urlParams = new URLSearchParams(window.location.search);
    const categoriaId = urlParams.get('id');
    
    if (!categoriaId) {
        alert('Nenhuma categoria selecionada para edição!');
        window.location.href = '../';
        return;
    }

    fetch(`${API_URL}/${categoriaId}`)
        .then(response => {
            if (!response.ok) throw new Error('Categoria não encontrada no banco de dados');
            return response.json();
        })
        .then(categoria => {
            $('#nome').val(categoria.nome);
        })
        .catch(error => {
            console.error('Erro:', error);
            $('#mensagem-erro').text('Falha ao carregar os dados. O backend está rodando?').removeClass('d-none');
        });

    $('#form-editar-categoria').submit(function(event) {
        event.preventDefault(); 
        $('#mensagem-erro').addClass('d-none');

        const nomeAtualizado = $('#nome').val().trim();

        if (!nomeAtualizado) {
            $('#mensagem-erro').text('O nome da categoria não pode ficar vazio.').removeClass('d-none');
            return;
        }

        const pacoteDeDados = { nome: nomeAtualizado };

        fetch(`${API_URL}/${categoriaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Token incluído!
            },
            body: JSON.stringify(pacoteDeDados)
        })
        .then(response => {
            if (response.ok) {
                event.target.reset();
                alert('Categoria updated com sucesso!');
                window.location.href = '../'; 
            } else {
                throw new Error('O servidor recusou a atualização.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            $('#mensagem-erro').text('Erro ao atualizar a categoria.').removeClass('d-none');
        });
    });
});