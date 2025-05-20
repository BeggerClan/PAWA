package com.begger.pawa.demo.TicketType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ticket-types")
public class TicketTypeController {

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @GetMapping
    public List<TicketType> getAllTicketTypes() {
        return ticketTypeRepository.findAll();
    }
}
