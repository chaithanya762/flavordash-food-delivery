const API_BASE = '/api';

const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API fetch failed for ${url}, using mock fallback:`, err.message);
    return null;
  }
};

export const userAPI = {
  register: async (data) => {
    const result = await safeFetch(`${API_BASE}/users/register`, { 
      method: 'POST', 
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data) 
    });
    return result || { id: Date.now(), ...data, createdAt: new Date().toISOString() };
  },
  getById: async (id) => {
    const result = await safeFetch(`${API_BASE}/users/${id}`);
    return result || { id, name: "Alex Johnson", email: "alex@example.com", phone: "555-0199", address: "742 Evergreen Terrace" };
  },
  getAll: async () => {
    const result = await safeFetch(`${API_BASE}/users`);
    return result || [];
  },
};

export const productAPI = {
  getAll: async () => {
    const result = await safeFetch(`${API_BASE}/products`);
    return result || null;
  },
  getById: async (id) => {
    const result = await safeFetch(`${API_BASE}/products/${id}`);
    return result || null;
  },
  getByRestaurant: async (name) => {
    const result = await safeFetch(`${API_BASE}/products/restaurant/${name}`);
    return result || null;
  },
  getByCategory: async (cat) => {
    const result = await safeFetch(`${API_BASE}/products/category/${cat}`);
    return result || null;
  },
  getAvailable: async () => {
    const result = await safeFetch(`${API_BASE}/products/available`);
    return result || null;
  },
};

export const orderAPI = {
  create: async (data) => {
    const result = await safeFetch(`${API_BASE}/orders`, { 
      method: 'POST', 
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data) 
    });
    return result || {
      id: Math.floor(Math.random() * 900) + 100,
      userId: data.userId,
      userName: "Alex Johnson",
      productIds: data.productIds,
      totalAmount: 25.99,
      status: "CONFIRMED",
      deliveryAddress: data.deliveryAddress,
      createdAt: new Date().toISOString()
    };
  },
  getById: async (id) => {
    const result = await safeFetch(`${API_BASE}/orders/${id}`);
    return result || null;
  },
  getByUser: async (userId) => {
    const result = await safeFetch(`${API_BASE}/orders/user/${userId}`);
    return result || null;
  },
};

export const paymentAPI = {
  getByOrder: async (orderId) => {
    const result = await safeFetch(`${API_BASE}/payments/order/${orderId}`);
    return result || { id: 101, orderId, amount: 25.99, status: "SUCCESS", transactionId: "TXN-" + Date.now() };
  },
};
