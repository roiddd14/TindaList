import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  // CREATE PRODUCT (with user ownership + cookies)
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price || !newProduct.stock || !newProduct.category) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/products", {
      method: "POST",
      credentials: "include", // 🔥 sends the JWT cookie
      headers: {
        "Content-Type": "application/json",
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

  // FETCH USER-OWNED PRODUCTS ONLY
  fetchProducts: async () => {
    const res = await fetch("/api/products", {
      method: "GET",
      credentials: "include", // 🔥 important
    });

    const data = await res.json();
    if (data.success) {
      set({ products: data.data });
    }
  },

  // DELETE product (must be owned by logged-in user)
  deleteProduct: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
      credentials: "include", // 🔥
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      products: state.products.filter((product) => product._id !== pid),
    }));

    return { success: true, message: data.message };
  },

  // UPDATE product
  updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      credentials: "include", // 🔥
      headers: {
        "Content-Type": "application/json",
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

  // UPDATE stock only
  updateProductStock: async (productId, newStock) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      credentials: "include", // 🔥
      headers: {
        "Content-Type": "application/json",
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
