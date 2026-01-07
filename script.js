/* =========================
   GLOBAL STATE
========================= */

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let totalExpense = 0;
let monthlyExpense = 0;
const categoryTotals = {};

/* =========================
   DOM ELEMENTS
========================= */

const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const noExpense = document.getElementById("no-expenses");

const totalExpenseEl = document.getElementById("total-expense");
const monthlyExpenseEl = document.getElementById("monthly-expense");
const topCategoryEl = document.getElementById("top-category");

/* =========================
   HELPER FUNCTIONS
========================= */

// Add single expense to history UI
function addExpenseToHistory({ id, description, amount, category, date }) {
  noExpense.style.display = "none";

  const expenseDiv = document.createElement("div");
  expenseDiv.classList.add("history-item");
  expenseDiv.dataset.id = id;

  expenseDiv.innerHTML = `
    <div class="history-details">
        <div class="description-item"><h2>${description}</h2></div>
        <div class="amount-item">₹${amount}</div>
        <div class="meta-info">
          <span class="category-item">${category}</span>
          <span class="date-item"><h3>${date}</h3></span>
        </div>
        <div class="delete-btn">
        <i class="fa-solid fa-trash-can"></i>
        </div>
    </div>
  `;

  expenseList.appendChild(expenseDiv);
}

// Update totals and top category
function updateStats({ amount, category, date }) {
  // Total Expense
  totalExpense += amount;
  totalExpenseEl.innerText = `₹${totalExpense}`;

  // Monthly Expense
  const expenseDate = new Date(date);
  const now = new Date();

  if (
    expenseDate.getMonth() === now.getMonth() &&
    expenseDate.getFullYear() === now.getFullYear()
  ) {
    monthlyExpense += amount;
    monthlyExpenseEl.innerText = `₹${monthlyExpense}`;
  }

  // Category Totals
  categoryTotals[category] = (categoryTotals[category] || 0) + amount;

  // Find top category
  let topCat = "No Data";
  let max = 0;

  for (let cat in categoryTotals) {
    if (categoryTotals[cat] > max) {
      max = categoryTotals[cat];
      topCat = cat;
    }
  }

  topCategoryEl.innerText = topCat;
}

// Reset all stats
function resetStats() {
  totalExpense = 0;
  monthlyExpense = 0;

  for (let key in categoryTotals) {
    delete categoryTotals[key];
  }

  totalExpenseEl.innerText = "₹0";
  monthlyExpenseEl.innerText = "₹0";
  topCategoryEl.innerText = "No Data";
}

// Rebuild entire UI from expenses array
function rebuildUI() {
  expenseList.innerHTML = "";
  resetStats();

  if (expenses.length === 0) {
    noExpense.style.display = "block";
    return;
  }

  expenses.forEach((exp) => {
    addExpenseToHistory(exp);
    updateStats(exp);
  });
}

/* =========================
   LOAD DATA ON PAGE LOAD
========================= */

rebuildUI();

/* =========================
   ADD EXPENSE
========================= */

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = document.getElementById("description").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!description || !amount || !category || !date) {
    alert("Please fill all the info!");
    return;
  }

  const expense = {
    id: Date.now() + Math.random(),
    description,
    amount,
    category,
    date,
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  addExpenseToHistory(expense);
  updateStats(expense);

  form.reset();
});

/* =========================
   DELETE EXPENSE
========================= */

expenseList.addEventListener("click", function (e) {
  console.log("Clicked element:", e.target);

  const deleteBtn = e.target.closest(".delete-btn");
  console.log("Delete button:", deleteBtn);

  if (!deleteBtn) return;

  const expenseItem = deleteBtn.closest(".history-item");
  console.log("Expense item:", expenseItem);
  console.log("Dataset:", expenseItem?.dataset);

  if (!expenseItem) return;

  const expenseId = Number(expenseItem.dataset.id);
  console.log("Deleting expense ID:", expenseId);

  // Remove from array
  expenses = expenses.filter((exp) => exp.id !== expenseId);

  // Save to localStorage
  localStorage.setItem("expenses", JSON.stringify(expenses));

  // Rebuild entire UI
  rebuildUI();
});
