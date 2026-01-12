import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
} from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");

    const navItems = useMemo(
        () => [
            { label: "Categories", to: "/components/HeroSection", icon: ChevronDown },
            { label: "Deals", to: "/deals", icon: Tag },
            { label: "What’s New", to: "/new", icon: Sparkles },
            { label: "Delivery", to: "/delivery", icon: Truck },
        ],
        []
    );

    return (
        <>
            <header className={styles.header}>
                <div className={styles.inner}>
                    {/* LEFT: Brand */}
                    <Link to="/" className={styles.brand} aria-label="Shopcart home">
                        <span className={styles.brandMark} />
                        <span className={styles.brandText}>DeiShop</span>
                    </Link>

                    {/* CENTER: Nav */}
                    <nav className={styles.nav} aria-label="Primary navigation">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                >
                                    <Icon size={16} />
                                    <span>{item.label}</span>
                                    <span className={styles.underline} />
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* RIGHT: Search + Actions */}
                    <div className={styles.actions}>
                        <div className={styles.searchWrap}>
                            <Search className={styles.searchIcon} size={18} />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className={styles.search}
                                placeholder="Search products, brands, categories…"
                                aria-label="Search products"
                            />
                            {!!q && (
                                <button
                                    className={styles.clearBtn}
                                    onClick={() => setQ("")}
                                    aria-label="Clear search"
                                    type="button"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <Link to="/login" className={styles.iconBtn} aria-label="Login">
                            <User size={18} />
                            <span className={styles.iconLabel}>Login</span>
                        </Link>

                        <Link to="/register" className={styles.iconBtnAlt} aria-label="Register">
                            <UserPlus size={18} />
                            <span className={styles.iconLabel}>Register</span>
                        </Link>

                        <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
                            <ShoppingBag size={18} />
                            <span className={styles.iconLabel}>Cart</span>
                            <span className={styles.badge} aria-label="Cart items">
                                2
                            </span>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className={styles.mobileToggle}
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                            type="button"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>

                {/* Premium glow underline animation */}
                <motion.div
                    className={styles.glowLine}
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            className={styles.backdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />
                        <motion.aside
                            className={styles.drawer}
                            initial={{ x: 360, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 360, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 280, damping: 26 }}
                            aria-label="Mobile menu"
                        >
                            <div className={styles.drawerTop}>
                                <div className={styles.drawerBrand}>
                                    <span className={styles.brandMark} />
                                    <span className={styles.brandText}>Shopcart</span>
                                </div>

                                <button
                                    className={styles.drawerClose}
                                    onClick={() => setOpen(false)}
                                    aria-label="Close menu"
                                    type="button"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className={styles.drawerBody}>
                                <div className={styles.drawerSectionTitle}>Explore</div>

                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            onClick={() => setOpen(false)}
                                            className={({ isActive }) =>
                                                isActive ? `${styles.drawerLink} ${styles.drawerActive}` : styles.drawerLink
                                            }
                                        >
                                            <Icon size={18} />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    );
                                })}

                                <div className={styles.drawerDivider} />

                                <NavLink to="/login" onClick={() => setOpen(false)} className={styles.drawerLink}>
                                    <User size={18} />
                                    <span>Login</span>
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    onClick={() => setOpen(false)}
                                    className={styles.drawerLink}
                                >
                                    <UserPlus size={18} />
                                    <span>Register</span>
                                </NavLink>

                                <NavLink to="/cart" onClick={() => setOpen(false)} className={styles.drawerLink}>
                                    <ShoppingBag size={18} />
                                    <span>Cart</span>
                                    <span className={styles.drawerPill}>2</span>
                                </NavLink>
                            </div>

                            <div className={styles.drawerBottom}>
                                <div className={styles.drawerPromo}>
                                    <Sparkles size={18} />
                                    <div>
                                        <div className={styles.promoTitle}>Premium deals unlocked</div>
                                        <div className={styles.promoSub}>Sign in to get member prices.</div>
                                    </div>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
