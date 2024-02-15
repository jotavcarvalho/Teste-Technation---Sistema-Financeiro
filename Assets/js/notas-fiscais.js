
const tabelaNotas = document.querySelector('#exibe-notas');
const statusFiltro = document.querySelector('#filtrar-status');
const dtEmissaoFiltro = document.querySelector('#filtrar-dtEmissao');
const dtCobrancaFiltro = document.querySelector('#filtrar-dtCobranca');
const dtPagamentoFiltro = document.querySelector('#filtrar-dtPagamento');


function exibirNotas(notas) {
    tabelaNotas.innerHTML = '';  /* a string vazia representa a limpeza na tabela antes de iniciar. Sem passar esse valor vazio sempre que clicar
    em um filtro os dados serão duplicados -- se filtrar por notas emitidas, todos as notas com esse status serão exibidas duplicadas
    então primeiro limpa a primeira exibição e após isso exibe somente o filtro, portanto exibe apenas uma vez*/

    notas.forEach((nota) => { /* percorre o array e exibe todos os dados, de acordo com a disposição das linhas, ao final a constante responsável pela 
 exibição dos dados é iterada para que possa realizar o processo a quantidade de vezes que for necessário (de acordo com a quantidade de dados na coleção)*/
        const linhaTabela = `<tr>
    <td>${nota.nomePagador}</td>
      <td>${nota.numero}</td>
      <td>${nota.dataEmissao}</td>
      <td>${nota.dataCobranca || '----'}</td>
      <td>${nota.dataPagamento || '----'}</td>
      <td>${nota.valor}</td>
      <td>${nota.documentoNotaFiscal || '----'}</td>
      <td>${nota.documentoBoleto || '----'}</td>
      <td>${nota.status}</td>
  </tr>`;
        tabelaNotas.innerHTML += linhaTabela;
    });
}


function filtrarNotasPorStatus(status) { /*array filter simples para filtrar por status e após filtrados retornar o array criado de acordo com o filtro
na função exibirNotas, que vai exibir de acordo com a interação do usuário com o sistema*/
    const notasFiltradas = notas.filter((nota) => nota.status === status);
    exibirNotas(notasFiltradas);
}

statusFiltro.addEventListener('change', function () { /*após filtrar os valores, é nessa parte do código, junto ao evento 'Change' que ocorrerá a mudança
dos dados exibidos na tabela, será feito um condicionais simples com o valor do filtro por status, onde verifica se a função anterior foi chamada
caso sim -- muda os dados exibidos na tela de acordo com o filtro clicado
caso não, permanece a exibição dos dados iniciais(todos os dados)*/
    const statusSelecionado = statusFiltro.value;
    if (statusSelecionado) {
        filtrarNotasPorStatus(statusSelecionado);
    } else {
        exibirNotas(notas);
    }
});



/*função para caso o o filtro for vazio e o if de verificação dentro das funções for falso (else)*/

function exibirMsgFiltroVazio(msgFiltroVazio) {
    tabelaNotas.innerHTML = `<tr><td colspan="9">${msgFiltroVazio}</td></tr>`; /*template string para concatenar o código js dentro do codigo html*/
};


function filtrarNotasPorDataEmissao(emissao) {/* filtra o mês do select (nesse caso de emissão) com a constante extraiMesEmissao e o compara com o parametro
'emissao' , após pegar as notas e armazenalas no array notasFiltradas esse array é passado como parametro para a função exibir notas */
    const notasFiltradas = notas.filter((nota) => {
        if (nota.dataEmissao) {
            const extraiMesEmissao = nota.dataEmissao.split('-')[1];
            return extraiMesEmissao === emissao;
        }
        return false;
    });
    /*verifica se o campo de data de pagamento possui um pagamento no determinado mês*/
    if (notasFiltradas.length > 0) {
        exibirNotas(notasFiltradas)
    } else {
        const msgFiltroVazio = "Não existem notas para esse filtro!"
        exibirMsgFiltroVazio(msgFiltroVazio);
    };
}

dtEmissaoFiltro.addEventListener('change', function () { /*esse evento é responsável por alterar a visibilidade da tabela de acordo com o filtro anterior
ao ser acionada, essa função vai verificar os valores que estão na variavel e quando for selecionada vai passar esses valores para a função anterior, o que faz 
com que os dados sejam exibidos na tabela */
    const dtEmissaoSelecionada = dtEmissaoFiltro.value;
    if (dtEmissaoSelecionada) {
        filtrarNotasPorDataEmissao(dtEmissaoSelecionada)
    } else {
        exibirNotas(notas);
    }
});


function filtrarNotasPorDataCobranca(cobranca) {
    const notasFiltradas = notas.filter((nota) => {
        if (nota.dataCobranca) {
            const extraiMesCobranca = nota.dataCobranca.split('-')[1];
            return extraiMesCobranca === cobranca;
        }
        return false;
    });
    /*verifica se o campo de data de pagamento possui um pagamento no determinado mês*/
    if (notasFiltradas.length > 0) {
        exibirNotas(notasFiltradas)
    } else {
        const msgFiltroVazio = "Não existem notas para esse filtro!"
        exibirMsgFiltroVazio(msgFiltroVazio);
    };
}

dtCobrancaFiltro.addEventListener('change', function () {
    const dtCobrancaSelecionada = dtCobrancaFiltro.value;
    if (dtCobrancaSelecionada) {
        filtrarNotasPorDataCobranca(dtCobrancaSelecionada)
    } else {
        exibirNotas(notas);
    }
});

function filtrarNotasPorDataPagamento(pagamento) {
    const notasFiltradas = notas.filter((nota) => {
        if (nota.dataPagamento) {
            const extraiMesPagamento = nota.dataPagamento.split('-')[1];
            return extraiMesPagamento === pagamento;
        }
        return false;
    });

    /*verifica se o campo de data de pagamento possui um pagamento no determinado mês*/
    if (notasFiltradas.length > 0) {
        exibirNotas(notasFiltradas)
    } else {
        const msgFiltroVazio = "Não existem notas para esse filtro!"
        exibirMsgFiltroVazio(msgFiltroVazio);
    };

}


dtPagamentoFiltro.addEventListener('change', function () {
    const dtPagamentoSelecionado = dtPagamentoFiltro.value;
    if (dtPagamentoSelecionado) {
        filtrarNotasPorDataPagamento(dtPagamentoSelecionado)
    } else {
        exibirNotas(notas);
    }
});

exibirNotas(notas); /*a função exibirNotas com o parametro (notas) serve para exibir todos os valores, quando nenhum dos dados tiverem sido filtrados pelo usuário*/

