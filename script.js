let cart = [];
let total = 0;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addItem() {
    let itemName = document.getElementById("itemName").value;
    let itemPrice = parseFloat(document.getElementById("itemPrice").value);
    let itemQty = parseInt(document.getElementById("itemQty").value);

    if (!itemName || itemPrice <= 0 || itemQty <= 0) {
        alert("Please enter valid details!");
        return;
    }

    let itemTotal = itemPrice * itemQty;
    cart.push({ name: itemName, price: itemPrice, qty: itemQty, total: itemTotal });

    updateCart();
}

function updateCart() {
    let tableBody = document.querySelector("#cart tbody");
    tableBody.innerHTML = "";
    total = 0;

    cart.forEach((item, index) => {
        total += item.total;
        tableBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>$${item.total.toFixed(2)}</td>
                <td><button onclick="removeItem(${index})">Remove</button></td>
            </tr>
        `;
    });

    document.getElementById("totalPrice").innerText = total.toFixed(2);
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let transaction = {
        date: new Date().toLocaleString(),
        amount: total.toFixed(2),
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    alert(`Total amount to pay: $${total.toFixed(2)}`);

    cart = [];
    updateCart();
    displayHistory();
}

function displayHistory() {
    let historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "<h3>Transaction History</h3>";

    if (transactions.length === 0) {
        historyDiv.innerHTML += "<p>No transactions yet.</p>";
    } else {
        transactions.forEach((t, index) => {
            historyDiv.innerHTML += `<p>#${index + 1} - ${t.date}: <b>$${t.amount}</b></p>`;
        });
    }
}

// Load history on page load
window.onload = displayHistory;
function clearHistory() {
    if (confirm("Are you sure you want to delete all transaction history?")) {
        localStorage.removeItem("transactions");
        transactions = [];
        displayHistory();
    }
}
function showModal() {
    document.getElementById("confirmModal").style.display = "block";
}

function closeModal() {
    document.getElementById("confirmModal").style.display = "none";
}

function confirmClear() {
    localStorage.removeItem("transactions");
    transactions = [];
    displayHistory();
    closeModal();
}

// Optional: Close modal if user clicks outside of it
window.onclick = function(event) {
    let modal = document.getElementById("confirmModal");
    if (event.target == modal) {
        closeModal();
    }
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}
