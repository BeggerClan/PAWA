package com.begger.pawa.demo.Cart;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "carts")
public class Cart {
    @Id
    private String id;

    private String passengerId;
    private List<CartRequest.CartItem> items;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPassengerId() { return passengerId; }
    public void setPassengerId(String passengerId) { this.passengerId = passengerId; }

    public List<CartRequest.CartItem> getItems() { return items; }
    public void setItems(List<CartRequest.CartItem> items) { this.items = items; }
}
