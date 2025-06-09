document.addEventListener('DOMContentLoaded', function() {
    // --- Configurações ---
    const BASE_URL = 'http://localhost:8080/api/atendimentos'; // *** IMPORTANTE: AJUSTE SE SEU BACKEND ESTIVER EM OUTRO ENDEREÇO/PORTA ***

    // --- Elementos do DOM ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    const btnNovoAtendimentoDesktop = document.getElementById('novo-atendimento-desktop');
    const btnNovoAtendimentoMobile = document.querySelector('.botao-novo-atendimento-mobile');
    const modalAtendimento = document.getElementById('modal-atendimento');
    const fecharModalBtn = document.getElementById('fechar-modal');
    const formAtendimento = document.getElementById('form-atendimento');
    const tabelaBody = document.querySelector('.tabela-atendimentos tbody');

    // Elementos de filtro
    const inputDataFiltro = document.querySelector('.campo-data input[type="date"]');
    const selectEspecialidadeFiltro = document.querySelector('.campo-especialidade select');
    const inputNomePacienteFiltro = document.querySelector('.campo-busca input[type="text"]');
    const btnFiltrar = document.querySelector('.botoes-acoes button:first-child');
    const btnExportarXLS = document.querySelector('.botoes-acoes button:last-child');

    // --- Funções Auxiliares ---

    // Função para mostrar mensagens (pode ser melhorada com um sistema de toasts/notificações)
    function showMessage(message, type = 'success') {
        console.log(`[${type.toUpperCase()}]: ${message}`);
        // Implementar um sistema de alerta/toast mais amigável aqui
        alert(message);
    }

    // Função para popular a tabela com os dados de atendimentos
    function popularTabela(atendimentos) {
        tabelaBody.innerHTML = ''; // Limpa as linhas existentes

        if (atendimentos.length === 0) {
            tabelaBody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum atendimento encontrado.</td></tr>`;
            return;
        }

        atendimentos.forEach(atendimento => {
            const row = document.createElement('tr');
            row.classList.add('linha-atendimento', 'hover:bg-gray-50');
            row.dataset.id = atendimento.idAtendimento; // Armazena o ID no dataset da linha

            // Determinar a classe de risco com base no valor
            let riscoClass = '';
            switch (atendimento.classificacaoRisco.toLowerCase()) {
                case 'verde':
                    riscoClass = 'bg-green-500';
                    break;
                case 'amarelo':
                    riscoClass = 'bg-yellow-500';
                    break;
                case 'vermelho':
                    riscoClass = 'bg-red-500';
                    break;
                default:
                    riscoClass = 'bg-gray-400'; // Cor padrão se não corresponder
            }


            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${atendimento.hora}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="ml-4">
                            <div class="nome-paciente text-sm font-medium text-gray-900">${atendimento.nomePaciente}</div>
                            <div class="idade-paciente text-sm text-gray-500">Idade ou outros dados (se disponíveis)</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full text-white ${riscoClass}">${atendimento.classificacaoRisco}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${atendimento.diagnostico}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${atendimento.reavaliacao.toLowerCase() === 'não' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}">${atendimento.reavaliacao}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${atendimento.desfecho}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="botao-editar text-blue-600 hover:text-blue-900 mr-3" data-id="${atendimento.idAtendimento}"><i class="fas fa-edit"></i></button>
                    <button class="botao-excluir text-red-600 hover:text-red-900" data-id="${atendimento.idAtendimento}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tabelaBody.appendChild(row);
        });

        // Adiciona event listeners para os botões de excluir após popular a tabela
        adicionarListenersBotoesAcao();
    }

    // Função para carregar atendimentos do backend (com ou sem filtros)
    async function carregarAtendimentos(data = null, especialidade = null, nome = null) {
        let url = BASE_URL;
        const params = new URLSearchParams();

        if (data) params.append('data', data);
        if (especialidade) params.append('especialidade', especialidade);
        if (nome) params.append('nome', nome);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const atendimentos = await response.json();
            popularTabela(atendimentos);
        } catch (error) {
            console.error('Erro ao carregar atendimentos:', error);
            showMessage('Erro ao carregar atendimentos. Tente novamente.', 'error');
        }
    }

    // Função para adicionar listeners aos botões de ação (editar/excluir)
    function adicionarListenersBotoesAcao() {
        document.querySelectorAll('.botao-excluir').forEach(button => {
            button.addEventListener('click', async function() {
                const atendimentoId = this.dataset.id;
                if (confirm(`Tem certeza que deseja excluir o atendimento ID ${atendimentoId}?`)) {
                    try {
                        const response = await fetch(`${BASE_URL}/${atendimentoId}`, {
                            method: 'DELETE'
                        });

                        if (response.status === 204) { // No Content
                            showMessage('Atendimento excluído com sucesso!');
                            carregarAtendimentos(); // Recarrega a tabela
                        } else if (response.status === 404) {
                            showMessage('Atendimento não encontrado.', 'error');
                        } else {
                            throw new Error(`Erro ao excluir atendimento: ${response.status}`);
                        }
                    } catch (error) {
                        console.error('Erro ao excluir atendimento:', error);
                        showMessage('Erro ao excluir atendimento. Tente novamente.', 'error');
                    }
                }
            });
        });

        // Lógica para o botão de editar (ainda não implementado no backend/modal)
        document.querySelectorAll('.botao-editar').forEach(button => {
            button.addEventListener('click', function() {
                const atendimentoId = this.dataset.id;
                showMessage(`Funcionalidade de edição para o ID ${atendimentoId} será implementada futuramente.`, 'info');
                // Aqui você abriria o modal de edição e preencheria com os dados
            });
        });
    }


    // --- Event Listeners ---

    // Menu lateral (mantido do seu código original)
    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        });
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        });
    }

    // Abrir modal ao clicar nos botões "+" (desktop e mobile)
    if (btnNovoAtendimentoDesktop) {
        btnNovoAtendimentoDesktop.addEventListener('click', () => modalAtendimento.classList.remove('hidden'));
    }
    if (btnNovoAtendimentoMobile) {
        btnNovoAtendimentoMobile.addEventListener('click', () => modalAtendimento.classList.remove('hidden'));
    }

    // Fechar modal ao clicar no X
    if (fecharModalBtn) {
        fecharModalBtn.addEventListener('click', () => modalAtendimento.classList.add('hidden'));
    }

    // Fechar modal ao clicar fora do conteúdo
    if (modalAtendimento) {
        modalAtendimento.addEventListener('click', function(e) {
            if (e.target === this) this.classList.add('hidden');
        });
    }

    // Envio do formulário de novo atendimento
    if (formAtendimento) {
        formAtendimento.addEventListener('submit', async function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário

            const formData = new FormData(this);
            const atendimentoData = {
                // Certifique-se de que os nomes dos campos no HTML (name="...")
                // correspondem exatamente aos nomes das propriedades no seu AtendimentoDTO
                // Ex: "nome" no HTML -> "nomePaciente" no DTO
                nomePaciente: formData.get('nome'),
                data: formData.get('data'),
                hora: formData.get('hora'),
                especialidade: formData.get('especialidade'),
                classificacaoRisco: formData.get('risco'), // "risco" no HTML
                diagnostico: formData.get('diagnostico'),
                reavaliacao: formData.get('reavaliacao'),
                desfecho: formData.get('desfecho'),
                concluido: 'Não' // Valor padrão, ajuste se precisar de um campo no formulário
                // idMedico: Opcional, se você for associar um médico via formulário, adicione um campo aqui.
                // Por enquanto, o backend irá lidar com ele sendo nulo.
            };

            try {
                const response = await fetch(BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(atendimentoData)
                });

                if (response.ok) { // Status 2xx (200 OK, 201 Created)
                    const novoAtendimento = await response.json();
                    showMessage('Atendimento salvo com sucesso!', 'success');
                    formAtendimento.reset(); // Limpa o formulário
                    modalAtendimento.classList.add('hidden'); // Fecha o modal
                    carregarAtendimentos(); // Recarrega a lista de atendimentos
                } else {
                    const errorData = await response.json(); // Tenta ler o corpo da resposta para erros
                    throw new Error(`Erro ao salvar atendimento: ${response.status} - ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Erro no formulário de atendimento:', error);
                showMessage(`Erro ao salvar atendimento: ${error.message}`, 'error');
            }
        });
    }

    // Event listener para o botão de filtrar
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function() {
            const data = inputDataFiltro.value;
            const especialidade = selectEspecialidadeFiltro.value;
            const nome = inputNomePacienteFiltro.value;
            carregarAtendimentos(data, especialidade, nome);
        });
    }

    // Event listener para o botão de exportar XLS
    if (btnExportarXLS) {
        btnExportarXLS.addEventListener('click', async function() {
            const data = inputDataFiltro.value;
            const especialidade = selectEspecialidadeFiltro.value;
            const nome = inputNomePacienteFiltro.value;

            let url = `${BASE_URL}/exportar-xls`;
            const params = new URLSearchParams();

            if (data) params.append('data', data);
            if (especialidade) params.append('especialidade', especialidade);
            if (nome) params.append('nome', nome);

            if (params.toString()) {
                url += '?' + params.toString();
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Cria um Blob a partir da resposta e um link para download
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'atendimentos.xlsx'; // Nome do arquivo
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);
                showMessage('Arquivo Excel gerado e baixado com sucesso!');

            } catch (error) {
                console.error('Erro ao exportar XLS:', error);
                showMessage('Erro ao exportar atendimentos para Excel. Tente novamente.', 'error');
            }
        });
    }


    // --- Inicialização ---
    // Carrega os atendimentos ao iniciar a página
    carregarAtendimentos();
});