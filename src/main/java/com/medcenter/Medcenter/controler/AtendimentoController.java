package com.medcenter.Medcenter.controler;

import com.medcenter.Medcenter.dto.AtendimentoDTO;
import com.medcenter.Medcenter.service.AtendimentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "*")
public class AtendimentoController {

    @Autowired
    private AtendimentoService atendimentoService;

    @PostMapping(consumes = "application/json", produces = "application/json")
    public AtendimentoDTO criar(@RequestBody AtendimentoDTO dto) {
        return atendimentoService.salvar(dto);
    }

    @GetMapping
    public List<AtendimentoDTO> listarTodos() {
        return atendimentoService.listarTodos();
    }

    @GetMapping("/data")
    public List<AtendimentoDTO> buscarPorData(@RequestParam String data) {
        return atendimentoService.buscarPorData(data);
    }

    @GetMapping("/especialidade")
    public List<AtendimentoDTO> buscarPorEspecialidade(@RequestParam String esp) {
        return atendimentoService.buscarPorEspecialidade(esp);
    }

    @GetMapping("/paciente")
    public List<AtendimentoDTO> buscarPorNomePaciente(@RequestParam String nome) {
        return atendimentoService.buscarPorNomePaciente(nome);
    }

    @GetMapping("/filtro")
    public List<AtendimentoDTO> buscarPorDataEEspecialidade(@RequestParam String data, @RequestParam String esp) {
        return atendimentoService.buscarPorDataEEspecialidade(data, esp);
    }
}
