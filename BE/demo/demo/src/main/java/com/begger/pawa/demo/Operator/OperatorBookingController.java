package com.begger.pawa.demo.Operator;

import com.begger.pawa.demo.Ticket.Ticket;
import com.begger.pawa.demo.Ticket.TicketRepository;
import com.begger.pawa.demo.TicketType.TicketTypeRepository;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/operator")
public class OperatorBookingController {

    private final TicketRepository ticketRepo;

    public OperatorBookingController(TicketRepository ticketRepo) {
        this.ticketRepo = ticketRepo;
    }


    // retrieve all booking record
    @GetMapping("/booking-records")
    public List<BookingRecordResponse> getAllBookingRecords() {
        List<Ticket> tickets = ticketRepo.findAll();
        return tickets.stream()
                .map(BookingRecordResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // retrieve all booking record base on passenger id
    @GetMapping("/{passengerId}")
    public List<BookingRecordResponse> getBookingRecordByPassenger(@PathVariable String passengerId){
        ObjectId pid;
        try {
            pid = new ObjectId(passengerId);
        } catch (IllegalArgumentException  e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid passengerId: must be a 24-hex-char ObjectId"
            );
        }

        List<Ticket> tickets = ticketRepo.findByPassengerId(pid);
        return tickets.stream()
                .map(BookingRecordResponse::fromEntity)
                .collect(Collectors.toList());
    }



}
