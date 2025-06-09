// Definindo a URL base da sua API backend
const API_BASE_URL = 'http://localhost:8080/api/atendimentos';

// Variáveis globais para os gráficos para que possamos atualizá-los
let specialtiesChart, riskChart, outcomesChart;

// Função para buscar dados da API
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar dados do endpoint ${endpoint}:`, error);
        return null;
    }
}

// Função para inicializar e atualizar o gráfico de Especialidades
async function updateSpecialtiesChart() {
    const data = await fetchData('/relatorios/especialidades');
    if (data) {
        const labels = data.map(item => item.especialidade);
        const values = data.map(item => item.totalAtendimentos);

        const specialtiesCtx = document.getElementById('specialtiesChart').getContext('2d');

        if (specialtiesChart) {
            specialtiesChart.destroy(); // Destrói a instância anterior do gráfico
        }

        specialtiesChart = new Chart(specialtiesCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Atendimentos',
                    data: values,
                    backgroundColor: [
                        'rgba(29, 78, 216, 0.7)', // blue-700
                        'rgba(16, 185, 129, 0.7)', // emerald-500
                        'rgba(245, 158, 11, 0.7)', // amber-500
                        'rgba(220, 38, 38, 0.7)', // red-600
                        'rgba(139, 92, 246, 0.7)', // violet-600
                        'rgba(6, 182, 212, 0.7)' // cyan-500
                    ],
                    borderColor: [
                        'rgba(29, 78, 216, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(220, 38, 38, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(6, 182, 212, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Função para inicializar e atualizar o gráfico de Classificação de Risco
async function updateRiskChart() {
    const data = await fetchData('/relatorios/risco');
    if (data) {
        const labels = data.map(item => item.classificacao);
        const values = data.map(item => item.totalAtendimentos);

        const riskCtx = document.getElementById('riskChart').getContext('2d');

        if (riskChart) {
            riskChart.destroy(); // Destrói a instância anterior do gráfico
        }

        riskChart = new Chart(riskCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.7)', // Verde
                        'rgba(245, 158, 11, 0.7)', // Amarelo
                        'rgba(220, 38, 38, 0.7)'  // Vermelho
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(220, 38, 38, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Função para inicializar e atualizar o gráfico de Desfechos
async function updateOutcomesChart() {
    const data = await fetchData('/relatorios/desfechos');
    if (data) {
        const labels = data.map(item => item.desfecho);
        const values = data.map(item => item.totalAtendimentos);

        const outcomesCtx = document.getElementById('outcomesChart').getContext('2d');

        if (outcomesChart) {
            outcomesChart.destroy(); // Destrói a instância anterior do gráfico
        }

        outcomesChart = new Chart(outcomesCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.7)', // Alta - Verde
                        'rgba(245, 158, 11, 0.7)', // Internação - Amarelo
                        'rgba(220, 38, 38, 0.7)'  // Transferência - Vermelho
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(220, 38, 38, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Função para atualizar a tabela de desempenho médico
async function updateMedicalPerformanceTable() {
    const data = await fetchData('/relatorios/desempenho-medicos');
    const tbody = document.querySelector('.min-w-full tbody');
    tbody.innerHTML = ''; // Limpa as linhas existentes

    if (data && data.length > 0) {
        data.forEach(medico => {
            const row = document.createElement('tr');
            row.classList.add('linha-desempenho', 'hover:bg-gray-50');

            // Nome e Especialidade do Médico
            const medicoCell = document.createElement('td');
            medicoCell.classList.add('px-4', 'py-4', 'whitespace-nowrap');
            medicoCell.innerHTML = `
                <div class="flex items-center">
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${medico.nomeMedico || 'N/A'}</div>
                        <div class="text-sm text-gray-500">${medico.especialidadeMedico || 'N/A'}</div>
                    </div>
                </div>
            `;
            row.appendChild(medicoCell);

            // Atendimentos
            const atendimentosCell = document.createElement('td');
            atendimentosCell.classList.add('px-4', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-900');
            atendimentosCell.textContent = medico.totalAtendimentos || 0;
            row.appendChild(atendimentosCell);

            // Média/Plantão (usando 2 casas decimais)
            const mediaPlantaoCell = document.createElement('td');
            mediaPlantaoCell.classList.add('px-4', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');
            // Como o backend está retornando null, use um valor padrão ou calcule.
            // Para exemplo, se for null, mostre "N/A".
            mediaPlantaoCell.textContent = medico.mediaAtendimentosPorPlantao != null ? medico.mediaAtendimentosPorPlantao.toFixed(1) : 'N/A';
            row.appendChild(mediaPlantaoCell);

            // Tempo Médio
            const tempoMedioCell = document.createElement('td');
            tempoMedioCell.classList.add('px-4', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');
            tempoMedioCell.textContent = medico.tempoMedioAtendimento || 'N/A'; // Backend está enviando null, mantenha N/A
            row.appendChild(tempoMedioCell);

            // Eficiência (exemplo: supondo que você tenha um campo 'eficiencia' ou o calcule)
            // Aqui é um exemplo com um valor mock, pois não temos no DTO do backend.
            // Se o backend fornecer, use: const eficiencia = medico.eficiencia || 0;
            const eficiencia = Math.min(100, (medico.totalAtendimentos / 150) * 100).toFixed(0); // Exemplo simples de cálculo de %
            const eficienciaCell = document.createElement('td');
            eficienciaCell.classList.add('px-4', 'py-4', 'whitespace-nowrap');
            eficienciaCell.innerHTML = `
                <div class="flex items-center">
                    <div class="w-24 bg-gray-200 rounded-full h-2.5">
                        <div class="bg-green-600 h-2.5 rounded-full" style="width: ${eficiencia}%"></div>
                    </div>
                    <span class="ml-2 text-xs font-medium text-gray-500">${eficiencia}%</span>
                </div>
            `;
            row.appendChild(eficienciaCell);

            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum dado de desempenho médico encontrado.</td>`;
        tbody.appendChild(row);
    }
}

// Função para atualizar os cartões resumo
async function updateSummaryCards() {
    const data = await fetchData('/relatorios/resumo');
    if (data) {
        document.querySelector('.bg-blue-600 h3').textContent = data.totalAtendimentos || 0;
        document.querySelector('.bg-green-600 h3').textContent = data.totalAltas || 0;
        document.querySelector('.bg-yellow-500 h3').textContent = data.totalInternacoes || 0;
        document.querySelector('.bg-red-600 h3').textContent = data.totalTransferencias || 0;

        // Atualizar as porcentagens nos cartões (exemplo: baseando-se no total de atendimentos)
        const total = data.totalAtendimentos || 1; // Evita divisão por zero
        document.querySelector('.bg-green-600 .mt-2 span').textContent = `${((data.totalAltas / total) * 100).toFixed(1)}% do total`;
        document.querySelector('.bg-yellow-500 .mt-2 span').textContent = `${((data.totalInternacoes / total) * 100).toFixed(1)}% do total`;
        document.querySelector('.bg-red-600 .mt-2 span').textContent = `${((data.totalTransferencias / total) * 100).toFixed(1)}% do total`;
    }
}

// Função para popular os dropdowns de filtro
async function populateFilters() {
    // Especialidades
    // ALTERADO AQUI: Usando getElementById
    const especialidadeSelect = document.getElementById('especialidadeFilter');
    const especialidades = await fetchData('/relatorios/especialidades-filtro');
    if (especialidades && especialidadeSelect) { // Verifique se o elemento existe
        // Limpa opções existentes, exceto a primeira (Todas as especialidades)
        especialidadeSelect.querySelectorAll('option:not([value=""])').forEach(option => option.remove());
        especialidades.forEach(esp => {
            const option = document.createElement('option');
            option.value = esp;
            option.textContent = esp;
            especialidadeSelect.appendChild(option);
        });
    }

    // Médicos
    // ALTERADO AQUI: Usando getElementById
    const medicoSelect = document.getElementById('medicoFilter');
    const medicos = await fetchData('/relatorios/medicos-filtro');
    if (medicos && medicoSelect) { // Verifique se o elemento existe
        // Limpa opções existentes, exceto a primeira (Todos os médicos)
        medicoSelect.querySelectorAll('option:not([value=""])').forEach(option => option.remove());
        medicos.forEach(medico => {
            const option = document.createElement('option');
            option.value = medico[0]; // ID do médico
            option.textContent = medico[1]; // Nome do médico
            medicoSelect.appendChild(option);
        });
    }
}


// Evento DOMContentLoaded para garantir que o HTML esteja carregado antes de manipular os elementos
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializa todos os componentes do relatório
    await populateFilters(); // Popula filtros primeiro
    await updateSpecialtiesChart();
    await updateRiskChart();
    await updateOutcomesChart();
    await updateMedicalPerformanceTable();
    await updateSummaryCards();

    // Lógica para o menu lateral (já existente)
    document.getElementById('menu-toggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('open');
        document.querySelector('#sidebar-overlay').classList.toggle('open');
    });

    document.getElementById('sidebar-overlay').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.remove('open');
        this.classList.remove('open');
    });

    // Lógica para o botão Gerar XLS (relatórios)
    const generateXLSButton = document.querySelector('.bg-green-600.hover\\:bg-green-700.text-white.py-2.px-4.rounded-lg.flex.items-center.space-x-2.transition');
    if (generateXLSButton) {
        generateXLSButton.addEventListener('click', async () => {
            // No momento, este endpoint não aceita filtros. Ele exporta todos os atendimentos.
            // Se precisar de filtros para o XLS, precisaremos adicionar a lógica aqui
            // e no backend para que o endpoint de exportação aceite-os.
            try {
                const response = await fetch(`${API_BASE_URL}/exportar-xls`);
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'relatorio_atendimentos.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    alert('Relatório XLS gerado com sucesso!');
                } else {
                    alert('Erro ao gerar relatório XLS.');
                    console.error('Erro ao baixar o XLS:', response.statusText);
                }
            } catch (error) {
                console.error('Erro na requisição de download do XLS:', error);
                alert('Erro na comunicação com o servidor ao gerar relatório XLS.');
            }
        });
    }

    // TODO: Adicionar lógica para o botão "Aplicar Filtros"
    // TODO: Adicionar lógica para o botão "Exportar PDF" (se planejado)
});