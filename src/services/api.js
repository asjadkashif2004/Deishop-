// src/services/api.js
import { fakeProducts, fakeCart, fakeReviewsByProductId } from "./fakeData";

// Contract says Base URL: /api/v1
const DEFAULT_BASE = "http://localhost:3000/api/v1";
const RAW_BASE = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;
const BASE_URL = RAW_BASE.replace(/\/+$/, ""); // trim trailing slash

// Token handling (JWT Bearer)
const TOKEN_KEY = "DEISHOP_TOKEN";

// Fake persistence (fallback mode)
const LS_CART_KEY = "DEISHOP_FAKE_CART_V1";
const LS_REVIEWS_KEY = "DEISHOP_FAKE_REVIEWS_V1";

export const auth = {
    getToken() {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch {
            return null;
        }
    },
    setToken(token) {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch {
            // ignore
        }
    },
    clearToken() {
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch {
            // ignore
        }
    },
};

/** -------- core fetch helper (JSON + consistent errors + timeout) -------- */
export async function apiFetch(path, options = {}) {
    const url = `${BASE_URL}${path}`;

    const {
        timeout = 12000,
        headers,
        signal,
        // if you ever want to disable auth header for a call:
        withAuth = true,
        ...rest
    } = options;

    const controller = !signal ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeout) : null;

    try {
        const token = withAuth ? auth.getToken() : null;

        const res = await fetch(url, {
            ...rest,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(headers || {}),
            },
            signal: signal || controller?.signal,
        });

        if (!res.ok) {
            let body = null;
            try {
                body = await res.json();
            } catch {
                // ignore
            }

            // doc shows error can be {error, message}
            const message =
                body?.message ||
                body?.error?.message ||
                `Request failed: ${res.status} ${res.statusText}`;

            const err = new Error(message);
            err.status = res.status;
            err.body = body;
            throw err;
        }

        const text = await res.text();
        return text ? JSON.parse(text) : null;
    } finally {
        if (timer) clearTimeout(timer);
    }
}

/** -------- fallback wrapper -------- */
async function withFallback(label, fn, fallback) {
    try {
        return await fn();
    } catch (err) {
        console.warn(`[API FALLBACK] ${label}`, err);
        return typeof fallback === "function" ? fallback(err) : fallback;
    }
}

/** -------- small utils -------- */
function clone(obj) {
    try {
        return structuredClone(obj);
    } catch {
        return JSON.parse(JSON.stringify(obj));
    }
}

function toQuery(params = {}) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        q.set(k, String(v));
    });
    const s = q.toString();
    return s ? `?${s}` : "";
}

/** ------------------ FAKE MODE STORAGE ------------------ */

function readFakeCart() {
    try {
        const raw = localStorage.getItem(LS_CART_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        // ignore
    }
    return clone(fakeCart);
}

function writeFakeCart(cart) {
    try {
        localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
    } catch {
        // ignore
    }
}

function readFakeReviewsMap() {
    try {
        const raw = localStorage.getItem(LS_REVIEWS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        // ignore
    }
    return clone(fakeReviewsByProductId);
}

function writeFakeReviewsMap(map) {
    try {
        localStorage.setItem(LS_REVIEWS_KEY, JSON.stringify(map));
    } catch {
        // ignore
    }
}

/**
 * Optional: recompute cart totals if your UI needs it.
 * If your backend returns totals already, UI can ignore these fields.
 */
function recomputeCart(cart) {
    const items = Array.isArray(cart.items) ? cart.items : [];
    let totalQty = 0;
    let totalPrice = 0;

    for (const it of items) {
        const qty = Number(it.quantity || 0);
        totalQty += qty;

        // cart uses product_variant_id in contract
        const variantId = String(it.product_variant_id);
        const product = fakeProducts.find((p) =>
            (p.variants || []).some((v) => String(v.id) === variantId)
        );

        const variant =
            product?.variants?.find((v) => String(v.id) === variantId) || null;

        const price = Number(variant?.price ?? product?.price ?? 0);
        totalPrice += price * qty;
    }

    return { ...cart, totalQty, totalPrice };
}

/** ================== PRODUCTS ================== */

export const productsApi = {
    /**
     * GET /products
     * Query params supported in doc: search, category_id, min_price, max_price, page, limit
     */
    list(params = {}) {
        return withFallback(
            `GET /products${toQuery(params)}`,
            () => apiFetch(`/products${toQuery(params)}`, { withAuth: true }),
            () => {
                // lightweight local filtering to match params
                let items = clone(fakeProducts);

                const search = (params.search || "").toLowerCase();
                if (search) {
                    items = items.filter(
                        (p) =>
                            String(p.name || p.title || "")
                                .toLowerCase()
                                .includes(search) ||
                            String(p.description || "").toLowerCase().includes(search)
                    );
                }

                if (params.category_id != null) {
                    items = items.filter(
                        (p) => String(p.category_id) === String(params.category_id)
                    );
                }

                const min = params.min_price != null ? Number(params.min_price) : null;
                const max = params.max_price != null ? Number(params.max_price) : null;

                if (min != null || max != null) {
                    items = items.filter((p) => {
                        const basePrice = Number(p.price ?? 0);
                        const okMin = min == null ? true : basePrice >= min;
                        const okMax = max == null ? true : basePrice <= max;
                        return okMin && okMax;
                    });
                }

                const page = Number(params.page || 1);
                const limit = Number(params.limit || items.length || 10);
                const start = (page - 1) * limit;

                return {
                    data: items.slice(start, start + limit),
                    meta: { page, limit, total: items.length },
                };
            }
        );
    },

    /** GET /products/{id} */
    getById(id) {
        return withFallback(
            `GET /products/${id}`,
            () => apiFetch(`/products/${id}`, { withAuth: true }),
            () => clone(fakeProducts.find((p) => String(p.id) === String(id)) || null)
        );
    },
};

/** ================== CART ================== */

export const cartApi = {
    /** GET /cart */
    get() {
        return withFallback(
            "GET /cart",
            () => apiFetch("/cart", { withAuth: true }),
            () => recomputeCart(readFakeCart())
        );
    },

    /**
     * POST /cart/items
     * Body: { product_variant_id, quantity }
     */
    addItem(product_variant_id, quantity = 1) {
        return withFallback(
            "POST /cart/items",
            () =>
                apiFetch("/cart/items", {
                    method: "POST",
                    body: JSON.stringify({ product_variant_id, quantity }),
                    withAuth: true,
                }),
            () => {
                const cart = readFakeCart();
                cart.items = Array.isArray(cart.items) ? cart.items : [];

                const existing = cart.items.find(
                    (it) => String(it.product_variant_id) === String(product_variant_id)
                );

                if (existing) {
                    existing.quantity = Number(existing.quantity || 0) + Number(quantity);
                } else {
                    cart.items.push({
                        id: crypto.randomUUID?.() || String(Date.now()),
                        product_variant_id,
                        quantity: Number(quantity),
                    });
                }

                const next = recomputeCart(cart);
                writeFakeCart(next);
                return next;
            }
        );
    },

    /**
     * PUT /cart/items/{id}
     * Body: { quantity }
     */
    updateQuantity(cartItemId, quantity) {
        return withFallback(
            `PUT /cart/items/${cartItemId}`,
            () =>
                apiFetch(`/cart/items/${cartItemId}`, {
                    method: "PUT",
                    body: JSON.stringify({ quantity }),
                    withAuth: true,
                }),
            () => {
                const cart = readFakeCart();
                cart.items = Array.isArray(cart.items) ? cart.items : [];

                const idx = cart.items.findIndex(
                    (it) => String(it.id) === String(cartItemId)
                );

                if (idx >= 0) {
                    const q = Number(quantity);
                    if (q <= 0) cart.items.splice(idx, 1);
                    else cart.items[idx].quantity = q;
                }

                const next = recomputeCart(cart);
                writeFakeCart(next);
                return next;
            }
        );
    },

    /** POST /cart/apply-coupon  Body: { code } */
    applyCoupon(code) {
        return withFallback(
            "POST /cart/apply-coupon",
            () =>
                apiFetch("/cart/apply-coupon", {
                    method: "POST",
                    body: JSON.stringify({ code }),
                    withAuth: true,
                }),
            () => {
                // Fake behavior: just store the coupon on cart object
                const cart = readFakeCart();
                const next = recomputeCart({ ...cart, coupon: code });
                writeFakeCart(next);
                return next;
            }
        );
    },

    /** POST /checkout  Body: { address_id, payment_method } */
    checkout({ address_id, payment_method }) {
        return withFallback(
            "POST /checkout",
            () =>
                apiFetch("/checkout", {
                    method: "POST",
                    body: JSON.stringify({ address_id, payment_method }),
                    withAuth: true,
                }),
            () => {
                // Fake: pretend checkout succeeded, clear cart
                const cleared = recomputeCart({ items: [] });
                writeFakeCart(cleared);
                return { ok: true, message: "Checkout simulated (fake mode)." };
            }
        );
    },
};

/** ================== REVIEWS ================== */

export const reviewsApi = {
    /** GET /products/{id}/reviews */
    list(productId) {
        return withFallback(
            `GET /products/${productId}/reviews`,
            () => apiFetch(`/products/${productId}/reviews`, { withAuth: true }),
            () => {
                const map = readFakeReviewsMap();
                return clone(map[String(productId)] || []);
            }
        );
    },

    /** POST /products/{id}/reviews  Body: { rating, comment } */
    add(productId, { rating, comment }) {
        return withFallback(
            `POST /products/${productId}/reviews`,
            () =>
                apiFetch(`/products/${productId}/reviews`, {
                    method: "POST",
                    body: JSON.stringify({ rating, comment }),
                    withAuth: true,
                }),
            () => {
                const map = readFakeReviewsMap();
                const key = String(productId);
                const list = Array.isArray(map[key]) ? map[key] : [];

                list.unshift({
                    id: crypto.randomUUID?.() || String(Date.now()),
                    product_id: productId,
                    rating: Number(rating),
                    comment: String(comment || ""),
                    created_at: new Date().toISOString(),
                    // user fields optional in fake mode
                });

                map[key] = list;
                writeFakeReviewsMap(map);
                return clone(list[0]);
            }
        );
    },
};

/** ================== (Optional) AUTH HELPERS ================== */
/** Matches /auth/login and /auth/register in the contract */
export const userApi = {
    register(payload) {
        return apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
            withAuth: false,
        });
    },

    async login({ email, password }) {
        const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            withAuth: false,
        });
        if (data?.token) auth.setToken(data.token);
        return data;
    },

    logout() {
        return withFallback(
            "POST /auth/logout",
            async () => {
                const out = await apiFetch("/auth/logout", { method: "POST" });
                auth.clearToken();
                return out;
            },
            () => {
                auth.clearToken();
                return { ok: true, message: "Logged out (fake mode)." };
            }
        );
    },

    me() {
        return withFallback(
            "GET /users/me",
            () => apiFetch("/users/me"),
            () => null
        );
    },
};
