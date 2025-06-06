package com.medcenter.Medcenter.dto;

import com.medcenter.Medcenter.model.Medico;
public class MedicoLoginResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String especialidade;

    // Construtor que recebe o Medico e monta o DTO
    public MedicoLoginResponseDTO(Medico medico) {
        this.id = medico.getIdMedico();
        this.nome = medico.getNome();
        this.email = medico.getEmail();
        this.especialidade = medico.getEspecialidade();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }
}

