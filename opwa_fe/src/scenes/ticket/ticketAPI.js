// Lấy tất cả loại ticket
export async function fetchTicketPolicies(token) {
  const response = await fetch(
    "http://localhost:8080/api/opwa/agent/ticket-policies",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch ticket policies");
  return response.json();
}

// Lấy tất cả passenger id
export async function fetchPassengerIds(token) {
  const response = await fetch(
    "http://localhost:8080/api/opwa/agent/passenger-ids",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch passenger ids");
  return response.json();
}

// Mua vé
export async function purchaseTicket(data, token) {
  const response = await fetch("http://localhost:8080/api/opwa/agent/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to purchase ticket");
  return response.json();
}

export async function createTicket(data, token) {
  const response = await fetch("http://localhost:8080/api/opwa/agent/tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create ticket");
  return response.json(); // trả về ticket object, trong đó có _id hoặc id
}
