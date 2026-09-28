// =========================
// DADOS
// =========================

let vendas = JSON.parse(localStorage.getItem("moreira_vendas")) || [];
let gastos = JSON.parse(localStorage.getItem("moreira_gastos")) || [];
let estoque = JSON.parse(localStorage.getItem("moreira_estoque")) || [];
let metas = JSON.parse(localStorage.getItem("moreira_metas")) || {};


// =========================
// ELEMENTOS
// =========================

const dataAtual = document.getElementById("dataAtual");
const mesSelecionado = document.getElementById("mesSelecionado");

const codigoVenda = document.getElementById("codigoVenda");
const produtoEncontrado = document.getElementById("produtoEncontrado");
const nomeProdutoVenda = document.getElementById("nomeProdutoVenda");
const precoProdutoVenda = document.getElementById("precoProdutoVenda");
const quantidadeVenda = document.getElementById("quantidadeVenda");
const valorVenda = document.getElementById("valorVenda");


// =========================
// FUNÇÕES
// =========================

function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function dataISO() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function mesDaData(data) {
    return data.substring(0, 7);
}

function obterMes() {
    if (mesSelecionado && mesSelecionado.value) {
        return mesSelecionado.value;
    }

    return dataISO().substring(0, 7);
}

function vendasDoMes() {
    const mes = obterMes();

    return vendas.filter(function (venda) {
        return mesDaData(venda.data) === mes;
    });
}

function gastosDoMes() {
    const mes = obterMes();

    return gastos.filter(function (gasto) {
        return mesDaData(gasto.data) === mes;
    });
}

function salvarTudo() {
    localStorage.setItem("moreira_vendas", JSON.stringify(vendas));
    localStorage.setItem("moreira_gastos", JSON.stringify(gastos));
    localStorage.setItem("moreira_estoque", JSON.stringify(estoque));
    localStorage.setItem("moreira_metas", JSON.stringify(metas));
}

function mostrarNotificacao(mensagem) {
    const notificacao = document.getElementById("notificacao");
    const texto = document.getElementById("textoNotificacao");

    if (!notificacao || !texto) return;

    texto.textContent = mensagem;

    notificacao.classList.add("ativo");

    setTimeout(function () {
        notificacao.classList.remove("ativo");
    }, 2500);
}

function formatarData(data) {
    if (!data) return "";

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// =========================
// DATA ATUAL
// =========================

function gerarDataAtual() {
    if (!dataAtual) return;

    const agora = new Date();

    dataAtual.textContent = agora.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}


// =========================
// MENU
// =========================

document.querySelectorAll("[data-secao]").forEach(function (botao) {

    botao.addEventListener("click", function () {

        const secao = botao.dataset.secao;

        document.querySelectorAll(".secao").forEach(function (elemento) {
            elemento.classList.remove("ativa");
        });

        const alvo = document.getElementById(secao);

        if (alvo) {
            alvo.classList.add("ativa");
        }

        document.querySelectorAll("[data-secao]").forEach(function (item) {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");
    });
});


// =========================
// CÓDIGO DO PRODUTO
// =========================

function buscarProdutoPorCodigo() {

    if (!codigoVenda) return null;

    const codigo = codigoVenda.value.trim();

    // Se estiver vazio
    if (codigo === "") {

        if (produtoEncontrado) {
            produtoEncontrado.textContent = "";
        }

        if (nomeProdutoVenda) {
            nomeProdutoVenda.value = "";
        }

        if (precoProdutoVenda) {
            precoProdutoVenda.value = "";
        }

        if (valorVenda) {
            valorVenda.value = "";
        }

        return null;
    }

    // Procura o produto
    const produto = estoque.find(function (item) {

        return String(item.codigo || "").trim() === codigo;

    });

    // Produto não encontrado
    if (!produto) {

        produtoEncontrado.textContent = "Produto não encontrado";

        nomeProdutoVenda.value = "";
        precoProdutoVenda.value = "";
        valorVenda.value = "";

        return null;
    }

    // Produto encontrado
    produtoEncontrado.textContent =
        `✓ ${produto.produto} — Estoque: ${produto.quantidade}`;

    nomeProdutoVenda.value = produto.produto;

    precoProdutoVenda.value = Number(produto.preco || 0).toFixed(2);

    calcularVenda();

    return produto;
}


// =========================
// CALCULAR VENDA
// =========================

function calcularVenda() {

    const quantidade = Number(quantidadeVenda.value) || 0;
    const preco = Number(precoProdutoVenda.value) || 0;

    const total = quantidade * preco;

    valorVenda.value = dinheiro(total);
}


// =========================
// DIGITAR CÓDIGO
// =========================

if (codigoVenda) {

    codigoVenda.addEventListener("input", function () {

        buscarProdutoPorCodigo();

    });

}


// =========================
// DIGITAR QUANTIDADE
// =========================

if (quantidadeVenda) {

    quantidadeVenda.addEventListener("input", function () {

        calcularVenda();

    });

}


// =========================
// REGISTRAR VENDA
// =========================

const formVenda = document.getElementById("formVenda");

if (formVenda) {

    formVenda.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const produto = buscarProdutoPorCodigo();

        if (!produto) {

            mostrarNotificacao("Digite um código de produto válido.");

            codigoVenda.focus();

            return;
        }

        const quantidade = Number(quantidadeVenda.value);

        if (!quantidade || quantidade <= 0) {

            mostrarNotificacao("Digite uma quantidade válida.");

            quantidadeVenda.focus();

            return;
        }

        if (quantidade > Number(produto.quantidade)) {

            mostrarNotificacao(
                `Estoque insuficiente. Disponível: ${produto.quantidade}`
            );

            quantidadeVenda.focus();

            return;
        }

        const preco = Number(produto.preco) || 0;

        const valor = quantidade * preco;

        // Baixa no estoque
        produto.quantidade -= quantidade;

        // Registra venda
        vendas.push({

            id: Date.now(),

            codigo: produto.codigo,

            produto: produto.produto,

            quantidade: quantidade,

            valor: valor,

            data: dataISO()

        });

        salvarTudo();

        formVenda.reset();

        produtoEncontrado.textContent = "";

        atualizarTudo();

        mostrarNotificacao("Venda registrada com sucesso!");

        codigoVenda.focus();

    });

}


// =========================
// FORMULÁRIO DE GASTOS
// =========================

const formGasto = document.getElementById("formGasto");

if (formGasto) {

    formGasto.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const descricao =
            document.getElementById("descricaoGasto").value.trim();

        const valor =
            Number(document.getElementById("valorGasto").value);

        if (!descricao || !valor || valor <= 0) {

            mostrarNotificacao("Preencha os dados do gasto.");

            return;
        }

        gastos.push({

            id: Date.now(),

            descricao: descricao,

            valor: valor,

            data: dataISO()

        });

        salvarTudo();

        formGasto.reset();

        atualizarTudo();

        mostrarNotificacao("Gasto registrado!");

    });

}


// =========================
// ESTOQUE
// =========================

const formEstoque = document.getElementById("formEstoque");

if (formEstoque) {

    formEstoque.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const codigo =
            document.getElementById("codigoEstoque").value.trim();

        const produto =
            document.getElementById("produtoEstoque").value.trim();

        const preco =
            Number(document.getElementById("precoEstoque").value);

        const quantidade =
            Number(document.getElementById("quantidadeEstoqueInput").value);

        if (!codigo || !produto || !preco || quantidade < 0) {

            mostrarNotificacao("Preencha os dados do produto.");

            return;
        }

        // Não permite código repetido
        const codigoExiste = estoque.some(function (item) {

            return String(item.codigo) === codigo;

        });

        if (codigoExiste) {

            mostrarNotificacao("Esse código já está cadastrado.");

            return;
        }

        estoque.push({

            id: Date.now(),

            codigo: codigo,

            produto: produto,

            preco: preco,

            quantidade: quantidade

        });

        salvarTudo();

        formEstoque.reset();

        atualizarTudo();

        mostrarNotificacao("Produto adicionado ao estoque!");

    });

}


// =========================
// ALTERAR ESTOQUE
// =========================

function alterarEstoque(id, quantidade) {

    const produto = estoque.find(function (item) {

        return item.id === id;

    });

    if (!produto) return;

    const novaQuantidade =
        Number(produto.quantidade) + Number(quantidade);

    if (novaQuantidade < 0) {

        mostrarNotificacao("O estoque não pode ficar negativo.");

        return;
    }

    produto.quantidade = novaQuantidade;

    salvarTudo();

    atualizarTudo();
}


// =========================
// EXCLUIR PRODUTO
// =========================

function excluirProduto(id) {

    const produto = estoque.find(function (item) {

        return item.id === id;

    });

    if (!produto) return;

    const confirmar = confirm(
        `Excluir "${produto.produto}" do estoque?`
    );

    if (!confirmar) return;

    estoque = estoque.filter(function (item) {

        return item.id !== id;

    });

    salvarTudo();

    atualizarTudo();

    mostrarNotificacao("Produto excluído.");
}


// =========================
// EXCLUIR VENDA
// =========================

function excluirVenda(id) {

    const venda = vendas.find(function (item) {

        return item.id === id;

    });

    if (!venda) return;

    const confirmar = confirm("Excluir esta venda?");

    if (!confirmar) return;

    // Devolve o produto ao estoque
    const produto = estoque.find(function (item) {

        return String(item.codigo) === String(venda.codigo);

    });

    if (produto) {

        produto.quantidade += Number(venda.quantidade);

    }

    vendas = vendas.filter(function (item) {

        return item.id !== id;

    });

    salvarTudo();

    atualizarTudo();

    mostrarNotificacao("Venda excluída e estoque restaurado.");

}


// =========================
// EXCLUIR GASTO
// =========================

function excluirGasto(id) {

    const confirmar = confirm("Excluir este gasto?");

    if (!confirmar) return;

    gastos = gastos.filter(function (item) {

        return item.id !== id;

    });

    salvarTudo();

    atualizarTudo();

    mostrarNotificacao("Gasto excluído.");
}


// =========================
// RENDER ESTOQUE
// =========================

function atualizarEstoque() {

    const grade = document.getElementById("gradeEstoque");

    if (!grade) return;

    if (estoque.length === 0) {

        grade.innerHTML =
            `<p class="vazio">Nenhum produto cadastrado.</p>`;

        return;
    }

    grade.innerHTML = estoque.map(function (item) {

        return `

        <div class="card-estoque">

            <span class="codigo-produto">
                CÓDIGO ${item.codigo || "SEM CÓDIGO"}
            </span>

            <h4>${item.produto}</h4>

            <span class="preco-produto">
                ${dinheiro(item.preco)}
            </span>

            <div class="estoque-quantidade">

                <span>
                    Estoque disponível
                </span>

                <div class="controles-estoque">

                    <button
                        class="controle"
                        onclick="alterarEstoque(${item.id}, -1)"
                        type="button"
                    >
                        −
                    </button>

                    <span class="quantidade">
                        ${item.quantidade}
                    </span>

                    <button
                        class="controle"
                        onclick="alterarEstoque(${item.id}, 1)"
                        type="button"
                    >
                        +
                    </button>

                    <button
                        class="botao-excluir"
                        onclick="excluirProduto(${item.id})"
                        type="button"
                    >
                        ×
                    </button>

                </div>

            </div>

        </div>

        `;

    }).join("");
}


// =========================
// TABELA DE VENDAS
// =========================

function atualizarTabelaVendas() {

    const tabela = document.getElementById("tabelaVendas");

    if (!tabela) return;

    const lista = vendasDoMes();

    if (lista.length === 0) {

        tabela.innerHTML =
            `<tr><td colspan="6">Nenhuma venda neste mês.</td></tr>`;

        const total = document.getElementById("totalTabelaVendas");

        if (total) {
            total.textContent = dinheiro(0);
        }

        return;
    }

    tabela.innerHTML = lista.slice().reverse().map(function (venda) {

        return `

        <tr>

            <td>${formatarData(venda.data)}</td>

            <td>${venda.codigo || "-"}</td>

            <td>${venda.produto}</td>

            <td>${venda.quantidade}</td>

            <td>${dinheiro(venda.valor)}</td>

            <td>
                <button
                    class="botao-excluir"
                    onclick="excluirVenda(${venda.id})"
                    type="button"
                >
                    ×
                </button>
            </td>

        </tr>

        `;

    }).join("");

    const totalVendas = lista.reduce(function (total, venda) {

        return total + Number(venda.valor || 0);

    }, 0);

    const total = document.getElementById("totalTabelaVendas");

    if (total) {
        total.textContent = dinheiro(totalVendas);
    }
}


// =========================
// TABELA DE GASTOS
// =========================

function atualizarTabelaGastos() {

    const tabela = document.getElementById("tabelaGastos");

    if (!tabela) return;

    const lista = gastosDoMes();

    if (lista.length === 0) {

        tabela.innerHTML =
            `<tr><td colspan="4">Nenhum gasto neste mês.</td></tr>`;

        const total = document.getElementById("totalTabelaGastos");

        if (total) {
            total.textContent = dinheiro(0);
        }

        return;
    }

    tabela.innerHTML = lista.slice().reverse().map(function (gasto) {

        return `

        <tr>

            <td>${formatarData(gasto.data)}</td>

            <td>${gasto.descricao}</td>

            <td>${dinheiro(gasto.valor)}</td>

            <td>

                <button
                    class="botao-excluir"
                    onclick="excluirGasto(${gasto.id})"
                    type="button"
                >
                    ×
                </button>

            </td>

        </tr>

        `;

    }).join("");

    const totalGastos = lista.reduce(function (total, gasto) {

        return total + Number(gasto.valor || 0);

    }, 0);

    const total = document.getElementById("totalTabelaGastos");

    if (total) {
        total.textContent = dinheiro(totalGastos);
    }
}


// =========================
// DASHBOARD
// =========================

function atualizarDashboard() {

    const vendasMes = vendasDoMes();
    const gastosMes = gastosDoMes();

    const faturamento = vendasMes.reduce(function (total, venda) {

        return total + Number(venda.valor || 0);

    }, 0);

    const totalGastos = gastosMes.reduce(function (total, gasto) {

        return total + Number(gasto.valor || 0);

    }, 0);

    const lucro = faturamento - totalGastos;

    const quantidadeEstoque = estoque.reduce(function (total, item) {

        return total + Number(item.quantidade || 0);

    }, 0);


    const faturamentoElemento =
        document.getElementById("faturamentoMes");

    if (faturamentoElemento) {
        faturamentoElemento.textContent = dinheiro(faturamento);
    }


    const quantidadeVendas =
        document.getElementById("quantidadeVendas");

    if (quantidadeVendas) {
        quantidadeVendas.textContent = vendasMes.length;
    }


    const gastosElemento =
        document.getElementById("gastosMes");

    if (gastosElemento) {
        gastosElemento.textContent = dinheiro(totalGastos);
    }


    const quantidadeGastos =
        document.getElementById("quantidadeGastos");

    if (quantidadeGastos) {
        quantidadeGastos.textContent = gastosMes.length;
    }


    const lucroElemento =
        document.getElementById("lucroMes");

    if (lucroElemento) {
        lucroElemento.textContent = dinheiro(lucro);
    }


    const margem =
        document.getElementById("margemLucro");

    if (margem) {

        const percentual =
            faturamento > 0
                ? (lucro / faturamento) * 100
                : 0;

        margem.textContent =
            `${percentual.toFixed(1)}%`;

    }


    const estoqueQuantidade =
        document.getElementById("quantidadeEstoque");

    if (estoqueQuantidade) {
        estoqueQuantidade.textContent = quantidadeEstoque;
    }


    const produtosEstoque =
        document.getElementById("produtosEstoque");

    if (produtosEstoque) {
        produtosEstoque.textContent = estoque.length;
    }
}


// =========================
// META
// =========================

function atualizarMeta() {

    const mes = obterMes();

    const meta = Number(metas[mes] || 0);

    const faturamento = vendasDoMes().reduce(function (total, venda) {

        return total + Number(venda.valor || 0);

    }, 0);

    const metaValor = document.getElementById("metaValor");

    if (metaValor) {
        metaValor.textContent = dinheiro(meta);
    }

    const metaFaturado = document.getElementById("metaFaturado");

    if (metaFaturado) {
        metaFaturado.textContent = dinheiro(faturamento);
    }

    let porcentagem = 0;

    if (meta > 0) {

        porcentagem =
            Math.min((faturamento / meta) * 100, 100);

    }

    const porcentagemMeta =
        document.getElementById("porcentagemMeta");

    if (porcentagemMeta) {
        porcentagemMeta.textContent =
            `${porcentagem.toFixed(0)}%`;
    }

    const barraMeta =
        document.getElementById("barraMeta");

    if (barraMeta) {
        barraMeta.style.width = `${porcentagem}%`;
    }

    const faltaMeta =
        document.getElementById("faltaMeta");

    if (faltaMeta) {

        const falta =
            Math.max(meta - faturamento, 0);

        faltaMeta.textContent =
            dinheiro(falta);

    }

    const statusMeta =
        document.getElementById("statusMeta");

    if (statusMeta) {

        if (meta <= 0) {

            statusMeta.textContent =
                "Defina uma meta";

        } else if (faturamento >= meta) {

            statusMeta.textContent =
                "Meta alcançada!";

        } else {

            statusMeta.textContent =
                "Em andamento";

        }

    }
}


// =========================
// CONFIGURAÇÃO DA META
// =========================

const formMeta = document.getElementById("formMeta");

if (formMeta) {

    formMeta.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const valor =
            Number(document.getElementById("valorMeta").value);

        if (!valor || valor <= 0) {

            mostrarNotificacao("Digite uma meta válida.");

            return;
        }

        metas[obterMes()] = valor;

        salvarTudo();

        atualizarTudo();

        mostrarNotificacao("Meta atualizada!");

    });

}


// =========================
// LIMPAR DADOS
// =========================

const limparDados =
    document.getElementById("limparDados");

if (limparDados) {

    limparDados.addEventListener("click", function () {

        const confirmar = confirm(
            "Tem certeza que deseja apagar todos os dados?"
        );

        if (!confirmar) return;

        vendas = [];
        gastos = [];
        estoque = [];
        metas = {};

        salvarTudo();

        atualizarTudo();

        mostrarNotificacao("Todos os dados foram apagados.");

    });

}


// =========================
// MESES
// =========================

function carregarMeses() {

    if (!mesSelecionado) return;

    const hoje = new Date();

    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    mesSelecionado.innerHTML = "";

    for (let i = -6; i <= 6; i++) {

        const data = new Date(
            anoAtual,
            mesAtual + i,
            1
        );

        const ano = data.getFullYear();

        const mes =
            String(data.getMonth() + 1).padStart(2, "0");

        const valor = `${ano}-${mes}`;

        const option = document.createElement("option");

        option.value = valor;

        option.textContent =
            data.toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric"
            });

        if (i === 0) {
            option.selected = true;
        }

        mesSelecionado.appendChild(option);

    }

    mesSelecionado.addEventListener("change", function () {

        atualizarTudo();

    });

}


// =========================
// ATUALIZAR TUDO
// =========================

function atualizarTudo() {

    atualizarDashboard();

    atualizarMeta();

    atualizarEstoque();

    atualizarTabelaVendas();

    atualizarTabelaGastos();

}


// =========================
// INICIALIZAÇÃO
// =========================

// Corrige produtos antigos
estoque = estoque.map(function (item) {

    return {

        ...item,

        codigo: item.codigo || "",

        preco: Number(item.preco) || 0,

        quantidade: Number(item.quantidade) || 0

    };

});

salvarTudo();

gerarDataAtual();

carregarMeses();

atualizarTudo();