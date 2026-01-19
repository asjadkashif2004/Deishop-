import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartApi, productsApi } from "../services/api";
import cartLogo from "../assets/cart.png";

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
    return item?.id ?? getVariantId(item) ?? String(Math.random());
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
    if (!res) return { items: [] };
    if (Array.isArray(res?.items)) return res;
    if (Array.isArray(res?.data?.items)) return res.data;
    if (Array.isArray(res?.data)) return { items: res.data };
    return { items: [] };
}

/* ---------------- Small UI ---------------- */

function Button({ children, onClick, disabled, variant = "ghost", className = "", type = "button" }) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed";
    const styles =
        variant === "primary"
            ? "bg-teal-400 text-[#070B16] hover:bg-teal-300"
            : variant === "danger"
                ? "border border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15"
                : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10";

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
            {children}
        </button>
    );
}

function SkeletonLine({ w = "w-full" }) {
    return <div className={`h-3 ${w} rounded bg-white/10`} />;
}

/* ---------------- Page ---------------- */

export default function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyItemId, setBusyItemId] = useState(null);

    const [coupon, setCoupon] = useState("");
    const [couponBusy, setCouponBusy] = useState(false);

    const [addressId, setAddressId] = useState("1");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [checkoutBusy, setCheckoutBusy] = useState(false);

    const [lookupByVariantId, setLookupByVariantId] = useState({});

    const items = cart?.items || [];

    async function loadCart() {
        setLoading(true);
        setError("");
        try {
            const res = await cartApi.get();
            const normalized = normalizeCart(res);
            setCart(normalized);

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
                            map[String(v.id)] = { title, img, price: v?.price ?? basePrice };
                        }
                    }
                    setLookupByVariantId(map);
                } catch {
                    // ignore
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
        const img =
            getImgFromItem(item) ||
            (key ? lookupByVariantId[key]?.img : "") ||
            "https://via.placeholder.com/800x800?text=Item";
        const price = getPriceFromItem(item) ?? (key ? lookupByVariantId[key]?.price : null);

        return { title, img, price, variantId };
    }

    const totals = useMemo(() => {
        let subtotal = 0;
        let qty = 0;
        for (const it of items) {
            const { price } = getResolvedItem(it);
            const q = getQty(it);
            qty += q;
            if (price != null) subtotal += Number(price) * q;
        }
        return { qty, subtotal };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, lookupByVariantId]);

    async function changeQty(item, nextQty) {
        const id = getCartItemId(item);
        setBusyItemId(id);
        setError("");
        try {
            if (!item?.id) throw new Error("Cart item id missing — cannot update quantity.");
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
            if (!item?.id) throw new Error("Cart item id missing — cannot remove item.");
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
            if (typeof cartApi.applyCoupon !== "function") throw new Error("Coupon API not available.");
            await cartApi.applyCoupon(coupon.trim());
            await loadCart();
        } catch (e) {
            setError(e?.message || "Failed to apply coupon.");
        } finally {
            setCouponBusy(false);
        }
    }

    // ✅ FIXED: clear cart robustly (no more clearCart() missing crash)
    async function clearCart() {
        setError("");
        setCheckoutBusy(true);

        try {
            // 1) If backend actually has clearCart()
            if (typeof cartApi.clearCart === "function") {
                await cartApi.clearCart();
                await loadCart();
                return;
            }

            // 2) Some APIs use different names
            if (typeof cartApi.clear === "function") {
                await cartApi.clear();
                await loadCart();
                return;
            }
            if (typeof cartApi.empty === "function") {
                await cartApi.empty();
                await loadCart();
                return;
            }

            // 3) Fallback: remove items one by one
            if (typeof cartApi.removeCartItem === "function" && items.length > 0) {
                await Promise.all(items.map((it) => cartApi.removeCartItem(it.id)));
                await loadCart();
                return;
            }

            // 4) Final fallback: local cart
            localStorage.removeItem("cart");
            localStorage.removeItem("cartItems");
            setCart({ items: [] });
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
            if (typeof cartApi.checkout !== "function") throw new Error("Checkout API not available.");
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
            {/* Subtle background */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.10),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(99,102,241,0.10),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.04),transparent_40%)]" />
                <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070B16]/70 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            {/* ✅ Back to home */}
                            <Button onClick={() => navigate("/")} className="h-11 w-11 px-0" variant="ghost">
                                ←
                            </Button>

                            {/* ✅ Cart logo */}
                            <div className="h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                <img src={cartLogo} alt="Cart" className="h-full w-full object-contain p-2" />
                            </div>

                            <div>
                                <div className="text-lg font-semibold tracking-tight">Your Cart</div>
                                <div className="text-xs text-slate-400">Review items and checkout</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 justify-end">
                            <Button onClick={loadCart} disabled={loading}>
                                ↻ Refresh
                            </Button>

                            <Button onClick={clearCart} disabled={checkoutBusy || loading || items.length === 0} variant="danger">
                                🗑 Clear
                            </Button>

                            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                                Items: <span className="text-white font-semibold">{totals.qty}</span>
                            </div>
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
            <main className="relative mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Items */}
                    <section className="lg:col-span-2">
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden">
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                <div>
                                    <div className="text-lg font-semibold">Cart Items</div>
                                    <div className="text-xs text-slate-400">Adjust quantities or remove items</div>
                                </div>

                                <Link
                                    to="/products"
                                    className="text-sm text-teal-200 hover:text-teal-100 transition"
                                >
                                    Continue shopping →
                                </Link>
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
                                        <div className="mt-6 flex justify-center">
                                            <Link
                                                to="/products"
                                                className="rounded-2xl bg-teal-400 px-5 py-3 text-sm font-semibold text-[#070B16] hover:bg-teal-300 transition"
                                            >
                                                Browse products
                                            </Link>
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
                                                    className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center hover:bg-white/[0.06] transition"
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
                                                                className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 disabled:opacity-50 transition"
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
                                                                className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 disabled:opacity-50 transition"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        {/* actions */}
                                                        <Button onClick={() => removeItem(it)} disabled={busy} variant="danger">
                                                            {busy ? "Working…" : "Remove"}
                                                        </Button>
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
                                        <Button onClick={applyCoupon} disabled={couponBusy} variant="primary" className="px-5">
                                            {couponBusy ? "..." : "Apply"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Checkout inputs */}
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
                                            className="mt-2 w-full rounded-2xl border border-black/10 bg-blue/5 px-3 py-2 text-sm outline-none focus:border-teal-400/40"
                                        >
                                            <option value="cod">Cash on Delivery</option>
                                            <option value="card">Card</option>
                                            <option value="wallet">Wallet</option>
                                        </select>
                                    </div>

                                    <Button
                                        onClick={checkout}
                                        disabled={checkoutBusy || loading || items.length === 0}
                                        variant="primary"
                                        className="mt-2 w-full py-3"
                                    >
                                        {checkoutBusy ? "Processing…" : "Checkout"}
                                    </Button>

                                    <Button
                                        onClick={clearCart}
                                        disabled={checkoutBusy || loading || items.length === 0}
                                        className="w-full py-3"
                                    >
                                        Clear Cart
                                    </Button>
                                </div>
                            </div>

                            {/* info card */}
                            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-300/80">
                                <div className="font-semibold text-slate-100">Tip</div>
                                <div className="mt-2">
                                    If the backend is down, your app may fall back to localStorage — cart can still work offline.
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
