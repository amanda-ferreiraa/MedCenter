package com.medcenter.Medcenter.controler;

import com.medcenter.Medcenter.dto.PerfilMedicoDTO;
import com.medcenter.Medcenter.model.Medico;
import com.medcenter.Medcenter.repository.MedicoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/perfil")
public class PerfilController {

    @Autowired
    private MedicoRepository medicoRepository;

    // 🔍 GET - Buscar perfil do médico por e-mail
    @GetMapping
    public PerfilMedicoDTO getPerfil(@RequestParam String email) {
        Medico medico = medicoRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado com esse e-mail"));

        PerfilMedicoDTO dto = new PerfilMedicoDTO();
        dto.setNome(medico.getNome());
        dto.setEmail(medico.getEmail());
        dto.setCrm(medico.getCrm());
        dto.setTelefone(medico.getTelefone());
        dto.setEspecialidade(medico.getEspecialidade());
        dto.setDataNascimento(medico.getDataNascimento());
        dto.setGenero(medico.getGenero());
        dto.setEndereco(medico.getEndereco());
        dto.setCep(medico.getCep());
        dto.setBiografia(medico.getBiografia());
        dto.setFotoPerfil(
                (medico.getFotoUrl() != null && !medico.getFotoUrl().isEmpty())
                        ? medico.getFotoUrl()
                        : "/assets/images/foto-padrao.png"
        );

        return dto;
    }

    // ✏️ PUT - Atualizar perfil do médico por e-mail
    @PutMapping
    @Transactional
    public void atualizarPerfil(@RequestBody PerfilMedicoDTO dto) {
        Medico medico = medicoRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Médico não encontrado com esse e-mail"));

        medico.setNome(dto.getNome());
        medico.setTelefone(dto.getTelefone());
        medico.setEspecialidade(dto.getEspecialidade());
        medico.setDataNascimento(dto.getDataNascimento());
        medico.setGenero(dto.getGenero());
        medico.setEndereco(dto.getEndereco());
        medico.setCep(dto.getCep());
        medico.setBiografia(dto.getBiografia());

        // Foto (só se não for nula ou vazia e não for a padrão)
        if (dto.getFotoPerfil() != null && !dto.getFotoPerfil().isEmpty()
                && !dto.getFotoPerfil().equals("/assets/images/foto-padrao.png")) {
            medico.setFotoUrl(dto.getFotoPerfil());
        }

        medicoRepository.save(medico);
    }
}
