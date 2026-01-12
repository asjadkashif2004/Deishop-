import styles from "./AuthLayout.module.css";

export default function AuthLayout({ title, children }) {
    return (
        <div className={styles.wrapper}>
            {/* Background effects */}
            <div className={styles.blobA} aria-hidden />
            <div className={styles.blobB} aria-hidden />
            <div className={styles.grid} aria-hidden />

            <div className={styles.card}>
                <h1 className={styles.title}>{title}</h1>
                {children}
            </div>
        </div>
    );
}
