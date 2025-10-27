// === main.js ===
// Handles navigation, authentication, and ticket management (offline)

// ✅ Helpers
const saveData = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const showToast = (msg) => alert(msg); // You can replace this with fancier UI later

// === Authentication ===
function loginUser(email, password) {
  if (!email || !password) return showToast("Please fill all fields");

  // Simulate login (no backend)
  const user = { email, loggedIn: true };
  saveData("ticketapp_session", user);
  showToast("Login successful!");
  window.location.href = "index.php?page=dashboard";
}

function checkSession() {
  const session = getData("ticketapp_session");
  const restricted = ["dashboard", "tickets"];
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");

  if (restricted.includes(page) && !session.loggedIn) {
    showToast("You need to log in first!");
    window.location.href = "index.php?page=auth";
  }
}

function logoutUser() {
  localStorage.removeItem("ticketapp_session");
  showToast("Logged out successfully!");
  window.location.href = "index.php?page=landing";
}

// === Ticket Management ===
function loadTickets() {
  const tickets = getData("tickets");
  const ticketList = document.querySelector("#ticketList");
  if (!ticketList) return;

  ticketList.innerHTML = "";
  tickets.forEach((ticket, index) => {
    ticketList.innerHTML += `
      <div class="ticket-item">
        <h4>${ticket.title}</h4>
        <p>${ticket.description}</p>
        <div class="ticket-actions">
          <button onclick="editTicket(${index})">Edit</button>
          <button onclick="deleteTicket(${index})">Delete</button>
        </div>
      </div>
    `;
  });
}

function addTicket(title, description) {
  if (!title || !description) return showToast("All fields required!");
  const tickets = getData("tickets");
  tickets.push({ title, description });
  saveData("tickets", tickets);
  showToast("Ticket added!");
  loadTickets();
}

function editTicket(index) {
  const tickets = getData("tickets");
  const newTitle = prompt("Edit title:", tickets[index].title);
  const newDesc = prompt("Edit description:", tickets[index].description);
  tickets[index] = { title: newTitle, description: newDesc };
  saveData("tickets", tickets);
  loadTickets();
}

function deleteTicket(index) {
  const tickets = getData("tickets");
  if (!confirm("Delete this ticket?")) return;
  tickets.splice(index, 1);
  saveData("tickets", tickets);
  loadTickets();
}

// === On Load Actions ===
document.addEventListener("DOMContentLoaded", () => {
  checkSession();

  // Login Page
  const loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();
      loginUser(email, password);
    });
  }

  // Dashboard logout button
  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);

  // Ticket Page
  const ticketForm = document.querySelector("#ticketForm");
  if (ticketForm) {
    ticketForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = e.target.title.value.trim();
      const description = e.target.description.value.trim();
      addTicket(title, description);
      e.target.reset();
    });
  }

  // Load tickets if on ticket page
  loadTickets();
});