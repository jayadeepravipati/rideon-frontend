import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import './AdminDashboard.css';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bikeData, setBikeData] = useState({
    name: "",
    type: "",
    pricePerDay: "",
    location: "",
    image: null
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState({
    totalBikes: 0,
    totalUsers: 0,
    totalOrders: 0
  });

  const availableLocations = [
    "Rajahmundry",
    "Vijayawada",
    "Visakhapatnam",
    "Hyderabad"
  ];

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication error! Please log in again.");
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchBikes = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bikes");
      console.log("Initial bike data:", res.data);

      const bikesWithImages = await Promise.all(
        res.data.map(async bike => {
          try {
            const bikeRes = await axios.get(`http://localhost:5000/api/bikes/${bike._id}/full`);
            console.log(`Bike ${bike._id} image data:`, !!bikeRes.data.image?.data);
            return bikeRes.data;
          } catch (error) {
            console.error(`Error fetching image for bike ${bike._id}:`, error);
            return {
              ...bike,
              image: null
            };
          }
        })
      );

      console.log("Final bikes data:", bikesWithImages);
      setBikes(bikesWithImages);
    } catch (error) {
      console.error("Error fetching bikes:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/users", getAuthConfig());
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    fetchBikes();
    fetchUsers();
  }, [fetchBikes, fetchUsers]);

  useEffect(() => {
    setStats({
      totalBikes: bikes.length,
      totalUsers: users.length,
      totalOrders: bookings.length
    });
  }, [bikes, users, bookings]);

  // Fetch bookings when order management section is opened
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (activeSection === "orderManage") {
      fetchBookings();
    }
  }, [activeSection]);

  const handleImageChange = (e) => {
    setBikeData({
      ...bikeData,
      image: e.target.files[0]
    });
  };

  const sendWhatsAppMessage = (phone, message) => {
    const digitsOnly = phone.replace(/\D/g, '');
    const countryCode = '+91';
    let formattedPhone = digitsOnly;

    if (!digitsOnly.startsWith(countryCode.replace('+', ''))) {
      formattedPhone = countryCode + digitsOnly;
    }

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddBike = async (e) => {
    e.preventDefault();
    const config = getAuthConfig();
    if (!config) return;

    const formData = new FormData();
    formData.append("name", bikeData.name);
    formData.append("type", bikeData.type);
    formData.append("pricePerDay", bikeData.pricePerDay);
    formData.append("location", bikeData.location);
    if (bikeData.image) {
      formData.append("image", bikeData.image);
    }

    try {
      await axios.post(
        "http://localhost:5000/api/bikes",
        formData,
        {
          ...config,
          headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Bike added successfully!");
      setBikeData({
        name: "",
        type: "",
        pricePerDay: "",
        location: "",
        image: null
      });
      fetchBikes();
    } catch (error) {
      console.error("Error adding bike:", error);
      alert(error.response?.data?.message || "Failed to add bike");
    }
  };

  const handleDeleteBike = async (id) => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      await axios.delete(`http://localhost:5000/api/bikes/${id}`, config);
      fetchBikes();
    } catch (error) {
      console.error("Error deleting bike:", error);
      alert("Failed to delete bike");
    }
  };

  const handleDeleteUser = async (id) => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-link ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`sidebar-link ${activeSection === "addBike" ? "active" : ""}`}
            onClick={() => setActiveSection("addBike")}
          >
            Add Bike
          </button>
          <button
            className={`sidebar-link ${activeSection === "manageBikes" ? "active" : ""}`}
            onClick={() => setActiveSection("manageBikes")}
          >
            Manage Bikes
          </button>
          <button
            className={`sidebar-link ${activeSection === "manageUsers" ? "active" : ""}`}
            onClick={() => setActiveSection("manageUsers")}
          >
            Manage Users
          </button>
          <button
            className={`sidebar-link ${activeSection === "orderManage" ? "active" : ""}`}
            onClick={() => setActiveSection("orderManage")}
          >
            Manage Orders
          </button>
          <button
            className="sidebar-link logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="dashboard-section">
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Bikes</h3>
                <p>{stats.totalBikes}</p>
              </div>
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p>{stats.totalOrders}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Bike Section */}
        {activeSection === "addBike" && (
          <div className="form-section">
            <h1>Add New Bike</h1>
            <form onSubmit={handleAddBike} className="bike-form">
              <div className="form-group">
                <label>Bike Name</label>
                <input
                  type="text"
                  placeholder="Enter bike name"
                  value={bikeData.name}
                  onChange={(e) => setBikeData({...bikeData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bike Type</label>
                <input
                  type="text"
                  placeholder="Enter bike type"
                  value={bikeData.type}
                  onChange={(e) => setBikeData({...bikeData, type: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price Per Day (₹)</label>
                <input
                  type="number"
                  placeholder="Enter price per day"
                  value={bikeData.pricePerDay}
                  onChange={(e) => setBikeData({...bikeData, pricePerDay: e.target.value})}
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <select
                  value={bikeData.location}
                  onChange={(e) => setBikeData({...bikeData, location: e.target.value})}
                  required
                  className="location-dropdown"
                >
                  <option value="">Select a location</option>
                  {availableLocations.map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Bike Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Add Bike
              </button>
            </form>
          </div>
        )}

        {/* Manage Bikes Section */}
        {activeSection === "manageBikes" && (
          <div className="list-section">
            <h1>Manage Bikes</h1>
            <div className="bike-grid">
              {bikes.map(bike => (
                <div key={bike._id} className="bike-card">
                  <div className="image-container">
                    {bike.image?.data ? (
                      <img
                        src={`data:${bike.image.contentType};base64,${bike.image.data}`}
                        alt={bike.name}
                        className="bike-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.jpg';
                          console.error('Image load failed:', bike._id);
                        }}
                        onLoad={() => console.log('Image loaded:', bike._id)}
                      />
                    ) : (
                      <div className="image-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="bike-details">
                    <h3>{bike.name}</h3>
                    <p><strong>Type:</strong> {bike.type}</p>
                    <p><strong>Price:</strong> {bike.pricePerDay}/day</p>
                    <p><strong>Location:</strong> {bike.location}</p>
                    <button
                      onClick={() => handleDeleteBike(bike._id)}
                      className="delete-btn"
                    >
                      Delete Bike
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manage Users Section */}
        {activeSection === "manageUsers" && (
          <div className="list-section">
            <h1>Manage Users</h1>
            <div className="user-table">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.email}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Manage Orders Section */}
        {activeSection === "orderManage" && (
          <div className="list-section">
            <h1>Order Management</h1>
            <table className="table">
              <thead>
                <tr>
                  <th>Bike</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Dates</th>
                  <th>Booked On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>
                      {booking.bikeName} ({booking.bikeType})<br />
                      ₹{booking.bikePrice}/day - {booking.bikeLocation}
                    </td>
                    <td>{booking.customerName}</td>
                    <td>{booking.customerPhone}</td>
                    <td>
                      {new Date(booking.startDate).toLocaleDateString()} -<br />
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td>{new Date(booking.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          const message = `Your booking for ${booking.bikeName} (₹${booking.bikePrice}/day) has been confirmed!`;
                          sendWhatsAppMessage(booking.customerPhone, message);
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => {
                          const message = `Sorry, your booking for ${booking.bikeName} has been cancelled.`;
                          sendWhatsAppMessage(booking.customerPhone, message);
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;