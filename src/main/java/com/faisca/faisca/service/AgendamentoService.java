package com.faisca.faisca.service;

import com.faisca.faisca.exception.AgendamentoCheioException;
import com.faisca.faisca.model.Agendamento;
import com.faisca.faisca.repositories.AgendamentoRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgendamentoService {

    // maximo de faisca por dia
    private static final int MAX_FAISCAS_POR_DIA = 2;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Transactional
    public Agendamento salvarAgendamento(Agendamento agendamento) {

        long agendamentosExistentes = agendamentoRepository.countByData(agendamento.getData());

        if (agendamentosExistentes >= MAX_FAISCAS_POR_DIA) {
            String mensagem = """
                    O limite de %d Faíscas para o dia %s foi atingido.
                    """.formatted(MAX_FAISCAS_POR_DIA,agendamento.getData());
            throw new AgendamentoCheioException(mensagem);
        }

        return agendamentoRepository.save(agendamento);
    }

    @Transactional(readOnly = true)
     public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Agendamento buscarPorId(Long id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND,
                        "Agendamento nao encontrado com o ID: " + id
                ));
    }

}