package com.medcenter.Medcenter.dto;

public class AtendimentoPorEspecialidadeDTO {
    private String especialidade;
    private Long totalAtendimentos;

    public AtendimentoPorEspecialidadeDTO(String especialidade, Long totalAtendimentos) {
        this.especialidade = especialidade;
        this.totalAtendimentos = totalAtendimentos;
    }

    // Getters e Setters
    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public Long getTotalAtendimentos() {
        return totalAtendimentos;
    }

    public void setTotalAtendimentos(Long totalAtendimentos) {
        this.totalAtendimentos = totalAtendimentos;
    }
}