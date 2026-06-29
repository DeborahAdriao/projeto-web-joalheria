
const API_CADASTRO = 'http://127.0.0.1:8000/usuarios'; 

$(document).ready(function() {
    
    if (localStorage.getItem('token')) {
        window.location.href = 'joias/index.html'; 
    }

    $('#form-cadastro').submit(function(event) {
        event.preventDefault(); 

        const nomeDigitado = $('#nome').val().trim();
        const emailDigitado = $('#email').val().trim();
        const senhaDigitada = $('#senha').val().trim();
        const confirmarSenhaDigitada = $('#confirmar-senha').val().trim();

        if (senhaDigitada !== confirmarSenhaDigitada) {
            mostrarToast('As palavras-passe não coincidem. Verifique e tente novamente!', 'danger');
            return; 
        }

        const pacoteDeDados = {
            nome: nomeDigitado,
            email: emailDigitado,
            senha: senhaDigitada 
        };

        const btnCadastrar = $('button[type="submit"]');
        btnCadastrar.prop('disabled', true).text('A CRIAR CONTA...');

        fetch(API_CADASTRO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pacoteDeDados)
        })
        .then(response => {
            if (response.ok) {
                event.target.reset(); 
                
                mostrarToast('Conta criada com sucesso! A redirecionar para o login...', 'success');
                
                setTimeout(function() {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                throw new Error('Não foi possível criar a conta. O e-mail introduzido já poderá estar em uso.');
            }
        })
        .catch(error => {
            console.error('Erro no processo de cadastro:', error);
            mostrarToast(error.message || 'Falha ao ligar ao servidor. Verifique se o Back-end está ativo.', 'danger');
            
            btnCadastrar.prop('disabled', false).text('CADASTRAR');
        });
    });
});

function mostrarToast(mensagem, cor) {
    const toastEl = document.getElementById('meuToast');
    const toastMensagem = document.getElementById('toast-mensagem');

    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark');
    
    toastEl.classList.add(`bg-${cor}`);
    toastMensagem.textContent = mensagem;

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}