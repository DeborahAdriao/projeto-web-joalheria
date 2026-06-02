const API_JOIAS = 'http://127.0.0.1:8000/joias';
const API_CATEGORIAS = 'http://127.0.0.1:8000/categorias';
let idParaDeletar = null;
let modalExcluir;
let paginaAtual = 1;
let termoBusca = '';
const LIMITE_POR_PAGINA = 8;

$(document).ready(function() {
    modalExcluir = new bootstrap.Modal(document.getElementById('modalExcluir'));
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

    $('#btn-limpar-busca').click(function() {
        $('#input-busca').val('');
        termoBusca = '';
        paginaAtual = 1;
        $('#btn-limpar-busca').addClass('d-none');
        
        carregarVitrine();
    });

    $('#btn-anterior').click(function() {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarVitrine();
        }
    });

    $('#btn-proximo').click(function() {
        paginaAtual++;
        carregarVitrine();
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

        $('#texto-paginacao').text(`Página ${paginaAtual} de ${totalPaginas}`);
        $('#btn-anterior').prop('disabled', paginaAtual <= 1);
        $('#btn-proximo').prop('disabled', paginaAtual >= totalPaginas);

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

            const card = `
                <div class="col">
                    <div class="card h-100 text-center border-0 bg-transparent">
                        <div class="card-body p-4" style="border: 1px solid #e5e0d8; background-color: #ffffff;">
                            <h5 class="card-title mb-1" style="font-family: 'Playfair Display', serif;">${joia.nome}</h5>
                            <p class="text-muted mb-3" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">${nomeCategoria}</p>
                            <p class="fw-bold mb-4" style="color: #333333;">${precoFormatado}</p>
                            
                            <div class="d-flex justify-content-center gap-2">
                                <a href="editar/?id=${joia.id}" class="btn btn-outline-dark btn-sm px-3" style="border-radius: 0; font-size: 0.7rem; letter-spacing: 1px;">EDITAR</a>
                                <button onclick="deletarJoia(${joia.id})" class="btn btn-dark btn-sm px-3" style="border-radius: 0; font-size: 0.7rem; letter-spacing: 1px;">EXCLUIR</button>
                            </div>
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

function deletarJoia(id) {
    idParaDeletar = id; 
    modalExcluir.show();
}

$('#btn-confirmar-exclusao').click(function() {
    if (!idParaDeletar) return;

    fetch(`${API_JOIAS}/${idParaDeletar}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            modalExcluir.hide();
            carregarVitrine(); 
        } else {
            alert('Erro ao excluir a joia.');
            modalExcluir.hide();
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Não foi possível conectar ao servidor para excluir.');
        modalExcluir.hide();
    });
});