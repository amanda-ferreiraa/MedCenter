package com.medcenter.Medcenter.dto;

public class ResumoAtendimentosDTO {
    private Long totalAtendimentos;
    private Long totalAltas;
    private Long totalInternacoes;
    private Long totalTransferencias;

    public ResumoAtendimentosDTO(Long totalAtendimentos, Long totalAltas, Long totalInternacoes, Long totalTransferencias) {
        this.totalAtendimentos = totalAtendimentos;
        this.totalAltas = totalAltas;
        this.totalInternacoes = totalInternacoes;
        this.totalTransferencias = totalTransferencias;
    }

    // Getters e Setters
    public Long getTotalAtendimentos() {
        return totalAtendimentos;
    }

    public void setTotalAtendimentos(Long totalAtendimentos) {
        this.totalAtendimentos = totalAtendimentos;
    }

    public Long getTotalAltas() {
        return totalAltas;
    }

    public void setTotalAltas(Long totalAltas) {
        this.totalAltas = totalAltas;
    }

    public Long getTotalInternacoes() {
        return totalInternacoes;
    }

    public void setTotalInternacoes(Long totalInternacoes) {
        this.totalInternacoes = totalInternacoes;
    }

    public Long getTotalTransferencias() {
        return totalTransferencias;
    }

    public void setTotalTransferencias(Long totalTransferencias) {
        this.totalTransferencias = totalTransferencias;
    }
}