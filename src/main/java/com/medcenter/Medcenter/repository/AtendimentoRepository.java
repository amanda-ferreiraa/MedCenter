package com.medcenter.Medcenter.repository;

import com.medcenter.Medcenter.model.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {

    // Filtros simples (mantidos)
    List<Atendimento> findByData(String data);

    List<Atendimento> findByEspecialidade(String especialidade);

    List<Atendimento> findByNomePacienteContainingIgnoreCase(String nome);

    List<Atendimento> findByDataAndEspecialidade(String data, String especialidade);

    // 🔍 Filtro flexível com nome, data e especialidade (tudo opcional)
    @Query("SELECT a FROM Atendimento a " +
            "WHERE (:nome IS NULL OR LOWER(a.nomePaciente) LIKE LOWER(CONCAT('%', :nome, '%'))) " +
            "AND (:data IS NULL OR a.data = :data) " +
            "AND (:especialidade IS NULL OR a.especialidade = :especialidade)")
    List<Atendimento> findByFiltros(@Param("nome") String nome,
                                    @Param("data") String data,
                                    @Param("especialidade") String especialidade);
}
