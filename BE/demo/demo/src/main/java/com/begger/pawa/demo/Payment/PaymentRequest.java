package com.begger.pawa.demo.Payment;

public class PaymentRequest {
    private String passengerId; // Optional: only used for wallet payments
    private String ticketTypeId;
    private String paymentMethod; // "WALLET" or "CASH"
    private Long paymentAmount;
    private Long cashReceived;
	private String nationalId; // Add this near the top

	public String getNationalId() {
		return nationalId;
	}

	public void setNationalId(String nationalId) {
		this.nationalId = nationalId;
	}


	public String getPassengerId() {
		return this.passengerId;
	}

	public void setPassengerId(String passengerId) {
		this.passengerId = passengerId;
	}

	public String getTicketTypeId() {
		return this.ticketTypeId;
	}

	public void setTicketTypeId(String ticketTypeId) {
		this.ticketTypeId = ticketTypeId;
	}

	public String getPaymentMethod() {
		return this.paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public Long getPaymentAmount() {
		return this.paymentAmount;
	}

	public void setPaymentAmount(Long paymentAmount) {
		this.paymentAmount = paymentAmount;
	}

	public Long getCashReceived() {
		return this.cashReceived;
	}

	public void setCashReceived(Long cashReceived) {
		this.cashReceived = cashReceived;
	}   
}
