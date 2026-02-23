const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const VaultService = {
  // Fetch items for a specific user
  getUserVault: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/vault/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch vault items");
    return response.json();
  },

  // NEW: Add an item to the vault
  // Matches the VaultRequest DTO in your Spring Boot app
  addToVault: async (userId, productId, customNote = "", metalPreference = "") => {
    const response = await fetch(`${API_BASE_URL}/api/vault/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        productId,
        customNote,
        metalPreference
      }),
    });

    if (response.status === 409) {
      throw new Error("This item is already in your vault!");
    }
    
    if (!response.ok) {
      throw new Error("Failed to add item to vault");
    }

    return response.ok;
  },

  // Remove an item
  removeFromVault: async (userId, productId) => {
    const response = await fetch(`${API_BASE_URL}/api/vault/remove?userId=${userId}&productId=${productId}`, {
      method: 'DELETE',
    });
    return response.ok;
  }
};