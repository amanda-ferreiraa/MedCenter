package com.medcenter.Medcenter.dto;

public class ClassificacaoRiscoDTO {
    private String classificacao;
    private Long totalAtendimentos;

    public ClassificacaoRiscoDTO(String classificacao, Long totalAtendimentos) {
        this.classificacao = classificacao;
        this.totalAtendimentos = totalAtendimentos;
    }

    // Getters e Setters
    public String getClassificacao() {
        return classificacao;
    }

    public void setClassificacao(String classificacao) {
        this.classificacao = classificacao;
    }

    public Long getTotalAtendimentos() {
        return totalAtendimentos;
    }

    public void setTotalAtendimentos(Long totalAtendimentos) {
        this.totalAtendimentos = totalAtendimentos;
    }
}