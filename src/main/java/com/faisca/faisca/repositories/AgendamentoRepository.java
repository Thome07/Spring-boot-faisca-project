package com.faisca.faisca.repositories;

import com.faisca.faisca.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento,Long> {

    long countByData(LocalDate date);
}
