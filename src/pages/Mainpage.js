import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import image from "../images/rideon.png";
import bikeImage from "../images/mainimage.jpg";

export default function Mainpage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const cities = ["Rajahmundry", "Vijayawada", "Visakhapatnam", "Hyderabad"];

  const handleSearch = () => {
    if (!selectedCity || !fromDate || !toDate) {
      setShowAlert(true);
      return;
    }
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      {/* Left Section - Form & Logo */}
      <div className="left-section d-flex flex-column justify-content-center align-items-center">
        {/* Logo */}
        <div className="position-absolute top-0 start-0 m-3">
          <img src={image} alt="RideOn Logo" className="logo" />
        </div>

        {/* Mobile Login/Register Buttons - Only visible on mobile */}
        <div className="d-block d-md-none position-absolute top-0 end-0 m-3">
          <Link to="/login" className="btn btn-primary btn-sm me-2">Login</Link>
          <Link to="/register" className="btn btn-success btn-sm">Register</Link>
        </div>

        {/* Booking Form */}
        <div className="form-box p-4 border rounded shadow-lg text-center">
          <h1>
            EASY BIKE <span className="text-warning">BOOKING</span>
          </h1>
          <h5>Two Wheeler For Rent in India</h5>

          {/* City Selection */}
          <div className="mb-3">
            <select 
              className="form-select" 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              required
            >
              <option value="">Choose City</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div className="mb-3">
            <input 
              type="date" 
              className="form-control" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="date" 
              className="form-control" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
              required 
              min={fromDate}
            />
          </div>

          {/* Search Button */}
          <button 
            className="btn btn-warning w-100"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Right Section - Image (Hidden on Mobile) */}
      <div className="right-section position-relative">
        <img src={bikeImage} alt="Bike Rental" className="bike-image" />

        {/* Login & Register Buttons on Top Right - Hidden on mobile */}
        <div className="d-none d-md-block position-absolute top-0 end-0 m-3">
          <Link to="/login" className="btn btn-primary me-2">Login</Link>
          <Link to="/register" className="btn btn-success">Register</Link>
        </div>
      </div>

      {/* Custom Alert Box */}
      {showAlert && (
        <div className="custom-alert-overlay">
          <div className="custom-alert-box">
            <div className="custom-alert-header bg-success bg-opacity-75">
              <h5>{!selectedCity || !fromDate || !toDate ? "Missing Information" : "Login Required"}</h5>
              <button 
                type="button" 
                className="close" 
                onClick={closeAlert}
              >
                &times;
              </button>
            </div>
            <div className="custom-alert-body">
              <p>
                {!selectedCity || !fromDate || !toDate 
                  ? "Please fill in all fields to continue." 
                  : "Please login first to continue with your booking."}
              </p>
            </div>
            <div className="custom-alert-footer">
              {(!selectedCity || !fromDate || !toDate) ? (
                <button className="btn btn-success" onClick={closeAlert}>OK</button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="btn btn-primary me-2"
                    onClick={closeAlert}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-success"
                    onClick={closeAlert}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* CSS */
const styles = `
  .left-section {
    width: 50%;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .right-section {
    width: 50%;
    position: relative;
  }
  .bike-image {
    width: 100%;
    height: 100vh;
    object-fit: cover;
  }
  .form-box {
    width: 100%;
    max-width: 450px;
    background-color: #fff;
  }
  .logo {
    height: 50px;
  }
  
  /* Custom Alert Styles */
  .custom-alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .custom-alert-box {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 400px;
    overflow: hidden;
    animation: fadeIn 0.3s ease-out;
  }
  .custom-alert-header {
    background-color: rgba(40, 167, 69, 0.75);
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .custom-alert-header h5 {
    margin: 0;
    font-size: 1.2rem;
  }
  .custom-alert-header .close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }
  .custom-alert-body {
    padding: 20px;
    font-size: 1rem;
    color: #495057;
  }
  .custom-alert-footer {
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #dee2e6;
  }
  
  /* Animation */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .container-fluid {
      flex-direction: column;
    }
    .left-section {
      width: 100%;
      height: 100vh;
      background-image: url(${bikeImage});
      background-size: cover;
      background-position: center;
    }
    .right-section {
      display: none;
    }
    .form-box {
      width: 90%;
      background-color: rgba(255, 255, 255, 0.95);
      padding: 20px;
      border-radius: 10px;
    }
    
    /* Mobile Alert Styles */
    .custom-alert-box {
      width: 95%;
      max-width: 350px;
    }
    .custom-alert-header {
      padding: 12px 15px;
    }
    .custom-alert-body {
      padding: 15px;
    }
    .custom-alert-footer {
      padding: 12px 15px;
    }
  }
`;

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);