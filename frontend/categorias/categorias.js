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
        window.location.href = '../joias/';
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
                            <a href="editar/?id=${categoria.id}" class="btn btn-outline-dark btn-sm" style="border-radius: 0; font-size: 0.75rem;">EDITAR</a>
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
        if (response.ok) {
            modalExcluir.hide();
            carregarCategorias(); 
        } else {
            response.json().then(data => {
                alert(data.detail || 'Erro ao excluir. O servidor recusou a operação.');
                modalExcluir.hide();
            }).catch(() => {
                alert('Erro ao excluir. O servidor recusou a operação.');
                modalExcluir.hide();
            });
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Não foi possível conectar ao servidor para excluir.');
        modalExcluir.hide();
    });
});