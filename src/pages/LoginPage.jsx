import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Mail,
    Lock,
    ArrowRight,
    ArrowLeft,
    Chrome,
    Apple,
} from "lucide-react";

import AuthLayout from "../app/AuthLayout";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        console.log("LOGIN DATA:", { email, password });
    }

    return (
        <AuthLayout title="Welcome back">
            {/* Back to home */}
            <Link to="/" className={styles.back}>
                <ArrowLeft size={16} />
                Back to home
            </Link>

            {/* Social auth */}
            <div className={styles.social}>
                <button type="button" className={styles.socialBtn}>
                    <Chrome size={18} />
                    Continue with Google
                </button>

                <button type="button" className={styles.socialBtnAlt}>
                    <Apple size={18} />
                    Continue with Apple
                </button>
            </div>

            {/* Divider */}
            <div className={styles.divider}>
                <span>or continue with email</span>
            </div>

            {/* Email login */}
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <Mail size={18} />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <Lock size={18} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button className={styles.submit} type="submit">
                    Login
                    <ArrowRight size={18} />
                    <span className={styles.shine} />
                </button>

                <p className={styles.text}>
                    Don’t have an account? <Link to="/register">Create one</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
