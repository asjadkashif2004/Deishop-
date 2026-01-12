import { apiFetch } from "./api";

export function getCart() {
    return apiFetch(`/cart`);
}

export function addCartItem(payload) {
    // payload example: { productId, quantity, variantId? }
    return apiFetch(`/cart/items`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateCartItem(itemId, payload) {
    // payload example: { quantity }
    return apiFetch(`/cart/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function removeCartItem(itemId) {
    return apiFetch(`/cart/items/${itemId}`, { method: "DELETE" });
}
