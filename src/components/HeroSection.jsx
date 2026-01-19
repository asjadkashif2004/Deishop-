import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const HEADER_H = 68;
const AUTOPLAY_MS = 5200;

const slides = [
    {
        src: "https://i5.walmartimages.com/asr/b91b09e6-989c-4dc8-857e-3494d0f9a046.fa13cb85bfd37ddbbaac38632e575da4.jpeg",
        alt: "Product slide 1",
        tag: "Trending now",
        title: "Streetwear Essentials",
        sub: "New drops • Limited stock • Premium quality",
        price: "$49",
        objectPos: "center",
    },
    {
        src: "https://hips.hearstapps.com/hmg-prod/images/esq-giftsfor-tech-5320-68dc0ace765b7.jpeg?crop=1xw:0.9998333333333334xh;center,top&resize=1200:*",
        alt: "Product slide 2",
        tag: "Just arrived",
        title: "Modern Tech Picks",
        sub: "Best sellers • Smart deals • Fast delivery",
        price: "$89",
        objectPos: "center",
    },
    {
        src: "https://media.istockphoto.com/id/955641488/photo/clothes-shop-costume-dress-fashion-store-style-concept.jpg?s=612x612&w=0&k=20&c=ZouECh5-XOCuBzvKBQfxgyw0RIGEUg9u5F0sJiZV86s=",
        alt: "Product slide 3",
        tag: "Editor’s choice",
        title: "Everyday Comfort",
        sub: "Sneakers • Lifestyle • Fresh collection",
        price: "$59",
        objectPos: "center",
    },
    {
        src: "https://media.product.which.co.uk/prod/images/original/155c687e5435-prods-of-the-decadeupdated-feb25.jpg",
        alt: "Product slide 3",
        tag: "Editor’s choice",
        title: "Basic Package",
        sub: "Sneakers • Lifestyle • Fresh collection",
        price: "$70",
        objectPos: "center",
    }
];

const slideVariants = {
    initial: { opacity: 0, scale: 1.03 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.01 },
};

export default function HeroSection() {
    const reduceMotion = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [progressKey, setProgressKey] = useState(0);
    const timerRef = useRef(null);

    const active = useMemo(() => slides[index], [index]);

    const go = (i) => {
        setIndex(i);
        setProgressKey((k) => k + 1);
    };

    const next = () => go((index + 1) % slides.length);
    const prev = () => go((index - 1 + slides.length) % slides.length);

    useEffect(() => {
        if (paused) return;

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setIndex((i) => (i + 1) % slides.length);
            setProgressKey((k) => k + 1);
        }, AUTOPLAY_MS);

        return () => timerRef.current && clearInterval(timerRef.current);
    }, [paused]);

    // keyboard support (no arrows in UI)
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    return (
        <section
            aria-label="Hero"
            className="relative w-full bg-[#070B16]"
            style={{ paddingTop: HEADER_H }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
        >
            {/* FULL-WIDTH BACKGROUND SLIDER */}
            <div className="relative w-full overflow-hidden" style={{ height: "clamp(520px, 78vh, 860px)" }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        className="absolute inset-0"
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
                        drag={reduceMotion ? false : "x"}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.06}
                        onDragEnd={(_, info) => {
                            if (info.offset.x > 120) prev();
                            if (info.offset.x < -120) next();
                        }}
                    >
                        {/* slight “alive” motion: slow zoom drift */}
                        <motion.img
                            src={active.src}
                            alt={active.alt}
                            className="h-full w-full object-cover"
                            style={{ objectPosition: active.objectPos || "center" }}
                            loading="eager"
                            animate={reduceMotion ? {} : { scale: [1.04, 1.08, 1.04] }}
                            transition={reduceMotion ? {} : { duration: 14, ease: "easeInOut", repeat: Infinity }}
                        />

                        {/* cinematic overlays (don’t block clicks) */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#070B16]/92 via-[#070B16]/45 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B16]/95 via-[#070B16]/25 to-transparent" />

                        {/* “alive” light bloom */}
                        <motion.div
                            className="pointer-events-none absolute inset-0 opacity-100"
                            animate={
                                reduceMotion
                                    ? {}
                                    : {
                                        backgroundPosition: ["0% 0%", "100% 40%", "0% 0%"],
                                    }
                            }
                            transition={reduceMotion ? {} : { duration: 10, ease: "easeInOut", repeat: Infinity }}
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 70% 25%, rgba(16,185,129,0.18), transparent 45%), radial-gradient(circle at 18% 70%, rgba(99,102,241,0.16), transparent 48%)",
                                backgroundSize: "140% 140%",
                            }}
                        />

                        {/* subtle grain (CSS-only, lightweight) */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
                            }}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* CONTENT (centered container, but hero is FULL WIDTH) */}
                <div className="relative z-20 mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:pb-14 lg:pb-16">
                    <div className="max-w-2xl">
                        {/* NO “UPWARD” JUMP: fade+blur only */}
                        <motion.div
                            key={`content-${index}`}
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
                            layout
                        >
                            {/* premium pill */}
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 backdrop-blur">
                                <Sparkles size={16} className="text-emerald-200" />
                                <span className="text-slate-100/90">Premium deals • New arrivals daily</span>
                            </div>

                            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.06]">
                                Shopping that feels{" "}
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-indigo-200 bg-clip-text text-transparent">
                                        zabardast
                                    </span>
                                    <span className="pointer-events-none absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-emerald-300/60 via-teal-300/40 to-indigo-300/55" />
                                </span>
                                .
                            </h1>

                            <p className="mt-4 text-sm leading-relaxed text-slate-200/80 sm:text-base">
                                Curated products, clean experience, fast delivery — built for speed, style, and savings.
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-200/85">
                                <span className="inline-flex items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
                                    {active.tag}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-white/30" />
                                <span className="font-semibold text-white">{active.title}</span>
                                <span className="ml-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100/90">
                                    {active.price}
                                </span>
                            </div>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <motion.button
                                    whileHover={reduceMotion ? undefined : { y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-300 to-teal-200 px-6 py-3 text-sm font-semibold text-[#070B16] shadow-[0_18px_60px_rgba(16,185,129,0.18)] hover:opacity-95"
                                >
                                    <span className="relative z-10">Shop Now</span>
                                    <ArrowRight size={18} className="relative z-10" />
                                    <span
                                        aria-hidden="true"
                                        className="absolute -left-24 top-0 h-full w-24 rotate-12 bg-white/35 blur-xl transition-transform duration-700 group-hover:translate-x-[560px]"
                                    />
                                </motion.button>

                                <motion.a
                                    href="#benefits"
                                    whileHover={reduceMotion ? undefined : { y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-100 hover:bg-white/10 backdrop-blur"
                                >
                                    Explore Collections
                                </motion.a>
                            </div>

                            {/* trust row */}
                            <div id="benefits" className="mt-7 grid gap-3 sm:grid-cols-3">
                                <TrustCard icon={<Truck size={18} />} title="Fast Delivery" sub="48–72 hours" />
                                <TrustCard icon={<ShieldCheck size={18} />} title="Secure Payments" sub="Protected checkout" />
                                <TrustCard icon={<RefreshCw size={18} />} title="Easy Returns" sub="7-day policy" />
                            </div>

                            {/* dots + progress (dynamic, elegant) */}
                            <div className="mt-6 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    {slides.map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => go(i)}
                                            aria-label={`Go to slide ${i + 1}`}
                                            className={[
                                                "h-2.5 rounded-full transition",
                                                i === index
                                                    ? "w-8 bg-emerald-200/85 shadow-[0_0_18px_rgba(16,185,129,0.32)]"
                                                    : "w-3 bg-white/20 hover:bg-white/30",
                                            ].join(" ")}
                                        />
                                    ))}
                                </div>

                                <div className="hidden sm:block w-44">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                        <motion.div
                                            key={progressKey}
                                            className="h-full w-full origin-left bg-gradient-to-r from-emerald-200/80 via-teal-200/70 to-indigo-200/70"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: paused || reduceMotion ? 0 : 1 }}
                                            transition={{ duration: paused || reduceMotion ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 text-xs text-slate-400/80">
                                Tip: swipe/drag to change • use keyboard arrows
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* bottom fade into page */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#070B16] to-transparent" />
            </div>
        </section>
    );
}

function TrustCard({ icon, title, sub }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-slate-200/85 backdrop-blur">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-emerald-200">
                {icon}
            </div>
            <div>
                <div className="font-semibold text-white">{title}</div>
                <div className="text-xs text-slate-400">{sub}</div>
            </div>
        </div>
    );
}
