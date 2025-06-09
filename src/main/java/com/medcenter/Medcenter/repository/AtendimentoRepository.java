package com.medcenter.Medcenter.repository;

import com.medcenter.Medcenter.model.Atendimento;
import com.medcenter.Medcenter.model.Medico; // Necessário para consultas que envolvem o médico
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

// Importar todos os DTOs, incluindo os novos para a dashboard
import com.medcenter.Medcenter.dto.AtendimentoPorEspecialidadeDTO;
import com.medcenter.Medcenter.dto.ClassificacaoRiscoDTO;
import com.medcenter.Medcenter.dto.DesfechoAtendimentoDTO;
import com.medcenter.Medcenter.dto.DesempenhoMedicoDTO;
import com.medcenter.Medcenter.dto.ResumoAtendimentosDTO;
import com.medcenter.Medcenter.dto.AtendimentoSemanalDTO; // Novo DTO para o gráfico semanal

import java.util.List;

@Repository // Anotação @Repository é boa prática
public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {

    // --- Seus métodos de filtro existentes ---
    List<Atendimento> findByData(String data);

    List<Atendimento> findByEspecialidade(String especialidade);

    List<Atendimento> findByNomePacienteContainingIgnoreCase(String nome);

    List<Atendimento> findByDataAndEspecialidade(String data, String especialidade);

    // Filtro flexível com nome, data e especialidade (tudo opcional)
    @Query("SELECT a FROM Atendimento a " +
            "WHERE (:nome IS NULL OR LOWER(a.nomePaciente) LIKE LOWER(CONCAT('%', :nome, '%'))) " +
            "AND (:data IS NULL OR a.data = :data) " +
            "AND (:especialidade IS NULL OR a.especialidade = :especialidade)")
    List<Atendimento> findByFiltros(@Param("nome") String nome,
                                    @Param("data") String data,
                                    @Param("especialidade") String especialidade);


    // --- SUAS CONSULTAS PARA RELATÓRIOS EXISTENTES ---

    // Consulta para "Atendimentos por Especialidade" (gráfico de barras)
    @Query("SELECT new com.medcenter.Medcenter.dto.AtendimentoPorEspecialidadeDTO(a.especialidade, COUNT(a)) " +
            "FROM Atendimento a GROUP BY a.especialidade ORDER BY COUNT(a) DESC")
    List<AtendimentoPorEspecialidadeDTO> countAtendimentosByEspecialidade();

    // Consulta para "Classificação de Risco" (gráfico de pizza)
    @Query("SELECT new com.medcenter.Medcenter.dto.ClassificacaoRiscoDTO(a.classificacaoRisco, COUNT(a)) " +
            "FROM Atendimento a GROUP BY a.classificacaoRisco ORDER BY COUNT(a) DESC")
    List<ClassificacaoRiscoDTO> countAtendimentosByClassificacaoRisco();

    // Consulta para "Desfechos dos Atendimentos" (gráfico de rosquinha)
    @Query("SELECT new com.medcenter.Medcenter.dto.DesfechoAtendimentoDTO(a.desfecho, COUNT(a)) " +
            "FROM Atendimento a GROUP BY a.desfecho ORDER BY COUNT(a) DESC")
    List<DesfechoAtendimentoDTO> countAtendimentosByDesfecho();

    // Consulta para "Desempenho Médico" (tabela)
    // Nota: O cálculo de tempo médio e eficiência geralmente é feito no serviço ou frontend
    // para maior flexibilidade e evitar complexidade excessiva no JPQL.
    @Query("SELECT new com.medcenter.Medcenter.dto.DesempenhoMedicoDTO(" +
            "m.idMedico, m.nome, m.especialidade, COUNT(a), " +
            "null, " + // mediaAtendimentosPorPlantao - pode ser calculado no serviço ou outra query
            "null) " + // tempoMedioAtendimento - complexo para JPQL, pode ser String ou Double
            "FROM Atendimento a JOIN a.medico m " +
            "GROUP BY m.idMedico, m.nome, m.especialidade " +
            "ORDER BY COUNT(a) DESC")
    List<DesempenhoMedicoDTO> findDesempenhoMedicos();

    // Consulta para os Cartões Resumo
    @Query("SELECT new com.medcenter.Medcenter.dto.ResumoAtendimentosDTO(" +
            "COUNT(a), " +
            "SUM(CASE WHEN a.desfecho = 'Alta' THEN 1L ELSE 0L END), " + // Usando 1L e 0L para garantir Long
            "SUM(CASE WHEN a.desfecho = 'Internação' THEN 1L ELSE 0L END), " +
            "SUM(CASE WHEN a.desfecho = 'Transferência' THEN 1L ELSE 0L END)) " +
            "FROM Atendimento a")
    ResumoAtendimentosDTO getResumoAtendimentos();

    // Consultas para popular os filtros de Especialidade e Médico no frontend
    @Query("SELECT DISTINCT a.especialidade FROM Atendimento a WHERE a.especialidade IS NOT NULL ORDER BY a.especialidade ASC")
    List<String> findAllDistinctEspecialidades();

    // Retorna ID e Nome do médico para popular o filtro.
    // Certifique-se que Medico tem os campos idMedico e nome.
    @Query("SELECT m.idMedico, m.nome FROM Medico m ORDER BY m.nome ASC")
    List<Object[]> findAllMedicosForFilter();


    // --- NOVAS CONSULTAS PARA A DASHBOARD HOME (ATENDIMENTOS DO MÉDICO LOGADO) ---

    // 1. Atendimentos de um médico específico para uma data específica
    // (Para a tabela "Últimos atendimentos (Hoje)" e para o total de atendimentos do dia)
    @Query("SELECT a FROM Atendimento a WHERE a.medico.idMedico = :medicoId AND a.data = :data")
    List<Atendimento> findByMedicoIdAndData(@Param("medicoId") Long medicoId, @Param("data") String data);

    // 2. Contagem de atendimentos concluídos para um médico em uma data
    // O campo 'concluido' no seu model é String ("true"/"false"), então a query usa String.
    @Query("SELECT COUNT(a) FROM Atendimento a WHERE a.medico.idMedico = :medicoId AND a.data = :data AND a.concluido = 'true'")
    Long countByMedicoIdAndDataAndConcluidoTrue(@Param("medicoId") Long medicoId, @Param("data") String data);

    // 3. Contagem de atendimentos em andamento para um médico em uma data
    @Query("SELECT COUNT(a) FROM Atendimento a WHERE a.medico.idMedico = :medicoId AND a.data = :data AND a.concluido = 'false'")
    Long countByMedicoIdAndDataAndConcluidoFalse(@Param("medicoId") Long medicoId, @Param("data") String data);

    // 4. Atendimentos semanais para o gráfico de linha (últimos 7 dias, incluindo hoje)
    // Retorna a data e a contagem de atendimentos para cada dia no período.
    @Query("SELECT new com.medcenter.Medcenter.dto.AtendimentoSemanalDTO(a.data, COUNT(a)) " +
            "FROM Atendimento a " +
            "WHERE a.medico.idMedico = :medicoId AND a.data BETWEEN :dataInicio AND :dataFim " +
            "GROUP BY a.data ORDER BY a.data ASC")
    List<AtendimentoSemanalDTO> countAtendimentosSemanalByMedicoId(
            @Param("medicoId") Long medicoId,
            @Param("dataInicio") String dataInicio,
            @Param("dataFim") String dataFim
    );
}