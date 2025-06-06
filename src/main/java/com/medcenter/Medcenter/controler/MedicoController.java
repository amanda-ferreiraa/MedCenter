package com.medcenter.Medcenter.controler;

import com.medcenter.Medcenter.dto.CadastroMedicoDTO;
import com.medcenter.Medcenter.dto.LoginDTO;
import com.medcenter.Medcenter.dto.MedicoLoginResponseDTO;
import com.medcenter.Medcenter.model.Medico;
import com.medcenter.Medcenter.service.MedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

    @Autowired
    private MedicoService medicoService;

    // Cadastro de médico com DTO
    @PostMapping("/cadastro")
    public ResponseEntity<Medico> cadastrar(@RequestBody CadastroMedicoDTO dto) {
        Medico medico = new Medico(dto); // usa o construtor que tu criou
        medico.setIdMedico(null); // garantir que não tá vindo id do front

        Medico novoMedico = medicoService.cadastrarMedico(medico);
        novoMedico.setSenha(null); // segurança: não devolver senha no response

        return ResponseEntity.ok(novoMedico);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login) {
        Optional<Medico> autenticado = medicoService.autenticar(login.getEmail(), login.getSenha());

        if (autenticado.isPresent()) {
            Medico medico = autenticado.get();
            return ResponseEntity.ok(new MedicoLoginResponseDTO(medico));
        }

        return ResponseEntity.status(401).body("Email ou senha inválidos");
    }
    }


