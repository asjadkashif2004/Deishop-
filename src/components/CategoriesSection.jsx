import { motion } from "framer-motion";
import {
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

// Stronger colorful theme per card (Tailwind classes)
const ACCENT = {
    emerald: {
        bg: "from-emerald-500/20 via-emerald-500/8 to-white/[0.02]",
        glow: "bg-emerald-400/30",
        ring: "hover:border-emerald-400/40",
        icon: "text-emerald-200",
        iconBg: "bg-emerald-400/10 border-emerald-400/20",
        pill: "bg-emerald-400/10 text-emerald-200 border-emerald-400/20",
    },
    pink: {
        bg: "from-pink-500/20 via-pink-500/8 to-white/[0.02]",
        glow: "bg-pink-400/30",
        ring: "hover:border-pink-400/40",
        icon: "text-pink-200",
        iconBg: "bg-pink-400/10 border-pink-400/20",
        pill: "bg-pink-400/10 text-pink-200 border-pink-400/20",
    },
    amber: {
        bg: "from-amber-500/20 via-amber-500/8 to-white/[0.02]",
        glow: "bg-amber-300/30",
        ring: "hover:border-amber-300/40",
        icon: "text-amber-200",
        iconBg: "bg-amber-300/10 border-amber-300/20",
        pill: "bg-amber-300/10 text-amber-200 border-amber-300/20",
    },
    blue: {
        bg: "from-sky-500/20 via-sky-500/8 to-white/[0.02]",
        glow: "bg-sky-300/30",
        ring: "hover:border-sky-300/40",
        icon: "text-sky-200",
        iconBg: "bg-sky-300/10 border-sky-300/20",
        pill: "bg-sky-300/10 text-sky-200 border-sky-300/20",
    },
    violet: {
        bg: "from-violet-500/20 via-violet-500/8 to-white/[0.02]",
        glow: "bg-violet-300/30",
        ring: "hover:border-violet-300/40",
        icon: "text-violet-200",
        iconBg: "bg-violet-300/10 border-violet-300/20",
        pill: "bg-violet-300/10 text-violet-200 border-violet-300/20",
    },
    indigo: {
        bg: "from-indigo-500/20 via-indigo-500/8 to-white/[0.02]",
        glow: "bg-indigo-300/30",
        ring: "hover:border-indigo-300/40",
        icon: "text-indigo-200",
        iconBg: "bg-indigo-300/10 border-indigo-300/20",
        pill: "bg-indigo-300/10 text-indigo-200 border-indigo-300/20",
    },
};

export default function CategoriesSection({ onSelectCategory }) {
    return (
        <section className="mx-auto max-w-7xl px-4 pt-10" aria-label="Top categories">
            <div className="rounded-[30px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                            Shop Our <span className="text-white">Top</span> Categories
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
                            Curated picks with premium vibes — fast to browse, easy to love.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
                        ✨ Premium picks <span className="text-slate-500">•</span> Daily deals
                    </div>
                </div>

                {/* Cards row like your screenshot */}
                <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const a = ACCENT[cat.accent];

                        return (
                            <motion.button
                                key={cat.name}
                                type="button"
                                whileHover={{ y: -6 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelectCategory?.(cat.name)}
                                className={[
                                    "group relative overflow-hidden rounded-[26px] border border-white/10",
                                    "bg-white/[0.03] p-5 text-left transition",
                                    "shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
                                    "hover:border-white/20",
                                    a.ring,
                                ].join(" ")}
                            >
                                {/* Color gradient base */}
                                <div
                                    className={[
                                        "absolute inset-0 opacity-100 transition duration-300",
                                        "bg-gradient-to-br",
                                        a.bg,
                                    ].join(" ")}
                                    aria-hidden="true"
                                />

                                {/* Big glow orb on hover */}
                                <div
                                    className={[
                                        "pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl",
                                        "opacity-0 transition duration-300 group-hover:opacity-100",
                                        a.glow,
                                    ].join(" ")}
                                    aria-hidden="true"
                                />

                                {/* Shimmer highlight */}
                                <div
                                    className="pointer-events-none absolute -inset-y-10 -left-20 w-28 rotate-12 bg-white/10 blur-xl opacity-0 transition duration-500 group-hover:opacity-100 group-hover:translate-x-[520px]"
                                    aria-hidden="true"
                                />

                                {/* Content */}
                                <div className="relative flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={[
                                                "grid h-12 w-12 place-items-center rounded-2xl border",
                                                "backdrop-blur",
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

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={[
                                                "hidden sm:inline-flex items-center rounded-2xl border px-3 py-1 text-xs",
                                                a.pill,
                                            ].join(" ")}
                                        >
                                            Hot
                                        </span>

                                        <span
                                            className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition group-hover:bg-white/10"
                                            aria-hidden="true"
                                        >
                                            <ArrowRight
                                                size={16}
                                                className="transition group-hover:translate-x-0.5"
                                            />
                                        </span>
                                    </div>
                                </div>

                                {/* Divider + hint */}
                                <div className="relative mt-4 h-px w-full bg-white/10" />
                                <div className="relative mt-3 text-xs text-slate-200/70">
                                    Tap to filter products
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
