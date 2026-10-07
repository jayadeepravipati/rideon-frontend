import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import image from "../images/rideon.png";
// Import city images
import rajahmundryImage from "../images/rjy.jpg";
import vijayawadaImage from "../images/vjw.jpg";
import visakhapatnamImage from "../images/viz.jpg";
import hyderabadImage from "../images/hyd.jpg";
import defaultImage from "../images/mainimage.jpg";

export default function Mainpage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  const cities = ["Rajahmundry", "Vijayawada", "Visakhapatnam", "Hyderabad",];

  const getCityImage = () => {
    switch(selectedCity) {
      case "Rajahmundry": return rajahmundryImage;
      case "Vijayawada": return vijayawadaImage;
      case "Visakhapatnam": return visakhapatnamImage;
      case "Hyderabad": return hyderabadImage;
      default: return defaultImage;
    }
  };

  const handleSearch = () => {
    if (!selectedCity) {
      alert("Please select a city");
      return;
    }
    navigate(`/bikes?city=${selectedCity}&from=${fromDate}&to=${toDate}`);
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0" style={{ overflow: 'hidden' }}>
      {/* Left Section - Form & Logo */}
      <div className="left-section d-flex flex-column justify-content-center align-items-center" style={{
        width: '50%',
        backgroundColor: '#f5f5f5',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
          <img src={image} alt="RideOn Logo" style={{ height: '50px' }} />
        </div>

        <div className="form-box p-4 border rounded shadow-lg text-center" style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#fff'
        }}>
          <h1>EASY BIKE <span className="text-warning">BOOKING</span></h1>
          <h5>Two Wheeler For Rent in India</h5>

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

          <div className="mb-3">
            <input 
              type="date" 
              className="form-control" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
            />
          </div>
          <div className="mb-3">
            <input 
              type="date" 
              className="form-control" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
            />
          </div>

          <button className="btn btn-warning w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="right-section" style={{
        width: '50%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img 
          src={getCityImage()} 
          alt={selectedCity || "Select a city"} 
          style={{
            width: '100%',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block'
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        {!selectedCity && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px'
          }}>
            {/* <h3>Select a city to view bikes</h3> */}
          </div>
        )}
      </div>
    </div>
  );
}