import React, { useEffect, useMemo, useState } from "react";
import { productsApi, cartApi } from "../services/api";
import Header from "../components/Header";

/* ---------------- Helpers ---------------- */

function money(value) {
    if (value == null) return "";
    const n = Number(value);
    const isCentsLikely = n > 1000;
    const amount = isCentsLikely ? n / 100 : n;
    return amount.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function pickCoverImage(p) {
    return (
        p?.image ||
        p?.thumbnail ||
        p?.images?.[0]?.url ||
        p?.images?.[0] ||
        "https://via.placeholder.com/800x800?text=Product"
    );
}
function pickTitle(p) {
    return p?.name || p?.title || "Untitled Product";
}
function pickDesc(p) {
    return p?.description || p?.short_description || "";
}
function pickPrice(p) {
    const v = p?.variants?.[0];
    return v?.price ?? p?.price ?? p?.amount ?? null;
}
function pickDefaultVariantId(p) {
    return p?.variants?.[0]?.id ?? null;
}
function normalizeProductsResponse(res) {
    if (Array.isArray(res)) return { items: res, meta: null };
    if (res?.data && Array.isArray(res.data)) return { items: res.data, meta: res.meta ?? null };
    return { items: [], meta: null };
}
function useDebouncedValue(value, delay = 350) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

/* ---------------- Page ---------------- */

const categoryPills = [
    { key: "furniture", label: "Furniture", emoji: "🛋️" },
    { key: "handbag", label: "Hand Bag", emoji: "👜" },
    { key: "books", label: "Books", emoji: "📚" },
    { key: "tech", label: "Tech", emoji: "💻" },
    { key: "sneakers", label: "Sneakers", emoji: "👟" },
    { key: "travel", label: "Travel", emoji: "✈️" },
];

export default function Products() {
    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState(null);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebouncedValue(search);

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);

    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null);
    const [error, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState(null);

    const queryParams = useMemo(() => {
        const categorySearch = activeCategory ? `${activeCategory}` : "";
        const combinedSearch = [debouncedSearch, categorySearch].filter(Boolean).join(" ").trim();

        return {
            search: combinedSearch || undefined,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            page,
            limit,
        };
    }, [debouncedSearch, minPrice, maxPrice, page, limit, activeCategory]);

    async function loadProducts() {
        setLoading(true);
        setError("");
        try {
            const res = await productsApi.list(queryParams);
            const { items: got, meta: m } = normalizeProductsResponse(res);
            setItems(got);
            setMeta(m);
        } catch (e) {
            setError(e?.message || "Failed to load products.");
            setItems([]);
            setMeta(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams]);

    async function handleAddToCart(product) {
        const variantId = pickDefaultVariantId(product);
        if (!variantId) {
            setError("This product has no variant available to add to cart.");
            return;
        }
        setAddingId(product.id);
        setError("");
        try {
            await cartApi.addItem(variantId, 1);
        } catch (e) {
            setError(e?.message || "Could not add item to cart.");
        } finally {
            setAddingId(null);
        }
    }

    const total = meta?.total ?? null;
    const totalPages = total ? Math.max(1, Math.ceil(total / limit)) : null;
    const canPrev = page > 1;
    const canNext = totalPages ? page < totalPages : items.length === limit;

    const hasAnyFilter = Boolean(search || minPrice || maxPrice || activeCategory);

    return (
        <div className="min-h-screen bg-[#070B16] text-slate-100">
            {/* Keep your home header */}
            <Header />

            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 opacity-70">
                <div className="absolute -top-48 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="absolute top-40 right-[-180px] h-[520px] w-[520px] rounded-full bg-indigo-400/10 blur-3xl" />
                <div className="absolute bottom-[-220px] left-[-220px] h-[560px] w-[560px] rounded-full bg-cyan-300/8 blur-3xl" />
            </div>

            {/* HERO + FILTERS (professional grid layout) */}
            <section className="relative border-b border-white/10">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#070B16] via-[#070B16]/85 to-[#070B16]" />
                    <div className="absolute inset-0 opacity-[0.10] [background:radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.28),transparent_44%),radial-gradient(circle_at_18%_70%,rgba(99,102,241,0.22),transparent_50%)]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-12">
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                        {/* Left: title + subtitle */}
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.35)]" />
                                Premium store • Curated drops • Fast delivery
                            </div>

                            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl leading-[1.05]">
                                Discover products that feel{" "}
                                <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-indigo-200 bg-clip-text text-transparent">
                                    zabardast
                                </span>
                                .
                            </h1>

                            <p className="mt-3 max-w-xl text-sm text-slate-300/80 sm:text-base">
                                A refined browsing experience — clean filters, premium layout, and fast checkout.
                            </p>

                            {/* Categories row */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                <FilterChip
                                    active={!activeCategory}
                                    onClick={() => {
                                        setActiveCategory(null);
                                        setPage(1);
                                    }}
                                >
                                    ✨ All
                                </FilterChip>

                                {categoryPills.map((c) => (
                                    <FilterChip
                                        key={c.key}
                                        active={activeCategory === c.label}
                                        onClick={() => {
                                            setActiveCategory(c.label);
                                            setPage(1);
                                        }}
                                    >
                                        <span className="mr-2">{c.emoji}</span>
                                        {c.label}
                                    </FilterChip>
                                ))}
                            </div>
                        </div>

                        {/* Right: search + filters card (aligned + consistent spacing) */}
                        <div className="lg:col-span-5">
                            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                                <div className="text-xs font-medium text-slate-300/80">Search & Filters</div>

                                <div className="mt-3 relative">
                                    <input
                                        value={search}
                                        onChange={(e) => {
                                            setPage(1);
                                            setSearch(e.target.value);
                                        }}
                                        placeholder="Search products, brands, categories…"
                                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-300/10"
                                    />
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        ⌕
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-12 gap-2">
                                    <MiniInput
                                        className="col-span-4"
                                        value={minPrice}
                                        onChange={(v) => {
                                            setPage(1);
                                            setMinPrice(v);
                                        }}
                                        placeholder="Min"
                                    />
                                    <MiniInput
                                        className="col-span-4"
                                        value={maxPrice}
                                        onChange={(v) => {
                                            setPage(1);
                                            setMaxPrice(v);
                                        }}
                                        placeholder="Max"
                                    />
                                    <select
                                        value={limit}
                                        onChange={(e) => {
                                            setPage(1);
                                            setLimit(Number(e.target.value));
                                        }}
                                        className="col-span-4 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-emerald-300/40"
                                        aria-label="Items per page"
                                    >
                                        <option value={8}>8</option>
                                        <option value={12}>12</option>
                                        <option value={16}>16</option>
                                        <option value={24}>24</option>
                                    </select>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-3">
                                    <div className="text-xs text-slate-400">
                                        {loading ? (
                                            "Loading…"
                                        ) : (
                                            <>
                                                Showing <span className="text-slate-100">{items.length}</span>
                                                {total != null ? (
                                                    <>
                                                        {" "}
                                                        of <span className="text-slate-100">{total}</span>
                                                    </>
                                                ) : null}
                                            </>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setMinPrice("");
                                            setMaxPrice("");
                                            setActiveCategory(null);
                                            setPage(1);
                                        }}
                                        disabled={!hasAnyFilter}
                                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Error under card (clean placement) */}
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
                    </div>
                </div>
            </section>

            {/* Toolbar (proper catalog alignment + pagination) */}
            <section className="sticky top-[68px] z-10 border-b border-white/10 bg-[#070B16]/70 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-slate-300">
                            {activeCategory ? (
                                <>
                                    Category: <span className="text-slate-100 font-medium">{activeCategory}</span>
                                </>
                            ) : (
                                <span className="text-slate-400">All products</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={!canPrev || loading}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm disabled:opacity-40 hover:bg-white/10"
                            >
                                ← Prev
                            </button>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
                                Page <span className="text-white">{page}</span>
                                {totalPages ? (
                                    <>
                                        {" "}
                                        / <span className="text-white">{totalPages}</span>
                                    </>
                                ) : null}
                            </div>

                            <button
                                disabled={!canNext || loading}
                                onClick={() => setPage((p) => p + 1)}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm disabled:opacity-40 hover:bg-white/10"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <main className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {loading
                        ? Array.from({ length: limit }).map((_, i) => <ProductSkeleton key={i} />)
                        : items.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onAdd={() => handleAddToCart(p)}
                                adding={addingId === p.id}
                            />
                        ))}
                </div>

                {!loading && items.length === 0 ? (
                    <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
                        <div className="text-lg font-semibold">No products found</div>
                        <div className="mt-2 text-sm text-slate-400">Try changing your search or filters.</div>
                        <button
                            onClick={() => {
                                setSearch("");
                                setMinPrice("");
                                setMaxPrice("");
                                setActiveCategory(null);
                                setPage(1);
                            }}
                            className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-300 to-teal-200 px-5 py-2.5 text-sm font-semibold text-[#070B16] hover:opacity-95"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : null}
            </main>
        </div>
    );
}

/* ---------------- UI components ---------------- */

function MiniInput({ value, onChange, placeholder, className = "" }) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            inputMode="numeric"
            className={[
                className,
                "w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-300/10",
            ].join(" ")}
        />
    );
}

function FilterChip({ active, children, onClick }) {
    return (
        <button
            onClick={onClick}
            className={[
                "inline-flex items-center rounded-full border px-4 py-2 text-sm transition backdrop-blur",
                active
                    ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.14)]"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function ProductCard({ product, onAdd, adding }) {
    const img = pickCoverImage(product);
    const title = pickTitle(product);
    const desc = pickDesc(product);
    const price = pickPrice(product);

    return (
        <div className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition hover:border-white/20 hover:bg-white/[0.04]">
            <div className="relative aspect-[4/5] bg-white/[0.02]">
                <img
                    src={img}
                    alt={title}
                    className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:opacity-100 group-hover:scale-[1.01]"
                    loading="lazy"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B16]/92 via-transparent to-transparent" />

                <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-slate-100 backdrop-blur">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300/90" />
                    {price != null ? money(price) : "—"}
                </div>

                <div className="pointer-events-none absolute -inset-12 opacity-0 transition group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-full bg-emerald-300/10 blur-3xl" />
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-snug tracking-tight">{title}</h3>
                    <span className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-100">
                        {product?.category?.name || "Product"}
                    </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-slate-300/70">
                    {desc || "No description available."}
                </p>

                <div className="mt-4 flex items-center gap-2">
                    <button
                        onClick={onAdd}
                        disabled={adding}
                        className="w-full rounded-2xl bg-gradient-to-r from-emerald-300 to-teal-200 px-4 py-2.5 text-sm font-semibold text-[#070B16] hover:opacity-95 disabled:opacity-60"
                    >
                        {adding ? "Adding…" : "Add to Cart"}
                    </button>

                    <button
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 hover:bg-white/10"
                        title="Save for later (wire up later)"
                        onClick={() => { }}
                        aria-label="Save for later"
                    >
                        ♡
                    </button>
                </div>

                {product?.variants?.length ? (
                    <div className="mt-3 text-xs text-slate-400">
                        Variants: <span className="text-slate-200">{product.variants.length}</span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function ProductSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
            <div className="aspect-[4/5] bg-white/5" />
            <div className="p-4">
                <div className="h-4 w-3/4 rounded bg-white/10" />
                <div className="mt-3 h-3 w-full rounded bg-white/10" />
                <div className="mt-2 h-3 w-5/6 rounded bg-white/10" />
                <div className="mt-4 h-10 w-full rounded-2xl bg-white/10" />
            </div>
        </div>
    );
}
