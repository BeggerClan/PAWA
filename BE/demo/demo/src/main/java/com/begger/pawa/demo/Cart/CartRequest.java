package com.begger.pawa.demo.Cart;

import java.util.List;

public class CartRequest {
    private List<CartItem> items;

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public static class CartItem {
        private String ticketType;
        private int quantity;
        private long unitPrice;
        private String fromStation;
        private String toStation;
    
        public String getTicketType() { return ticketType; }
        public void setTicketType(String ticketType) { this.ticketType = ticketType; }
    
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    
        public long getUnitPrice() { return unitPrice; }
        public void setUnitPrice(long unitPrice) { this.unitPrice = unitPrice; }
    
        public String getFromStation() { return fromStation; }
        public void setFromStation(String fromStation) { this.fromStation = fromStation; }
    
        public String getToStation() { return toStation; }
        public void setToStation(String toStation) { this.toStation = toStation; }
    }
    
}
