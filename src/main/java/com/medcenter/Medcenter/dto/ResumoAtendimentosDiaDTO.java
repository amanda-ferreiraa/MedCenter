package com.medcenter.Medcenter.dto;

public class ResumoAtendimentosDiaDTO {
    private long totalAtendimentos;
    private long concluidos;
    private long emAndamento;
    private String especialidadeMedico; // Para o cartão de área de atuação

    public ResumoAtendimentosDiaDTO(long totalAtendimentos, long concluidos, long emAndamento, String especialidadeMedico) {
        this.totalAtendimentos = totalAtendimentos;
        this.concluidos = concluidos;
        this.emAndamento = emAndamento;
        this.especialidadeMedico = especialidadeMedico;
    }

    // Getters e Setters
    public long getTotalAtendimentos() { return totalAtendimentos; }
    public void setTotalAtendimentos(long totalAtendimentos) { this.totalAtendimentos = totalAtendimentos; }
    public long getConcluidos() { return concluidos; }
    public void setConcluidos(long concluidos) { this.concluidos = concluidos; }
    public long getEmAndamento() { return emAndamento; }
    public void setEmAndamento(long emAndamento) { this.emAndamento = emAndamento; }
    public String getEspecialidadeMedico() { return especialidadeMedico; }
    public void setEspecialidadeMedico(String especialidadeMedico) { this.especialidadeMedico = especialidadeMedico; }
}