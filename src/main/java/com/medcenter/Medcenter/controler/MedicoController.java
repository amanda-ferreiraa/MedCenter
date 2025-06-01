package com.medcenter.Medcenter.controler;

import com.medcenter.Medcenter.dto.LoginDTO;
import com.medcenter.Medcenter.model.Medico;
import com.medcenter.Medcenter.service.MedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

    @Autowired
    private MedicoService medicoService;

    // Cadastro de médico
    @PostMapping("/cadastro")
    public ResponseEntity<Medico> cadastrar(@RequestBody Medico medico) {
        Medico novoMedico = medicoService.cadastrarMedico(medico);
        novoMedico.setSenha(null);
        return ResponseEntity.ok(novoMedico);
    }

    // Login com DTO
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login) {
        Optional<Medico> autenticado = medicoService.autenticar(login.getEmail(), login.getSenha());
        if (autenticado.isPresent()) {
            Medico medico = autenticado.get();
            medico.setSenha(null);
            return ResponseEntity.ok(medico);
        } else {
            return ResponseEntity.status(401).body("Email ou senha inválidos.");
        }
    }
}
