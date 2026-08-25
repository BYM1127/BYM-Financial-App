const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// A mock token function. In a real app with Supabase Auth, you'd get the session token here.
const getAuthHeaders = () => {
  // For local testing before Supabase UI login is built, we might bypass or mock this
  return {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
  };
};

export const api = {
  async parseTransaction(raw_text) {
    const res = await fetch(`${API_URL}/transactions/parse`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ raw_text })
    });
    if (!res.ok) throw new Error('Failed to parse');
    return res.json();
  },

  async saveTransaction(data) {
    const res = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save');
    return res.json();
  },

  async getTransactions(startDate, endDate) {
    const url = new URL(`${API_URL}/transactions`);
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);
    
    const res = await fetch(url.toString(), {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  async updateTransaction(id, updates) {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
  },

  async deleteTransaction(id) {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete');
    return res.json();
  }
};
