export async function fetchBookingRecords() {
  const token = localStorage.getItem("token");
  const response = await fetch(
    "http://localhost:8080/api/opwa/operator/booking-records",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch booking records");
  }
  return response.json();
}
