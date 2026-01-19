import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    ArrowLeft,
    Chrome,
    Apple,
    Eye,
    EyeOff,
    ShieldCheck,
} from "lucide-react";

import AuthLayout from "../app/AuthLayout";
// ❌ remove: import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fadeUp = useMemo(
        () => ({
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
        }),
        []
    );

    const passwordMismatch = confirm.length > 0 && password !== confirm;

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirm) return;

        setLoading(true);
        try {
            // simulate request
            await new Promise((r) => setTimeout(r, 700));
            console.log("REGISTER DATA:", { name, email, password });

            // Example: go login
            // navigate("/login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#070B16] text-slate-100">
            {/* Subtle background */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.10),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(99,102,241,0.10),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.04),transparent_40%)]" />
                <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
                <motion.div initial="hidden" animate="show" variants={fadeUp} className="w-full">
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

                    {/* Clean split card */}
                    <div className="grid overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:grid-cols-2">
                        {/* Left panel (desktop only) */}
                        <div className="hidden lg:block p-10 border-r border-white/10">
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
                                <ShieldCheck size={14} className="text-teal-200" />
                                Create account securely
                            </div>

                            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">
                                Join{" "}
                                <span className="bg-gradient-to-r from-teal-300 to-indigo-300 bg-clip-text text-transparent">
                                    DeiShop
                                </span>
                            </h1>

                            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300/90">
                                Create an account to save your cart, track orders, and get member-only offers.
                            </p>

                            <div className="mt-8 grid gap-3">
                                <InfoRow title="Faster checkout" sub="Saved details" />
                                <InfoRow title="Order tracking" sub="Real-time status" />
                                <InfoRow title="Exclusive deals" sub="Members only" />
                            </div>

                            <div className="mt-10 text-xs text-slate-400">
                                Tip: Use 8+ characters with a mix of letters & numbers.
                            </div>
                        </div>

                        {/* Right panel (form) */}
                        <div className="p-6 sm:p-10">
                            <AuthLayout title="Create your account">
                                <div className="mb-6 text-sm text-slate-300">
                                    Already have an account?{" "}
                                    <Link to="/login" className="font-semibold text-teal-200 hover:text-teal-100 transition">
                                        Login
                                    </Link>
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

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Field
                                        icon={<User size={18} />}
                                        type="text"
                                        placeholder="Full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />

                                    <Field
                                        icon={<Mail size={18} />}
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <PasswordField
                                        label="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        show={showPw}
                                        setShow={setShowPw}
                                    />

                                    <PasswordField
                                        label="Confirm password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        show={showConfirm}
                                        setShow={setShowConfirm}
                                        error={passwordMismatch ? "Passwords do not match" : ""}
                                    />

                                    {/* Terms */}
                                    <label className="flex items-center gap-2 text-xs text-slate-400">
                                        <input
                                            type="checkbox"
                                            required
                                            className="h-4 w-4 rounded border-white/20 bg-white/10 accent-teal-400"
                                        />
                                        I agree to the Terms & Privacy Policy
                                    </label>

                                    <motion.button
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.99 }}
                                        disabled={loading || passwordMismatch}
                                        className="group relative w-full rounded-2xl bg-teal-400 px-4 py-3 text-sm font-semibold text-[#070B16] hover:bg-teal-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                        type="submit"
                                    >
                                        <span className="inline-flex items-center justify-center gap-2">
                                            {loading ? "Creating..." : "Create account"}
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
                </motion.div>
            </div>
        </div>
    );
}

/* ---------- Components ---------- */

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

function PasswordField({ label, value, onChange, show, setShow, error = "" }) {
    return (
        <div>
            <div
                className={[
                    "group flex items-center gap-3 rounded-2xl border bg-white/5 px-4 py-3 text-sm text-slate-200 transition",
                    "hover:bg-white/10 focus-within:border-teal-400/40 focus-within:ring-2 focus-within:ring-teal-400/10",
                    error ? "border-rose-500/40" : "border-white/10",
                ].join(" ")}
            >
                <span className="text-slate-400 group-focus-within:text-teal-200 transition">
                    <Lock size={18} />
                </span>

                <input
                    type={show ? "text" : "password"}
                    placeholder={label}
                    required
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent outline-none placeholder:text-slate-500"
                />

                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10 transition"
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            {error ? <div className="mt-2 text-xs text-rose-300">{error}</div> : null}
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
