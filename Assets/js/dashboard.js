// formata a forma com que os valores monetários serão exibidos na tela
function formataValor(valor) {
    return valor.toFixed(2).replace(".", ",").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


function calcularValoresDashboard(notas) { /* cria um array com os valores a serem exibidos, porém com esses valores zerados para 
no forEach serem, por meio da iteração esses valores serem acrescidos com todos os valores correspondentes ao filtro de status,
independente da qunatidade de valor que existir por filtro */
    const dashboard = {
        valorTotalNotas: 0,
        valorSemCobranca: 0,
        valorInadimplencia: 0,
        valorAVencer: 0,
        valorPagas: 0,
        evolucaoInadimplencia: [], /*os dois ultimos indices do array são os valores a serem inseridos no grafico, por esse motivo não é possível iniciar com valores zerados e sim com um array vazio*/
        evolucaoReceita: [],
    };

    notas.forEach((nota) => {
        dashboard.valorTotalNotas += nota.valor;

        if (nota.status === 'Emitida') {
            dashboard.valorSemCobranca += nota.valor;
        }

        if (nota.status === 'Pagamento em Atraso') {
            dashboard.valorInadimplencia += nota.valor;
        }

        if (nota.status === 'Cobrança Realizada') {
            dashboard.valorAVencer += nota.valor;
        }

        if (nota.status === 'Pagamento Realizado') {
            dashboard.valorPagas += nota.valor;
        }
    });


    dashboard.valorTotalNotas = formataValor(dashboard.valorTotalNotas);
    dashboard.valorSemCobranca = formataValor(dashboard.valorSemCobranca);
    dashboard.valorInadimplencia = formataValor(dashboard.valorInadimplencia);
    dashboard.valorAVencer = formataValor(dashboard.valorAVencer);
    dashboard.valorPagas = formataValor(dashboard.valorPagas);


    return dashboard;
}

/* Função responsável por armazenas os valores mês a mês para que possam ser consumidos nos gráficos*/

function calcularEvolucaoGrafico(notas, status) {  // ao passar o status como parametro eu consigo reaproveitar essa mesma função para os dois graficos, alterando apenas o status quando chamar a função no dataset { data: }
    const evolucaoMensal = Array.from({ length: 12 }, () => 0);

    notas.forEach((nota) => {
        const data = new Date(nota.dataEmissao);
        const mes = data.getMonth();

        if (nota.status === status) {
            evolucaoMensal[mes] += nota.valor;
        }
    });

    return evolucaoMensal;
}



/*função responsável por adicionar os valores nos devidos campos na tela de acordo com os novos valores gerados nas demais funções*/
function atualizarDashboard() {
    const dashboard = calcularValoresDashboard(notas);

    document.querySelector('#valor-total-notas').textContent = dashboard.valorTotalNotas;
    document.querySelector('#valor-sem-cobranca').textContent = dashboard.valorSemCobranca;
    document.querySelector('#valor-inadimplencia').textContent = dashboard.valorInadimplencia;
    document.querySelector('#valor-a-vencer').textContent = dashboard.valorAVencer;
    document.querySelector('#valor-pagas').textContent = dashboard.valorPagas;

    // Grafico para evolução da Inadimplência, criado conforme documentação do Chart.js

    const atraso = document.querySelector('.atraso');

    const graficoAtraso = new Chart(atraso, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Evolução da Inadimplência',
                data: calcularEvolucaoGrafico(notas, 'Pagamento em Atraso'),
                borderColor: 'rgb(241, 14, 14)',
                backgroundColor: 'rgb(252, 141, 141)',
                borderWidth: 4,
                fill: false
            }]
        }
    });

    const receita = document.querySelector('.receita');

    const graficoReceita = new Chart(receita, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Evolução da Receita',
                data: calcularEvolucaoGrafico(notas, 'Pagamento Realizado'),
                borderColor: 'rgb(8, 184, 8)',
                backgroundColor: 'rgb(177, 240, 177)',
                borderWidth: 4,
                fill: false
            }]
        }
    });

}


/* nesse trecho de código foi adicionado um escutador de evento para alterar os valores de acordo com o filtro do mês que for selecionado 
e então exibir os dados somente do referente mês  */

const mes = document.querySelector('#filtro-indicadores-mes');

mes.addEventListener('change', function () {
    const selecionaMes = mes.value;

    const notasFiltradas = notas.filter(nota => {
        if (selecionaMes === "") { /*esse condição verifica se os valores estão nulos ou não foram selecionados e caso seja verdadeiro exibe todos
        os dados na tela, que por padrão está com a visualização do ano todo*/
            return true;
        }

        if (nota.dataEmissao) {
            const extraiMesEmissao = nota.dataEmissao.split('-')[1];
            return extraiMesEmissao === selecionaMes;
        }
        return false;
    });

    const dashboard = calcularValoresDashboard(notasFiltradas);

    document.querySelector('#valor-total-notas').textContent = dashboard.valorTotalNotas;
    document.querySelector('#valor-sem-cobranca').textContent = dashboard.valorSemCobranca;
    document.querySelector('#valor-inadimplencia').textContent = dashboard.valorInadimplencia;
    document.querySelector('#valor-a-vencer').textContent = dashboard.valorAVencer;
    document.querySelector('#valor-pagas').textContent = dashboard.valorPagas;
});


/* nesse trecho de código foi adicionado um escutador de evento para alterar os valores de acordo com o filtro do trimestre que for selecionado 
e então exibir os dados somente do referente trimestre  */

// Essa função determina qual é o trimestre de acordo com o mês do ano
function obterTrimestre(mes) {
    if (mes >= 1 && mes <= 3) {
        return 1;
    } else if (mes >= 4 && mes <= 6) {
        return 2;
    } else if (mes >= 7 && mes <= 9) {
        return 3;
    } else if (mes >= 10 && mes <= 12) {
        return 4;
    }
    return 0;
}


const trimestre = document.querySelector('#filtro-indicadores-trimestre');

trimestre.addEventListener('change', function () {
    const selecionaTrimestre = parseInt(trimestre.value);

    if (selecionaTrimestre >= 1 && selecionaTrimestre <= 4) { // verifica se o semestre esta entre o intervalo valido (de 1 até 4)
        const notasFiltradas = notas.filter(nota => {
            if (nota.dataEmissao) {
                const extraiMesEmissao = nota.dataEmissao.split('-')[1];
                const trimestreDaNota = obterTrimestre(extraiMesEmissao);
                return trimestreDaNota === selecionaTrimestre;
            }
            return false;
        });

        const dashboard = calcularValoresPorTrimestre(notasFiltradas, selecionaTrimestre); // atualiza os valores de acordo com os valores armazenados na função calcularValoresPorTrimestre

        document.querySelector('#valor-total-notas').textContent = dashboard.valorTotalNotas;
        document.querySelector('#valor-sem-cobranca').textContent = dashboard.valorSemCobranca;
        document.querySelector('#valor-inadimplencia').textContent = dashboard.valorInadimplencia;
        document.querySelector('#valor-a-vencer').textContent = dashboard.valorAVencer;
        document.querySelector('#valor-pagas').textContent = dashboard.valorPagas;
    } else {
        atualizarDashboard(); /*esse condição verifica se os valores estão nulos ou não foram selecionados e caso seja verdadeiro exibe todos
        os dados na tela, que por padrão está com a visualização do ano todo*/
    }
});

// Essa função calcula os valores por trimestre os armazenando no Array notasFiltradas de acordo com seu trimestre e dps esses valores são consumidos pela função no escutador de eventos
function calcularValoresPorTrimestre(notas, trimestre) {
    const notasFiltradas = notas.filter(nota => {
        if (nota.dataEmissao) {
            const extraiMesEmissao = nota.dataEmissao.split('-')[1];
            const trimestreDaNota = obterTrimestre(extraiMesEmissao);
            return trimestreDaNota === trimestre;
        }
        return false;
    });

    return calcularValoresDashboard(notasFiltradas);
}
