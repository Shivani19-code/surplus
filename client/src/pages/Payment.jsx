import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {}; // Get the food details passed from Home page

  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);

  if (!item) return <h2>No item selected</h2>;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    // SIMULATE A DELAY (Like a real bank processing)
    setTimeout(async () => {
      try {
        const studentId = localStorage.getItem('userId');
        
        // Call the backend API
        await axios.post('http://localhost:5000/api/orders/place', {
          studentId: studentId,
          listingId: item._id,
          restaurantId: item.restaurantId,
          price: item.discountedPrice,
          itemTitle: item.title // <--- NEW: SEND THE NAME
        });

        alert('Payment Successful! Order Placed. ✅');
        navigate('/my-orders'); // Redirect to receipt
      } catch (err) {
        alert("Payment Failed: " + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    }, 2000); // 2 second delay
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Checkout 💳</h1>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '20px', backgroundColor: 'white' }}>
        <h3>Order Summary</h3>
        <p><strong>Item:</strong> {item.title}</p>
        <p><strong>Total to Pay:</strong> <span style={{ color: 'green', fontSize: '1.5em', fontWeight: 'bold' }}>${item.discountedPrice}</span></p>
      </div>

      <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>Card Number (Fake):</label>
        <input 
          type="text" 
          placeholder="1234 5678 9101 1121" 
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required 
          maxLength="19"
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="MM/YY" required style={{ width: '50%' }} />
          <input type="text" placeholder="CVV" required style={{ width: '50%' }} />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            backgroundColor: loading ? 'gray' : '#2e7d32', 
            color: 'white', 
            padding: '15px', 
            fontSize: '1.2em' 
          }}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}

export default Payment;