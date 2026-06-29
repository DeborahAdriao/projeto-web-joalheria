const API_LOGIN = 'https://projeto-web-joalheria.onrender.com/login';

$(document).ready(function() {
    
    if (localStorage.getItem('token')) {
        window.location.href = 'joias/index.html'; 
    }

    $('#form-login').submit(function(event) {
        event.preventDefault(); 
        $('#mensagem-erro').addClass('d-none').text('');
        
        const btnEntrar = $('#btn-entrar');
        btnEntrar.prop('disabled', true).text('VERIFICANDO...');

        const emailDigitado = $('#email').val().trim();
        const senhaDigitada = $('#senha').val().trim();

        const formData = new URLSearchParams();
        formData.append('username', emailDigitado); 
        formData.append('password', senhaDigitada); 

        fetch(API_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData 
        })
        .then(response => {
            if (response.ok) {
                return response.json(); 
            } else if (response.status === 401) {
                throw new Error('E-mail ou senha incorretos.');
            } else if (response.status === 422) { 
                throw new Error('Formato de envio incompatível com o servidor.');
            } else {
                throw new Error('Erro no servidor ao tentar fazer login. Código: ' + response.status);
            }
        })
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('email_usuario', emailDigitado); 
                
                window.location.href = 'joias/index.html'; 
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