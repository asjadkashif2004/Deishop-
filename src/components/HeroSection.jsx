import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./HeroSection.module.css";

/**
 * ✅ Add your images here
 * Replace src with your image URL (or local import).
 */
const slides = [
    {
        src: "https://i5.walmartimages.com/asr/b91b09e6-989c-4dc8-857e-3494d0f9a046.fa13cb85bfd37ddbbaac38632e575da4.jpeg",
        alt: "Product slide 1",
        tag: "Trending now",
        title: "Streetwear Essentials",
        sub: "New drops • Limited stock • Premium quality",
        price: "$49",
    },
    {
        src: "https://hips.hearstapps.com/hmg-prod/images/esq-giftsfor-tech-5320-68dc0ace765b7.jpeg?crop=1xw:0.9998333333333334xh;center,top&resize=1200:*", // <-- add image url
        alt: "Product slide 2",
        tag: "Just arrived",
        title: "Modern Tech Picks",
        sub: "Best sellers • Smart deals • Fast delivery",
        price: "$89",
    },
    {
        src: "https://media.istockphoto.com/id/955641488/photo/clothes-shop-costume-dress-fashion-store-style-concept.jpg?s=612x612&w=0&k=20&c=ZouECh5-XOCuBzvKBQfxgyw0RIGEUg9u5F0sJiZV86s=", // <-- add image url
        alt: "Product slide 3",
        tag: "Editor’s choice",
        title: "Everyday Comfort",
        sub: "Sneakers • Lifestyle • Fresh collection",
        price: "$59",
    },
];

export default function HeroSection() {
    const [index, setIndex] = useState(0);

    // Auto-slide
    useEffect(() => {
        const t = setInterval(() => {
            setIndex((i) => (i + 1) % slides.length);
        }, 4500);
        return () => clearInterval(t);
    }, []);

    const active = useMemo(() => slides[index], [index]);

    return (
        <section className={styles.hero} aria-label="Hero">
            {/* Background ambient */}
            <div className={styles.bgGlowA} aria-hidden="true" />
            <div className={styles.bgGlowB} aria-hidden="true" />
            <div className={styles.bgGrid} aria-hidden="true" />

            {/* FULL WIDTH SLIDER */}
            <div className={styles.slider}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        className={styles.slide}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.99 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                    >
                        {active.src ? (
                            <img src={active.src} alt={active.alt} className={styles.slideImg} />
                        ) : (
                            <div className={styles.placeholder}>
                                Add image URL inside slides[] (src: "")
                            </div>
                        )}

                        {/* overlays */}
                        <div className={styles.imageOverlay} aria-hidden="true" />
                        <div className={styles.vignette} aria-hidden="true" />
                    </motion.div>
                </AnimatePresence>

                {/* Gradient bottom fade for premium look */}
                <div className={styles.bottomFade} aria-hidden="true" />
            </div>

            {/* CONTENT OVERLAY (ON TOP OF SLIDER) */}
            <div className={styles.contentWrap}>
                <div className={styles.inner}>
                    <motion.div
                        className={styles.content}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className={styles.kicker}>
                            <Sparkles size={16} />
                            <span>Premium deals • New arrivals daily</span>
                        </div>

                        <h1 className={styles.title}>
                            Shopping that feels <span className={styles.highlight}>zabardast</span>.
                        </h1>

                        <p className={styles.subtitle}>
                            Curated products, clean experience, fast delivery — built for speed, style, and savings.
                        </p>

                        {/* Slide meta */}
                        <div className={styles.heroMeta}>
                            <span className={styles.pill}>{active.tag}</span>
                            <span className={styles.dot} />
                            <span className={styles.metaTitle}>{active.title}</span>
                            <span className={styles.metaPrice}>{active.price}</span>
                        </div>

                        {/* CTA */}
                        <div className={styles.ctaRow}>
                            <motion.button
                                className={styles.primaryBtn}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                            >
                                Shop Now <ArrowRight size={18} />
                                <span className={styles.btnShine} aria-hidden="true" />
                            </motion.button>

                            <motion.a
                                className={styles.secondaryBtn}
                                href="#benefits"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Explore Collections
                            </motion.a>
                        </div>

                        {/* Trust */}
                        <div className={styles.trustRow} id="benefits">
                            <div className={styles.trustItem}>
                                <Truck size={18} />
                                <div>
                                    <div className={styles.trustTitle}>Fast Delivery</div>
                                    <div className={styles.trustSub}>48–72 hours</div>
                                </div>
                            </div>

                            <div className={styles.trustItem}>
                                <ShieldCheck size={18} />
                                <div>
                                    <div className={styles.trustTitle}>Secure Payments</div>
                                    <div className={styles.trustSub}>Protected checkout</div>
                                </div>
                            </div>

                            <div className={styles.trustItem}>
                                <RefreshCw size={18} />
                                <div>
                                    <div className={styles.trustTitle}>Easy Returns</div>
                                    <div className={styles.trustSub}>7-day policy</div>
                                </div>
                            </div>
                        </div>

                        {/* Dots */}
                        <div className={styles.dots} aria-label="Hero slider dots">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={i === index ? `${styles.dotBtn} ${styles.dotActive}` : styles.dotBtn}
                                    onClick={() => setIndex(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
