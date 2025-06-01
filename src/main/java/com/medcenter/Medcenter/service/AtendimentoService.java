package com.medcenter.Medcenter.service;

import com.medcenter.Medcenter.model.Atendimento;
import com.medcenter.Medcenter.repository.AtendimentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class AtendimentoService {
    @Autowired
    private AtendimentoRepository atendimentoRepository;

    public Atendimento salvar(Atendimento atendimento) {
        return atendimentoRepository.save(atendimento);
    }

    public List<Atendimento> listarTodos() {
        return atendimentoRepository.findAll();
    }

    public Atendimento buscarPorId(Long id) {
        return atendimentoRepository.findById(id).orElse(null);
    }

    public void deletar(Long id) {
        atendimentoRepository.deleteById(id);
    }

    // Buscar por data
    public List<Atendimento> buscarPorData(String data) {
        return atendimentoRepository.findByData(data);
    }

    // Buscar por especialidade
    public List<Atendimento> buscarPorEspecialidade(String especialidade) {
        return atendimentoRepository.findByEspecialidade(especialidade);
    }

    // Buscar por data e especialidade
    public List<Atendimento> buscarPorDataEEspecialidade(String data, String especialidade) {
        return atendimentoRepository.findByDataAndEspecialidade(data, especialidade);
    }

    // Buscar paciente pelo nome (parcial, ignorando maiúsculas/minúsculas)
    public List<Atendimento> buscarPorNomePaciente(String nome) {
        return atendimentoRepository.findByNomePacienteContainingIgnoreCase(nome);
    }

}
