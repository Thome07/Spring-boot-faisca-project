package com.faisca.faisca.controllers;

import com.faisca.faisca.exception.AgendamentoCheioException;
import com.faisca.faisca.model.Agendamento;
import com.faisca.faisca.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

import java.util.List;

@Controller
@RequestMapping("/")
public class AppController {

    @Autowired
    private AgendamentoService agendamentoService;

    @GetMapping("/")
    public String paginaInicial() {
        return "paginaInicial";
    }

    @PostMapping("/agendar/faisca")
    public String agendadorFaisca(@Valid @ModelAttribute Agendamento agendamento,
                                  BindingResult bindingResult,
                                  RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            ObjectError error = bindingResult.getAllErrors().stream().findFirst().orElse(null);
            String errorMessage = (error != null) ? error.getDefaultMessage() : "Erro de validação.";
            redirectAttributes.addFlashAttribute("error", errorMessage);

            // Retorna para a home
            return "redirect:/";
        }

        try {
            agendamentoService.salvarAgendamento(agendamento);
            redirectAttributes.addFlashAttribute("success", "Faísca agendada com sucesso!");

        } catch (AgendamentoCheioException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ocorreu um erro inesperado ao salvar o agendamento.");
        }

        return "redirect:/";
    }

    @GetMapping("/lista")
    public String verTodosAgendamentos(Model model) {
        List<Agendamento> faiscas = agendamentoService.listarTodos();
        model.addAttribute("faiscas", faiscas);
        return "listaAgendamentos";
    }
}