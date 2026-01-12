import { useState } from "react";
import { Link } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    ArrowLeft,
    Chrome,
    Apple,
} from "lucide-react";

import AuthLayout from "../app/AuthLayout";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        console.log("REGISTER DATA:", { name, email, password });
    }

    return (
        <AuthLayout title="Create your account">
            {/* Back to home */}
            <Link to="/" className={styles.back}>
                <ArrowLeft size={16} />
                Back to home
            </Link>

            {/* Social sign up */}
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
                <span>or sign up with email</span>
            </div>

            {/* Register form */}
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <User size={18} />
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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
                    Create account
                    <ArrowRight size={18} />
                    <span className={styles.shine} />
                </button>

                <p className={styles.text}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
