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
import styles from "./CategoriesSection.module.css";

const categories = [
    { name: "Furniture", icon: Sofa, accent: "emerald" },
    { name: "Hand Bag", icon: Handbag, accent: "pink" },
    { name: "Books", icon: BookOpen, accent: "amber" },
    { name: "Tech", icon: Laptop, accent: "blue" },
    { name: "Sneakers", icon: Footprints, accent: "violet" },
    { name: "Travel", icon: Plane, accent: "indigo" },
];

export default function CategoriesSection() {
    return (
        <section className={styles.section} aria-label="Top categories">
            <div className={styles.headerRow}>
                <div>
                    <h2 className={styles.title}>Shop Our Top Categories</h2>
                    <p className={styles.subtitle}>
                        Curated picks with premium vibes — fast to browse, easy to love.
                    </p>
                </div>

            </div>

            <div className={styles.grid}>
                {categories.map((cat) => {
                    const Icon = cat.icon;

                    return (
                        <motion.button
                            key={cat.name}
                            type="button"
                            className={`${styles.card} ${styles[`accent_${cat.accent}`]}`}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className={styles.cardGlow} aria-hidden="true" />

                            <span className={styles.iconWrap} aria-hidden="true">
                                <Icon size={20} />
                            </span>

                            <span className={styles.textWrap}>
                                <span className={styles.name}>{cat.name}</span>
                                <span className={styles.hint}>Explore</span>
                            </span>

                            <span className={styles.chev} aria-hidden="true">
                                <ArrowRight size={16} />
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </section>
    );
}
