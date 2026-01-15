import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ShoppingBag,
    User,
    UserPlus,
    Sparkles,
    Tag,
    Truck,
    Menu,
    X,
    ChevronDown,
    Sofa,
    Handbag,
    BookOpen,
    Laptop,
    Footprints,
    Plane,
    ArrowRight,
} from "lucide-react";

const categories = [
    { name: "Furniture", icon: Sofa, accent: "emerald" },
    { name: "Hand Bag", icon: Handbag, accent: "pink" },
    { name: "Books", icon: BookOpen, accent: "amber" },
    { name: "Tech", icon: Laptop, accent: "blue" },
    { name: "Sneakers", icon: Footprints, accent: "violet" },
    { name: "Travel", icon: Plane, accent: "indigo" },
];

const ACCENT = {
    emerald: {
        bg: "from-emerald-500/22 via-emerald-500/10 to-white/[0.02]",
        glow: "bg-emerald-400/30",
        icon: "text-emerald-200",
        iconBg: "bg-emerald-400/10 border-emerald-400/20",
        ring: "hover:border-emerald-400/40",
    },
    pink: {
        bg: "from-pink-500/22 via-pink-500/10 to-white/[0.02]",
        glow: "bg-pink-400/30",
        icon: "text-pink-200",
        iconBg: "bg-pink-400/10 border-pink-400/20",
        ring: "hover:border-pink-400/40",
    },
    amber: {
        bg: "from-amber-500/22 via-amber-500/10 to-white/[0.02]",
        glow: "bg-amber-300/30",
        icon: "text-amber-200",
        iconBg: "bg-amber-300/10 border-amber-300/20",
        ring: "hover:border-amber-300/40",
    },
    blue: {
        bg: "from-sky-500/22 via-sky-500/10 to-white/[0.02]",
        glow: "bg-sky-300/30",
        icon: "text-sky-200",
        iconBg: "bg-sky-300/10 border-sky-300/20",
        ring: "hover:border-sky-300/40",
    },
    violet: {
        bg: "from-violet-500/22 via-violet-500/10 to-white/[0.02]",
        glow: "bg-violet-300/30",
        icon: "text-violet-200",
        iconBg: "bg-violet-300/10 border-violet-300/20",
        ring: "hover:border-violet-300/40",
    },
    indigo: {
        bg: "from-indigo-500/22 via-indigo-500/10 to-white/[0.02]",
        glow: "bg-indigo-300/30",
        icon: "text-indigo-200",
        iconBg: "bg-indigo-300/10 border-indigo-300/20",
        ring: "hover:border-indigo-300/40",
    },
};

function useOutsideClose({ enabled, refs, onClose }) {
    useEffect(() => {
        if (!enabled) return;

        function onDown(e) {
            const clickedInside = refs.some((r) => r.current && r.current.contains(e.target));
            if (!clickedInside) onClose?.();
        }
        function onKey(e) {
            if (e.key === "Escape") onClose?.();
        }

        window.addEventListener("mousedown", onDown);
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("keydown", onKey);
        };
    }, [enabled, refs, onClose]);
}

export default function Header({ cartCount = 0 }) {
    const [openMobile, setOpenMobile] = useState(false);
    const [openCats, setOpenCats] = useState(false);
    const [q, setQ] = useState("");

    const navigate = useNavigate();
    const catsBtnRef = useRef(null);
    const catsPanelRef = useRef(null);

    useOutsideClose({
        enabled: openCats,
        refs: [catsBtnRef, catsPanelRef],
        onClose: () => setOpenCats(false),
    });

    const navItems = useMemo(
        () => [
            // Categories is handled as dropdown button (not NavLink)
            { label: "Products", to: "/products", icon: Tag },
            { label: "Coming soon", to: "/", icon: Sparkles },
            { label: "Delivery", to: "/", icon: Truck },
        ],
        []
    );

    function submitSearch(e) {
        e?.preventDefault?.();
        // If you want query routing:
        // navigate(`/products?search=${encodeURIComponent(q)}`);
        navigate("/products");
        setOpenCats(false);
        setOpenMobile(false);
    }

    function goCategory(name) {
        // Best UX: route to products filtered by category/search
        navigate(`/products?search=${encodeURIComponent(name)}`);
        setOpenCats(false);
        setOpenMobile(false);
    }

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070B16]/70 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex h-[68px] items-center justify-between gap-3">
                        {/* Brand */}
                        <Link to="/" className="flex items-center gap-3" aria-label="DeiShop home">
                            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-teal-400/80 to-indigo-400/70 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" />
                            <div className="leading-tight">
                                <div className="text-[15px] font-semibold tracking-tight text-white">DeiShop</div>
                                <div className="text-[11px] text-slate-400">Premium store</div>
                            </div>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
                            {/* Categories dropdown trigger */}
                            <button
                                ref={catsBtnRef}
                                type="button"
                                onClick={() => setOpenCats((v) => !v)}
                                aria-expanded={openCats}
                                aria-controls="categories-dropdown"
                                className={[
                                    "group relative inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm transition",
                                    "text-slate-300 hover:text-white hover:bg-white/5",
                                    openCats ? "text-white bg-white/5" : "",
                                ].join(" ")}
                            >
                                <ChevronDown
                                    size={16}
                                    className={[
                                        "opacity-90 transition",
                                        openCats ? "rotate-180" : "rotate-0",
                                    ].join(" ")}
                                />
                                <span>Categories</span>
                                <span className="pointer-events-none absolute inset-x-3 -bottom-[6px] h-[2px] origin-left scale-x-0 rounded-full bg-teal-400/70 transition-transform duration-300 group-hover:scale-x-100" />
                            </button>

                            {/* Other nav links */}
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setOpenCats(false)}
                                        className={({ isActive }) =>
                                            [
                                                "group relative inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm transition",
                                                isActive ? "text-white" : "text-slate-300 hover:text-white",
                                                "hover:bg-white/5",
                                            ].join(" ")
                                        }
                                    >
                                        <Icon size={16} className="opacity-90" />
                                        <span>{item.label}</span>
                                        <span className="pointer-events-none absolute inset-x-3 -bottom-[6px] h-[2px] origin-left scale-x-0 rounded-full bg-teal-400/70 transition-transform duration-300 group-hover:scale-x-100" />
                                    </NavLink>
                                );
                            })}
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center gap-2">
                            {/* Search (desktop) */}
                            <form onSubmit={submitSearch} className="relative hidden w-[360px] xl:block">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search products, brands, categories…"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-400 outline-none focus:border-teal-400/40 focus:ring-2 focus:ring-teal-400/10"
                                />
                                {!!q && (
                                    <button
                                        type="button"
                                        onClick={() => setQ("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-200 hover:bg-white/10"
                                        aria-label="Clear search"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </form>

                            {/* Auth (desktop) */}
                            <div className="hidden items-center gap-2 md:flex">
                                <Link
                                    to="/login"
                                    onClick={() => setOpenCats(false)}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                                >
                                    <User size={16} />
                                    <span>Login</span>
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setOpenCats(false)}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-4 py-2 text-sm font-semibold text-[#070B16] hover:bg-teal-300"
                                >
                                    <UserPlus size={16} />
                                    <span>Register</span>
                                </Link>
                            </div>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                onClick={() => setOpenCats(false)}
                                className="relative inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                            >
                                <ShoppingBag size={16} />
                                <span className="hidden sm:inline">Cart</span>
                                {cartCount > 0 ? (
                                    <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-teal-400 px-2 text-xs font-bold text-[#070B16]">
                                        {cartCount}
                                    </span>
                                ) : null}
                            </Link>

                            {/* Mobile menu */}
                            <button
                                onClick={() => setOpenMobile(true)}
                                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-200 hover:bg-white/10 lg:hidden"
                                aria-label="Open menu"
                                type="button"
                            >
                                <Menu size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* glow underline */}
                <motion.div
                    className="h-[2px] w-full bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                />
            </header>

            {/* ✅ Categories Dropdown Panel */}
            <AnimatePresence>
                {openCats && (
                    <>
                        {/* Soft backdrop (optional but premium) */}
                        <motion.div
                            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenCats(false)}
                        />

                        <motion.div
                            ref={catsPanelRef}
                            id="categories-dropdown"
                            className="fixed left-0 right-0 top-[68px] z-40"
                            initial={{ opacity: 0, y: -10, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                            <div className="mx-auto max-w-7xl px-4">
                                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#070B16]/90 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                                    {/* Top strip */}
                                    <div className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <div className="text-lg font-semibold text-white">Shop Our Top Categories</div>
                                            <div className="mt-1 text-sm text-slate-300/80">
                                                Curated picks with premium vibes — fast to browse, easy to love.
                                            </div>
                                        </div>

                                        {/* Inline search inside dropdown */}
                                        <form onSubmit={submitSearch} className="relative w-full md:w-[380px]">
                                            <Search
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            />
                                            <input
                                                value={q}
                                                onChange={(e) => setQ(e.target.value)}
                                                placeholder="Search within categories…"
                                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-400 outline-none focus:border-teal-400/40 focus:ring-2 focus:ring-teal-400/10"
                                            />
                                            {!!q && (
                                                <button
                                                    type="button"
                                                    onClick={() => setQ("")}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-200 hover:bg-white/10"
                                                    aria-label="Clear search"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </form>
                                    </div>

                                    {/* Colorful cards */}
                                    <div className="p-6">
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {categories.map((cat) => {
                                                const Icon = cat.icon;
                                                const a = ACCENT[cat.accent];

                                                return (
                                                    <motion.button
                                                        key={cat.name}
                                                        type="button"
                                                        whileHover={{ y: -6 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => goCategory(cat.name)}
                                                        className={[
                                                            "group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03] p-5 text-left transition",
                                                            "shadow-[0_0_0_1px_rgba(255,255,255,0.06)] hover:border-white/20",
                                                            a.ring,
                                                        ].join(" ")}
                                                    >
                                                        {/* gradient base */}
                                                        <div
                                                            className={["absolute inset-0 bg-gradient-to-br", a.bg].join(" ")}
                                                            aria-hidden="true"
                                                        />
                                                        {/* glow orb */}
                                                        <div
                                                            className={[
                                                                "pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl",
                                                                "opacity-0 transition duration-300 group-hover:opacity-100",
                                                                a.glow,
                                                            ].join(" ")}
                                                            aria-hidden="true"
                                                        />
                                                        {/* shimmer */}
                                                        <div
                                                            className="pointer-events-none absolute -inset-y-10 -left-20 w-28 rotate-12 bg-white/10 blur-xl opacity-0 transition duration-500 group-hover:opacity-100 group-hover:translate-x-[520px]"
                                                            aria-hidden="true"
                                                        />

                                                        <div className="relative flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-4">
                                                                <div
                                                                    className={[
                                                                        "grid h-12 w-12 place-items-center rounded-2xl border backdrop-blur",
                                                                        a.iconBg,
                                                                        a.icon,
                                                                    ].join(" ")}
                                                                    aria-hidden="true"
                                                                >
                                                                    <Icon size={20} />
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <div className="truncate text-sm font-semibold text-white">
                                                                        {cat.name}
                                                                    </div>
                                                                    <div className="mt-1 text-xs text-slate-200/70">Explore</div>
                                                                </div>
                                                            </div>

                                                            <span
                                                                className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition group-hover:bg-white/10"
                                                                aria-hidden="true"
                                                            >
                                                                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                                                            </span>
                                                        </div>

                                                        <div className="relative mt-4 h-px w-full bg-white/10" />
                                                        <div className="relative mt-3 text-xs text-slate-200/70">
                                                            Tap to browse products
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>

                                        {/* Bottom hint */}
                                        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300/80">
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={16} className="text-teal-300" />
                                                <span>New drops daily — shop fast, stay fresh.</span>
                                            </div>

                                            <button
                                                onClick={() => setOpenCats(false)}
                                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Drawer (same as before, shortened) */}
            <AnimatePresence>
                {openMobile && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenMobile(false)}
                        />
                        <motion.aside
                            className="fixed right-0 top-0 z-50 h-full w-[340px] border-l border-white/10 bg-[#070B16]/95 backdrop-blur-xl"
                            initial={{ x: 360, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 360, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 280, damping: 26 }}
                        >
                            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                                <div className="text-sm font-semibold text-white">Menu</div>
                                <button
                                    onClick={() => setOpenMobile(false)}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-5 space-y-2">
                                <button
                                    onClick={() => {
                                        setOpenCats(true);
                                        setOpenMobile(false);
                                    }}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/10"
                                >
                                    Categories
                                </button>

                                {navItems.map((i) => (
                                    <NavLink
                                        key={i.to}
                                        to={i.to}
                                        onClick={() => setOpenMobile(false)}
                                        className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
                                    >
                                        {i.label}
                                    </NavLink>
                                ))}

                                <div className="mt-4 h-px bg-white/10" />

                                <NavLink
                                    to="/login"
                                    onClick={() => setOpenMobile(false)}
                                    className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    onClick={() => setOpenMobile(false)}
                                    className="block rounded-2xl bg-teal-400 px-4 py-3 text-sm font-semibold text-[#070B16] hover:bg-teal-300"
                                >
                                    Register
                                </NavLink>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
