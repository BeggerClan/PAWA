export async function fetchTeam() {
  const token = localStorage.getItem("token"); // Adjust if you store token elsewhere
  const response = await fetch("http://localhost:8081/api/v1/user/getAll", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // Needed if your backend uses allowCredentials(true)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch team data");
  }

  return response.json();
}
export async function deleteUserById(id) {
  const token = localStorage.getItem("token"); // Adjust if you store token elsewhere
  const response = await fetch(`http://localhost:8081/api/v1/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // Needed if your backend uses allowCredentials(true)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to delete user");
  }

  return response.json();
}
export async function addUser(userData) {
  const token = localStorage.getItem("token"); // Adjust if you store token elsewhere
  const response = await fetch("http://localhost:8081/api/v1/user/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to add user");
  }

  return response.json();
}
export async function updateUser(id, userData) {
  const token = localStorage.getItem("token"); // Adjust if you store token elsewhere
  const response = await fetch(`http://localhost:8081/api/v1/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to update user");
  }

  return response.json();
}
export async function getUserById(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:8081/api/v1/user/get/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch user data");
  }

  return response.json();
}