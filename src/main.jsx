import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Store from "./pages/Store.jsx";
import Cart from "./pages/Cart.jsx";
import Members from "./pages/Members.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import Order from "./components/orders/Order.jsx";
import Product from "./components/store/Product.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          {/* Protected route for user login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/members" element={<Members />}/>
          </Route>
          <Route path="/store" element={<Store />} />
          <Route path="/products/:productId" element={<Product />}/>
          <Route path="/orders/:orderId" element={<Order />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
