import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🔹 GLOBAL CSS (THIS WAS MISSING)
import './index.css';

// 🔹 Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MyOrders from './pages/MyOrders';
import RestaurantOrders from './pages/RestaurantOrders';
import Payment from './pages/Payment';
import MyFavorites from './pages/MyFavorites';
import RestaurantAnalytics from './pages/RestaurantAnalytics';

function App() {
  return (
    <Router>
      <Routes>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-favorites" element={<MyFavorites />} />
        <Route path="/payment" element={<Payment />} />

        {/* Restaurant */}
        <Route path="/restaurant-orders" element={<RestaurantOrders />} />
        <Route path="/analytics" element={<RestaurantAnalytics />} />

      </Routes>
    </Router>
  );
}

export default App;
