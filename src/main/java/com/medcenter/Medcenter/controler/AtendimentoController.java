package com.medcenter.Medcenter.controler;

import com.medcenter.Medcenter.dto.AtendimentoDTO;
// Importar todos os DTOs, incluindo os novos para a dashboard
import com.medcenter.Medcenter.dto.AtendimentoPorEspecialidadeDTO;
import com.medcenter.Medcenter.dto.ClassificacaoRiscoDTO;
import com.medcenter.Medcenter.dto.DesfechoAtendimentoDTO;
import com.medcenter.Medcenter.dto.DesempenhoMedicoDTO;
import com.medcenter.Medcenter.dto.ResumoAtendimentosDTO;
import com.medcenter.Medcenter.dto.ResumoAtendimentosDiaDTO; // NOVO DTO para a dashboard
import com.medcenter.Medcenter.dto.AtendimentoSemanalDTO; // NOVO DTO para a dashboard

import com.medcenter.Medcenter.service.AtendimentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate; // Para a data atual
import java.time.format.DateTimeFormatter; // Para formatar a data
import java.util.List;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "*") // Mantenha o CORS liberado para facilitar o desenvolvimento
public class AtendimentoController {

    @Autowired
    private AtendimentoService atendimentoService;

    // --- Seus métodos existentes de CRUD e filtro ---

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<AtendimentoDTO> criar(@RequestBody AtendimentoDTO dto) {
        AtendimentoDTO atendimentoSalvo = atendimentoService.salvar(dto);
        return new ResponseEntity<>(atendimentoSalvo, HttpStatus.CREATED); // Retorna 201 Created
    }

    // Endpoint de busca unificado e flexível
    @GetMapping
    public List<AtendimentoDTO> buscarAtendimentos(
            @RequestParam(required = false) String data,
            @RequestParam(required = false) String especialidade,
            @RequestParam(required = false) String nome
    ) {
        // Se nenhum filtro for fornecido, lista todos.
        // Caso contrário, usa o método de busca flexível.
        if ((data == null || data.trim().isEmpty()) &&
                (especialidade == null || especialidade.trim().isEmpty()) &&
                (nome == null || nome.trim().isEmpty())) {
            return atendimentoService.listarTodos();
        } else {
            // Assegura que strings vazias sejam tratadas como null pelo serviço
            String nomeParam = (nome != null && !nome.trim().isEmpty()) ? nome : null;
            String dataParam = (data != null && !data.trim().isEmpty()) ? data : null;
            String especialidadeParam = (especialidade != null && !especialidade.trim().isEmpty()) ? especialidade : null;
            return atendimentoService.buscarPorFiltros(nomeParam, dataParam, especialidadeParam);
        }
    }

    // Endpoint para exportar atendimentos para XLS
    @GetMapping("/exportar-xls")
    public ResponseEntity<byte[]> exportarAtendimentosXLS(
            @RequestParam(required = false) String data,
            @RequestParam(required = false) String especialidade,
            @RequestParam(required = false) String nome
    ) {
        try {
            List<AtendimentoDTO> atendimentosFiltrados;
            if ((data == null || data.trim().isEmpty()) &&
                    (especialidade == null || especialidade.trim().isEmpty()) &&
                    (nome == null || nome.trim().isEmpty())) {
                atendimentosFiltrados = atendimentoService.listarTodos();
            } else {
                // Assegura que strings vazias sejam tratadas como null pelo serviço
                String nomeParam = (nome != null && !nome.trim().isEmpty()) ? nome : null;
                String dataParam = (data != null && !data.trim().isEmpty()) ? data : null;
                String especialidadeParam = (especialidade != null && !especialidade.trim().isEmpty()) ? especialidade : null;
                atendimentosFiltrados = atendimentoService.buscarPorFiltros(nomeParam, dataParam, especialidadeParam);
            }

            byte[] excelBytes = atendimentoService.gerarExcel(atendimentosFiltrados);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "atendimentos.xlsx");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Em produção, use um logger (ex: Logback/SLF4J)
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para deletar um atendimento
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAtendimento(@PathVariable Long id) {
        boolean deletado = atendimentoService.deletar(id);
        if (deletado) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }

    // --- SEUS ENDPOINTS EXISTENTES PARA RELATÓRIOS E ESTATÍSTICAS ---

    @GetMapping("/relatorios/especialidades")
    public ResponseEntity<List<AtendimentoPorEspecialidadeDTO>> getAtendimentosPorEspecialidade() {
        List<AtendimentoPorEspecialidadeDTO> data = atendimentoService.getAtendimentosPorEspecialidade();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/relatorios/risco")
    public ResponseEntity<List<ClassificacaoRiscoDTO>> getClassificacaoRisco() {
        List<ClassificacaoRiscoDTO> data = atendimentoService.getClassificacaoRisco();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/relatorios/desfechos")
    public ResponseEntity<List<DesfechoAtendimentoDTO>> getDesfechosAtendimentos() {
        List<DesfechoAtendimentoDTO> data = atendimentoService.getDesfechosAtendimentos();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/relatorios/desempenho-medicos")
    public ResponseEntity<List<DesempenhoMedicoDTO>> getDesempenhoMedicos() {
        List<DesempenhoMedicoDTO> data = atendimentoService.getDesempenhoMedicos();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/relatorios/resumo")
    public ResponseEntity<ResumoAtendimentosDTO> getResumoAtendimentos() {
        ResumoAtendimentosDTO data = atendimentoService.getResumoAtendimentos();
        return ResponseEntity.ok(data);
    }

    // Endpoints para popular os dropdowns de filtro no frontend
    @GetMapping("/relatorios/especialidades-filtro")
    public ResponseEntity<List<String>> getDistinctEspecialidades() {
        List<String> especialidades = atendimentoService.getDistinctEspecialidades();
        return ResponseEntity.ok(especialidades);
    }

    @GetMapping("/relatorios/medicos-filtro")
    public ResponseEntity<List<Object[]>> getMedicosForFilter() {
        List<Object[]> medicos = atendimentoService.getMedicosForFilter();
        return ResponseEntity.ok(medicos);
    }

    // --- NOVOS ENDPOINTS PARA A DASHBOARD HOME ---

    /**
     * Endpoint para retornar o resumo de atendimentos do dia para um médico específico.
     * Retorna total, concluídos, em andamento, e a especialidade do médico.
     * URL esperado pelo frontend: /api/atendimentos/home/resumo-dia/{medicoId}
     */
    @GetMapping("/home/resumo-dia/{medicoId}")
    public ResponseEntity<ResumoAtendimentosDiaDTO> getResumoDiarioDoMedico(
            @PathVariable Long medicoId) {
        // A data é gerada no backend para garantir consistência
        String dataHoje = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")); // Formato "yyyy-MM-dd"
        ResumoAtendimentosDiaDTO resumo = atendimentoService.getResumoDiarioMedico(medicoId, dataHoje);
        return ResponseEntity.ok(resumo);
    }

    /**
     * Endpoint para retornar os atendimentos agendados para um médico em um dia específico.
     * Usado para popular a tabela "Últimos atendimentos (Hoje)".
     * URL esperado pelo frontend: /api/atendimentos/home/atendimentos-dia/{medicoId}
     */
    @GetMapping("/home/atendimentos-dia/{medicoId}")
    public ResponseEntity<List<AtendimentoDTO>> getAtendimentosDoDiaDoMedico(
            @PathVariable Long medicoId) {
        // A data é gerada no backend para garantir consistência
        String dataHoje = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")); // Formato "yyyy-MM-dd"
        List<AtendimentoDTO> atendimentos = atendimentoService.getAtendimentosDoDia(medicoId, dataHoje);
        return ResponseEntity.ok(atendimentos);
    }

    /**
     * Endpoint para retornar os dados de atendimentos semanais para o gráfico de linha de um médico.
     * URL esperado pelo frontend: /api/atendimentos/home/atendimentos-semanal/{medicoId}
     */
    @GetMapping("/home/atendimentos-semanal/{medicoId}")
    public ResponseEntity<List<AtendimentoSemanalDTO>> getAtendimentosSemanaisDoMedico(
            @PathVariable Long medicoId) {
        List<AtendimentoSemanalDTO> dadosGrafico = atendimentoService.getAtendimentosSemanal(medicoId);
        return ResponseEntity.ok(dadosGrafico);
    }
}