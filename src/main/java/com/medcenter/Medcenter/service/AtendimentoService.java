package com.medcenter.Medcenter.service;

import com.medcenter.Medcenter.dto.AtendimentoDTO;
// Importar todos os DTOs, incluindo os novos para a dashboard
import com.medcenter.Medcenter.dto.AtendimentoPorEspecialidadeDTO;
import com.medcenter.Medcenter.dto.ClassificacaoRiscoDTO;
import com.medcenter.Medcenter.dto.DesfechoAtendimentoDTO;
import com.medcenter.Medcenter.dto.DesempenhoMedicoDTO;
import com.medcenter.Medcenter.dto.ResumoAtendimentosDTO;
import com.medcenter.Medcenter.dto.ResumoAtendimentosDiaDTO; // NOVO DTO
import com.medcenter.Medcenter.dto.AtendimentoSemanalDTO; // NOVO DTO

import com.medcenter.Medcenter.model.Atendimento;
import com.medcenter.Medcenter.model.Medico;
import com.medcenter.Medcenter.repository.AtendimentoRepository;
import com.medcenter.Medcenter.repository.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate; // Para usar LocalDate para datas
import java.time.LocalTime; // Para parsear e calcular tempo médio (se necessário)
import java.time.format.DateTimeFormatter; // Para formatar datas
import java.time.temporal.ChronoUnit; // Para calcular tempo médio (se necessário)
import java.util.ArrayList; // Para o gráfico semanal
import java.util.Comparator; // Para ordenar a lista final
import java.util.LinkedHashMap; // Para manter a ordem das datas no mapa
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AtendimentoService {

    @Autowired
    private AtendimentoRepository atendimentoRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    // --- Seus métodos existentes de CRUD e filtro ---

    public AtendimentoDTO salvar(AtendimentoDTO dto) {
        Atendimento atendimento = new Atendimento();

        // Mapeamento do DTO para a entidade
        atendimento.setData(dto.getData());
        atendimento.setHora(dto.getHora());
        atendimento.setNomePaciente(dto.getNomePaciente());
        atendimento.setClassificacaoRisco(dto.getClassificacaoRisco());
        atendimento.setDiagnostico(dto.getDiagnostico());
        atendimento.setReavaliacao(dto.getReavaliacao());
        atendimento.setDesfecho(dto.getDesfecho());
        atendimento.setEspecialidade(dto.getEspecialidade());
        atendimento.setConcluido(dto.getConcluido());

        if (dto.getIdMedico() != null) {
            Optional<Medico> medicoOpt = medicoRepository.findById(dto.getIdMedico());
            medicoOpt.ifPresent(atendimento::setMedico);
        } else {
            atendimento.setMedico(null); // Define médico como null se ID não for fornecido
        }

        Atendimento salvo = atendimentoRepository.save(atendimento);
        dto.setIdAtendimento(salvo.getIdAtendimento());
        return dto;
    }

    public List<AtendimentoDTO> listarTodos() {
        return atendimentoRepository.findAll()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public List<AtendimentoDTO> buscarPorFiltros(String nome, String data, String especialidade) {
        // Assegura que null seja passado para a query se a string for vazia
        String nomeFiltro = (nome != null && !nome.trim().isEmpty()) ? nome : null;
        String dataFiltro = (data != null && !data.trim().isEmpty()) ? data : null;
        String especialidadeFiltro = (especialidade != null && !especialidade.trim().isEmpty()) ? especialidade : null;

        return atendimentoRepository.findByFiltros(nomeFiltro, dataFiltro, especialidadeFiltro)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public boolean deletar(Long id) {
        if (atendimentoRepository.existsById(id)) {
            atendimentoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Método para gerar o arquivo Excel de atendimentos
    public byte[] gerarExcel(List<AtendimentoDTO> atendimentos) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Atendimentos");

            // Cabeçalho
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Data", "Hora", "Paciente", "Risco", "Diagnóstico", "Reavaliação", "Desfecho", "Especialidade", "Concluído", "ID Médico"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Dados
            int rowNum = 1;
            for (AtendimentoDTO atendimento : atendimentos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(atendimento.getIdAtendimento() != null ? String.valueOf(atendimento.getIdAtendimento()) : "");
                row.createCell(1).setCellValue(atendimento.getData() != null ? atendimento.getData() : "");
                row.createCell(2).setCellValue(atendimento.getHora() != null ? atendimento.getHora() : "");
                row.createCell(3).setCellValue(atendimento.getNomePaciente() != null ? atendimento.getNomePaciente() : "");
                row.createCell(4).setCellValue(atendimento.getClassificacaoRisco() != null ? atendimento.getClassificacaoRisco() : "");
                row.createCell(5).setCellValue(atendimento.getDiagnostico() != null ? atendimento.getDiagnostico() : "");
                row.createCell(6).setCellValue(atendimento.getReavaliacao() != null ? atendimento.getReavaliacao() : "");
                row.createCell(7).setCellValue(atendimento.getDesfecho() != null ? atendimento.getDesfecho() : "");
                row.createCell(8).setCellValue(atendimento.getEspecialidade() != null ? atendimento.getEspecialidade() : "");
                // Concluido é String, então String.valueOf é apropriado
                row.createCell(9).setCellValue(atendimento.getConcluido() != null ? atendimento.getConcluido() : "");
                row.createCell(10).setCellValue(atendimento.getIdMedico() != null ? String.valueOf(atendimento.getIdMedico()) : "");
            }

            // Ajustar largura das colunas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }


    // --- SEUS MÉTODOS EXISTENTES PARA RELATÓRIOS E ESTATÍSTICAS ---

    public List<AtendimentoPorEspecialidadeDTO> getAtendimentosPorEspecialidade() {
        return atendimentoRepository.countAtendimentosByEspecialidade();
    }

    public List<ClassificacaoRiscoDTO> getClassificacaoRisco() {
        return atendimentoRepository.countAtendimentosByClassificacaoRisco();
    }

    public List<DesfechoAtendimentoDTO> getDesfechosAtendimentos() {
        return atendimentoRepository.countAtendimentosByDesfecho();
    }

    public List<DesempenhoMedicoDTO> getDesempenhoMedicos() {
        // O repositório já retorna um DTO básico.
        // Se precisar de cálculos mais complexos de tempo médio ou atendimentos por plantão,
        // essa lógica seria implementada aqui, possivelmente buscando dados brutos adicionais.
        List<DesempenhoMedicoDTO> desempenhoList = atendimentoRepository.findDesempenhoMedicos();

        // Exemplo: se você tivesse dados de início e fim de plantões, poderia calcular:
        // for (DesempenhoMedicoDTO dto : desempenhoList) {
        //     // Lógica para calcular tempo médio e média por plantão
        //     dto.setTempoMedioAtendimento("30 min"); // Exemplo mock
        //     dto.setMediaAtendimentosPorPlantao(dto.getTotalAtendimentos() / 5.0); // Exemplo mock
        // }

        return desempenhoList;
    }

    public ResumoAtendimentosDTO getResumoAtendimentos() {
        return atendimentoRepository.getResumoAtendimentos();
    }

    public List<String> getDistinctEspecialidades() {
        return atendimentoRepository.findAllDistinctEspecialidades();
    }

    public List<Object[]> getMedicosForFilter() {
        return atendimentoRepository.findAllMedicosForFilter();
    }


    // --- NOVOS MÉTODOS PARA A DASHBOARD HOME (ATENDIMENTOS DO MÉDICO LOGADO) ---

    /**
     * Retorna o resumo dos atendimentos para um médico em um dia específico.
     * Inclui total, concluídos, em andamento, e a especialidade do médico.
     */
    public ResumoAtendimentosDiaDTO getResumoDiarioMedico(Long medicoId, String dataHoje) {
        // Encontrar o médico para pegar a especialidade
        Optional<Medico> medicoOpt = medicoRepository.findById(medicoId);
        // Se o médico não for encontrado, a especialidade será "Não informada"
        String especialidadeMedico = medicoOpt.map(Medico::getEspecialidade).orElse("Não informada");

        // Conta o total de atendimentos para o dia (usando findByMedicoIdAndData e contando o tamanho da lista)
        Long totalAtendimentos = (long) atendimentoRepository.findByMedicoIdAndData(medicoId, dataHoje).size();

        // Contar atendimentos concluídos e em andamento
        Long concluidos = atendimentoRepository.countByMedicoIdAndDataAndConcluidoTrue(medicoId, dataHoje);
        Long emAndamento = atendimentoRepository.countByMedicoIdAndDataAndConcluidoFalse(medicoId, dataHoje);

        // Garante que os valores não sejam null (caso não haja nenhum atendimento com o status)
        concluidos = (concluidos != null) ? concluidos : 0L;
        emAndamento = (emAndamento != null) ? emAndamento : 0L;

        return new ResumoAtendimentosDiaDTO(totalAtendimentos, concluidos, emAndamento, especialidadeMedico);
    }

    /**
     * Retorna a lista de atendimentos para um médico em um dia específico.
     */
    public List<AtendimentoDTO> getAtendimentosDoDia(Long medicoId, String dataHoje) {
        return atendimentoRepository.findByMedicoIdAndData(medicoId, dataHoje)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retorna os dados para o gráfico de atendimentos semanais de um médico.
     * Preenche os dias sem atendimentos com zero para garantir 7 pontos no gráfico.
     */
    public List<AtendimentoSemanalDTO> getAtendimentosSemanal(Long medicoId) {
        LocalDate hoje = LocalDate.now();
        // Os últimos 7 dias (hoje + 6 dias anteriores)
        LocalDate seteDiasAtras = hoje.minusDays(6);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String dataInicioStr = seteDiasAtras.format(formatter);
        String dataFimStr = hoje.format(formatter);

        // Busca os dados do repositório
        List<AtendimentoSemanalDTO> dadosBrutos = atendimentoRepository.countAtendimentosSemanalByMedicoId(medicoId, dataInicioStr, dataFimStr);

        // Cria um mapa para facilitar o preenchimento de dias com zero, mantendo a ordem
        Map<String, Long> atendimentosPorData = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate dataIteracao = seteDiasAtras.plusDays(i);
            atendimentosPorData.put(dataIteracao.format(formatter), 0L); // Inicializa com 0
        }

        // Preenche o mapa com os dados reais retornados do banco
        for (AtendimentoSemanalDTO dto : dadosBrutos) {
            atendimentosPorData.put(dto.getData(), dto.getTotalAtendimentos());
        }

        // Converte o mapa de volta para uma lista de DTOs, garantindo a ordem cronológica
        List<AtendimentoSemanalDTO> dadosCompletos = atendimentosPorData.entrySet().stream()
                .map(entry -> new AtendimentoSemanalDTO(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(AtendimentoSemanalDTO::getData)) // Garante a ordem cronológica das datas
                .collect(Collectors.toList());

        return dadosCompletos;
    }

    // --- Método de conversão de Atendimento para AtendimentoDTO ---
    private AtendimentoDTO converterParaDTO(Atendimento atendimento) {
        AtendimentoDTO dto = new AtendimentoDTO();
        dto.setIdAtendimento(atendimento.getIdAtendimento());
        dto.setData(atendimento.getData());
        dto.setHora(atendimento.getHora());
        dto.setNomePaciente(atendimento.getNomePaciente());
        dto.setClassificacaoRisco(atendimento.getClassificacaoRisco());
        dto.setDiagnostico(atendimento.getDiagnostico());
        dto.setReavaliacao(atendimento.getReavaliacao());
        dto.setDesfecho(atendimento.getDesfecho());
        dto.setEspecialidade(atendimento.getEspecialidade());
        // No seu modelo, 'concluido' é String, então mapeamos como String aqui.
        // Se no futuro você mudar para boolean no modelo, esta linha precisará ser ajustada.
        dto.setConcluido(atendimento.getConcluido());

        if (atendimento.getMedico() != null) {
            dto.setIdMedico(atendimento.getMedico().getIdMedico());
        }

        return dto;
    }
}