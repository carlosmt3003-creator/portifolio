
/* =========================================================
   MOREIRA DOCES & GELADOS
   SISTEMA FINANCEIRO
========================================================= */


/* =========================================================
   DADOS
========================================================= */

let vendas =
    JSON.parse(
        localStorage.getItem("moreira_vendas")
    ) || [];


let gastos =
    JSON.parse(
        localStorage.getItem("moreira_gastos")
    ) || [];


let estoque =
    JSON.parse(
        localStorage.getItem("moreira_estoque")
    ) || [];


let metas =
    JSON.parse(
        localStorage.getItem("moreira_metas")
    ) || {};



/* =========================================================
   ELEMENTOS
========================================================= */

const secoes =
    document.querySelectorAll(".secao");


const botoesMenu =
    document.querySelectorAll(".menu-item");


const botoesSecao =
    document.querySelectorAll("[data-secao]");


const mesSelecionado =
    document.getElementById("mesSelecionado");


const dataAtual =
    document.getElementById("dataAtual");


const faturamentoMes =
    document.getElementById("faturamentoMes");


const gastosMes =
    document.getElementById("gastosMes");


const lucroMes =
    document.getElementById("lucroMes");


const quantidadeVendas =
    document.getElementById("quantidadeVendas");


const quantidadeGastos =
    document.getElementById("quantidadeGastos");


const margemLucro =
    document.getElementById("margemLucro");


const quantidadeEstoque =
    document.getElementById("quantidadeEstoque");


const produtosEstoque =
    document.getElementById("produtosEstoque");


const metaFaturado =
    document.getElementById("metaFaturado");


const metaValor =
    document.getElementById("metaValor");


const porcentagemMeta =
    document.getElementById("porcentagemMeta");


const barraMeta =
    document.getElementById("barraMeta");


const faltaMeta =
    document.getElementById("faltaMeta");


const statusMeta =
    document.getElementById("statusMeta");


const indicadorSaude =
    document.getElementById("indicadorSaude");


const textoSaude =
    document.getElementById("textoSaude");


const descricaoSaude =
    document.getElementById("descricaoSaude");


const grafico =
    document.getElementById("grafico");


const ultimasMovimentacoes =
    document.getElementById("ultimasMovimentacoes");


const tabelaVendas =
    document.getElementById("tabelaVendas");


const tabelaGastos =
    document.getElementById("tabelaGastos");


const gradeEstoque =
    document.getElementById("gradeEstoque");


const notificacao =
    document.getElementById("notificacao");


const textoNotificacao =
    document.getElementById("textoNotificacao");



/* =========================================================
   DATA ATUAL
========================================================= */

const agora =
    new Date();


function gerarMesAtual() {

    const ano =
        agora.getFullYear();

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");

    return `${ano}-${mes}`;
}


mesSelecionado.value =
    gerarMesAtual();


dataAtual.textContent =
    agora.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );



/* =========================================================
   NAVEGAÇÃO
========================================================= */

botoesMenu.forEach(function(botao) {

    botao.addEventListener(
        "click",
        function() {

            abrirSecao(
                botao.dataset.secao
            );

        }
    );

});


botoesSecao.forEach(function(botao) {

    botao.addEventListener(
        "click",
        function() {

            abrirSecao(
                botao.dataset.secao
            );

        }
    );

});


function abrirSecao(nome) {

    secoes.forEach(function(secao) {

        secao.classList.remove("ativa");

    });


    botoesMenu.forEach(function(botao) {

        botao.classList.remove("ativo");

    });


    const secao =
        document.getElementById(nome);


    if (secao) {

        secao.classList.add("ativa");

    }


    botoesMenu.forEach(function(botao) {

        if (
            botao.dataset.secao === nome
        ) {

            botao.classList.add("ativo");

        }

    });

}



/* =========================================================
   FORMATAR DINHEIRO
========================================================= */

function dinheiro(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}



/* =========================================================
   SALVAR
========================================================= */

function salvarTudo() {

    localStorage.setItem(
        "moreira_vendas",
        JSON.stringify(vendas)
    );


    localStorage.setItem(
        "moreira_gastos",
        JSON.stringify(gastos)
    );


    localStorage.setItem(
        "moreira_estoque",
        JSON.stringify(estoque)
    );


    localStorage.setItem(
        "moreira_metas",
        JSON.stringify(metas)
    );

}



/* =========================================================
   NOTIFICAÇÃO
========================================================= */

let tempoNotificacao;


function mostrarNotificacao(mensagem) {

    textoNotificacao.textContent =
        mensagem;


    notificacao.classList.add(
        "mostrar"
    );


    clearTimeout(
        tempoNotificacao
    );


    tempoNotificacao =
        setTimeout(
            function() {

                notificacao.classList.remove(
                    "mostrar"
                );

            },
            2500
        );

}



/* =========================================================
   PEGAR MÊS DE UMA DATA
========================================================= */

function mesDaData(data) {

    const partes =
        data.split("-");

    return `${partes[0]}-${partes[1]}`;

}



/* =========================================================
   PEGAR MÊS ATUAL SELECIONADO
========================================================= */

function obterMes() {

    return mesSelecionado.value;

}



/* =========================================================
   FILTRAR VENDAS
========================================================= */

function vendasDoMes() {

    return vendas.filter(
        function(venda) {

            return mesDaData(
                venda.data
            ) === obterMes();

        }
    );

}



/* =========================================================
   FILTRAR GASTOS
========================================================= */

function gastosDoMes() {

    return gastos.filter(
        function(gasto) {

            return mesDaData(
                gasto.data
            ) === obterMes();

        }
    );

}



/* =========================================================
   DATA PARA SALVAR
========================================================= */

function dataISO() {

    const data =
        new Date();


    const ano =
        data.getFullYear();


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            data.getDate()
        ).padStart(2, "0");


    return `${ano}-${mes}-${dia}`;

}



/* =========================================================
   REGISTRAR VENDA
========================================================= */

document
    .getElementById("formVenda")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const produto =
                document
                    .getElementById(
                        "produtoVenda"
                    )
                    .value
                    .trim();


            const quantidade =
                Number(
                    document
                        .getElementById(
                            "quantidadeVenda"
                        )
                        .value
                );


            const valor =
                Number(
                    document
                        .getElementById(
                            "valorVenda"
                        )
                        .value
                );


            if (
                !produto ||
                quantidade <= 0 ||
                valor <= 0
            ) {

                mostrarNotificacao(
                    "Preencha os dados corretamente."
                );

                return;

            }


            /*
                Procura o produto no estoque.
            */

            const produtoEstoque =
                estoque.find(
                    function(item) {

                        return (
                            item.produto.toLowerCase()
                            ===
                            produto.toLowerCase()
                        );

                    }
                );


            if (produtoEstoque) {

                if (
                    produtoEstoque.quantidade
                    <
                    quantidade
                ) {

                    mostrarNotificacao(
                        "Estoque insuficiente."
                    );

                    return;

                }


                produtoEstoque.quantidade -=
                    quantidade;

            }


            vendas.push({

                id:
                    Date.now(),

                produto:
                    produto,

                quantidade:
                    quantidade,

                valor:
                    valor,

                data:
                    dataISO()

            });


            salvarTudo();


            event.target.reset();


            mostrarNotificacao(
                "Venda registrada com sucesso."
            );


            atualizarTudo();

        }
    );



/* =========================================================
   REGISTRAR GASTO
========================================================= */

document
    .getElementById("formGasto")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const descricao =
                document
                    .getElementById(
                        "descricaoGasto"
                    )
                    .value
                    .trim();


            const valor =
                Number(
                    document
                        .getElementById(
                            "valorGasto"
                        )
                        .value
                );


            if (
                !descricao ||
                valor <= 0
            ) {

                mostrarNotificacao(
                    "Informe uma descrição e um valor."
                );

                return;

            }


            gastos.push({

                id:
                    Date.now(),

                descricao:
                    descricao,

                valor:
                    valor,

                data:
                    dataISO()

            });


            salvarTudo();


            event.target.reset();


            mostrarNotificacao(
                "Gasto registrado com sucesso."
            );


            atualizarTudo();

        }
    );



/* =========================================================
   ADICIONAR ESTOQUE
========================================================= */

document
    .getElementById("formEstoque")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const produto =
                document
                    .getElementById(
                        "produtoEstoque"
                    )
                    .value
                    .trim();


            const quantidade =
                Number(
                    document
                        .getElementById(
                            "quantidadeEstoqueInput"
                        )
                        .value
                );


            if (
                !produto ||
                quantidade <= 0
            ) {

                mostrarNotificacao(
                    "Informe o produto e a quantidade."
                );

                return;

            }


            const existente =
                estoque.find(
                    function(item) {

                        return (
                            item.produto.toLowerCase()
                            ===
                            produto.toLowerCase()
                        );

                    }
                );


            if (existente) {

                existente.quantidade +=
                    quantidade;

            } else {

                estoque.push({

                    id:
                        Date.now(),

                    produto:
                        produto,

                    quantidade:
                        quantidade

                });

            }


            salvarTudo();


            event.target.reset();


            mostrarNotificacao(
                "Estoque atualizado."
            );


            atualizarTudo();

        }
    );



/* =========================================================
   META
========================================================= */

document
    .getElementById("formMeta")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const valor =
                Number(
                    document
                        .getElementById(
                            "valorMeta"
                        )
                        .value
                );


            if (valor <= 0) {

                return;

            }


            metas[obterMes()] =
                valor;


            salvarTudo();


            event.target.reset();


            mostrarNotificacao(
                "Meta mensal salva."
            );


            atualizarDashboard();

        }
    );



/* =========================================================
   ATUALIZAR DASHBOARD
========================================================= */

function atualizarDashboard() {

    const vendasMes =
        vendasDoMes();


    const gastosMesArray =
        gastosDoMes();


    let faturamento =
        0;


    let totalGastos =
        0;


    vendasMes.forEach(
        function(venda) {

            faturamento +=
                venda.valor;

        }
    );


    gastosMesArray.forEach(
        function(gasto) {

            totalGastos +=
                gasto.valor;

        }
    );


    const lucro =
        faturamento -
        totalGastos;


    const margem =
        faturamento > 0
            ? (lucro / faturamento) * 100
            : 0;


    faturamentoMes.textContent =
        dinheiro(faturamento);


    gastosMes.textContent =
        dinheiro(totalGastos);


    lucroMes.textContent =
        dinheiro(lucro);


    quantidadeVendas.textContent =
        vendasMes.length;


    quantidadeGastos.textContent =
        gastosMesArray.length;


    margemLucro.textContent =
        `${margem.toFixed(1)}%`;


    atualizarEstoqueResumo();


    atualizarMeta(
        faturamento
    );


    atualizarSaude(
        faturamento,
        totalGastos,
        lucro
    );


    atualizarGrafico(
        faturamento,
        totalGastos,
        lucro
    );


    atualizarUltimasMovimentacoes();

}



/* =========================================================
   RESUMO ESTOQUE
========================================================= */

function atualizarEstoqueResumo() {

    let quantidade =
        0;


    estoque.forEach(
        function(item) {

            quantidade +=
                item.quantidade;

        }
    );


    quantidadeEstoque.textContent =
        quantidade;


    produtosEstoque.textContent =
        `${estoque.length} produtos`;

}



/* =========================================================
   META
========================================================= */

function atualizarMeta(faturamento) {

    const meta =
        metas[obterMes()] || 1000;


    const porcentagem =
        meta > 0
            ? (faturamento / meta) * 100
            : 0;


    const porcentagemLimitada =
        Math.min(
            porcentagem,
            100
        );


    metaFaturado.textContent =
        dinheiro(faturamento);


    metaValor.textContent =
        dinheiro(meta);


    porcentagemMeta.textContent =
        `${porcentagem.toFixed(0)}%`;


    barraMeta.style.width =
        `${porcentagemLimitada}%`;


    const falta =
        meta - faturamento;


    if (faturamento >= meta) {

        faltaMeta.textContent =
            "Meta alcançada!";


        statusMeta.textContent =
            "Meta alcançada";


        barraMeta.style.background =
            "linear-gradient(90deg, #22c55e, #4ade80)";

        statusMeta.style.color =
            "#22c55e";

        statusMeta.style.background =
            "rgba(34,197,94,0.1)";

    }

    else {

        faltaMeta.textContent =
            `Faltam ${dinheiro(falta)}`;


        statusMeta.textContent =
            "Em andamento";


        /*
            A cor muda conforme o percentual.
        */

        if (porcentagem >= 75) {

            barraMeta.style.background =
                "linear-gradient(90deg, #22c55e, #84cc16)";

            statusMeta.style.color =
                "#22c55e";

        }

        else if (porcentagem >= 40) {

            barraMeta.style.background =
                "linear-gradient(90deg, #f59e0b, #eab308)";

            statusMeta.style.color =
                "#f59e0b";

        }

        else {

            barraMeta.style.background =
                "linear-gradient(90deg, #8b5cf6, #a855f7)";

            statusMeta.style.color =
                "#8b5cf6";

        }

    }

}



/* =========================================================
   SAÚDE FINANCEIRA
========================================================= */

function atualizarSaude(
    faturamento,
    gastos,
    lucro
) {

    if (
        faturamento === 0 &&
        gastos === 0
    ) {

        indicadorSaude.textContent =
            "—";


        textoSaude.textContent =
            "Sem movimentação";


        descricaoSaude.textContent =
            "Registre vendas e gastos para acompanhar seu resultado.";

        return;

    }


    if (lucro > 0) {

        indicadorSaude.textContent =
            "↑";


        indicadorSaude.style.color =
            "#22c55e";


        indicadorSaude.style.borderColor =
            "#22c55e";


        indicadorSaude.style.background =
            "rgba(34,197,94,0.08)";


        textoSaude.textContent =
            "Resultado positivo";


        descricaoSaude.textContent =
            "O faturamento está acima dos gastos neste período.";

    }

    else if (lucro === 0) {

        indicadorSaude.textContent =
            "=";


        indicadorSaude.style.color =
            "#f59e0b";


        indicadorSaude.style.borderColor =
            "#f59e0b";


        textoSaude.textContent =
            "Ponto de equilíbrio";


        descricaoSaude.textContent =
            "O faturamento está igual aos gastos.";

    }

    else {

        indicadorSaude.textContent =
            "↓";


        indicadorSaude.style.color =
            "#ef4444";


        indicadorSaude.style.borderColor =
            "#ef4444";


        indicadorSaude.style.background =
            "rgba(239,68,68,0.08)";


        textoSaude.textContent =
            "Resultado negativo";


        descricaoSaude.textContent =
            "Os gastos estão acima do faturamento.";

    }

}



/* =========================================================
   GRÁFICO
========================================================= */

function atualizarGrafico(
    faturamento,
    gastos,
    lucro
) {

    grafico.innerHTML = "";


    const valores = [

        {
            nome: "Faturamento",
            valor: faturamento,
            classe: "barra-venda"
        },

        {
            nome: "Gastos",
            valor: gastos,
            classe: "barra-gasto"
        },

        {
            nome: "Lucro",
            valor: Math.max(
                lucro,
                0
            ),
            classe: "barra-lucro"
        }

    ];


    const maior =
        Math.max(
            ...valores.map(
                item => item.valor
            ),
            1
        );


    valores.forEach(
        function(item) {

            const coluna =
                document.createElement(
                    "div"
                );


            coluna.className =
                "grafico-coluna";


            const barra =
                document.createElement(
                    "div"
                );


            barra.className =
                `barra-grafico ${item.classe}`;


            const altura =
                Math.max(
                    (item.valor / maior) * 210,
                    3
                );


            barra.style.height =
                `${altura}px`;


            barra.dataset.valor =
                dinheiro(item.valor);


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "grafico-label";


            label.textContent =
                item.nome;


            coluna.appendChild(
                barra
            );


            coluna.appendChild(
                label
            );


            grafico.appendChild(
                coluna
            );

        }
    );

}



/* =========================================================
   ÚLTIMAS MOVIMENTAÇÕES
========================================================= */

function atualizarUltimasMovimentacoes() {

    const registros = [];


    vendas.forEach(
        function(venda) {

            registros.push({

                id:
                    venda.id,

                tipo:
                    "venda",

                nome:
                    venda.produto,

                valor:
                    venda.valor,

                data:
                    venda.data

            });

        }
    );


    gastos.forEach(
        function(gasto) {

            registros.push({

                id:
                    gasto.id,

                tipo:
                    "gasto",

                nome:
                    gasto.descricao,

                valor:
                    gasto.valor,

                data:
                    gasto.data

            });

        }
    );


    registros.sort(
        function(a, b) {

            return b.id - a.id;

        }
    );


    const ultimos =
        registros.slice(
            0,
            6
        );


    ultimasMovimentacoes.innerHTML =
        "";


    if (ultimos.length === 0) {

        ultimasMovimentacoes.innerHTML = `
            <div class="vazio">
                Nenhuma movimentação registrada.
            </div>
        `;

        return;

    }


    ultimos.forEach(
        function(item) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "movimento";


            const icone =
                item.tipo === "venda"
                    ? "↗"
                    : "↘";


            const classeIcone =
                item.tipo === "venda"
                    ? "movimento-venda"
                    : "movimento-gasto";


            const classeValor =
                item.tipo === "venda"
                    ? "movimento-venda-valor"
                    : "movimento-gasto-valor";


            const sinal =
                item.tipo === "venda"
                    ? "+"
                    : "-";


            div.innerHTML = `

                <div class="movimento-icone ${classeIcone}">
                    ${icone}
                </div>

                <div class="movimento-info">

                    <strong>
                        ${item.nome}
                    </strong>

                    <span>
                        ${formatarData(item.data)}
                    </span>

                </div>

                <strong class="movimento-valor ${classeValor}">
                    ${sinal} ${dinheiro(item.valor)}
                </strong>

            `;


            ultimasMovimentacoes.appendChild(
                div
            );

        }
    );

}



/* =========================================================
   TABELA DE VENDAS
========================================================= */

function atualizarTabelaVendas() {

    tabelaVendas.innerHTML =
        "";


    const lista =
        [...vendas].sort(
            (a, b) =>
                b.id - a.id
        );


    document.getElementById(
        "totalTabelaVendas"
    ).textContent =
        `${vendas.length} vendas`;


    if (lista.length === 0) {

        tabelaVendas.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="vazio"
                >
                    Nenhuma venda registrada.
                </td>

            </tr>

        `;

        return;

    }


    lista.forEach(
        function(venda) {

            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>
                    ${formatarData(venda.data)}
                </td>

                <td>
                    ${venda.produto}
                </td>

                <td>
                    ${venda.quantidade}
                </td>

                <td>
                    ${dinheiro(venda.valor)}
                </td>

                <td>

                    <button
                        class="btn-excluir"
                        onclick="excluirVenda(${venda.id})"
                    >
                        Excluir
                    </button>

                </td>

            `;


            tabelaVendas.appendChild(
                linha
            );

        }
    );

}



/* =========================================================
   TABELA DE GASTOS
========================================================= */

function atualizarTabelaGastos() {

    tabelaGastos.innerHTML =
        "";


    const lista =
        [...gastos].sort(
            (a, b) =>
                b.id - a.id
        );


    document.getElementById(
        "totalTabelaGastos"
    ).textContent =
        `${gastos.length} gastos`;


    if (lista.length === 0) {

        tabelaGastos.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="vazio"
                >
                    Nenhum gasto registrado.
                </td>

            </tr>

        `;

        return;

    }


    lista.forEach(
        function(gasto) {

            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>
                    ${formatarData(gasto.data)}
                </td>

                <td>
                    ${gasto.descricao}
                </td>

                <td>
                    ${dinheiro(gasto.valor)}
                </td>

                <td>

                    <button
                        class="btn-excluir"
                        onclick="excluirGasto(${gasto.id})"
                    >
                        Excluir
                    </button>

                </td>

            `;


            tabelaGastos.appendChild(
                linha
            );

        }
    );

}



/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(data) {

    const partes =
        data.split("-");


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}



/* =========================================================
   ESTOQUE
========================================================= */

function atualizarEstoque() {

    gradeEstoque.innerHTML =
        "";


    if (estoque.length === 0) {

        gradeEstoque.innerHTML = `

            <div class="painel vazio">
                Nenhum produto cadastrado no estoque.
            </div>

        `;

        return;

    }


    estoque.forEach(
        function(item) {

            const produto =
                document.createElement(
                    "article"
                );


            let classe =
                "";


            let status =
                "Estoque normal";


            if (
                item.quantidade === 0
            ) {

                classe =
                    "esgotado";

                status =
                    "Esgotado";

            }

            else if (
                item.quantidade <= 5
            ) {

                classe =
                    "baixo";

                status =
                    "Estoque baixo";

            }


            produto.className =
                `produto ${classe}`;


            produto.innerHTML = `

                <h3>
                    ${item.produto}
                </h3>

                <div class="produto-info">

                    <div>

                        <div class="quantidade-produto">
                            ${item.quantidade}
                        </div>

                        <span>
                            unidades
                        </span>

                    </div>

                    <span class="status-estoque">
                        ${status}
                    </span>

                </div>

                <div class="acoes-produto">

                    <button
                        class="btn-estoque"
                        onclick="alterarEstoque(${item.id}, 1)"
                    >
                        +1
                    </button>

                    <button
                        class="btn-estoque"
                        onclick="alterarEstoque(${item.id}, -1)"
                    >
                        −1
                    </button>

                    <button
                        class="btn-estoque btn-remover"
                        onclick="excluirProduto(${item.id})"
                    >
                        ×
                    </button>

                </div>

            `;


            gradeEstoque.appendChild(
                produto
            );

        }
    );

}



/* =========================================================
   ALTERAR ESTOQUE
========================================================= */

function alterarEstoque(
    id,
    quantidade
) {

    const produto =
        estoque.find(
            item =>
                item.id === id
        );


    if (!produto) {

        return;

    }


    produto.quantidade +=
        quantidade;


    if (
        produto.quantidade < 0
    ) {

        produto.quantidade =
            0;

    }


    salvarTudo();


    atualizarTudo();


    mostrarNotificacao(
        "Estoque atualizado."
    );

}



/* =========================================================
   EXCLUIR PRODUTO
========================================================= */

function excluirProduto(id) {

    const confirmar =
        confirm(
            "Deseja excluir este produto do estoque?"
        );


    if (!confirmar) {

        return;

    }


    estoque =
        estoque.filter(
            item =>
                item.id !== id
        );


    salvarTudo();


    atualizarTudo();


    mostrarNotificacao(
        "Produto removido."
    );

}



/* =========================================================
   EXCLUIR VENDA
========================================================= */

function excluirVenda(id) {

    const confirmar =
        confirm(
            "Deseja excluir esta venda?"
        );


    if (!confirmar) {

        return;

    }


    vendas =
        vendas.filter(
            venda =>
                venda.id !== id
        );


    salvarTudo();


    atualizarTudo();


    mostrarNotificacao(
        "Venda excluída."
    );

}



/* =========================================================
   EXCLUIR GASTO
========================================================= */

function excluirGasto(id) {

    const confirmar =
        confirm(
            "Deseja excluir este gasto?"
        );


    if (!confirmar) {

        return;

    }


    gastos =
        gastos.filter(
            gasto =>
                gasto.id !== id
        );


    salvarTudo();


    atualizarTudo();


    mostrarNotificacao(
        "Gasto excluído."
    );

}



/* =========================================================
   LIMPAR TUDO
========================================================= */

document
    .getElementById("limparDados")
    .addEventListener(
        "click",
        function() {

            const confirmar =
                confirm(
                    "ATENÇÃO!\n\nIsso apagará vendas, gastos, estoque e metas.\n\nDeseja realmente continuar?"
                );


            if (!confirmar) {

                return;

            }


            localStorage.removeItem(
                "moreira_vendas"
            );


            localStorage.removeItem(
                "moreira_gastos"
            );


            localStorage.removeItem(
                "moreira_estoque"
            );


            localStorage.removeItem(
                "moreira_metas"
            );


            vendas = [];

            gastos = [];

            estoque = [];

            metas = {};


            atualizarTudo();


            mostrarNotificacao(
                "Todos os dados foram apagados."
            );

        }
    );



/* =========================================================
   MUDANÇA DE MÊS
========================================================= */

mesSelecionado.addEventListener(
    "change",
    function() {

        atualizarDashboard();

        atualizarTabelaVendas();

        atualizarTabelaGastos();

        mostrarNotificacao(
            "Período atualizado."
        );

    }
);



/* =========================================================
   ATUALIZAR TUDO
========================================================= */

function atualizarTudo() {

    atualizarDashboard();

    atualizarTabelaVendas();

    atualizarTabelaGastos();

    atualizarEstoque();

}



/* =========================================================
   INICIALIZAÇÃO
========================================================= */

atualizarTudo();

