let selectedTicketCode = null;
let isOneWay = false;
let selectedPurchaseQty = 1;

let selectedCartTicket = null;
let selectedCartQty = 1;

// metro-lines.js - Simple implementation focusing on I.PA.3 requirements

document.addEventListener("DOMContentLoaded", function () {
    // ─── Stripe.js setup ───────────────────────────────────────────────────────
    const stripe   = Stripe('pk_test_51JH5tPGf0p0OT9IpPNHREFmHvGymO5yEaSrCNNCgsSdyiv7RRpPdRCx1doM4HzH1c83GuXJV7aTqJkq1DRYqR2jl00FVUzlo6z');  // ← your publishable key
    const elements = stripe.elements();
    let card;      // will hold our mounted Card element

    // When the purchase modal opens, mount Stripe’s Card UI once:
    const ticketModalEl = document.getElementById('ticketPurchaseModal');
    ticketModalEl.addEventListener('shown.bs.modal', () => {
        if (card) return;  // only mount once

        const style = {
        base: {
            fontSize: '16px',
            color: '#495057',
            '::placeholder': { color: '#6c757d' }
        }
        };

        card = elements.create('card', { style });
        card.mount('#card-element');

        // show real-time validation errors
        card.on('change', e => {
        document.getElementById('card-errors').textContent = e.error?.message || '';
        });
    });
    const purchaseBtn = document.getElementById('stripePurchaseBtn');
    purchaseBtn.addEventListener('click', async () => {
    purchaseBtn.disabled = true;
    document.getElementById('purchaseFeedback').textContent = '';
    document.getElementById('card-errors').textContent = '';

    // 1) Tokenize
    const { token, error } = await stripe.createToken(card);
    if (error) {
        document.getElementById('card-errors').textContent = error.message;
        purchaseBtn.disabled = false;
        return;
    }

    // 2) Compute amount & build payload
    const amount = selectedPurchaseQty * selectedTicketPrice;
    const payload = {
        amount,
        paymentToken: token.id,
        ticketTypeCode: selectedTicketCode,
        fromStation: isOneWay ? document.getElementById('modalFromStation').value : null,
        toStation:   isOneWay ? document.getElementById('modalToStation').value   : null
    };

    // 3) Build headers (include JWT if logged in)
    const headers = {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('jwtToken') && {
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        })
    };

    try {
        // 4) Fetch as text
        const res  = await fetch('http://localhost:8080/api/payments/tickets/direct', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
        });
        const text = await res.text();

        // 5) Handle non-2xx
        if (!res.ok) {
        let msg;
        try {
            msg = JSON.parse(text).reason || text;
        } catch {
            msg = text || res.statusText;
        }
        throw new Error(msg);
        }

        // 6) Safe JSON parse
        const body = text ? JSON.parse(text) : {};

        // ─── APPROACH 2: replace modal content instead of redirect ────────────────
        const modalContent = ticketModalEl.querySelector('.modal-content');
        modalContent.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Purchase Confirmed</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
            <p>🎉 Thank you for your purchase!</p>
            <p>Your ticket ID is <strong>${body.ticketId}</strong>.</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
        </div>
        `;
        // ───────────────────────────────────────────────────────────────────────────

    } catch (err) {
        document.getElementById('purchaseFeedback').textContent = err.message;
        purchaseBtn.disabled = false;
    }
    });
    // Check if user is logged in
    const isAuthenticated = localStorage.getItem("jwtToken") !== null;

    // Update navigation based on authentication status
    updateNavigation(isAuthenticated);

    // Fetch metro lines from OPWA API
    fetchMetroLines();
});

/**
 * Updates the navigation menu based on authentication status
 * @param {boolean} isAuthenticated - Whether user is logged in
 */
function updateNavigation(isAuthenticated) {
  const authMenu = document.querySelector(".auth-menu");
  const guestMenu = document.querySelector(".guest-menu");

  if (authMenu && guestMenu) {
    authMenu.style.display = isAuthenticated ? "flex" : "none";
    guestMenu.style.display = isAuthenticated ? "none" : "flex";
  }
}

/**
 * Fetches metro lines data from OPWA API
 */
async function fetchMetroLines() {
  // Get the container element
  const container = document.getElementById("metro-lines-container");

  try {
    // Fetch metro lines from OPWA API using the correct endpoint
    const response = await fetch(
      "http://localhost:8081/api/metro-lines/full-details"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch metro lines: ${response.status}`);
    }

    const metroLines = await response.json();
    console.log("Metro lines data:", metroLines); // Log the response for debugging

    // Clear the loading spinner
    container.innerHTML = "";

    // Display the metro lines
    if (!metroLines || metroLines.length === 0) {
      container.innerHTML = `<div class="alert alert-info">No metro lines available.</div>`;
    } else {
      displayMetroLines(metroLines, container);
    }
  } catch (error) {
    console.error("Error fetching metro lines:", error);

    // Show error message
    container.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Unable to load metro lines. Please try again later.
                <br>
                <small>${error.message}</small>
            </div>
        `;
  }
}

/**
 * Displays the metro lines in the container
 * @param {Array} metroLines - Array of metro line objects
 * @param {HTMLElement} container - Container to display the metro lines
 */
function displayMetroLines(metroLines, container) {
  metroLines.forEach((line) => {
    // Create a card for each metro line
    const card = document.createElement("div");
    card.className = "metro-card";

    // Get first and last station (if stations array is available)
    let firstStation = "First Station";
    let lastStation = "Last Station";
    let totalStations = line.stationIds ? line.stationIds.length : 0;

    if (line.stations && line.stations.length > 0) {
      firstStation = line.stations[0].stationName;
      lastStation = line.stations[line.stations.length - 1].stationName;
      totalStations = line.stations.length;
    }

    // Determine line status
    const isActive = line.active !== false;
    const isSuspended = line.suspended === true;

    let statusBadge = "";
    if (isSuspended) {
      statusBadge = `<span class="status-badge status-suspended">Suspended</span>`;
    } else if (isActive) {
      statusBadge = `<span class="status-badge status-operational">Operational</span>`;
    } else {
      statusBadge = `<span class="status-badge status-inactive">Inactive</span>`;
    }

    // Determine line color based on name or ID
    let lineBadgeColor = "primary-blue";
    if (line.lineName && line.lineName.toLowerCase().includes("red")) {
      lineBadgeColor = "danger";
    } else if (line.lineName && line.lineName.toLowerCase().includes("blue")) {
      lineBadgeColor = "primary";
    }

    // Create the card header with line name
    const cardHeader = document.createElement("div");
    cardHeader.className = "metro-card-header";
    cardHeader.innerHTML = `<i class="fas fa-subway me-2"></i>${
      line.lineName || "Metro Line"
    }`;

    // Create the card body with line details
    const cardBody = document.createElement("div");
    cardBody.className = "metro-card-body";

    // Add line information
    cardBody.innerHTML = `
            <div class="metro-info-row">
                <div class="metro-info-label">Status:</div>
                <div class="metro-info-value">${statusBadge}</div>
            </div>
            <div class="metro-info-row">
                <div class="metro-info-label">First Station:</div>
                <div class="metro-info-value">${firstStation}</div>
            </div>
            <div class="metro-info-row">
                <div class="metro-info-label">Last Station:</div>
                <div class="metro-info-value">${lastStation}</div>
            </div>
            <div class="metro-info-row">
                <div class="metro-info-label">Total Duration:</div>
                <div class="metro-info-value">${
                  line.totalDuration || "N/A"
                } minutes</div>
            </div>
            <div class="metro-info-row">
                <div class="metro-info-label">Total Stations:</div>
                <div class="metro-info-value">${totalStations}</div>
            </div>
            
            ${
              isSuspended
                ? `
            <div class="metro-info-row">
                <div class="metro-info-label">Suspension Reason:</div>
                <div class="metro-info-value">${
                  line.suspensionReason || "Maintenance"
                }</div>
            </div>
            `
                : ""
            }
            
            <button class="btn btn-outline-primary mt-3 toggle-stations-btn">
                <i class="fas fa-list me-2"></i>View Stations
            </button>
            
            <div class="station-list">
                ${generateStationList(line)}
            </div>
        `;

    // Append the header and body to the card
    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    // Append the card to the container
    container.appendChild(card);

    // Add event listener to the toggle button
    const toggleBtn = cardBody.querySelector(".toggle-stations-btn");
    const stationList = cardBody.querySelector(".station-list");

    toggleBtn.addEventListener("click", function () {
      // Toggle the display of station list with animation
      if (!stationList.classList.contains("show")) {
        stationList.classList.add("show");
        toggleBtn.innerHTML = '<i class="fas fa-times me-2"></i>Hide Stations';
        toggleBtn.classList.add("active");
      } else {
        stationList.classList.remove("show");
        toggleBtn.innerHTML = '<i class="fas fa-list me-2"></i>View Stations';
        toggleBtn.classList.remove("active");
      }
    });
  });
}

/**
 * Generates HTML for the station list
 * @param {Object} metroLine - Metro line object
 * @returns {string} - HTML for the station list
 */
function generateStationList(metroLine) {
  // Check for stations array in the full-details format
  if (metroLine.stations && metroLine.stations.length > 0) {
    return metroLine.stations
      .map(
        (station, index) => `
            <div class="station-item">
                <strong>${index + 1}.</strong> ${station.stationName}
            </div>
        `
      )
      .join("");
  }
  // Fallback to stationIds if stations array is not available
  else if (metroLine.stationIds && metroLine.stationIds.length > 0) {
    return metroLine.stationIds
      .map(
        (stationId, index) => `
            <div class="station-item">
                <strong>${index + 1}.</strong> Station ${stationId}
            </div>
        `
      )
      .join("");
  } else {
    return '<div class="alert alert-info mt-3">No stations available for this line.</div>';
  }
}


// TICKET TYPE
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderTicketTypes();
    updateCartBadge();
});

document.addEventListener('DOMContentLoaded', fetchAndRenderTicketTypes);

async function fetchAndRenderTicketTypes() {
    const container = document.querySelector('.ticket-types');
    if (!container) return;

    try {
        const response = await fetch('http://localhost:8080/api/ticket-types', {
            credentials: 'include'
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Status ${response.status}: ${text}`);
        }

        const ticketTypes = await response.json();
        container.innerHTML = '';

        ticketTypes.forEach(ticket => {
            const card = document.createElement('div');
            card.className = 'ticket-type mb-4';

            const isOneWayType = ticket.code.startsWith("ONE_WAY");

            card.innerHTML = `
                <h5>${ticket.displayName}</h5>
                <p>Valid for ${ticket.validityDurationHours} hours after ${ticket.validFrom.toLowerCase()}.</p>
                <div class="d-flex justify-content-between align-items-center text-white">
                <div><strong>${ticket.price.toLocaleString('vi-VN')}đ</strong></div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm add-to-cart-btn">
                    <i class="fas fa-cart-plus"></i>
                    </button>
                    <button class="btn btn-outline-success btn-sm purchase-btn">
                    Purchase
                    </button>
                </div>
                </div>
            `;

            container.appendChild(card);

            // Add to cart
            card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                selectedCartTicket = ticket;
                selectedCartQty = 1;

                document.getElementById('cartTicketLabel').textContent = `Selected: ${ticket.displayName}`;
                document.getElementById('cartQuantity').textContent = selectedCartQty;
                document.getElementById('cartFeedback').textContent = '';

                const cartModal = new bootstrap.Modal(document.getElementById('addToCartModal'));
                cartModal.show();
            });

            // Handle purchase modal trigger
            card.querySelector('.purchase-btn').addEventListener('click', () => {
                selectedTicketCode = ticket.code;
                selectedPurchaseQty = 1;
                document.getElementById('purchaseQty').textContent = selectedPurchaseQty;

                isOneWay = isOneWayType;

                // Update modal UI
                document.getElementById('ticketTypeLabel').textContent = `Selected: ${ticket.displayName}`;
                document.getElementById('fromToFields').style.display = isOneWay ? 'block' : 'none';

                if (isOneWay) {
                    const fromTripSelect = document.getElementById('from-station');
                    const toTripSelect = document.getElementById('to-station');

                    const modalFromSelect = document.getElementById('modalFromStation');
                    const modalToSelect = document.getElementById('modalToStation');

                    // Copy options from trip select to modal select
                    modalFromSelect.innerHTML = [...fromTripSelect.options]
                    .map(opt => `<option value="${opt.value}">${opt.textContent}</option>`)
                    .join('');

                    modalToSelect.innerHTML = [...toTripSelect.options]
                    .map(opt => `<option value="${opt.value}">${opt.textContent}</option>`)
                    .join('');


                    // Apply selected values from trip search
                    if (fromTripSelect.value) {
                        modalFromSelect.value = fromTripSelect.value;
                    }
                    if (toTripSelect.value) {
                        modalToSelect.value = toTripSelect.value;
                    }
                }

                const modal = new bootstrap.Modal(document.getElementById('ticketPurchaseModal'));
                modal.show();
            });
        });
    } catch (error) {
        console.error('Error fetching ticket types:', error);
        container.innerHTML = `<p class="text-danger">Unable to load ticket types. (${error.message})</p>`;
    }
}

  

// Add to cart
function addToCart(ticket) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const index = cart.findIndex(item => item.code === ticket.code);
    if (index !== -1) {
        cart[index].quantity += 1;
    } else {
        cart.push({
            code: ticket.code,
            name: ticket.displayName,
            price: ticket.price,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
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

document.getElementById('walletPurchaseBtn').addEventListener('click', () => {
  if (!isLoggedIn()) {
    if (confirm("You need to sign in to use eWallet. Redirect to sign in?")) {
      window.location.href = "signin.html";
    }
    return;
  }

  submitPurchase('EWALLET');
});

document.getElementById('stripePurchaseBtn').addEventListener('click', () => {
    submitPurchase('STRIPE');
});

async function submitPurchase(paymentMode) {
  if (!selectedTicketCode) {
    alert("No ticket selected.");
    return;
  }

  const fromStation = isOneWay ? document.getElementById('modalFromStation').value : null;
  const toStation = isOneWay ? document.getElementById('modalToStation').value : null;

  const modal = bootstrap.Modal.getInstance(document.getElementById('ticketPurchaseModal'));
  document.getElementById('purchaseFeedback').textContent = "";

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < selectedPurchaseQty; i++) {
    const response = await fetch(`http://localhost:8080/api/tickets/purchase?ticketTypeCode=${selectedTicketCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({
        fromStation,
        toStation,
        paymentMode,
        freeRide: false
      })
    });

    if (response.ok) {
      successCount++;
    } else {
      failureCount++;
      const text = await response.text();
      console.error(`❌ Purchase ${i + 1} failed:`, text);
    }
  }

  if (successCount > 0) {
    modal.hide();
    alert(`✅ Successfully purchased ${successCount} ticket(s).`);
  }

  if (failureCount > 0) {
    document.getElementById('purchaseFeedback').textContent =
      `⚠️ ${failureCount} ticket(s) failed to purchase. Check console for details.`;
  }
}

document.getElementById('increaseQty').addEventListener('click', () => {
    selectedCartQty++;
    document.getElementById('cartQuantity').textContent = selectedCartQty;
});

document.getElementById('decreaseQty').addEventListener('click', () => {
    if (selectedCartQty > 1) {
        selectedCartQty--;
        document.getElementById('cartQuantity').textContent = selectedCartQty;
    }
});

document.getElementById('confirmAddToCart').addEventListener('click', () => {
    if (!selectedCartTicket) {
        document.getElementById('cartFeedback').textContent = "No ticket selected.";
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.code === selectedCartTicket.code);

    if (index !== -1) {
        cart[index].quantity += selectedCartQty;
    } else {
        cart.push({
        code: selectedCartTicket.code,
        name: selectedCartTicket.displayName,
        price: selectedCartTicket.price,
        quantity: selectedCartQty
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();

    const modal = bootstrap.Modal.getInstance(document.getElementById('addToCartModal'));
    modal.hide();

    // Optional: alert or toast
    alert("✅ Ticket added to cart.");
});

document.getElementById('increasePurchaseQty').addEventListener('click', () => {
  selectedPurchaseQty++;
  document.getElementById('purchaseQty').textContent = selectedPurchaseQty;
});

document.getElementById('decreasePurchaseQty').addEventListener('click', () => {
  if (selectedPurchaseQty > 1) {
    selectedPurchaseQty--;
    document.getElementById('purchaseQty').textContent = selectedPurchaseQty;
  }
});
