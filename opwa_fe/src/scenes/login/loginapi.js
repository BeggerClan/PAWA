export async function loginApi(email, password) {
  const response = await fetch(
    "http://localhost:8081/api/v1/auth/authenticate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!response.ok) {
    throw new Error("Invalid email or password");
  }
  return response.json();
}
