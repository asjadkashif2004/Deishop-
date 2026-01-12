import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/products", element: <ProductsPage /> },
    { path: "/products/:id", element: <ProductDetailPage /> },
    { path: "/cart", element: <CartPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
