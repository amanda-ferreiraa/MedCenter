package com.medcenter.Medcenter.controler;

import com.medcenter.Medcenter.model.Atendimento;
import com.medcenter.Medcenter.service.AtendimentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "*") // libera requisições do front
public class AtendimentoController {
    @Autowired
    private AtendimentoService atendimentoService;

    @PostMapping
    public Atendimento criar(@RequestBody Atendimento atendimento) {
        return atendimentoService.salvar(atendimento);
    }

    @GetMapping
    public List<Atendimento> listarTodos() {
        return atendimentoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Atendimento buscarPorId(@PathVariable Long id) {
        return atendimentoService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        atendimentoService.deletar(id);
    }

    @GetMapping("/data")
    public List<Atendimento> buscarPorData(@RequestParam String data) {
        return atendimentoService.buscarPorData(data);
    }

    @GetMapping("/especialidade")
    public List<Atendimento> buscarPorEspecialidade(@RequestParam String esp) {
        return atendimentoService.buscarPorEspecialidade(esp);
    }

    @GetMapping("/paciente")
    public List<Atendimento> buscarPorNomePaciente(@RequestParam String nome) {
        return atendimentoService.buscarPorNomePaciente(nome);
    }

    @GetMapping("/filtro")
    public List<Atendimento> buscarPorDataEEspecialidade(@RequestParam String data, @RequestParam String esp) {
        return atendimentoService.buscarPorDataEEspecialidade(data, esp);
    }
}
