import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import About from './pages/About';
import Contact from './pages/Contact';
import NewArrivals from './pages/NewArrivals';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import PaymentProvider from './context/PaymentContext';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <UserProvider>
          <PaymentProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/category/fashion" element={<Products category="fashion" />} />
                  <Route path="/category/electronics" element={<Products category="electronics" />} />
                  <Route path="/category/laptops" element={<Products category="laptops" />} />
                  <Route path="/wishlist" element={<Products category="wishlist" />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/new-arrivals" element={<NewArrivals />} />
                  <Route path="/checkoutpage" element={
                    <PrivateRoute>
                      <CheckoutPage />
                    </PrivateRoute>
                  } />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </div>
              <Footer />
            </Router>
          </PaymentProvider>
        </UserProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
