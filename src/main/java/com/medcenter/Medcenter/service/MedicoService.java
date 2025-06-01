package com.medcenter.Medcenter.service;

import com.medcenter.Medcenter.model.Medico;
import com.medcenter.Medcenter.repository.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MedicoService {
    @Autowired
    private MedicoRepository medicoRepository;

    public Medico cadastrarMedico(Medico medico) {
        return medicoRepository.save(medico);
    }

    public Optional<Medico> autenticar(String email, String senha) {
        Optional<Medico> medico = medicoRepository.findByEmail(email);
        if (medico.isPresent() && medico.get().getSenha().equals(senha)) {
            return medico;
        }
        return Optional.empty();
    }
}
