import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/index";
import About from "./routes/about";
import Awareness from "./routes/awareness";
import Contact from "./routes/contact";
import Shop from "./routes/shop";
import ProductDetail from "./routes/product";
import CartPage from "./routes/cart";
import CheckoutPage from "./routes/checkout"; // We'll create this next
import { Login } from "./routes/login";
import AdminLogin from "./routes/admin/login";
import AdminDashboard from "./routes/admin/dashboard";

import { ScrollToTop } from "./components/ScrollToTop";
import { CartProvider } from "./lib/cart";

export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
export default App;
