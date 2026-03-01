const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const VaultService = {
  // 1. Fetch items for the logged-in user (Backend gets identity from token)
  getUserVault: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/vault`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // THE KEY CHANGE
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401 || response.status === 403) {
      throw new Error("Session expired");
    }
    if (!response.ok) throw new Error("Failed to fetch vault items");
    return response.json();
  },

  // 2. Add an item to the vault
  addToVault: async (productId, token, customNote = "", metalPreference = "") => {
    // SECURITY CHANGE: We no longer send userId. 
    const response = await fetch(`${API_BASE_URL}/api/vault/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // MANDATORY FOR SECURITY
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId, // Backend identifies User from the JWT
        customNote,
        metalPreference
      }),
    });

    if (response.status === 409) {
      throw new Error("This item is already in your vault!");
    }
    
    if (response.status === 403) {
      throw new Error("Security Error: 403 Forbidden. Check your token format.");
    }

    if (!response.ok) {
      throw new Error("Failed to add item to vault");
    }

    return response.ok;
  },

  // 3. Remove an item
  removeFromVault: async (productId, token) => {
    // SECURITY CHANGE: Remove userId from query params
    const response = await fetch(`${API_BASE_URL}/api/vault/remove?productId=${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error("Failed to remove item");
    return response.ok;
  }
};