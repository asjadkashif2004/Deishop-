import { lazy, Suspense } from "react";
import Header from "../components/Header";

const HeroSection = lazy(() => import("../components/HeroSection"));
const CategoriesSection = lazy(() => import("../components/CategoriesSection"));
const Footer = lazy(() => import("../components/Footer"));

export default function HomePage() {
  return (
    <>
      <Header />

      <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
        <HeroSection />
        <CategoriesSection />
        <Footer />
      </Suspense>
    </>
  );
}
