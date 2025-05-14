// const API_BASE = '/api';
// const token = localStorage.getItem('jwt'); // or however you store your JWT

// const headers = {
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${token}`
// };

// document.addEventListener('DOMContentLoaded', () => {
//   updateCartBadge();
//   loadCart();
//   document.getElementById('checkoutBtn').addEventListener('click', checkout);
// });

// function updateCartBadge() {
//   fetch(`${API_BASE}/cart/count`, { headers })
//     .then(res => res.json())
//     .then(count => {
//       const badge = document.querySelector('.cart-count');
//       badge.textContent = count;
//       badge.style.display = count > 0 ? 'inline-block' : 'none';
//     });
// }

// function loadCart() {
//   fetch(`${API_BASE}/cart/update`, { method: 'GET', headers })
//     .then(() => fetch(`${API_BASE}/cart/total`, { headers }))
//     .then(res => res.json())
//     .then(data => {
//       document.getElementById('totalFare').textContent = `₫${data.totalFare.toLocaleString()}`;
//     });

//   // (Optional) Fetch and show items — if you add a /cart/items endpoint
// }

// function checkout() {
//   fetch(`${API_BASE}/cart/checkout`, {
//     method: 'POST',
//     headers
//   })
//     .then(res => {
//       if (!res.ok) throw new Error("Payment failed");
//       return res.json();
//     })
//     .then(data => {
//       alert(`Payment successful! New balance: ₫${data.newBalance.toLocaleString()}`);
//       loadCart();
//       updateCartBadge();
//     })
//     .catch(err => alert(err.message));
// }

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  loadGuestCart();
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    alert("✅ Demo only: Payment flow disabled in guest mode.");
  });
});

function updateCartBadge() {
  const badge = document.querySelector('.cart-count');
  const cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
  badge.textContent = cart.length;
  badge.style.display = cart.length > 0 ? 'inline-block' : 'none';
}

function loadGuestCart() {
  const cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';

  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'card mb-3 text-dark';
    div.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${item.description?.split('\n')[0]}</h5>
        <p class="card-text">${item.description?.replace(/\n/g, '<br>')}</p>
        <button class="btn btn-sm btn-danger" data-index="${index}">Remove</button>
      </div>
    `;
    cartItems.appendChild(div);

    // Try to extract all prices in description (multi-line)
    const matches = [...item.description.matchAll(/(\d[\d,]*)đ/g)];
    matches.forEach(match => {
      const raw = match[1].replace(/,/g, '');
      total += parseInt(raw);
    });
  });

  document.getElementById('totalFare').textContent = `₫${total.toLocaleString()}`;

  // Add remove button behavior
  document.querySelectorAll('[data-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.splice(parseInt(btn.dataset.index), 1);
      localStorage.setItem('guestCart', JSON.stringify(cart));
      loadGuestCart();
      updateCartBadge();
    });
  });
}