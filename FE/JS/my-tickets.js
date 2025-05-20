document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = initAuth();
    updateNavigation(isAuthenticated);
});

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('ticketHistoryContainer');

  try {
    const res = await fetch('http://localhost:8080/api/tickets/history', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    });

    const history = await res.json();

    container.innerHTML = '';

    history.forEach(ticket => {
        const card = document.createElement('div');
        card.className = 'ticket-card';

        card.innerHTML = `
        <h5>${ticket.ticketTypeCode || 'Unknown Ticket Type'}</h5>
        <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
        <p><strong>Route:</strong> ${ticket.fromStation || '—'} → ${ticket.toStation || '—'}</p>
        <p><strong>Purchased:</strong> ${formatTime(ticket.purchaseTime)}</p>
        <p><strong>Expires:</strong> ${formatTime(ticket.expiryTime)}</p>
        <span class="badge ${getStatusClass(ticket.status)}">${ticket.status}</span>
        ${ticket.status === 'INACTIVE' ? `
            <div class="mt-2">
            <button class="btn btn-sm btn-outline-warning activate-btn" data-id="${ticket.ticketId}">
                Activate
            </button>
            <div class="text-danger small mt-1" id="error-${ticket.ticketId}"></div>
            </div>
        ` : ''}
        `;


        container.appendChild(card);
        if (ticket.status === 'INACTIVE') {
            const activateBtn = card.querySelector('.activate-btn');
            activateBtn.addEventListener('click', async () => {
                const ticketId = activateBtn.dataset.id;

                try {
                const res = await fetch(`http://localhost:8080/api/tickets/${ticketId}/activate`, {
                    method: 'POST',
                    headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });

                if (!res.ok) {
                    const msg = await res.text();
                    document.getElementById(`error-${ticketId}`).textContent = msg || 'Activation failed';
                    return;
                }

                alert('✅ Ticket activated successfully!');
                location.reload();
                } catch (err) {
                console.error(err);
                document.getElementById(`error-${ticketId}`).textContent = err.message || 'Activation failed';
                }
            });
        }

    });

  } catch (err) {
    console.error("Error loading history:", err);
    container.innerHTML = `<p class="text-danger">❌ Failed to load ticket history.</p>`;
  }
});

function formatTime(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getDate()}/${date.getMonth()+1}/${String(date.getFullYear()).slice(-2)}`;
}

function getStatusClass(status) {
  switch (status) {
    case "ACTIVE": return "bg-success";
    case "EXPIRED": return "bg-warning text-dark";
    case "INACTIVE": return "bg-secondary";
    default: return "bg-dark";
  }
}
