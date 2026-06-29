if (!localStorage.getItem('token')) {
    window.location.href = '../../login.html'; 
}

const API_JOIAS = 'https://projeto-web-joalheria.onrender.com/joias';
const API_CATEGORIAS = 'https://projeto-web-joalheria.onrender.com/categorias';

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

    carregarCategoriasParaSelect();

    $('#form-criar-joia').submit(function(event) {
        event.preventDefault(); 
        $('#mensagem-erro').addClass('d-none');

        const nomeDigitado = $('#nome').val().trim();
        const precoDigitado = parseFloat($('#preco').val());
        const categoriaEscolhida = parseInt($('#categoria_id').val());

        if (!nomeDigitado || isNaN(precoDigitado) || isNaN(categoriaEscolhida)) {
            $('#mensagem-erro').text('Por favor, preencha todos os campos corretamente.').removeClass('d-none');
            return;
        }

        const pacoteDeDados = {
            nome: $('#nome').val().trim(),
            preco: parseFloat($('#preco').val()),
            categoria_id: parseInt($('#categoria_id').val()),
            imagem: $('#imagem').val().trim(),
            descricao: $('#descricao').val().trim()
        };

        fetch(API_JOIAS, {
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
                mostrarToast('Joia adicionada ao catálogo com sucesso! Redirecionando...', 'success');
                setTimeout(function() {
                    window.location.href = '../index.html'; 
                }, 2000);
            } else {
                throw new Error('O servidor recusou o cadastro.');
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            $('#mensagem-erro').text('Falha ao salvar a joia. Verifique se o backend está rodando.').removeClass('d-none');
        });
    });
});

function carregarCategoriasParaSelect() {
    fetch(API_CATEGORIAS)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar categorias');
            return response.json();
        })
        .then(categorias => {
            const select = $('#categoria_id');
            select.empty(); 

            if (categorias.length === 0) {
                select.append('<option value="">Cadastre uma categoria primeiro!</option>');
                $('button[type="submit"]').prop('disabled', true);
                return;
            }

            select.append('<option value="">Selecione...</option>');
            categorias.forEach(cat => {
                select.append(`<option value="${cat.id}">${cat.nome}</option>`);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
            $('#categoria_id').empty().append('<option value="">Erro ao carregar</option>');
        });
}

function mostrarToast(mensagem, cor) {
    const toastEl = document.getElementById('meuToast');
    const toastMensagem = document.getElementById('toast-mensagem');

    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark');
    toastEl.classList.add(`bg-${cor}`);
    toastMensagem.textContent = mensagem;

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}