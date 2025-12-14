import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RestaurantOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch Orders
  const fetchOrders = async () => {
    const restaurantId = localStorage.getItem('userId');
    if (!restaurantId) return navigate('/login');

    try {
      const res = await axios.get(`http://localhost:5000/api/orders/restaurant/${restaurantId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  // NEW: Function to mark order as picked up
  const handleStatusUpdate = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/status/${orderId}`, {
        status: 'picked up'
      });
      alert("Order completed!");
      fetchOrders(); // Refresh the list to see the change
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div style={{ padding: '20px', color: 'black', minHeight: '100vh', backgroundColor: 'white' }}> 
      <h1>Incoming Orders 🛍️</h1>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#333', color: 'white' }}
      >
        Back to Dashboard
      </button>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th>Item</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Action</th> {/* New Column */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.listingId?.title}</td>
                <td>{order.studentId?.name}</td>
                <td>
                  <span style={{ 
                    color: order.status === 'picked up' ? 'gray' : 'green', 
                    fontWeight: 'bold' 
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  {/* Only show button if order is NOT picked up yet */}
                  {order.status !== 'picked up' && (
                    <button 
                      onClick={() => handleStatusUpdate(order._id)}
                      style={{ padding: '5px 10px', backgroundColor: 'green', color: 'white', cursor: 'pointer' }}
                    >
                      Mark Picked Up
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RestaurantOrders;