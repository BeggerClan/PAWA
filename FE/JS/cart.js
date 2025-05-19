document.addEventListener('DOMContentLoaded', () => {
  const isAuthenticated = initAuth();
  updateNavigation(isAuthenticated);

  renderCart();
  updateCartBadge();
});

function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-container');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info">
        Your cart is empty. <a href="metro-lines.html">Browse tickets</a>.
      </div>
    `;
    return;
  }

  const table = document.createElement('table');
  table.className = 'table table-bordered';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Ticket</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Subtotal</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      ${cart.map(item => `
        <tr data-code="${item.code}">
          <td>${item.name}</td>
          <td>${item.price.toLocaleString('vi-VN')}đ</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-sm btn-outline-secondary decrease-btn" data-code="${item.code}">−</button>
              <span class="fw-bold">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary increase-btn" data-code="${item.code}">+</button>
            </div>
          </td>
          <td>${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
          <td><button class="btn btn-sm btn-danger remove-btn">Remove</button></td>
        </tr>
      `).join('')}
    </tbody>
  `;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const summary = document.createElement('div');
  summary.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mt-3">
      <h4>Total: <span class="text-success">${total.toLocaleString('vi-VN')}đ</span></h4>
      <div>
        <button class="btn btn-outline-danger btn-sm me-2" id="clear-cart">Clear All</button>
        <button class="btn btn-primary btn-sm" id="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  `;

  container.appendChild(table);
  container.appendChild(summary);

  // Remove buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.closest('tr').dataset.code;
      removeFromCart(code);
    });
  });

  // Increase quantity
  document.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      updateQuantity(code, +1);
    });
  });

  // Decrease quantity
  document.querySelectorAll('.decrease-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      updateQuantity(code, -1);
    });
  });

  // Clear All
  document.getElementById('clear-cart').addEventListener('click', () => {
    if (confirm('Clear all items from cart?')) {
      localStorage.removeItem('cart');
      renderCart();
    }
  });

  // Checkout button handler (inside renderCart!)
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const payload = {
      items: cart.map(item => ({
        code: item.code,
        quantity: item.quantity
      }))
    };

    const token = sessionStorage.getItem('jwtToken');
    let method = 'stripe';

    if (token) {
      const choice = prompt("Choose payment method: 'wallet' or 'stripe'").toLowerCase();
      if (choice === 'wallet') {
        method = 'wallet';
      } else if (choice === 'stripe') {
        method = 'stripe';
      } else {
        alert('Invalid method. Try again.');
        return;
      }
    }

    // Add fake token for Stripe
    if (method === 'stripe') {
      payload.paymentToken = 'test-token';
    }

    const endpoint =
      method === 'wallet'
        ? 'http://localhost:8080/api/tickets/purchase-cart'
        : 'http://localhost:8080/api/payments/tickets';

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(`Checkout failed: ${res.status} ${error}`);
        }
        return res.json();
      })
      .then(data => {
        alert('Purchase successful!');
        localStorage.removeItem('cart');
        renderCart();
        updateCartBadge?.();
      })
      .catch(err => {
        alert(err.message);
        console.error(err);
      });
  });
}

function removeFromCart(code) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.code !== code);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartBadge?.(); // optional if used
}

function updateQuantity(code, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex(item => item.code === code);
  if (index === -1) return;

  cart[index].quantity += delta;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1); // remove if quantity hits 0
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartBadge?.();
}

// Update cart badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update all elements with class 'cart-count'
  document.querySelectorAll('.cart-count').forEach(badge => {
    badge.textContent = totalQty;
  });
}
