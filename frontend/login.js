const API_LOGIN = 'http://127.0.0.1:8000/login';

$(document).ready(function() {
    
    if (localStorage.getItem('token')) {
        window.location.href = 'joias/'; 
    }

    $('#form-login').submit(function(event) {
        event.preventDefault(); 
        $('#mensagem-erro').addClass('d-none').text('');
        
        const btnEntrar = $('#btn-entrar');
        btnEntrar.prop('disabled', true).text('VERIFICANDO...');

        const credenciais = {
            email: $('#email').val().trim(),
            senha: $('#senha').val().trim()
        };

        fetch(API_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciais)
        })
        .then(response => {
            if (response.ok) {
                return response.json(); 
            } else if (response.status === 401) {
                throw new Error('E-mail ou senha incorretos.');
            } else {
                throw new Error('Erro no servidor ao tentar fazer login. Código: ' + response.status);
            }
        })
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('email_usuario', credenciais.email); 
                
                window.location.href = 'joias/'; 
            } else {
                throw new Error('Token de acesso não foi enviado pelo servidor.');
            }
        })
        .catch(error => {
            console.error('Erro de login:', error);
            $('#mensagem-erro').text(error.message).removeClass('d-none');
            btnEntrar.prop('disabled', false).text('ENTRAR');
        });
    });
});