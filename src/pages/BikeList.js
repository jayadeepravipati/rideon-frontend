import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const BikeList = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    fromDate: '',
    toDate: ''
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get('city');
  const fromDate = queryParams.get('from');
  const toDate = queryParams.get('to');

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const basicResponse = await axios.get("http://localhost:5000/api/bikes");
        const filteredBikes = city 
          ? basicResponse.data.filter(bike => 
              bike.location.toLowerCase() === city.toLowerCase()
            )
          : basicResponse.data;

        const bikesWithImages = await Promise.all(
          filteredBikes.map(async bike => {
            try {
              const fullResponse = await axios.get(
                `http://localhost:5000/api/bikes/${bike._id}/full`
              );
              return fullResponse.data;
            } catch (imgError) {
              console.error(`Error loading full bike data for ${bike._id}:`, imgError);
              return {
                ...bike,
                image: null
              };
            }
          })
        );

        setBikes(bikesWithImages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBikes();
  }, [city]);

  const handleBookNow = (bike) => {
    setSelectedBike(bike);
    setBookingForm({
      ...bookingForm,
      fromDate: fromDate || '',
      toDate: toDate || ''
    });
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate all required fields
      if (!selectedBike?._id || !bookingForm.fromDate || !bookingForm.toDate || !bookingForm.name || !bookingForm.phone) {
        alert('Please fill in all required fields');
        return;
      }
  
      // Calculate total days and amount
      const fromDate = new Date(bookingForm.fromDate);
      const toDate = new Date(bookingForm.toDate);
      const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) || 1;
      const totalAmount = selectedBike.pricePerDay * days;
  
      const bookingData = {
        bike: selectedBike._id,  // Changed from bikeId to bike to match model
        bikeName: selectedBike.name,
        bikeType: selectedBike.type,
        bikePrice: selectedBike.pricePerDay,
        bikeLocation: selectedBike.location,
        customerName: bookingForm.name.trim(),
        customerPhone: bookingForm.phone.trim(),
        startDate: fromDate,  // Changed from fromDate to startDate to match model
        endDate: toDate,      // Changed from toDate to endDate to match model
        totalAmount: totalAmount
      };
  
      console.log('Submitting booking:', bookingData); // Debug log
  
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Booking response:', response.data); // Debug log
      
      setShowBookingModal(false);
      alert('Booking successful! Our team will contact you shortly.');
    } catch (err) {
      console.error('Booking error details:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.join('\n') || 
                          err.message || 
                          'Booking failed. Please try again.';
      alert(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number input
    if (name === 'phone') {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // Auto-add country code if missing
      let formattedValue = digitsOnly;
      if (digitsOnly && !digitsOnly.startsWith('91')) { // For India
        formattedValue = '91' + digitsOnly;
      }
      
      setBookingForm({
        ...bookingForm,
        [name]: formattedValue
      });
      return;
    }
    
    setBookingForm({
      ...bookingForm,
      [name]: value
    });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>{city ? `Available Bikes in ${city}` : 'All Available Bikes'}</h2>
      {city && <p>From: {fromDate || 'Not specified'} To: {toDate || 'Not specified'}</p>}
      
      <div className="row">
        {bikes.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              {city ? `No bikes available in ${city}` : 'No bikes available'}
            </div>
          </div>
        ) : (
          bikes.map(bike => (
            <div key={bike._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-img-container" style={{ 
                  height: '200px', 
                  overflow: 'hidden',
                  backgroundColor: '#f8f9fa'
                }}>
                  {bike.image?.data ? (
                    <img 
                      src={`data:${bike.image.contentType};base64,${bike.image.data}`}
                      className="card-img-top h-100 w-100"
                      alt={bike.name}
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-bike.jpg';
                      }}
                    />
                  ) : (
                    <img
                      src="/placeholder-bike.jpg"
                      className="card-img-top h-100 w-100"
                      alt="Placeholder"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{bike.name}</h5>
                  <p className="card-text">
                    <strong>Type:</strong> {bike.type}<br />
                    <strong>Price:</strong> ₹{bike.pricePerDay}/day<br />
                    <strong>Location:</strong> {bike.location}
                  </p>
                  <button 
                    className="btn btn-primary mt-auto"
                    onClick={() => handleBookNow(bike)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book {selectedBike?.name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBookingSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={bookingForm.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Phone Number </Form.Label>
  <Form.Control
    type="tel"
    name="phone"
    value={bookingForm.phone}
    onChange={handleInputChange}
    placeholder="91XXXXXXXXXX" // Example for India
    pattern="[0-9]{10,12}"
    title="Please include country code (e.g., 91 for India)"
    required
  />
  <Form.Text className="text-muted">
  </Form.Text>
</Form.Group>
<Form.Group className="mb-3">
  <Form.Label>From Date *</Form.Label>
  <Form.Control
    type="date"
    name="fromDate"
    value={bookingForm.fromDate}
    onChange={handleInputChange}
    required
    min={new Date().toISOString().split('T')[0]}
  />
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>To Date *</Form.Label>
  <Form.Control
    type="date"
    name="toDate"
    value={bookingForm.toDate}
    onChange={handleInputChange}
    required
    min={bookingForm.fromDate || new Date().toISOString().split('T')[0]}
    disabled={!bookingForm.fromDate}
  />
</Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Confirm Booking
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default BikeList;