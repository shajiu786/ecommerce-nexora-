import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import { Login, Register } from "./pages/AuthPages.jsx";
import Profile from "./pages/Profile.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Orders from "./pages/Orders.jsx";
import NotFound from "./pages/NotFound.jsx";

function RouteFallback() {
  return <div className="container-page py-20 text-center text-sm font-semibold text-slate-500">Loading page…</div>;
}

export default function App() {
  return <Suspense fallback={<RouteFallback />}><Routes><Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/order-success/:id" element={<OrderSuccess />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Route></Routes></Suspense>;
}
