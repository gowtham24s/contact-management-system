const API_URL = "contacts";

const contactForm = document.getElementById("contactForm");
const contactIdInput = document.getElementById("contactId");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");

const editingIdInput = document.getElementById("editingId");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

const contactsContainer = document.getElementById("contactsContainer");
const contactCount = document.getElementById("contactCount");
const message = document.getElementById("message");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");

async function loadContacts() {
  try {
    loading.style.display = "block";
    emptyState.style.display = "none";

    const response = await fetch(API_URL);
    const data = await response.json();

    loading.style.display = "none";

    displayContacts(data.contacts || []);
  } catch (error) {
    loading.style.display = "none";
    showMessage("Unable to load contacts", "error");
  }
}

function displayContacts(contacts) {
  contactsContainer.innerHTML = "";

  contactCount.textContent =
    `${contacts.length} contact${contacts.length !== 1 ? "s" : ""}`;

  if (contacts.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  contacts.forEach((contact) => {
    const card = document.createElement("div");
    card.className = "contact-card";

    card.innerHTML = `
      <h3>${escapeHtml(contact.name)}</h3>

      <div class="contact-info">
        <strong>Contact ID:</strong>
        ${escapeHtml(contact.contactId)}
      </div>

      <div class="contact-info">
        <strong>Phone:</strong>
        ${escapeHtml(contact.phone)}
      </div>

      <div class="contact-info">
        <strong>Email:</strong>
        ${escapeHtml(contact.email)}
      </div>

      <div class="card-buttons">
        <button class="edit-btn"
          onclick="editContact('${contact._id}')">
          Edit
        </button>

        <button class="delete-btn"
          onclick="deleteContact('${contact._id}')">
          Delete
        </button>
      </div>
    `;

    contactsContainer.appendChild(card);
  });
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const contactData = {
    contactId: contactIdInput.value.trim(),
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim()
  };

  try {
    let response;

    if (editingIdInput.value) {
      response = await fetch(
        `${API_URL}/${editingIdInput.value}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(contactData)
        }
      );
    } else {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactData)
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        (data.errors ? data.errors.join(", ") : "Request failed")
      );
    }

    showMessage(data.message, "success");

    resetForm();
    loadContacts();

  } catch (error) {
    showMessage(error.message, "error");
  }
});

async function editContact(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const contact = await response.json();

    if (!response.ok) {
      throw new Error(contact.message || "Unable to load contact");
    }

    contactIdInput.value = contact.contactId;
    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email;

    editingIdInput.value = contact._id;

    document.getElementById("formTitle").textContent =
      "Edit Contact";

    submitBtn.textContent = "Update Contact";
    cancelBtn.style.display = "inline-block";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function deleteContact(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this contact?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to delete contact");
    }

    showMessage(data.message, "success");

    loadContacts();

  } catch (error) {
    showMessage(error.message, "error");
  }
}

cancelBtn.addEventListener("click", () => {
  resetForm();
});

function resetForm() {
  contactForm.reset();

  editingIdInput.value = "";

  document.getElementById("formTitle").textContent =
    "Add New Contact";

  submitBtn.textContent = "Add Contact";
  cancelBtn.style.display = "none";
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;

  setTimeout(() => {
    message.textContent = "";
    message.className = "";
  }, 4000);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

loadContacts();