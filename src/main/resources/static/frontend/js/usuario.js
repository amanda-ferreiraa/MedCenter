// usuario.js

// A BASE URL da API deve apontar para o SEU BACKEND (Spring Boot), que está na porta 8080.
// Se o backend estiver rodando em 'localhost' na máquina de desenvolvimento, use localhost.
// Se estiver em outro IP na rede, use esse IP.
const API_BASE_URL = 'http://localhost:8080/api/atendimentos';

// Variável global para a instância do gráfico semanal
let weeklyAttendanceChart;

// Variável global para o ID do médico logado
let MEDICO_ID = null;

document.addEventListener('DOMContentLoaded', function () {
    // --- Lógica de autenticação e carregamento de dados do médico ---
    // Assumindo que medicoLogado no localStorage tem 'id', 'nome', 'especialidade'
    const medicoDataString = localStorage.getItem("medicoLogado");
    let medicoData = null;

    if (medicoDataString) {
        try {
            medicoData = JSON.parse(medicoDataString);
        } catch (e) {
            console.error("Erro ao parsear medicoLogado do localStorage:", e);
            // Opcional: limpar item inválido no localStorage para evitar futuros erros
            localStorage.removeItem("medicoLogado");
        }
    }

    // Verifica se os dados do médico logado existem e se o ID está presente
    // Usamos 'medicoData.id' aqui, pois o MedicoLoginResponseDTO retorna 'id' e não 'idMedico'.
    if (medicoData && medicoData.id) {
        // Usa medicoData.nome para preencher o nome do médico, pegando apenas o primeiro nome
        document.getElementById("nome-medico").textContent = getFirstName(medicoData.nome || "Médico(a)");
        // Usa medicoData.especialidade para preencher a área de atuação
        document.getElementById("especialidade").textContent = medicoData.especialidade || "Não definida";
        MEDICO_ID = medicoData.id; // Atribui o ID do médico para as chamadas da API

        // Agora que temos o ID do médico, podemos carregar os dados da dashboard
        loadDashboardData();

    } else {
        console.warn("Médico não logado ou dados incompletos. Verifique o localStorage. Dashboard pode não carregar.");
        // Opcional: Redirecionar para a página de login se o médico não estiver logado
        // window.location.href = '../pages/login.html';
    }

    // --- Lógica de Sidebar ---
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');

    function toggleSidebar() {
        if (sidebar && overlay) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        }
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', toggleSidebar);

    // Evento de clique no botão "Novo Atendimento"
    const btnNovoAtendimento = document.getElementById('novo-atendimento-btn');
    if (btnNovoAtendimento) {
        btnNovoAtendimento.addEventListener('click', function() {
            // Ajuste o caminho conforme sua estrutura de pastas do frontend
            window.location.href = '../pages/atendimentos.html';
        });
    }

    // Adiciona listener para o botão de logout (assumindo que você tem um botão com este ID)
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
}); // Fim do DOMContentLoaded


// --- Funções auxiliares ---

/**
 * Retorna o primeiro nome de uma string de nome completo.
 * @param {string} fullName - O nome completo do médico.
 * @returns {string} - O primeiro nome.
 */
function getFirstName(fullName) {
    if (!fullName) return "";
    return fullName.split(' ')[0];
}

/**
 * Lida com o processo de logout, limpando o localStorage e redirecionando.
 */
function handleLogout() {
    localStorage.removeItem("medicoLogado");
    localStorage.removeItem("emailMedicoLogado"); // Remover outros itens relacionados ao login, se existirem
    // Redireciona para a página de login (ajuste o caminho se necessário)
    window.location.href = '../index.html';
}


// --- Funções para buscar e exibir dados da API ---

/**
 * Função principal para carregar todos os dados da dashboard.
 * Só executa se o MEDICO_ID estiver disponível.
 */
async function loadDashboardData() {
    if (MEDICO_ID) {
        // Busca todos os dados da dashboard em paralelo usando Promise.all para melhor desempenho
        const [dailySummaryData, weeklyChartData, latestAppointments] = await Promise.all([
            fetchData(`/home/resumo-dia/${MEDICO_ID}`),         // Busca dados para os cartões de resumo
            fetchData(`/home/atendimentos-semanal/${MEDICO_ID}`), // Busca dados para o gráfico semanal
            fetchData(`/home/atendimentos-dia/${MEDICO_ID}`)     // Busca dados para a tabela de atendimentos do dia
        ]);

        // Atualiza a interface do usuário com os dados recebidos
        updateDailySummaryCards(dailySummaryData);
        updateWeeklyAttendanceChart(weeklyChartData);
        updateLatestAppointmentsTable(latestAppointments);

    } else {
        console.warn("ID do médico não disponível. Não foi possível carregar os dados da dashboard.");
    }
}

/**
 * Função auxiliar para fazer requisições GET à API.
 * @param {string} endpoint - O caminho específico da API (ex: '/home/resumo-dia/123').
 * @returns {Promise<Object|null>} - Os dados retornados pela API ou null em caso de erro.
 */
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            // Log detalhado do erro da resposta do servidor
            const errorBody = await response.text();
            console.error(`Erro na resposta da API para ${endpoint}: ${response.status} ${response.statusText} - Resposta do servidor:`, errorBody);
            return null; // Retorna null para que a função chamadora possa tratar a ausência de dados
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar dados do endpoint ${endpoint}:`, error);
        return null; // Retorna null em caso de erro de rede ou processamento do JSON
    }
}

/**
 * Atualiza os cartões de resumo (total, concluídos, em andamento) do dia e a especialidade.
 * @param {Object} data - Objeto contendo os dados do resumo diário (ResumoAtendimentosDiaDTO).
 */
function updateDailySummaryCards(data) {
    // Usa o operador optional chaining (?. ) e o operador OR (||) para garantir que seja 0 ou 'Não definida'
    // se os dados ou as propriedades forem null/undefined.
    document.getElementById('totalAtendimentosHoje').textContent = data?.totalAtendimentos || 0;
    document.getElementById('concluidosHoje').textContent = data?.concluidos || 0;
    document.getElementById('emAndamentoHoje').textContent = data?.emAndamento || 0;

    // Atualiza a especialidade no cartão. Prioriza a especialidade vinda do backend (data.especialidadeMedico).
    // Se não vier do backend, usa a que está salva no localStorage (currentMedicoData.especialidade).
    const currentMedicoData = JSON.parse(localStorage.getItem("medicoLogado"));
    document.getElementById("especialidade").textContent = data?.especialidadeMedico || currentMedicoData?.especialidade || "Não definida";

    // Se os dados não foram carregados, loga um aviso mais específico.
    if (!data) {
        console.warn("Dados para os cartões de resumo diário não carregados. Exibindo zeros.");
    }
}

/**
 * Atualiza o gráfico de linha de atendimentos semanais.
 * @param {Array<Object>} data - Lista de objetos com 'data' e 'totalAtendimentos' (AtendimentoSemanalDTO).
 */
function updateWeeklyAttendanceChart(data) {
    const ctx = document.getElementById('weeklyAttendanceChart').getContext('2d');

    // Destrói a instância anterior do gráfico se existir para evitar sobreposição
    if (weeklyAttendanceChart) {
        weeklyAttendanceChart.destroy();
    }

    if (data && data.length > 0) {
        // Os dados já vêm do backend ordenados por data e com dias zerados.
        const labels = data.map(item => {
            // Adiciona 'T00:00:00' para garantir que new Date() interprete corretamente e evite problemas de fuso horário.
            const date = new Date(item.data + 'T00:00:00');
            // Formata a data para exibição no gráfico (ex: "Seg, 03/06")
            return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        });
        const values = data.map(item => item.totalAtendimentos);

        weeklyAttendanceChart = new Chart(ctx, {
            type: 'line', // Tipo de gráfico de linha
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total de Atendimentos',
                    data: values,
                    backgroundColor: 'rgba(29, 78, 216, 0.5)', // Cor de preenchimento da área sob a linha
                    borderColor: 'rgba(29, 78, 216, 1)',      // Cor da linha
                    borderWidth: 2,
                    fill: true, // Preenche a área sob a linha
                    tension: 0.4 // Suaviza a curva da linha
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Permite que o gráfico se adapte ao tamanho do contêiner
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false, // Mostra o tooltip para o ponto mais próximo
                    }
                },
                scales: {
                    x: {
                        grid: { display: false } // Esconde as linhas de grade do eixo X
                    },
                    y: {
                        beginAtZero: true, // Começa o eixo Y em zero
                        ticks: {
                            stepSize: 1, // Garante que os ticks do eixo Y sejam números inteiros
                            callback: function(value) {
                                return Number.isInteger(value) ? value : null; // Mostra apenas números inteiros no eixo Y
                            }
                        }
                    }
                }
            }
        });
    } else {
        // Se não houver dados, exibe uma mensagem no canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Limpa o canvas
        ctx.font = "16px Arial";
        ctx.fillStyle = "#A0A0A0";
        ctx.textAlign = "center";
        ctx.fillText("Nenhum dado de atendimento para a semana.", ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
}

/**
 * Preenche a tabela de "Últimos atendimentos" com os atendimentos do dia.
 * @param {Array<Object>} atendimentos - Lista de objetos de atendimento (AtendimentoDTO).
 */
function updateLatestAppointmentsTable(atendimentos) {
    const tbody = document.getElementById('latestAppointmentsTableBody');
    tbody.innerHTML = ''; // Limpa as linhas existentes da tabela

    if (atendimentos && atendimentos.length > 0) {
        atendimentos.forEach(atendimento => {
            const row = document.createElement('tr');
            row.classList.add('linha-atendimento', 'hover:bg-gray-50');

            // O campo 'concluido' no seu DTO é String ("true"/"false"), então convertemos para boolean.
            const isConcluido = String(atendimento.concluido).toLowerCase() === 'true';
            const statusClass = isConcluido ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
            const statusText = isConcluido ? 'Concluído' : 'Em andamento';

            row.innerHTML = `
                <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${atendimento.nomePaciente || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${atendimento.data || 'N/A'}<br>
                    <span class="text-gray-400">${atendimento.hora || 'N/A'}</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${atendimento.diagnostico || 'N/A'}</td>
                <td class="px-4 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">${statusText}</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900" title="Excluir">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        // Mensagem se não houver atendimentos para o dia
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum atendimento agendado para hoje.</td>`;
        tbody.appendChild(row);
    }
}