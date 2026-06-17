if (!localStorage.getItem('token')) {
    window.location.href = '../../login.html'; 
}

const API_JOIAS = 'http://127.0.0.1:8000/joias';
const API_CATEGORIAS = 'http://127.0.0.1:8000/categorias';

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
    const joiaId = urlParams.get('id');

    if (!joiaId) {
        mostrarToast('Nenhuma joia selecionada!', 'warning');
        setTimeout(function() {
            window.location.href = '../index.html';
        }, 2000);
        return;
    }

    inicializarEdicao(joiaId);

    $('#form-editar-joia').submit(function(event) {
        event.preventDefault();
        $('#mensagem-erro').addClass('d-none');

        const pacoteDeDados = {
            nome: $('#nome').val().trim(),
            preco: parseFloat($('#preco').val()),
            categoria_id: parseInt($('#categoria_id').val()),
            imagem: $('#imagem').val().trim(),
            descricao: $('#descricao').val().trim()
        };

        fetch(`${API_JOIAS}/${joiaId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify(pacoteDeDados)
        })
        .then(response => {
            if (response.ok) {
                event.target.reset();
                mostrarToast('Joia atualizada com sucesso! Redirecionando...', 'success');
                setTimeout(function() {
                    window.location.href = '../index.html';
                }, 2000);
            } else {
                throw new Error('Erro ao atualizar');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            $('#mensagem-erro').text('Erro ao atualizar a joia. Verifique os dados.').removeClass('d-none');
        });
    });
});

async function inicializarEdicao(id) {
    try {
        const [resCat, resJoia] = await Promise.all([
            fetch(API_CATEGORIAS),
            fetch(`${API_JOIAS}/${id}`)
        ]);

        if (!resCat.ok || !resJoia.ok) throw new Error('Falha ao carregar dados');

        const categorias = await resCat.json();
        const joia = await resJoia.json();

        const select = $('#categoria_id');
        select.empty();
        categorias.forEach(cat => {
            const selecionada = (cat.id === joia.categoria_id) ? 'selected' : '';
            select.append(`<option value="${cat.id}" ${selecionada}>${cat.nome}</option>`);
        });

        $('#nome').val(joia.nome);
        $('#preco').val(joia.preco);
        $('#imagem').val(joia.imagem);
        $('#descricao').val(joia.descricao);

    } catch (error) {
        console.error('Erro:', error);
        $('#mensagem-erro').text('Erro ao carregar dados da joia.').removeClass('d-none');
    }
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