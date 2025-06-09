package com.medcenter.Medcenter.dto;

public class DesfechoAtendimentoDTO {
    private String desfecho;
    private Long totalAtendimentos;

    public DesfechoAtendimentoDTO(String desfecho, Long totalAtendimentos) {
        this.desfecho = desfecho;
        this.totalAtendimentos = totalAtendimentos;
    }

    // Getters e Setters
    public String getDesfecho() {
        return desfecho;
    }

    public void setDesfecho(String desfecho) {
        this.desfecho = desfecho;
    }

    public Long getTotalAtendimentos() {
        return totalAtendimentos;
    }

    public void setTotalAtendimentos(Long totalAtendimentos) {
        this.totalAtendimentos = totalAtendimentos;
    }
}