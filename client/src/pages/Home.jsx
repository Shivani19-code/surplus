import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [favorites, setFavorites] = useState([]); // Stores list of liked item IDs
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const studentId = localStorage.getItem('userId');

  // Fetch items AND favorites when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resItems = await axios.get('http://localhost:5000/api/listings/all');
        setListings(resItems.data);
        setFilteredListings(resItems.data);

        if (studentId) {
          const resFavs = await axios.get(`http://localhost:5000/api/favorites/${studentId}`);
          // Extract just the listing IDs to make checking easier
          const favIds = resFavs.data.map(f => f.listingId._id);
          setFavorites(favIds);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [studentId]);

  // --- FILTERING LOGIC ---
  useEffect(() => {
    let result = listings;
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }
    if (searchTerm) {
      result = result.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredListings(result);
  }, [searchTerm, selectedCategory, listings]);

  const handleBuy = (item) => {
    if (!studentId) return alert("Please login to buy!");
    navigate('/payment', { state: { item } });
  };

  // --- NOTIFICATION SYSTEM ---
  useEffect(() => {
    const checkNotifications = async () => {
      if (!studentId) return;
      try {
        // Get my favorites
        const res = await axios.get(`http://localhost:5000/api/favorites/${studentId}`);
        const myFavs = res.data;

        // Check if any favorite has low stock (less than 3)
        myFavs.forEach(fav => {
            if (fav.listingId && fav.listingId.quantity > 0 && fav.listingId.quantity < 3) {
                alert(`Hurry! Your favorite item "${fav.listingId.title}" is running low on stock! (${fav.listingId.quantity} left)`);
            }
        });
      } catch (err) {
        console.error("Notification check failed");
      }
    };
    
    // Run this check once when the home page loads
    checkNotifications();
  }, [studentId]);

  // --- NEW: HANDLE FAVORITE TOGGLE ---
  const handleToggleFavorite = async (item) => {
    if (!studentId) return alert("Please login to like items!");

    try {
      const res = await axios.post('http://localhost:5000/api/favorites/toggle', {
        studentId,
        listingId: item._id
      });

      if (res.data.status === 'added') {
        setFavorites([...favorites, item._id]); // Add heart to UI
      } else {
        setFavorites(favorites.filter(id => id !== item._id)); // Remove heart from UI
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
  <div className="page">

    {/* Header */}
    <div className="home-header">
      <h1 className="home-title">Campus Marketplace 🛒</h1>

      <div className="header-actions">
        <button
          className="btn pink"
          onClick={() => navigate('/my-favorites')}
        >
          Favorites ❤️
        </button>

        <button
          className="btn orange"
          onClick={() => navigate('/my-orders')}
        >
          Orders
        </button>

        <button
          className="btn dark"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>

    {/* Search */}
    <div className="search-box">
      <input
        type="text"
        placeholder="Search for items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/* Categories */}
    <div className="category-tabs">
      {['all', 'food', 'electronics', 'clothing', 'other'].map((cat) => (
        <button
          key={cat}
          className={`tab ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => setSelectedCategory(cat)}
        >
          {cat === 'all' ? 'All Items' : cat}
        </button>
      ))}
    </div>

    {/* Items Grid */}
    <div className="items-grid">
      {filteredListings.length === 0 ? (
        <p className="empty-text">No items found.</p>
      ) : (
        filteredListings.map((item) => (
          <div className="item-card" key={item._id}>

            {/* Favorite */}
            <button
              className={`heart ${favorites.includes(item._id) ? 'liked' : ''}`}
              onClick={() => handleToggleFavorite(item)}
            >
              {favorites.includes(item._id) ? '❤️' : '🤍'}
            </button>

            {/* Category */}
            <span className="badge">
              {item.category ? item.category.toUpperCase() : 'FOOD'}
            </span>

            <h3>{item.title}</h3>

            <div className="price">
              <span className="old">${item.originalPrice}</span>
              <span className="new">${item.discountedPrice}</span>
            </div>

            <p>📍 Pickup: {item.pickupTime}</p>

            <p className="location">
              🏠 <strong>Location:</strong>{' '}
              {item.restaurantId?.address || 'Not listed'}
            </p>

            <p className="stock">📦 {item.quantity} left</p>

            <button
              className="buy-btn"
              onClick={() => handleBuy(item)}
            >
              Add to Cart
            </button>

          </div>
        ))
      )}
    </div>

  </div>
);

}

export default Home;
