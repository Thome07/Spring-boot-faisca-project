package com.faisca.faisca.model;
import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
public class Agendamento {

    public Agendamento() {
    }

    public Agendamento(Long id, String nome, String descricao, LocalDate data) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.data = data;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é um requesito obrigatorio")
    @Size(min = 2,max = 50)
    private String nome;

    @NotBlank(message = "A descrição é um requesito obrigatorio")
    @Size(min = 5, max = 500)
    private String descricao;


    @Column(name = "data_agendamento")
    @FutureOrPresent(message = "A data deve estar no presente ou no futuro") // achei legal
    private LocalDate data;                                                  // esse @






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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }
}