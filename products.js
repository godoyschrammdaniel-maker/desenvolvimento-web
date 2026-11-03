
const produtos = [
    {
        id: 1,
        nome: "VisionAR Glass",
        categoria: "Wearables",
        descricao: "Óculos inteligentes com GPS e tradução de idiomas em tempo real.",
        preco: 2499.90,
        imagem: "🥽"
    },
    {
        id: 2,
        nome: "PulseTouch Pro",
        categoria: "Wearables",
        descricao: "Pulseira com feedback tátil e vibrações direcionais para jogos.",
        preco: 899.90,
        imagem: "⌚"
    },
    {
        id: 3,
        nome: "AuraRing Control",
        categoria: "Wearables",
        descricao: "Anel inteligente para controle por gestos no ar.",
        preco: 599.90,
        imagem: "💍"
    },
    {
        id: 4,
        nome: "HoloDesk AI",
        categoria: "Casa Inteligente",
        descricao: "Assistente de mesa com projeção holográfica 3D interativa.",
        preco: 3199.90,
        imagem: "🖥️"
    },
    {
        id: 5,
        nome: "HydroSmart",
        categoria: "Casa Inteligente",
        descricao: "Garrafa com esterilização UV-C e lembrete de hidratação.",
        preco: 249.90,
        imagem: "💧"
    }
];

// Elementos HTML
const gradeProdutos = document.getElementById("grade-produtos");
const campoPesquisa = document.getElementById("pesquisa");
const campoCategoria = document.getElementById("categoria");
const resultado = document.getElementById("resultado");
const contador = document.getElementById("contador");
const itensCarrinho = document.getElementById("itens-carrinho");
const totalItens = document.getElementById("total-itens");
const valorTotal = document.getElementById("valor-total");
const botaoLimpar = document.getElementById("limpar-carrinho");

// Formatação de valores em reais
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// SEMANA 1 E 2: renderização dinâmica dos produtos
function renderizarProdutos(lista) {
    gradeProdutos.replaceChildren();

    resultado.textContent =
        `${lista.length} produto(s) encontrado(s).`;

    if (lista.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.className = "mensagem-vazia";
        mensagem.textContent = "Nenhum produto encontrado.";
        gradeProdutos.appendChild(mensagem);
        return;
    }

    lista.forEach(produto => {
        const card = document.createElement("article");
        card.className = "card";

        const imagem = document.createElement("div");
        imagem.className = "imagem";
        imagem.textContent = produto.imagem;
        imagem.setAttribute("aria-hidden", "true");

        const nome = document.createElement("h3");
        nome.textContent = produto.nome;

        const categoria = document.createElement("p");
        categoria.className = "categoria-texto";
        categoria.textContent = produto.categoria;

        const descricao = document.createElement("p");
        descricao.textContent = produto.descricao;

        const preco = document.createElement("p");
        preco.className = "preco";
        preco.textContent = formatarMoeda(produto.preco);

        const botao = document.createElement("button");
        botao.className = "botao-adicionar";
        botao.textContent = "Adicionar ao carrinho";

        botao.addEventListener("click", () => {
            adicionarCarrinho(produto.id);
        });

        card.append(
            imagem,
            nome,
            categoria,
            descricao,
            preco,
            botao
        );

        gradeProdutos.appendChild(card);
    });
}

// SEMANA 2: pesquisa e filtro por categoria
function pesquisarProdutos() {
    const texto = campoPesquisa.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    const categoriaSelecionada = campoCategoria.value;

    const filtrados = produtos.filter(produto => {
        const correspondeNome = produto.nome
            .toLocaleLowerCase("pt-BR")
            .includes(texto);

        const correspondeCategoria =
            categoriaSelecionada === "todos" ||
            produto.categoria === categoriaSelecionada;

        return correspondeNome && correspondeCategoria;
    });

    renderizarProdutos(filtrados);
}

// SEMANA 3: leitura segura do localStorage
function carregarCarrinho() {
    try {
        const dados = localStorage.getItem("techstore-carrinho");

        if (!dados) {
            return [];
        }

        const lista = JSON.parse(dados);

        if (!Array.isArray(lista)) {
            return [];
        }

        return lista.filter(item =>
            item &&
            Number.isInteger(item.id) &&
            produtos.some(p => p.id === item.id) &&
            Number.isInteger(item.quantidade) &&
            item.quantidade > 0 &&
            item.quantidade <= 10000
        );
    } catch (erro) {
        return [];
    }
}

let carrinho = carregarCarrinho();

// Salva as alterações no navegador
function salvarCarrinho() {
    try {
        localStorage.setItem(
            "techstore-carrinho",
            JSON.stringify(carrinho)
        );
    } catch (erro) {
        console.error("Não foi possível salvar o carrinho.", erro);
    }
}

// Adiciona ou aumenta a quantidade de um produto
function adicionarCarrinho(id) {
    const produto = produtos.find(p => p.id === id);

    if (!produto) {
        return;
    }

    const item = carrinho.find(p => p.id === id);

    if (item) {
        if (item.quantidade >= 10000) {
            alert("Limite de quantidade atingido.");
            return;
        }

        item.quantidade++;
    } else {
        carrinho.push({
            id: id,
            quantidade: 1
        });
    }

    salvarCarrinho();
    renderizarCarrinho();
}

// Altera a quantidade de um produto
function alterarQuantidade(id, variacao) {
    const item = carrinho.find(p => p.id === id);

    if (!item) {
        return;
    }

    item.quantidade += variacao;

    if (item.quantidade <= 0) {
        removerProduto(id);
        return;
    }

    if (item.quantidade > 10000) {
        item.quantidade = 10000;
    }

    salvarCarrinho();
    renderizarCarrinho();
}

// Remove um produto completamente
function removerProduto(id) {
    carrinho = carrinho.filter(item => item.id !== id);

    salvarCarrinho();
    renderizarCarrinho();
}

// SEMANA 3: exibição do carrinho e cálculo do total
function renderizarCarrinho() {
    itensCarrinho.replaceChildren();

    let quantidadeTotal = 0;
    let valorCalculado = 0;

    carrinho.forEach(item => {
        const produto = produtos.find(p => p.id === item.id);

        if (!produto) {
            return;
        }

        quantidadeTotal += item.quantidade;
        valorCalculado += produto.preco * item.quantidade;

        const linha = document.createElement("article");
        linha.className = "item-carrinho";

        const informacoes = document.createElement("div");
        informacoes.className = "item-info";

        const nome = document.createElement("h3");
        nome.textContent = produto.nome;

        const preco = document.createElement("p");
        preco.textContent =
            `${formatarMoeda(produto.preco)} por unidade`;

        informacoes.append(nome, preco);

        const controles = document.createElement("div");
        controles.className = "controles-item";

        const diminuir = document.createElement("button");
        diminuir.className = "botao-quantidade";
        diminuir.textContent = "−";
        diminuir.setAttribute("aria-label",
            `Diminuir quantidade de ${produto.nome}`);

        diminuir.addEventListener("click", () => {
            alterarQuantidade(produto.id, -1);
        });

        const quantidade = document.createElement("span");
        quantidade.textContent = item.quantidade;

        const aumentar = document.createElement("button");
        aumentar.className = "botao-quantidade";
        aumentar.textContent = "+";
        aumentar.setAttribute("aria-label",
            `Aumentar quantidade de ${produto.nome}`);

        aumentar.addEventListener("click", () => {
            alterarQuantidade(produto.id, 1);
        });

        const remover = document.createElement("button");
        remover.className = "botao-remover";
        remover.textContent = "Remover";

        remover.addEventListener("click", () => {
            removerProduto(produto.id);
        });

        controles.append(
            diminuir,
            quantidade,
            aumentar,
            remover
        );

        linha.append(informacoes, controles);
        itensCarrinho.appendChild(linha);
    });

    if (carrinho.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.className = "mensagem-vazia";
        mensagem.textContent = "Seu carrinho está vazio.";
        itensCarrinho.appendChild(mensagem);
    }

    contador.textContent = quantidadeTotal;
    totalItens.textContent = quantidadeTotal;
    valorTotal.textContent = formatarMoeda(valorCalculado);
}

// Limpa todos os produtos do carrinho
function limparCarrinho() {
    carrinho = [];

    salvarCarrinho();
    renderizarCarrinho();
}

// Eventos dos campos de pesquisa
campoPesquisa.addEventListener("input", pesquisarProdutos);

campoCategoria.addEventListener("change", pesquisarProdutos);

// Evento do botão de limpar
botaoLimpar.addEventListener("click", limparCarrinho);

// Inicialização da página
renderizarProdutos(produtos);
renderizarCarrinho();
