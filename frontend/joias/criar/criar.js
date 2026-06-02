if (!localStorage.getItem('token')) {
    window.location.href = '../../login.html'; 
}

const API_JOIAS = 'http://127.0.0.1:8000/joias';
const API_CATEGORIAS = 'http://127.0.0.1:8000/categorias';

$(document).ready(function() {
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
            nome: nomeDigitado,
            preco: precoDigitado,
            categoria_id: categoriaEscolhida
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
                alert('Joia adicionada ao catálogo com sucesso!');
                window.location.href = '../'; 
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