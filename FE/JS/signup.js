document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const responseMessage = document.getElementById("responseMessage");

  // Add loading class to body when page is loaded for animations
  document.body.classList.add("page-loaded");

  // Input validators
  const validators = {
    email: (value) => {
      const regex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.(com|vn)$/;
      return regex.test(value)
        ? ""
        : "Invalid email format. The email must end with '.com' or '.vn' (e.g., example@domain.com).";
    },

    password: (value) => {
      if (value.length < 8) {
        return "Password must be at least 8 characters long.";
      }
      if (!/[A-Z]/.test(value)) {
        return "Password must contain at least one uppercase letter.";
      }
      if (!/[a-z]/.test(value)) {
        return "Password must contain at least one lowercase letter.";
      }
      if (!/[0-9]/.test(value)) {
        return "Password must contain at least one digit.";
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        return "Password must contain at least one special character (e.g., @, #, $, %).";
      }
      return "";
    },

    name: (value) => {
      // Support Vietnamese characters
      const regex =
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
      if (!regex.test(value)) {
        return "Name must contain only alphabet characters, including Vietnamese characters.";
      }
      if (value.length > 50) {
        return "Name cannot exceed 50 characters.";
      }
      return "";
    },

    nationalId: (value) => {
      const regex = /^\d{12}$/;
      return regex.test(value) ? "" : "National ID must be exactly 12 digits.";
    },

    dob: (value) => {
      // Allow both date picker format and manual entry format
      let dobDate;

      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        // YYYY-MM-DD format (from date input)
        dobDate = new Date(value);
      } else if (/^(\d{2})\/(\d{2})\/(\d{4})$/.test(value)) {
        // DD/MM/YYYY format (manual entry)
        const [day, month, year] = value.split("/");
        dobDate = new Date(`${year}-${month}-${day}`);
      } else {
        return "Invalid date format. Please use dd/mm/yyyy format.";
      }

      if (isNaN(dobDate.getTime())) {
        return "Invalid date. Please enter a valid calendar date.";
      }

      // Check if person is at least 6 years old
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 6);

      if (dobDate > minDate) {
        return "You must be at least 6 years old to register.";
      }

      return "";
    },

    // Update the residenceAddress validator in your signup.js file
    residenceAddress: (value) => {
      // Modified regex to allow Vietnamese characters plus the allowed symbols
      const regex =
        /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s,./-]+$/;
      return regex.test(value)
        ? ""
        : "Residence address can only contain alphanumeric characters, Vietnamese characters, and the symbols , . - /";
    },

    phoneNumber: (value) => {
      const regex = /^0\d{9}$/;
      return regex.test(value)
        ? ""
        : "Phone number must be exactly 10 digits and start with 0.";
    },

    studentId: (value) => {
      if (!value) return ""; // Optional field
      const regex = /^[a-zA-Z0-9]{1,15}$/;
      return regex.test(value)
        ? ""
        : "Student ID must contain only alphanumeric characters and not exceed 15 characters.";
    },
  };

  // Handle date input formatting
  const dobInput = document.getElementById("dob");
  dobInput.addEventListener("focus", function () {
    // Leave as is if it's already a date type
    if (this.type !== "date") {
      this.type = "date";
    }
  });

  dobInput.addEventListener("blur", function () {
    if (!this.value) {
      this.type = "text";
      this.placeholder = "dd/mm/yyyy";
    }
  });

  // Validate individual fields as they are filled
  const inputs = signupForm.querySelectorAll('input:not([type="radio"])');
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });
  });

  function validateField(field) {
    const fieldName = field.id;
    const value = field.value.trim();
    let errorMessage = "";

    // Skip validation for empty optional fields
    if (
      (!value && fieldName === "middleName") ||
      (!value && fieldName === "studentId")
    ) {
      removeFieldError(field);
      return true;
    }

    // Skip validation for empty required fields (handled by HTML required attribute)
    if (!value && field.hasAttribute("required")) {
      return false;
    }

    // Select appropriate validator
    switch (fieldName) {
      case "email":
        errorMessage = validators.email(value);
        break;
      case "password":
        errorMessage = validators.password(value);
        break;
      case "firstName":
      case "middleName":
      case "lastName":
        errorMessage = validators.name(value);
        break;
      case "nationalId":
        errorMessage = validators.nationalId(value);
        break;
      case "dob":
        errorMessage = validators.dob(value);
        break;
      case "residenceAddress":
        errorMessage = validators.residenceAddress(value);
        break;
      case "phoneNumber":
        errorMessage = validators.phoneNumber(value);
        break;
      case "studentId":
        errorMessage = validators.studentId(value);
        break;
    }

    if (errorMessage) {
      showFieldError(field, errorMessage);
      return false;
    } else {
      removeFieldError(field);
      return true;
    }
  }

  function showFieldError(field, message) {
    removeFieldError(field); // Remove any existing error

    const errorElement = document.createElement("div");
    errorElement.className = "field-error text-danger small";
    errorElement.textContent = message;

    field.classList.add("is-invalid");
    field.parentNode.appendChild(errorElement);
  }

  function removeFieldError(field) {
    field.classList.remove("is-invalid");
    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }
  }

  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      responseMessage.innerHTML = `
                <div class="alert alert-danger">
                    Please correct the errors in the form before submitting.
                </div>
            `;
      return;
    }

    // Format date of birth correctly
    let dobValue;
    try {
      // Handle different date formats
      if (dobInput.type === "date") {
        // YYYY-MM-DD format
        const parts = dobInput.value.split("-");
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        dobValue = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}T00:00:00`;
      } else {
        // DD/MM/YYYY format
        const parts = dobInput.value.split("/");
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        dobValue = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}T00:00:00`;
      }
    } catch (error) {
      responseMessage.innerHTML = `
                <div class="alert alert-danger">
                    Invalid date format. Please use dd/mm/yyyy format.
                </div>
            `;
      return;
    }

    const payload = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
      firstName: document.getElementById("firstName").value.trim(),
      middleName: document.getElementById("middleName").value.trim() || null,
      lastName: document.getElementById("lastName").value.trim(),
      nationalId: document.getElementById("nationalId").value.trim(),
      dob: dobValue,
      residenceAddress: document
        .getElementById("residenceAddress")
        .value.trim(),
      phoneNumber: document.getElementById("phoneNumber").value.trim(),
      studentId: document.getElementById("studentId").value.trim() || null,
      disabilityStatus:
        document.querySelector('input[name="disabilityStatus"]:checked')
          .value === "true",
      revolutionaryStatus:
        document.querySelector('input[name="revolutionaryStatus"]:checked')
          .value === "true",
    };

    // Show loading state
    const submitButton = signupForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Creating Account...";

    try {
      // Hide any previous error messages
      responseMessage.innerHTML = "";

      const response = await fetch(
        "http://localhost:8080/api/passengers/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error registering account");
      }

      // Show success message
      responseMessage.innerHTML = `
                <div class="alert alert-success">
                    Registration successful! You can now <a href="signin.html">sign in</a> with your credentials.
                </div>
            `;

      // Show success state
      submitButton.textContent = "Success!";
      submitButton.classList.add("success");

      // Reset form
      signupForm.reset();

      // Redirect to signin page after a delay
      setTimeout(() => {
        window.location.href = "signin.html";
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);

      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;

      // Show error message
      responseMessage.innerHTML = `
                <div class="alert alert-danger">
                    ${error.message || "Failed to register. Please try again."}
                </div>
            `;

      // Add shake animation to form on error
      signupForm.classList.add("shake");
      setTimeout(() => {
        signupForm.classList.remove("shake");
      }, 500);
    }
  });

  // Custom radio button behavior
  const radioInputs = document.querySelectorAll('input[type="radio"]');
  radioInputs.forEach((input) => {
    input.addEventListener("change", function () {
      // Update all radio buttons in the same group
      const name = this.name;
      document.querySelectorAll(`input[name="${name}"]`).forEach((radio) => {
        const customRadio = radio.nextElementSibling;
        if (radio.checked) {
          customRadio.classList.add("checked");
        } else {
          customRadio.classList.remove("checked");
        }
      });
    });
  });

  // Trigger change event on page load to set initial state
  radioInputs.forEach((input) => {
    if (input.checked) {
      input.dispatchEvent(new Event("change"));
    }
  });
});
