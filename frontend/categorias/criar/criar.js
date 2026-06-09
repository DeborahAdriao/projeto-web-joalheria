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
        window.location.href = '../../joias/';
    });

    $('#form-criar-categoria').submit(function(event) {
        
        event.preventDefault();

        $('#mensagem-erro').addClass('d-none');

        const nomeDigitado = $('#nome').val().trim();

        if (!nomeDigitado) {
            $('#mensagem-erro').text('Por favor, digite um nome válido.').removeClass('d-none');
            return;
        }

        const pacoteDeDados = {
            nome: nomeDigitado
        };

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(pacoteDeDados)
        })
        .then(response => {
            if (response.ok) {
                event.target.reset();
                alert('Categoria cadastrada com sucesso!');
                window.location.href = '../'; 
            } else {
                throw new Error('O servidor recusou o cadastro.');
            }
        })

        .catch(error => {
            console.error('Erro na requisição:', error);
            $('#mensagem-erro').text('Falha ao salvar. Verifique se o backend está rodando.').removeClass('d-none');
        });
    });
});