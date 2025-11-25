import { create } from "zustand";

const API = import.meta.env.VITE_API_URL;

// helper to get token
const getToken = () => localStorage.getItem("token");

export const useProductStore = create((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  // CREATE PRODUCT
  createProduct: async (newProduct) => {
    if (
      !newProduct.name ||
      !newProduct.image ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.category
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const token = getToken();

    const res = await fetch(`${API}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(newProduct),
    });

    const data = await res.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }

    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product created successfully" };
  },

  // FETCH PRODUCTS
  fetchProducts: async () => {
    const token = getToken();

    const res = await fetch(`${API}/api/products`, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await res.json();
    if (data.success) set({ products: data.data });
  },

  // DELETE PRODUCT
  deleteProduct: async (pid) => {
    const token = getToken();

    const res = await fetch(`${API}/api/products/${pid}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      products: state.products.filter((product) => product._id !== pid),
    }));

    return { success: true, message: data.message };
  },

  // UPDATE PRODUCT
  updateProduct: async (pid, updatedProduct) => {
    const token = getToken();

    const res = await fetch(`${API}/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(updatedProduct),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      products: state.products.map((product) =>
        product._id === pid ? data.data : product
      ),
    }));

    return { success: true, message: data.message };
  },

  // UPDATE STOCK ONLY
  updateProductStock: async (productId, newStock) => {
    const token = getToken();

    const res = await fetch(`${API}/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ stock: newStock }),
    });

    const data = await res.json();

    if (data.success) {
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId ? { ...product, stock: newStock } : product
        ),
      }));
    }

    return data;
  },
}));
