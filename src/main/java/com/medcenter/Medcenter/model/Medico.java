package com.medcenter.Medcenter.model;

import com.medcenter.Medcenter.dto.CadastroMedicoDTO;
import jakarta.persistence.*;
import java.util.List;
import java.time.LocalDate;

@Entity
public class Medico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medico")
    private Long idMedico;

    @Column(nullable = false, unique = true)
    private String crm;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false)
    private String especialidade;

    @Column(nullable = true)
    private LocalDate dataNascimento;

    private String fotoUrl;

    private String endereco;

    private String cep;

    private String biografia;

    @Column(nullable = true)
    private String genero;  // agora é String, sem enum

    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL)
    private List<Atendimento> atendimentos;

    // Construtor padrão (obrigatório pro JPA)
    public Medico() {
    }

    // Construtor que recebe o DTO e inicializa os campos principais
    public Medico(CadastroMedicoDTO dto) {
        this.nome = dto.getFullname();
        this.crm = dto.getCrm();
        this.email = dto.getEmail();
        this.telefone = dto.getPhone();
        this.senha = dto.getPassword();
        this.especialidade = dto.getEspecialidade();
    }

    // Getters e Setters
    public Long getIdMedico() {
        return idMedico;
    }

    public void setIdMedico(Long idMedico) {
        this.idMedico = idMedico;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCrm() {
        return crm;
    }

    public void setCrm(String crm) {
        this.crm = crm;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public List<Atendimento> getAtendimentos() {
        return atendimentos;
    }

    public void setAtendimentos(List<Atendimento> atendimentos) {
        this.atendimentos = atendimentos;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }
}
