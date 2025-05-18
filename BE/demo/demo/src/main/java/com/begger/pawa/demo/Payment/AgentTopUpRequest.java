package com.begger.pawa.demo.Payment;

public class AgentTopUpRequest {
    private String passengerId;
    private long amount;

    public String getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(String passengerId) {
        this.passengerId = passengerId;
    }

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }
}
