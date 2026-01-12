import { apiFetch } from "./api";

export function getProducts({ page = 1, limit = 20 } = {}) {
    return apiFetch(`/products?page=${page}&limit=${limit}`);
}

export function getProductById(id) {
    return apiFetch(`/products/${id}`);
}
