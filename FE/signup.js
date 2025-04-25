document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const payload = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      firstName: document.getElementById("firstName").value,
      middleName: document.getElementById("middleName").value || null,
      lastName: document.getElementById("lastName").value,
      nationalId: document.getElementById("nationalId").value,
      dob: document.getElementById("dob").value,
      residenceAddress: document.getElementById("residenceAddress").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      studentId: document.getElementById("studentId").value || null,
      disabilityStatus: document.querySelector('input[name="disabilityStatus"]:checked').value === "true",
      revolutionaryStatus: document.querySelector('input[name="revolutionaryStatus"]:checked').value === "true"
    };
  
    try {
      const res = await fetch("http://localhost:8080/api/passengers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
  
      const result = await res.json();
      const messageBox = document.getElementById("responseMessage");
  
      if (res.ok) {
        messageBox.innerHTML = `<div class="alert alert-success">Registration successful! ID: ${result.passengerId}</div>`;
      } else {
        messageBox.innerHTML = `<div class="alert alert-danger">Error: ${result.message || 'Something went wrong.'}</div>`;
      }
    } catch (err) {
      document.getElementById("responseMessage").innerHTML =
        `<div class="alert alert-danger">Network error: ${err.message}</div>`;
    }
  });
  