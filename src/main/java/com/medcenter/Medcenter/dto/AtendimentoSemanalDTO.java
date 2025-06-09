package com.medcenter.Medcenter.dto;

public class AtendimentoSemanalDTO {
    private String data; // Formato "YYYY-MM-DD"
    private long totalAtendimentos;

    public AtendimentoSemanalDTO(String data, long totalAtendimentos) {
        this.data = data;
        this.totalAtendimentos = totalAtendimentos;
    }

    // Getters e Setters
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
    public long getTotalAtendimentos() { return totalAtendimentos; }
    public void setTotalAtendimentos(long totalAtendimentos) { this.totalAtendimentos = totalAtendimentos; }
}