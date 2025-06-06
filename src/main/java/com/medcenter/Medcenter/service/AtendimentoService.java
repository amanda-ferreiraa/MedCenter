package com.medcenter.Medcenter.service;

import com.medcenter.Medcenter.dto.AtendimentoDTO;
import com.medcenter.Medcenter.model.Atendimento;
import com.medcenter.Medcenter.model.Medico;
import com.medcenter.Medcenter.repository.AtendimentoRepository;
import com.medcenter.Medcenter.repository.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AtendimentoService {

    @Autowired
    private AtendimentoRepository atendimentoRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    public AtendimentoDTO salvar(AtendimentoDTO dto) {
        Atendimento atendimento = new Atendimento();

        atendimento.setData(dto.getData());
        atendimento.setHora(dto.getHora());
        atendimento.setNomePaciente(dto.getNomePaciente());
        atendimento.setClassificacaoRisco(dto.getClassificacaoRisco());
        atendimento.setDiagnostico(dto.getDiagnostico());
        atendimento.setReavaliacao(dto.getReavaliacao());
        atendimento.setDesfecho(dto.getDesfecho());
        atendimento.setEspecialidade(dto.getEspecialidade());
        atendimento.setConcluido(dto.getConcluido());

        Optional<Medico> medicoOpt = medicoRepository.findById(dto.getIdMedico());
        medicoOpt.ifPresent(atendimento::setMedico);

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

    public List<AtendimentoDTO> buscarPorData(String data) {
        return atendimentoRepository.findByData(data)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public List<AtendimentoDTO> buscarPorEspecialidade(String esp) {
        return atendimentoRepository.findByEspecialidade(esp)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public List<AtendimentoDTO> buscarPorNomePaciente(String nome) {
        return atendimentoRepository.findByNomePacienteContainingIgnoreCase(nome)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public List<AtendimentoDTO> buscarPorDataEEspecialidade(String data, String esp) {
        return atendimentoRepository.findByDataAndEspecialidade(data, esp)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

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
        dto.setConcluido(atendimento.getConcluido());

        // Aqui é onde finaliza certinho o método com o ID do médico
        if (atendimento.getMedico() != null) {
            dto.setIdMedico(atendimento.getMedico().getIdMedico());
        }

        return dto;
    }
}
