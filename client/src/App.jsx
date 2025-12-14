import React from 'react';
import MyOrders from './pages/MyOrders';
import RestaurantOrders from './pages/RestaurantOrders';
import Payment from './pages/Payment';
import MyFavorites from './pages/MyFavorites';
import RestaurantAnalytics from './pages/RestaurantAnalytics';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import the pages you created
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect empty path to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Define your pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurant-orders" element={<RestaurantOrders />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/my-favorites" element={<MyFavorites />} />
        <Route path="/analytics" element={<RestaurantAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;