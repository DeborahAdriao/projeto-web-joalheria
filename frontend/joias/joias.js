const API_JOIAS = 'http://127.0.0.1:8000/joias';
const API_CATEGORIAS = 'http://127.0.0.1:8000/categorias';

let idParaDeletar = null;
let modalExcluir;

let paginaAtual = 1;
let termoBusca = '';
const LIMITE_POR_PAGINA = 8;

const tokenAtual = localStorage.getItem('token');
const ehAdmin = tokenAtual !== null; 

$(document).ready(function() {
    modalExcluir = new bootstrap.Modal(document.getElementById('modalExcluir'));
    
    if (ehAdmin) {
        $('#usuario-logado').text(localStorage.getItem('email_usuario')).removeClass('d-none');

        $('#btn-sair').click(function() {
            localStorage.removeItem('token');
            localStorage.removeItem('email_usuario'); 
            window.location.href = '../login.html'; 
        });
    } else {
        $('#usuario-logado').addClass('d-none');

        $('#btn-sair').text('LOGIN').removeClass('btn-link text-dark').addClass('btn-dark text-white').click(function() {
            window.location.href = '../login.html';
        });
        
        $('a[href="criar/"]').addClass('d-none'); 
        $('a[href="../categorias/"]').addClass('d-none');  
    }

    carregarVitrine();

    $('#btn-buscar').click(function() {
        termoBusca = $('#input-busca').val().trim();
        paginaAtual = 1; 
        
        if (termoBusca) {
            $('#btn-limpar-busca').removeClass('d-none');
        } else {
            $('#btn-limpar-busca').addClass('d-none');
        }
        
        carregarVitrine();
    });

    $('#input-busca').keypress(function(evento) {
        if (evento.which === 13) { 
            evento.preventDefault(); 
            $('#btn-buscar').click(); 
        }
    });

    $('#btn-limpar-busca').click(function() {
        $('#input-busca').val('');
        termoBusca = '';
        paginaAtual = 1;
        $('#btn-limpar-busca').addClass('d-none');
        carregarVitrine();
    });

    $(document).on('click', '.btn-mudar-pagina', function() {
        if ($(this).hasClass('disabled')) return;
        paginaAtual = $(this).data('pagina'); 
        carregarVitrine();
    });

    $(document).on('click', '.btn-deletar-joia', function() {
        idParaDeletar = $(this).data('id'); 
        modalExcluir.show();
    });
});

async function carregarVitrine() {
    $('#mensagem-erro').addClass('d-none');

    try {
        let urlBusca = `${API_JOIAS}?page=${paginaAtual}&limit=${LIMITE_POR_PAGINA}`;
        if (termoBusca) {
            urlBusca += `&nome=${encodeURIComponent(termoBusca)}`;
        }

        const [respostaJoias, respostaCategorias] = await Promise.all([
            fetch(urlBusca), 
            fetch(API_CATEGORIAS)
        ]);

        if (!respostaJoias.ok || !respostaCategorias.ok) {
            throw new Error('Falha ao buscar dados do servidor');
        }

        const dataJoias = await respostaJoias.json();
        const categorias = await respostaCategorias.json();

        let joias = [];
        let totalPaginas = 1;

        if (Array.isArray(dataJoias)) {
            joias = dataJoias;
        } else {
            joias = dataJoias.data || [];
            totalPaginas = dataJoias.pages || 1;
            paginaAtual = dataJoias.page || 1;
        }

        renderizarPaginacao(paginaAtual, totalPaginas);

        const mapaCategorias = {};
        categorias.forEach(cat => {
            mapaCategorias[cat.id] = cat.nome;
        });

        const grid = $('#grid-joias');
        grid.empty();

        if (joias.length === 0) {
            grid.append('<div class="col-12 text-center mt-5"><p class="text-muted" style="font-style: italic;">Nenhuma joia encontrada.</p></div>');
            return;
        }

        joias.forEach(joia => {
            const nomeCategoria = joia.categoria?.nome || mapaCategorias[joia.categoria_id] || 'Sem Categoria';
            const precoFormatado = joia.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            let botoesAcao = '';
            if (ehAdmin) {
                botoesAcao = `
                    <div class="d-flex justify-content-center gap-2 mt-3">
                        <a href="editar/?id=${joia.id}" class="btn btn-outline-dark btn-sm px-3" style="border-radius: 0; font-size: 0.7rem; letter-spacing: 1px;">EDITAR</a>
                        <button class="btn btn-dark btn-sm px-3 btn-deletar-joia" data-id="${joia.id}" style="border-radius: 0; font-size: 0.7rem; letter-spacing: 1px;">EXCLUIR</button>
                    </div>
                `;
            }

            const card = `
                <div class="col">
                    <div class="card h-100 text-center border-0 bg-transparent">
                        <div class="card-body p-4" style="border: 1px solid #e5e0d8; background-color: #ffffff;">
                            <h5 class="card-title mb-1" style="font-family: 'Playfair Display', serif;">${joia.nome}</h5>
                            <p class="text-muted mb-3" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">${nomeCategoria}</p>
                            <p class="fw-bold mb-4" style="color: #333333;">${precoFormatado}</p>
                            
                            ${botoesAcao}
                        </div>
                    </div>
                </div>
            `;
            grid.append(card); 
        });

    } catch (error) {
        console.error('Erro na requisição:', error);
        $('#grid-joias').empty();
        $('#mensagem-erro').text('Falha ao conectar com o servidor para carregar a vitrine. Verifique se o backend está rodando.').removeClass('d-none');
    }
}

$('#btn-confirmar-exclusao').click(function() {
    if (!idParaDeletar) return;

    fetch(`${API_JOIAS}/${idParaDeletar}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${tokenAtual}`
        }
    })
    .then(response => {
        if (response.ok) {
            modalExcluir.hide();
            carregarVitrine(); 
        } else {
            alert('Erro ao excluir a joia. Você tem permissão?');
            modalExcluir.hide();
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Não foi possível conectar ao servidor para excluir.');
        modalExcluir.hide();
    });
});

function renderizarPaginacao(pagina, total) {
    const container = $('#paginacao-container');
    container.empty();

    const btnAnterior = `<button class="btn btn-outline-dark rounded-0 px-3 btn-mudar-pagina ${pagina <= 1 ? 'disabled' : ''}" data-pagina="${pagina - 1}">ANTERIOR</button>`;
    container.append(btnAnterior);

    for (let i = 1; i <= total; i++) {
        const ativo = (i === pagina) ? 'btn-dark' : 'btn-outline-dark';
        const btnNumero = `<button class="btn ${ativo} rounded-0 px-3 btn-mudar-pagina" data-pagina="${i}">${i}</button>`;
        container.append(btnNumero);
    }

    const btnProximo = `<button class="btn btn-outline-dark rounded-0 px-3 btn-mudar-pagina ${pagina >= total ? 'disabled' : ''}" data-pagina="${pagina + 1}">PRÓXIMO</button>`;
    container.append(btnProximo);
}