package com.medcenter.Medcenter.dto;

public class DesempenhoMedicoDTO {
    private Long idMedico;
    private String nomeMedico;
    private String especialidadeMedico; // Pode ser útil para a exibição
    private Long totalAtendimentos;
    private Double mediaAtendimentosPorPlantao; // Exemplo de cálculo, pode ser diferente
    private String tempoMedioAtendimento; // Pode ser String se for formatado (ex: "18 min")

    public DesempenhoMedicoDTO(Long idMedico, String nomeMedico, String especialidadeMedico, Long totalAtendimentos, Double mediaAtendimentosPorPlantao, String tempoMedioAtendimento) {
        this.idMedico = idMedico;
        this.nomeMedico = nomeMedico;
        this.especialidadeMedico = especialidadeMedico;
        this.totalAtendimentos = totalAtendimentos;
        this.mediaAtendimentosPorPlantao = mediaAtendimentosPorPlantao;
        this.tempoMedioAtendimento = tempoMedioAtendimento;
    }

    // Getters e Setters
    public Long getIdMedico() {
        return idMedico;
    }

    public void setIdMedico(Long idMedico) {
        this.idMedico = idMedico;
    }

    public String getNomeMedico() {
        return nomeMedico;
    }

    public void setNomeMedico(String nomeMedico) {
        this.nomeMedico = nomeMedico;
    }

    public String getEspecialidadeMedico() {
        return especialidadeMedico;
    }

    public void setEspecialidadeMedico(String especialidadeMedico) {
        this.especialidadeMedico = especialidadeMedico;
    }

    public Long getTotalAtendimentos() {
        return totalAtendimentos;
    }

    public void setTotalAtendimentos(Long totalAtendimentos) {
        this.totalAtendimentos = totalAtendimentos;
    }

    public Double getMediaAtendimentosPorPlantao() {
        return mediaAtendimentosPorPlantao;
    }

    public void setMediaAtendimentosPorPlantao(Double mediaAtendimentosPorPlantao) {
        this.mediaAtendimentosPorPlantao = mediaAtendimentosPorPlantao;
    }

    public String getTempoMedioAtendimento() {
        return tempoMedioAtendimento;
    }

    public void setTempoMedioAtendimento(String tempoMedioAtendimento) {
        this.tempoMedioAtendimento = tempoMedioAtendimento;
    }
}