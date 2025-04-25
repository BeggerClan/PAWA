package com.begger.pawa.demo.TicketPurchase.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document("tickets")
public class Ticket {
    @Id
    private String id;
    private String email;
    private String type;
    private Instant purchasedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Instant getPurchasedAt() { return purchasedAt; }
    public void setPurchasedAt(Instant purchasedAt) { this.purchasedAt = purchasedAt; }
}

