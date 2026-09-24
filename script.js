// ==============================
// PEGAR DADOS DO LOCALSTORAGE
// ==============================

let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];


// ==============================
// ELEMENTOS DO HTML
// ==============================

const formVenda = document.getElementById("formVenda");
const formGasto = document.getElementById("formGasto");
const formEstoque = document.getElementById("formEstoque");

const listaHistorico = document.getElementById("listaHistorico");
const listaEstoque = document.getElementById("listaEstoque");

const faturamento = document.getElementById("faturamento");
const totalGastos = document.getElementById("totalGastos");
const lucro = document.getElementById("lucro");
const totalEstoque = document.getElementById("totalEstoque");

const barraVenda = document.getElementById("barraVenda");
const barraGasto = document.getElementById("barraGasto");
const barraLucro = document.getElementById("barraLucro");

const valorGraficoVenda = document.getElementById("valorGraficoVenda");
const valorGraficoGasto = document.getElementById("valorGraficoGasto");
const valorGraficoLucro = document.getElementById("valorGraficoLucro");


// ==============================
// SALVAR DADOS
// ==============================

function salvarDados() {

    localStorage.setItem(
        "vendas",
        JSON.stringify(vendas)
    );

    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );

    localStorage.setItem(
        "estoque",
        JSON.stringify(estoque)
    );
}


// ==============================
// FORMATAR DINHEIRO
// ==============================

function dinheiro(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ==============================
// REGISTRAR VENDA
// ==============================

formVenda.addEventListener("submit", function(event) {

    event.preventDefault();

    const produto =
        document.getElementById("produtoVenda").value.trim();

    const quantidade =
        Number(document.getElementById("quantidadeVenda").value);

    const valor =
        Number(document.getElementById("valorVenda").value);


    if (
        produto === "" ||
        quantidade <= 0 ||
        valor <= 0
    ) {

        alert("Preencha os dados corretamente.");
        return;
    }


    // Verifica se existe estoque

    const produtoEstoque = estoque.find(function(item) {

        return item.produto.toLowerCase() === produto.toLowerCase();

    });


    if (produtoEstoque) {

        if (produtoEstoque.quantidade < quantidade) {

            alert("Quantidade insuficiente no estoque.");
            return;

        }

        produtoEstoque.quantidade -= quantidade;

    } else {

        const continuar = confirm(
            "Esse produto não está no estoque. Deseja registrar a venda mesmo assim?"
        );

        if (!continuar) {
            return;
        }
    }


    vendas.push({

        id: Date.now(),

        produto: produto,

        quantidade: quantidade,

        valor: valor,

        data: new Date().toLocaleDateString("pt-BR")

    });


    salvarDados();

    formVenda.reset();

    atualizarSistema();
});


// ==============================
// REGISTRAR GASTO
// ==============================

formGasto.addEventListener("submit", function(event) {

    event.preventDefault();


    const descricao =
        document.getElementById("descricaoGasto").value.trim();

    const valor =
        Number(document.getElementById("valorGasto").value);


    if (
        descricao === "" ||
        valor <= 0
    ) {

        alert("Preencha os dados corretamente.");
        return;
    }


    gastos.push({

        id: Date.now(),

        descricao: descricao,

        valor: valor,

        data: new Date().toLocaleDateString("pt-BR")

    });


    salvarDados();

    formGasto.reset();

    atualizarSistema();
});


// ==============================
// ADICIONAR ESTOQUE
// ==============================

formEstoque.addEventListener("submit", function(event) {

    event.preventDefault();


    const produto =
        document.getElementById("produtoEstoque").value.trim();

    const quantidade =
        Number(document.getElementById("quantidadeEstoque").value);


    if (
        produto === "" ||
        quantidade <= 0
    ) {

        alert("Preencha os dados corretamente.");
        return;
    }


    const produtoExistente = estoque.find(function(item) {

        return item.produto.toLowerCase() === produto.toLowerCase();

    });


    if (produtoExistente) {

        produtoExistente.quantidade += quantidade;

    } else {

        estoque.push({

            id: Date.now(),

            produto: produto,

            quantidade: quantidade

        });

    }


    salvarDados();

    formEstoque.reset();

    atualizarSistema();
});


// ==============================
// MOSTRAR ESTOQUE
// ==============================

function mostrarEstoque() {

    listaEstoque.innerHTML = "";


    if (estoque.length === 0) {

        listaEstoque.innerHTML = `
            <p class="mensagem-vazia">
                Nenhum produto no estoque.
            </p>
        `;

        return;
    }


    estoque.forEach(function(item) {

        const produto = document.createElement("div");

        produto.classList.add("produto-estoque");


        produto.innerHTML = `

            <h3>${item.produto}</h3>

            <p>
                Quantidade:
                <span class="quantidade">
                    ${item.quantidade}
                </span>
            </p>

            <div class="acoes-estoque">

                <button
                    onclick="adicionarEstoque(${item.id})"
                >
                    + Adicionar
                </button>

                <button
                    class="btn-remover"
                    onclick="removerProdutoEstoque(${item.id})"
                >
                    Excluir
                </button>

            </div>

        `;


        listaEstoque.appendChild(produto);

    });
}


// ==============================
// ADICIONAR MAIS ESTOQUE
// ==============================

function adicionarEstoque(id) {

    const produto = estoque.find(function(item) {

        return item.id === id;

    });


    if (!produto) {
        return;
    }


    const quantidade = Number(
        prompt(
            `Quantas unidades de ${produto.produto} deseja adicionar?`
        )
    );


    if (
        isNaN(quantidade) ||
        quantidade <= 0
    ) {

        return;
    }


    produto.quantidade += quantidade;


    salvarDados();

    atualizarSistema();
}


// ==============================
// EXCLUIR PRODUTO DO ESTOQUE
// ==============================

function removerProdutoEstoque(id) {

    const confirmar = confirm(
        "Deseja excluir este produto do estoque?"
    );


    if (!confirmar) {
        return;
    }


    estoque = estoque.filter(function(item) {

        return item.id !== id;

    });


    salvarDados();

    atualizarSistema();
}


// ==============================
// MOSTRAR HISTÓRICO
// ==============================

function mostrarHistorico() {

    listaHistorico.innerHTML = "";


    const registros = [];


    vendas.forEach(function(venda) {

        registros.push({

            id: venda.id,

            tipo: "Venda",

            descricao: venda.produto,

            quantidade: venda.quantidade,

            valor: venda.valor

        });

    });


    gastos.forEach(function(gasto) {

        registros.push({

            id: gasto.id,

            tipo: "Gasto",

            descricao: gasto.descricao,

            quantidade: "-",

            valor: gasto.valor

        });

    });


    registros.sort(function(a, b) {

        return b.id - a.id;

    });


    if (registros.length === 0) {

        listaHistorico.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="mensagem-vazia"
                >
                    Nenhum registro encontrado.
                </td>
            </tr>
        `;

        return;
    }


    registros.forEach(function(registro) {

        const linha = document.createElement("tr");


        linha.innerHTML = `

            <td>${registro.tipo}</td>

            <td>${registro.descricao}</td>

            <td>${registro.quantidade}</td>

            <td>${dinheiro(registro.valor)}</td>

            <td>

                <button
                    class="btn-excluir"
                    onclick="excluirRegistro(
                        '${registro.tipo}',
                        ${registro.id}
                    )"
                >
                    Excluir
                </button>

            </td>

        `;


        listaHistorico.appendChild(linha);

    });
}


// ==============================
// EXCLUIR REGISTRO
// ==============================

function excluirRegistro(tipo, id) {

    const confirmar = confirm(
        "Deseja realmente excluir este registro?"
    );


    if (!confirmar) {
        return;
    }


    if (tipo === "Venda") {

        vendas = vendas.filter(function(venda) {

            return venda.id !== id;

        });

    }


    if (tipo === "Gasto") {

        gastos = gastos.filter(function(gasto) {

            return gasto.id !== id;

        });

    }


    salvarDados();

    atualizarSistema();
}


// ==============================
// ATUALIZAR RESUMO
// ==============================

function atualizarResumo() {

    let totalVenda = 0;
    let totalGasto = 0;
    let quantidadeEstoque = 0;


    vendas.forEach(function(venda) {

        totalVenda += venda.valor;

    });


    gastos.forEach(function(gasto) {

        totalGasto += gasto.valor;

    });


    estoque.forEach(function(item) {

        quantidadeEstoque += item.quantidade;

    });


    const resultadoLucro =
        totalVenda - totalGasto;


    faturamento.textContent =
        dinheiro(totalVenda);

    totalGastos.textContent =
        dinheiro(totalGasto);

    lucro.textContent =
        dinheiro(resultadoLucro);

    totalEstoque.textContent =
        quantidadeEstoque;


    valorGraficoVenda.textContent =
        dinheiro(totalVenda);

    valorGraficoGasto.textContent =
        dinheiro(totalGasto);

    valorGraficoLucro.textContent =
        dinheiro(resultadoLucro);


    atualizarGrafico(
        totalVenda,
        totalGasto,
        resultadoLucro
    );
}


// ==============================
// GRÁFICO
// ==============================

function atualizarGrafico(
    vendas,
    gastos,
    lucro
) {

    const maiorValor = Math.max(
        vendas,
        gastos,
        lucro,
        1
    );


    let porcentagemVenda =
        (vendas / maiorValor) * 100;

    let porcentagemGasto =
        (gastos / maiorValor) * 100;

    let porcentagemLucro =
        (Math.max(lucro, 0) / maiorValor) * 100;


    barraVenda.style.width =
        porcentagemVenda + "%";

    barraGasto.style.width =
        porcentagemGasto + "%";

    barraLucro.style.width =
        porcentagemLucro + "%";
}


// ==============================
// LIMPAR ESTOQUE
// ==============================

document
    .getElementById("btnLimparEstoque")
    .addEventListener("click", function() {

        if (estoque.length === 0) {
            return;
        }


        const confirmar = confirm(
            "Deseja apagar todo o estoque?"
        );


        if (!confirmar) {
            return;
        }


        estoque = [];

        salvarDados();

        atualizarSistema();

    });


// ==============================
// LIMPAR HISTÓRICO
// ==============================

document
    .getElementById("btnLimparHistorico")
    .addEventListener("click", function() {

        if (
            vendas.length === 0 &&
            gastos.length === 0
        ) {

            return;
        }


        const confirmar = confirm(
            "Deseja apagar todo o histórico?"
        );


        if (!confirmar) {
            return;
        }


        vendas = [];

        gastos = [];

        salvarDados();

        atualizarSistema();

    });


// ==============================
// ATUALIZAR TUDO
// ==============================

function atualizarSistema() {

    atualizarResumo();

    mostrarEstoque();

    mostrarHistorico();

}


// ==============================
// INICIAR SISTEMA
// ==============================

atualizarSistema();
