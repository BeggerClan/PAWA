package com.begger.pawa.demo.TicketPolicy;

import com.begger.pawa.demo.TicketType.TicketType;
import com.begger.pawa.demo.TicketType.TicketTypeRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/opwa/agent")
public class TicketPolicyController {

    private final TicketTypeRepository typeRepo;

    public TicketPolicyController(TicketTypeRepository typeRepo) {
        this.typeRepo = typeRepo;
    }

    @GetMapping("/ticket-policies")
    public List<TicketPolicyResponse> getAllPolicies() {
        return typeRepo.findAll().stream()
                .map(TicketPolicyResponse::fromEntity)
                .collect(Collectors.toList());
    }


}
