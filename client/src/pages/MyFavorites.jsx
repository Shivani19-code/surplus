import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const studentId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!studentId) return navigate('/login');
      try {
        console.log("Fetching favorites for:", studentId);
        const res = await axios.get(`http://localhost:5000/api/favorites/${studentId}`);
        console.log("Favorites Data Received:", res.data); // <--- Check your browser console (F12) for this
        setFavorites(res.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };
    fetchFavorites();
  }, [navigate, studentId]);

  const handleRemove = async (listingId) => {
    try {
      await axios.post('http://localhost:5000/api/favorites/toggle', {
        studentId,
        listingId
      });
      setFavorites(favorites.filter(fav => fav.listingId?._id !== listingId));
    } catch (err) {
      alert("Error removing favorite");
    }
  };

  const handleBuy = (item) => {
    navigate('/payment', { state: { item } });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>My Favorites ❤️</h1>
        <button onClick={() => navigate('/home')} style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>Back to Home</button>
      </div>

      {favorites.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>You haven't liked any items yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center' }}>
          {favorites.map((fav) => {
             // 1. SAFE CHECK: Does the item still exist?
             const item = fav.listingId;
             
             // If item is null (deleted), render nothing or a placeholder
             if (!item) return null; 

             return (
              <div key={fav._id} style={{ 
                border: 'none', padding: '20px', borderRadius: '15px', width: '280px', 
                backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                position: 'relative'
              }}>
                
                {/* Remove Button (X) */}
                <button 
                  onClick={() => handleRemove(item._id)}
                  style={{ 
                    position: 'absolute', top: '10px', right: '10px', 
                    backgroundColor: '#ffebee', color: '#c62828', 
                    border: 'none', borderRadius: '50%', width: '30px', height: '30px',
                    cursor: 'pointer', fontWeight: 'bold'
                  }}
                  title="Remove from favorites"
                >
                  ✕
                </button>

                {/* Category Badge - Added '?' for safety */}
                <span style={{ 
                  position: 'absolute', top: '15px', left: '15px', 
                  backgroundColor: '#e0f2f1', color: '#00695c', 
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' 
                }}>
                  {item.category ? item.category.toUpperCase() : 'FOOD'}
                </span>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', marginTop: '30px' }}>{item.title}</h3>
                <p><strong>Pickup:</strong> {item.pickupTime}</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '10px 0' }}>
                   <span style={{ textDecoration: 'line-through', color: 'gray' }}>${item.originalPrice}</span>
                   <span style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2rem' }}>${item.discountedPrice}</span>
                </div>
                
                <button 
                  onClick={() => handleBuy(item)} 
                  style={{ width: '100%', padding: '12px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px' }}
                >
                  Buy Now
                </button>
              </div>
             );
          })}
        </div>
      )}
    </div>
  );
}

export default MyFavorites;