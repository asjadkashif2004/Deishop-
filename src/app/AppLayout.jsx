import Header from "../components/Header";

export default function AppLayout({ children }) {
    return (
        <div>
            <Header />
            <main style={{ padding: 24 }}>{children}</main>
        </div>
    );
}
