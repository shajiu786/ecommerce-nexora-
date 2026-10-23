import axios from "axios";

export const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 12000,
  headers: { Accept: "application/json" }
});

export async function fetchProducts({ limit = 20, skip = 0, signal } = {}) {
  const { data } = await api.get("/products", { params: { limit, skip }, signal });
  return data;
}
export async function fetchAllProducts(signal) {
  return fetchProducts({ limit: 0, skip: 0, signal });
}
export async function fetchProduct(id, signal) {
  const { data } = await api.get(`/products/${encodeURIComponent(id)}`, { signal });
  return data;
}
export async function searchProducts(query, signal) {
  const { data } = await api.get("/products/search", { params: { q: query, limit: 0 }, signal });
  return data;
}
export async function fetchCategories(signal) {
  const { data } = await api.get("/products/categories", { signal });
  return data;
}
export async function fetchCategoryProducts(category, signal) {
  const { data } = await api.get(`/products/category/${encodeURIComponent(category)}`, { params: { limit: 0 }, signal });
  return data;
}
