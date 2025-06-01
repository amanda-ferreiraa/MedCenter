package com.medcenter.Medcenter.repository;

import com.medcenter.Medcenter.model.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {
    List<Atendimento> findByData(String data);

    List<Atendimento> findByEspecialidade(String especialidade);

    List<Atendimento> findByNomePacienteContainingIgnoreCase(String nome);

    List<Atendimento> findByDataAndEspecialidade(String data, String especialidade);


}