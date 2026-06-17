if (!localStorage.getItem('token')) {
    window.location.href = '../login.html'; 
}

const API_URL = 'http://127.0.0.1:8000/categorias';
let idParaDeletar = null;
let modalExcluir; 

$(document).ready(function() {

    const emailUsuario = localStorage.getItem('email_usuario');
    if (emailUsuario) {
        $('#usuario-logado').text(emailUsuario).removeClass('d-none');
    }
    
    modalExcluir = new bootstrap.Modal(document.getElementById('modalExcluir'));

    $('#btn-sair').click(function() {
        localStorage.removeItem('token');
        localStorage.removeItem('email_usuario');
        window.location.href = '../login.html';
    });

    carregarCategorias();
});

function carregarCategorias() {
    $('#mensagem-erro').addClass('d-none');
    
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('Servidor não respondeu corretamente');
            return response.json(); 
        })
        .then(categorias => {
            const tabela = $('#tabela-categorias');
            tabela.empty(); 

            if (categorias.length === 0) {
                tabela.append('<tr><td colspan="3" class="text-center text-muted">Nenhuma categoria cadastrada.</td></tr>');
                return;
            }

            categorias.forEach(categoria => {
                const linha = `
                    <tr>
                        <td class="ps-4 fw-bold text-muted">#${categoria.id}</td>
                        <td>${categoria.nome}</td>
                        <td class="text-end pe-4">
                            <a href="editar/index.html?id=${categoria.id}" class="btn btn-outline-dark btn-sm" style="...">EDITAR</a>
                            <button onclick="deletarCategoria(${categoria.id})" class="btn btn-dark btn-sm ms-1" style="border-radius: 0; font-size: 0.75rem;">EXCLUIR</button>
                        </td>
                    </tr>
                `;
                tabela.append(linha); 
            });
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            $('#tabela-categorias').empty();
            $('#mensagem-erro').text('Falha ao conectar com o servidor. Verifique se o backend está rodando.').removeClass('d-none');
        });
}

function deletarCategoria(id) {
    idParaDeletar = id; 
    modalExcluir.show();
}

$('#btn-confirmar-exclusao').click(function() {
    if (!idParaDeletar) return;

    fetch(`${API_URL}/${idParaDeletar}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {        
        modalExcluir.hide(); 
        
        if (response.ok) {
            console.log("Servidor confirmou exclusão. Aguardando animação para o Toast verde...");
            carregarCategorias(); 
            
            setTimeout(() => {
                mostrarToast('Categoria excluída com sucesso!', 'success');
            }, 500);
            
        } else {
            setTimeout(() => {
                mostrarToast('Não é possível deletar esta categoria pois existem joias vinculadas a ela.', 'warning');
            }, 500);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        modalExcluir.hide();
        setTimeout(() => {
            mostrarToast('Erro de conexão ao tentar excluir.', 'danger');
        }, 500);
    });
});

function mostrarToast(mensagem, cor) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1100';
        document.body.appendChild(container);
    }

    const toastHTML = `
        <div class="toast align-items-center text-white bg-${cor} border-0 rounded-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body" style="letter-spacing: 1px; font-size: 0.85rem;">
                    ${mensagem}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHTML);

    const novoToastEl = container.lastElementChild;

    const toast = new bootstrap.Toast(novoToastEl, { delay: 3000 });
    toast.show();

    novoToastEl.addEventListener('hidden.bs.toast', function () {
        novoToastEl.remove();
    });
}