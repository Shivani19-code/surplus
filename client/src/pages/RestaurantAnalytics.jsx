import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RestaurantAnalytics() {
  const [reviews, setReviews] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const navigate = useNavigate();
  const restaurantId = localStorage.getItem('userId');

  useEffect(() => {
    if (!restaurantId) return navigate('/login');

    const fetchData = async () => {
      try {
        // 1. Fetch Reviews
        const resReviews = await axios.get(`http://localhost:5000/api/reviews/${restaurantId}`);
        setReviews(resReviews.data);

        // 2. Fetch Orders to calculate "Top Sales"
        const resOrders = await axios.get(`http://localhost:5000/api/orders/restaurant/${restaurantId}`);
        calculateTopSales(resOrders.data);

      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };
    fetchData();
  }, [navigate, restaurantId]);

  // --- LOGIC TO FIND TOP SELLING ITEMS ---
  const calculateTopSales = (orders) => {
    const salesMap = {};

    // Inside calculateTopSales function...
  orders.forEach(order => {
      // Logic: Try to get name from Listing (if alive), OR use the saved 'itemTitle' (if deleted)
      const title = order.listingId?.title || order.itemTitle || "Deleted Item";
      
      if (salesMap[title]) {
        salesMap[title] += 1;
      } else {
        salesMap[title] = 1;
      }
    });

    // Convert to array and sort by highest count
    const sortedSales = Object.entries(salesMap)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count) // Sort High to Low
      .slice(0, 5); // Take only Top 5

    setTopItems(sortedSales);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Business Analytics 📈</h1>
        <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#333', color: 'white' }}>Back to Dashboard</button>
      </div>

      {/* --- SECTION 1: TOP SALES --- */}
      <div style={{ marginBottom: '40px' }}>
        <h2>🏆 Top Selling Items</h2>
        {topItems.length === 0 ? (
          <p style={{ color: 'gray' }}>No sales data yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            {topItems.map((item, index) => (
              <div key={index} style={{ 
                backgroundColor: 'white', padding: '15px', borderRadius: '8px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between' 
              }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>#{index + 1} {item.title}</span>
                <span style={{ color: 'green', fontWeight: 'bold' }}>{item.count} Sold</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- SECTION 2: REVIEWS --- */}
      <div>
        <h2>⭐ Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p style={{ color: 'gray' }}>No reviews yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {reviews.map((rev) => (
              <div key={rev._id} style={{ 
                backgroundColor: 'white', padding: '20px', borderRadius: '10px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '5px solid orange'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>{rev.studentId?.name || "Anonymous"}</strong>
                  <span style={{ color: '#666', fontSize: '0.9em' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                
                {/* Star Rating Display */}
                <div style={{ color: 'gold', fontSize: '1.2em', marginBottom: '5px' }}>
                  {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                </div>
                
                <p style={{ margin: 0, fontStyle: 'italic', color: '#333' }}>"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default RestaurantAnalytics;