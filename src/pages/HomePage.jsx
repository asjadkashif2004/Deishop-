import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection";

export default function HomePage() {
    return (
        <div>
            <Header />

            <CategoriesSection />
            <HeroSection />
        </div>
    );
}
