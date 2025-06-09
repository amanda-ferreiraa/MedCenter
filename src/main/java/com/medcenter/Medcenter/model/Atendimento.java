package com.medcenter.Medcenter.model;
import jakarta.persistence.*;
@Entity
public class Atendimento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "idAtendimento")
    private Long idAtendimento;

    @Column(nullable = false)
    private String data;

    @Column(nullable = false)
    private String hora;

    @Column(name = "nome_paciente")
    private String nomePaciente;

    @Column(nullable = false)
        private String classificacaoRisco;

    @Column(nullable = false)
    private String diagnostico;

    @Column(nullable = false)
    private String reavaliacao;

    @Column(nullable = false)
    private String desfecho;

    @Column(nullable = false)
    private String especialidade;

    @Column(nullable = false)
    private String concluido;

    @ManyToOne
    @JoinColumn(name = "medico_idMedico")
    private Medico medico;

    // getters e setters


    public Long getIdAtendimento() {
        return idAtendimento;
    }

    public void setIdAtendimento(Long idAtendimento) {
        this.idAtendimento = idAtendimento;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public String getNomePaciente() {
        return nomePaciente;
    }

    public void setNomePaciente(String nomePaciente) {
        this.nomePaciente = nomePaciente;
    }

    public String getClassificacaoRisco() {
        return classificacaoRisco;
    }

    public void setClassificacaoRisco(String classificacaoRisco) {
        this.classificacaoRisco = classificacaoRisco;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getReavaliacao() {
        return reavaliacao;
    }

    public void setReavaliacao(String reavaliacao) {
        this.reavaliacao = reavaliacao;
    }

    public String getDesfecho() {
        return desfecho;
    }

    public void setDesfecho(String desfecho) {
        this.desfecho = desfecho;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getConcluido() {
        return concluido;
    }

    public void setConcluido(String concluido) {
        this.concluido = concluido;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }
}


