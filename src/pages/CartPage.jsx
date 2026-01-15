import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom"; // ✅ add this
import { cartApi, productsApi } from "../services/api";

/* ---------------- Helpers ---------------- */

function money(value) {
    if (value == null) return "";
    const n = Number(value);
    const isCentsLikely = n > 1000;
    const amount = isCentsLikely ? n / 100 : n;
    return amount.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function pickImgFromProduct(p) {
    return (
        p?.image ||
        p?.thumbnail ||
        p?.images?.[0]?.url ||
        p?.images?.[0] ||
        "https://via.placeholder.com/800x800?text=Item"
    );
}

function getVariantId(item) {
    return (
        item?.product_variant_id ??
        item?.variant_id ??
        item?.productVariantId ??
        item?.product_variant?.id ??
        item?.variant?.id ??
        null
    );
}

function getCartItemId(item) {
    return item?.id ?? getVariantId(item) ?? crypto.randomUUID?.() ?? String(Date.now());
}

function getQty(item) {
    return Number(item?.quantity ?? 0);
}

function getTitleFromItem(item) {
    return (
        item?.product?.name ||
        item?.product?.title ||
        item?.name ||
        item?.title ||
        item?.product_name ||
        ""
    );
}

function getPriceFromItem(item) {
    // Try nested variant/product fields if backend returns expanded data
    return (
        item?.product_variant?.price ??
        item?.variant?.price ??
        item?.product?.price ??
        item?.price ??
        null
    );
}

function getImgFromItem(item) {
    return (
        item?.image ||
        item?.product?.image ||
        item?.product?.thumbnail ||
        item?.product?.images?.[0]?.url ||
        item?.product?.images?.[0] ||
        ""
    );
}

function normalizeCart(res) {
    // Cart might be { items: [...] } or { data: { items: [...] } } etc.
    if (!res) return { items: [] };
    if (Array.isArray(res?.items)) return res;
    if (Array.isArray(res?.data?.items)) return res.data;
    if (Array.isArray(res?.data)) return { items: res.data };
    return { items: [] };
}

/* ---------------- UI bits ---------------- */

function Pill({ children, onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-50"
        >
            {children}
        </button>
    );
}

function Chip({ active, children, onClick }) {
    return (
        <button
            onClick={onClick}
            className={[
                "inline-flex items-center rounded-2xl border px-4 py-2 text-sm transition",
                active
                    ? "border-teal-400/40 bg-teal-400/10 text-teal-100"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function SkeletonLine({ w = "w-full" }) {
    return <div className={`h-3 ${w} rounded bg-white/10`} />;
}

/* ---------------- Page ---------------- */

export default function Cart() {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [busyItemId, setBusyItemId] = useState(null);

    const [coupon, setCoupon] = useState("");
    const [couponBusy, setCouponBusy] = useState(false);

    // Optional checkout inputs (keeps things working without building full address UI)
    const [addressId, setAddressId] = useState("1");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [checkoutBusy, setCheckoutBusy] = useState(false);

    // If your cart response doesn’t include product details, we resolve by variantId
    const [lookupByVariantId, setLookupByVariantId] = useState({});

    async function loadCart() {
        setLoading(true);
        setError("");
        try {
            const res = await cartApi.get();
            const normalized = normalizeCart(res);
            setCart(normalized);

            // If items lack title/image/price, do a products lookup once
            const needsLookup = (normalized.items || []).some((it) => {
                const hasTitle = Boolean(getTitleFromItem(it));
                const hasImg = Boolean(getImgFromItem(it));
                const hasPrice = getPriceFromItem(it) != null;
                return !(hasTitle && hasImg && hasPrice);
            });

            if (needsLookup) {
                try {
                    const prodRes = await productsApi.list({ page: 1, limit: 200 });
                    const products = Array.isArray(prodRes) ? prodRes : prodRes?.data || [];
                    const map = {};
                    for (const p of products) {
                        const img = pickImgFromProduct(p);
                        const title = p?.name || p?.title || "Product";
                        const basePrice = p?.price ?? null;
                        for (const v of p?.variants || []) {
                            map[String(v.id)] = {
                                title,
                                img,
                                price: v?.price ?? basePrice,
                            };
                        }
                    }
                    setLookupByVariantId(map);
                } catch {
                    // ignore; fallback mode still works
                }
            }
        } catch (e) {
            setError(e?.message || "Failed to load cart.");
            setCart({ items: [] });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getResolvedItem(item) {
        const variantId = getVariantId(item);
        const key = variantId != null ? String(variantId) : null;

        const title = getTitleFromItem(item) || (key ? lookupByVariantId[key]?.title : "") || "Item";
        const img = getImgFromItem(item) || (key ? lookupByVariantId[key]?.img : "") || "https://via.placeholder.com/800x800?text=Item";
        const price = getPriceFromItem(item) ?? (key ? lookupByVariantId[key]?.price : null);

        return { title, img, price, variantId };
    }

    const items = cart?.items || [];

    const totals = useMemo(() => {
        let subtotal = 0;
        let qty = 0;

        for (const it of items) {
            const { price } = getResolvedItem(it);
            const q = getQty(it);
            qty += q;
            if (price != null) subtotal += Number(price) * q;
        }

        // if price looks cents-like, keep cents-like behavior consistent
        // (money() already applies heuristic)
        return { qty, subtotal };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, lookupByVariantId]);

    async function changeQty(item, nextQty) {
        const id = getCartItemId(item);
        setBusyItemId(id);
        setError("");
        try {
            await cartApi.updateQuantity(item.id, nextQty);
            await loadCart();
        } catch (e) {
            setError(e?.message || "Failed to update quantity.");
        } finally {
            setBusyItemId(null);
        }
    }

    async function removeItem(item) {
        const id = getCartItemId(item);
        setBusyItemId(id);
        setError("");
        try {
            await cartApi.removeCartItem(item.id);
            await loadCart();
        } catch (e) {
            setError(e?.message || "Failed to remove item.");
        } finally {
            setBusyItemId(null);
        }
    }

    async function applyCoupon() {
        if (!coupon.trim()) return;
        setCouponBusy(true);
        setError("");
        try {
            await cartApi.applyCoupon(coupon.trim());
            await loadCart();
        } catch (e) {
            setError(e?.message || "Failed to apply coupon.");
        } finally {
            setCouponBusy(false);
        }
    }

    async function clearCart() {
        setError("");
        setCheckoutBusy(true);
        try {
            await cartApi.clearCart();
            await loadCart();
        } catch (e) {
            setError(e?.message || "Failed to clear cart.");
        } finally {
            setCheckoutBusy(false);
        }
    }

    async function checkout() {
        setCheckoutBusy(true);
        setError("");
        try {
            await cartApi.checkout({
                address_id: Number(addressId || 1),
                payment_method: paymentMethod,
            });
            await loadCart();
        } catch (e) {
            setError(e?.message || "Checkout failed.");
        } finally {
            setCheckoutBusy(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#070B16] text-slate-100">
            {/* Background glows */}
            <div className="pointer-events-none fixed inset-0 opacity-70">
                <div className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="absolute top-40 right-[-120px] h-[380px] w-[380px] rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute bottom-[-160px] left-[-160px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-3xl" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070B16]/70 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-teal-400/80 to-indigo-400/70 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" />
                            <div>
                                <div className="text-lg font-semibold tracking-tight">Your Cart</div>
                                <div className="text-xs text-slate-400">Review items and checkout</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 justify-end">
                            <Pill onClick={loadCart} disabled={loading}>
                                ↻ Refresh
                            </Pill>
                            <Pill onClick={clearCart} disabled={checkoutBusy || loading || items.length === 0}>
                                🗑 Clear
                            </Pill>
                            <Pill>
                                Items: <span className="text-white">{totals.qty}</span>
                            </Pill>
                        </div>
                    </div>

                    {error ? (
                        <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                            <div className="flex items-start gap-2">
                                <span className="mt-0.5">⚠</span>
                                <div>
                                    <div className="font-medium">Something went wrong</div>
                                    <div className="text-rose-200/90">{error}</div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Items */}
                    <section className="lg:col-span-2">
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                <div>
                                    <div className="text-lg font-semibold">Cart Items</div>
                                    <div className="text-xs text-slate-400">Adjust quantities or remove items</div>
                                </div>

                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <CartSkeleton />
                                ) : items.length === 0 ? (
                                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-10 text-center">
                                        <div className="text-xl font-semibold">Your cart is empty</div>
                                        <div className="mt-2 text-sm text-slate-400">
                                            Add products to see them here.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {items.map((it) => {
                                            const id = getCartItemId(it);
                                            const qty = getQty(it);
                                            const { title, img, price } = getResolvedItem(it);
                                            const lineTotal = price != null ? Number(price) * qty : null;
                                            const busy = busyItemId === id;

                                            return (
                                                <div
                                                    key={id}
                                                    className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                                            <img src={img} alt={title} className="h-full w-full object-cover" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="truncate text-sm font-semibold">{title}</div>
                                                            <div className="mt-1 text-xs text-slate-400">
                                                                {price != null ? money(price) : "—"}
                                                            </div>
                                                            {lineTotal != null ? (
                                                                <div className="mt-1 text-xs text-slate-300">
                                                                    Line: <span className="text-white">{money(lineTotal)}</span>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="ml-auto flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                                                        {/* qty controls */}
                                                        <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 md:justify-start">
                                                            <button
                                                                disabled={busy || qty <= 1}
                                                                onClick={() => changeQty(it, Math.max(1, qty - 1))}
                                                                className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 disabled:opacity-50"
                                                            >
                                                                −
                                                            </button>

                                                            <input
                                                                value={qty}
                                                                onChange={(e) => {
                                                                    const v = Number(e.target.value);
                                                                    if (!Number.isFinite(v)) return;
                                                                    changeQty(it, Math.max(1, v));
                                                                }}
                                                                className="w-14 rounded-xl bg-transparent text-center text-sm outline-none"
                                                                inputMode="numeric"
                                                            />

                                                            <button
                                                                disabled={busy}
                                                                onClick={() => changeQty(it, qty + 1)}
                                                                className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 disabled:opacity-50"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        {/* actions */}
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => removeItem(it)}
                                                                disabled={busy}
                                                                className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200 hover:bg-rose-500/15 disabled:opacity-50"
                                                            >
                                                                {busy ? "Working…" : "Remove"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Summary / Checkout */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                                <div className="text-lg font-semibold">Order Summary</div>
                                <div className="mt-1 text-xs text-slate-400">Taxes & shipping handled at checkout</div>

                                <div className="mt-5 space-y-3 text-sm">
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span>Subtotal</span>
                                        <span className="text-white">{money(totals.subtotal)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span>Items</span>
                                        <span className="text-white">{totals.qty}</span>
                                    </div>

                                    <div className="h-px bg-white/10" />

                                    <div className="flex items-center justify-between text-slate-200">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-semibold text-white">{money(totals.subtotal)}</span>
                                    </div>
                                </div>

                                {/* Coupon */}
                                <div className="mt-6">
                                    <div className="text-sm font-semibold">Coupon</div>
                                    <div className="mt-2 flex gap-2">
                                        <input
                                            value={coupon}
                                            onChange={(e) => setCoupon(e.target.value)}
                                            placeholder="Enter code"
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-teal-400/40 focus:ring-2 focus:ring-teal-400/10"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            disabled={couponBusy}
                                            className="rounded-2xl bg-teal-400 px-4 py-2 text-sm font-semibold text-[#070B16] hover:bg-teal-300 disabled:opacity-60"
                                        >
                                            {couponBusy ? "..." : "Apply"}
                                        </button>
                                    </div>
                                </div>

                                {/* Checkout inputs (simple) */}
                                <div className="mt-6 grid gap-3">
                                    <div>
                                        <div className="text-sm font-semibold">Address ID</div>
                                        <input
                                            value={addressId}
                                            onChange={(e) => setAddressId(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-teal-400/40 focus:ring-2 focus:ring-teal-400/10"
                                            inputMode="numeric"
                                        />
                                    </div>

                                    <div>
                                        <div className="text-sm font-semibold">Payment Method</div>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-teal-400/40"
                                        >
                                            <option value="cod">Cash on Delivery</option>
                                            <option value="card">Card</option>
                                            <option value="wallet">Wallet</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={checkout}
                                        disabled={checkoutBusy || loading || items.length === 0}
                                        className="mt-2 w-full rounded-2xl bg-teal-400 px-4 py-3 text-sm font-semibold text-[#070B16] hover:bg-teal-300 disabled:opacity-60"
                                    >
                                        {checkoutBusy ? "Processing…" : "Checkout"}
                                    </button>

                                    <button
                                        onClick={clearCart}
                                        disabled={checkoutBusy || loading || items.length === 0}
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-60"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>

                            {/* tiny info card */}
                            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-300/80">
                                <div className="font-semibold text-slate-100">Tip</div>
                                <div className="mt-2">
                                    If the backend is down, your app automatically falls back to fake data and
                                    localStorage — cart still works offline.
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

/* ---------------- Skeleton ---------------- */

function CartSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center animate-pulse"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-2xl bg-white/10" />
                        <div className="w-64 max-w-full space-y-2">
                            <SkeletonLine w="w-48" />
                            <SkeletonLine w="w-24" />
                            <SkeletonLine w="w-32" />
                        </div>
                    </div>

                    <div className="ml-auto flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                        <div className="h-12 w-full rounded-2xl bg-white/10 md:w-44" />
                        <div className="h-10 w-full rounded-2xl bg-white/10 md:w-28" />
                    </div>
                </div>
            ))}
        </div>
    );
}
