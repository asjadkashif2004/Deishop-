import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    ArrowLeft,
    ArrowRight,
    Chrome,
    Apple,
    Eye,
    EyeOff,
    ShieldCheck,
} from "lucide-react";

import AuthLayout from "../app/AuthLayout";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fadeUp = useMemo(
        () => ({
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
        }),
        []
    );

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 700));
            console.log("LOGIN DATA:", { email, password });
            // navigate("/");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#070B16] text-slate-100">
            {/* Subtle professional background */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.10),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(99,102,241,0.10),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.04),transparent_40%)]" />
                <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    className="w-full"
                >
                    {/* Top row */}
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition"
                        >
                            <ArrowLeft size={16} />
                            Back to home
                        </Link>

                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                            className="text-sm text-slate-300 hover:text-white transition"
                        >
                            Browse products
                        </button>
                    </div>

                    {/* ONE clean, centered container */}
                    <div className="grid overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:grid-cols-2">
                        {/* Left panel (hidden on mobile) */}
                        <div className="hidden lg:block p-10 border-r border-white/10">
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
                                <ShieldCheck size={14} className="text-teal-200" />
                                Secure sign-in
                            </div>

                            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">
                                Welcome back to{" "}
                                <span className="bg-gradient-to-r from-teal-300 to-indigo-300 bg-clip-text text-transparent">
                                    DeiShop
                                </span>
                            </h1>

                            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300/90">
                                Sign in to access your cart, track deliveries, and manage your account.
                                Simple, fast, and secure.
                            </p>

                            <div className="mt-8 grid gap-3">
                                <InfoRow title="Fast delivery" sub="48–72 hours" />
                                <InfoRow title="Easy returns" sub="7-day policy" />
                                <InfoRow title="Member benefits" sub="Exclusive offers" />
                            </div>

                            <div className="mt-10 text-xs text-slate-400">
                                Tip: Use a strong password and never share it with anyone.
                            </div>
                        </div>

                        {/* Right panel (form) */}
                        <div className="p-6 sm:p-10">
                            <AuthLayout title="Sign in">
                                <div className="mb-6">
                                    <div className="text-sm text-slate-300">
                                        Don’t have an account?{" "}
                                        <Link
                                            to="/register"
                                            className="font-semibold text-teal-200 hover:text-teal-100 transition"
                                        >
                                            Create one
                                        </Link>
                                    </div>
                                </div>

                                {/* Social */}
                                <div className="grid gap-3">
                                    <SocialButton icon={<Chrome size={18} />} label="Continue with Google" />
                                    <SocialButton icon={<Apple size={18} />} label="Continue with Apple" />
                                </div>

                                <div className="my-6 flex items-center gap-3">
                                    <div className="h-px flex-1 bg-white/10" />
                                    <span className="text-xs text-slate-400">or</span>
                                    <div className="h-px flex-1 bg-white/10" />
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Field
                                        icon={<Mail size={18} />}
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10 focus-within:border-teal-400/40 focus-within:ring-2 focus-within:ring-teal-400/10">
                                        <span className="text-slate-400 group-focus-within:text-teal-200 transition">
                                            <Lock size={18} />
                                        </span>

                                        <input
                                            type={showPw ? "text" : "password"}
                                            placeholder="Password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-transparent outline-none placeholder:text-slate-500"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPw((v) => !v)}
                                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10 transition"
                                            aria-label={showPw ? "Hide password" : "Show password"}
                                        >
                                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-xs text-slate-400">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-white/20 bg-white/10 accent-teal-400"
                                            />
                                            Remember me
                                        </label>

                                        <button
                                            type="button"
                                            className="text-xs text-slate-400 hover:text-slate-200 transition"
                                            onClick={() => alert("Implement reset password flow")}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    <motion.button
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.99 }}
                                        disabled={loading}
                                        className="group relative w-full rounded-2xl bg-teal-400 px-4 py-3 text-sm font-semibold text-[#070B16] hover:bg-teal-300 transition disabled:opacity-70 disabled:cursor-not-allowed"
                                        type="submit"
                                    >
                                        <span className="inline-flex items-center justify-center gap-2">
                                            {loading ? "Signing in..." : "Login"}
                                            <ArrowRight size={18} />
                                        </span>
                                    </motion.button>

                                    <div className="pt-2 text-center text-xs text-slate-400">
                                        By continuing, you agree to our Terms & Privacy Policy.
                                    </div>
                                </form>
                            </AuthLayout>
                        </div>
                    </div>

                    {/* Bottom helper */}
                    <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400">
                        <button
                            type="button"
                            className="hover:text-slate-200 transition"
                            onClick={() => navigate("/cart")}
                        >
                            View cart
                        </button>
                        <span className="text-slate-600">•</span>
                        <button
                            type="button"
                            className="hover:text-slate-200 transition"
                            onClick={() => navigate("/products")}
                        >
                            Explore categories
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

/* ---------- Small Components ---------- */

function SocialButton({ icon, label }) {
    return (
        <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10 transition"
        >
            <span className="opacity-90">{icon}</span>
            <span className="flex-1 text-left">{label}</span>
            <span className="opacity-50">→</span>
        </motion.button>
    );
}

function Field({ icon, ...props }) {
    return (
        <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10 focus-within:border-teal-400/40 focus-within:ring-2 focus-within:ring-teal-400/10">
            <span className="text-slate-400 group-focus-within:text-teal-200 transition">{icon}</span>
            <input
                {...props}
                required
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
            />
        </div>
    );
}

function InfoRow({ title, sub }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="mt-1 text-xs text-slate-400">{sub}</div>
        </div>
    );
}
