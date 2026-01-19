import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube, Facebook, Mail, ArrowRight, Sparkles } from "lucide-react";

// If you have a real logo file, uncomment and update the path:
// import logo from "../assets/logo.png";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative border-t border-white/10 bg-[#070B16] text-slate-200">
            {/* subtle background (light, not tall) */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 left-1/2 h-44 w-[760px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl opacity-60" />
                <div className="absolute bottom-[-90px] right-[-120px] h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl opacity-60" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-10">
                {/* Top grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
                    {/* Brand */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="flex items-center gap-3">
                            {/* If using image logo:
              <div className="h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <img src={logo} alt="DeiShop logo" className="h-full w-full object-contain p-2" />
              </div>
              */}
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-teal-400/80 to-indigo-400/70 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" />
                            <div className="leading-tight">
                                <div className="text-[15px] font-semibold tracking-tight text-white">DeiShop</div>
                                <div className="text-[11px] text-slate-400">Premium store</div>
                            </div>
                        </Link>

                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-300/80">
                            Curated products with premium vibes. Secure checkout, fast delivery, and easy returns —
                            designed for a smooth shopping experience.
                        </p>

                        <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
                            <Sparkles size={14} className="text-teal-200" />
                            New drops daily <span className="text-slate-500">•</span> Member deals
                        </div>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold text-white">Shop</h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300/80">
                            <li><Link className="hover:text-white transition" to="/products">Products</Link></li>
                            <li><Link className="hover:text-white transition" to="/cart">Cart</Link></li>
                            <li><Link className="hover:text-white transition" to="/login">Login</Link></li>
                            <li><Link className="hover:text-white transition" to="/register">Register</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold text-white">Categories</h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300/80">
                            <li><Link className="hover:text-white transition" to="/products?category=Furniture">Furniture</Link></li>
                            <li><Link className="hover:text-white transition" to="/products?category=Hand%20Bag">Hand Bags</Link></li>
                            <li><Link className="hover:text-white transition" to="/products?category=Books">Books</Link></li>
                            <li><Link className="hover:text-white transition" to="/products?category=Tech">Tech</Link></li>
                            <li><Link className="hover:text-white transition" to="/products?category=Sneakers">Sneakers</Link></li>
                            <li><Link className="hover:text-white transition" to="/products?category=Travel">Travel</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold text-white">Company</h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-300/80">
                            <li><Link className="hover:text-white transition" to="/">About</Link></li>
                            <li><Link className="hover:text-white transition" to="/">Careers</Link></li>
                            <li><Link className="hover:text-white transition" to="/">Privacy</Link></li>
                            <li><Link className="hover:text-white transition" to="/">Terms</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold text-white">Newsletter</h3>
                        <p className="mt-3 text-sm text-slate-300/80">
                            Get deals and new arrivals in your inbox.
                        </p>

                        <form onSubmit={(e) => e.preventDefault()} className="mt-4 space-y-3">
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-teal-400/40 focus:ring-2 focus:ring-teal-400/10"
                                    required
                                />
                            </div>

                            <button className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-400 px-4 py-2.5 text-sm font-semibold text-[#070B16] hover:bg-teal-300 transition">
                                Subscribe
                                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                            </button>
                        </form>

                        <div className="mt-4 flex items-center gap-2">
                            <SocialIcon label="Instagram"><Instagram size={16} /></SocialIcon>
                            <SocialIcon label="Twitter"><Twitter size={16} /></SocialIcon>
                            <SocialIcon label="YouTube"><Youtube size={16} /></SocialIcon>
                            <SocialIcon label="Facebook"><Facebook size={16} /></SocialIcon>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-white/10" />

                {/* Bottom bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400">
                    <div>© {year} DeiShop. All rights reserved.</div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <Link className="hover:text-slate-200 transition" to="/">Privacy Policy</Link>
                        <Link className="hover:text-slate-200 transition" to="/">Terms</Link>
                        <Link className="hover:text-slate-200 transition" to="/">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ label, children }) {
    return (
        <button
            type="button"
            aria-label={label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white transition"
            onClick={() => alert(`${label} link not set yet`)}
        >
            {children}
        </button>
    );
}
