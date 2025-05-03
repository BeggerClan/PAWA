document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const date = document.getElementById("date").value;
    const quantity = document.getElementById("quantity").value;
  
    // Simulate booking confirmation
    const msg = `Ticket booked from <strong>${from}</strong> to <strong>${to}</strong> for <strong>${quantity}</strong> passenger(s) on <strong>${date}</strong>.`;
  
    document.getElementById("resultMsg").innerHTML =
      `<div class="alert alert-success">${msg}</div>`;
  });
  