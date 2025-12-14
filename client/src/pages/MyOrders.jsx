import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // State for the Review Popup
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return navigate('/login');
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [navigate, userId]);

  const openRateModal = (order) => {
    setSelectedOrder(order);
    setShowRateModal(true);
  };

  const submitReview = async () => {
    try {
      await axios.post('http://localhost:5000/api/reviews/add', {
        studentId: userId,
        restaurantId: selectedOrder.restaurantId._id,
        orderId: selectedOrder._id,
        rating,
        comment
      });
      alert("Review Submitted! ⭐");
      setShowRateModal(false);
      setComment('');
    } catch (err) {
      alert("Error submitting review: " + err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Orders 📦</h1>
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px', padding: '10px' }}>Back to Home</button>

      {orders.length === 0 ? (
        <p>You haven't ordered anything yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ 
              border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '600px',
              backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3>{order.listingId?.title || "Item Unavailable"}</h3>
                <p><strong>Restaurant:</strong> {order.restaurantId?.name || "Unknown"}</p>
                <p><strong>Price:</strong> ${order.totalPrice}</p>
                <p><strong>Status:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{order.status}</span></p>
              </div>

              {/* RATE BUTTON */}
              <button 
                onClick={() => openRateModal(order)}
                style={{ backgroundColor: '#ffc107', color: 'black', fontWeight: 'bold' }}
              >
                Rate ⭐
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- REVIEW POPUP MODAL --- */}
      {showRateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '300px' }}>
            <h2>Rate {selectedOrder?.restaurantId?.name}</h2>
            
            <label>Rating:</label>
            <div style={{ margin: '10px 0', fontSize: '1.5rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star} 
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'gray' }}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea 
              placeholder="Write a comment..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', height: '80px', margin: '10px 0' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowRateModal(false)} style={{ backgroundColor: '#ccc' }}>Cancel</button>
              <button onClick={submitReview} style={{ backgroundColor: 'green', color: 'white' }}>Submit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MyOrders;