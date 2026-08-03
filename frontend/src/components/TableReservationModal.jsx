import React, { useState } from 'react';
import './TableReservationModal.css';

const HOTELS = [
  { id: 1, name: 'Punjab Rasoi', location: 'JP Nagar, Mysore', cuisine: 'North Indian & Tandoor', rating: 4.9, image: '/images/butter-chicken.jpg' },
  { id: 2, name: 'Haveli North Indian', location: 'Mahadevapura, Mysore', cuisine: 'Royal Mughlai & Paneer', rating: 4.8, image: '/images/paneer-butter-masala.jpg' },
  { id: 3, name: 'Kashmiri Zaika', location: 'Mysore Main Road', cuisine: 'Kashmiri & Dum Mutton', rating: 4.9, image: '/images/rogan-josh.jpg' },
  { id: 4, name: 'Dhaba 1986', location: 'Ring Road, Mysore', cuisine: 'Authentic Slow Cooked Dal & Rotis', rating: 4.9, image: '/images/dal-makhani.jpg' }
];

const TableReservationModal = ({ isOpen, onClose, selectedHotelName }) => {
  const [formData, setFormData] = useState({
    customerName: 'Chaithanya Gowda',
    customerPhone: '9591791336',
    customerEmail: 'chaithanyagowda762@gmail.com',
    hotelName: selectedHotelName || 'Punjab Rasoi',
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '19:30',
    guestCount: 2,
    seatingPreference: 'Indoor AC',
    specialRequest: 'Anniversary celebration table near window if possible'
  });

  const [submitted, setSubmitted] = useState(false);
  const [notification, setNotification] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate booking & API submission to backend (/api/reservations)
    const mockSms = `📱 SMS sent to +91 ${formData.customerPhone}: Table for ${formData.guestCount} booked at ${formData.hotelName} on ${formData.reservationDate} at ${formData.reservationTime}!`;
    const mockEmail = `✉️ Email sent to ${formData.customerEmail}: Booking Ref #TR-${Math.floor(1000 + Math.random() * 9000)}`;

    setNotification({
      sms: mockSms,
      email: mockEmail
    });
    setSubmitted(true);
  };

  return (
    <div className="reservation-modal-backdrop fade-in">
      <div className="reservation-modal-card glass-luxury-god-panel">
        <button className="reservation-close-btn" onClick={onClose}>✕</button>

        {!submitted ? (
          <>
            <div className="reservation-header">
              <div className="section-eyebrow">
                <span className="sparkle">🍷</span> FINE DINING RESERVATIONS
              </div>
              <h2>Reserve a Table at {formData.hotelName}</h2>
              <p>Book your VIP table instantly with instant SMS & Email confirmation</p>
            </div>

            <form className="reservation-form" onSubmit={handleSubmit}>
              <div className="form-group-grid">
                <div className="form-field">
                  <label>Select Restaurant / Hotel</label>
                  <select 
                    name="hotelName" 
                    value={formData.hotelName}
                    onChange={handleChange}
                    className="reservation-select"
                  >
                    {HOTELS.map(h => (
                      <option key={h.id} value={h.name}>{h.name} — ({h.location})</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Guest Count</label>
                  <select 
                    name="guestCount" 
                    value={formData.guestCount}
                    onChange={handleChange}
                    className="reservation-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group-grid">
                <div className="form-field">
                  <label>Date</label>
                  <input 
                    type="date" 
                    name="reservationDate"
                    value={formData.reservationDate}
                    onChange={handleChange}
                    className="reservation-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Time Slot</label>
                  <select 
                    name="reservationTime"
                    value={formData.reservationTime}
                    onChange={handleChange}
                    className="reservation-select"
                  >
                    <option value="12:30">12:30 PM (Lunch)</option>
                    <option value="13:30">01:30 PM (Lunch)</option>
                    <option value="19:00">07:00 PM (Dinner)</option>
                    <option value="19:30">07:30 PM (Dinner)</option>
                    <option value="20:30">08:30 PM (Dinner)</option>
                    <option value="21:30">09:30 PM (Late Night)</option>
                  </select>
                </div>
              </div>

              <div className="form-group-grid">
                <div className="form-field">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="reservation-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Mobile Number (For SMS)</label>
                  <input 
                    type="tel" 
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="reservation-input"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Email Address (For Confirmation Email)</label>
                <input 
                  type="email" 
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  className="reservation-input"
                  required
                />
              </div>

              <div className="form-field">
                <label>Seating & Special Requests</label>
                <input 
                  type="text" 
                  name="specialRequest"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  placeholder="e.g. Window seat, anniversary, quiet corner"
                  className="reservation-input"
                />
              </div>

              <button type="submit" className="btn-confirm-reservation">
                🍷 Confirm Table Reservation
              </button>
            </form>
          </>
        ) : (
          <div className="reservation-success-card fade-in">
            <div className="success-icon-badge">🎉</div>
            <h2>Table Reserved Successfully!</h2>
            <p className="success-subtitle">We look forward to welcoming you at <strong>{formData.hotelName}</strong></p>

            <div className="reservation-details-box">
              <div className="detail-row">
                <span>📍 Restaurant:</span>
                <strong>{formData.hotelName}</strong>
              </div>
              <div className="detail-row">
                <span>📅 Date & Time:</span>
                <strong>{formData.reservationDate} at {formData.reservationTime}</strong>
              </div>
              <div className="detail-row">
                <span>👥 Guests:</span>
                <strong>{formData.guestCount} People ({formData.seatingPreference})</strong>
              </div>
            </div>

            {/* SMS & EMAIL NOTIFICATION PROOF BADGES */}
            <div className="notification-proof-box">
              <h4>Notifications Sent:</h4>
              <div className="notify-badge sms">
                {notification?.sms}
              </div>
              <div className="notify-badge email">
                {notification?.email}
              </div>
            </div>

            <button className="btn-done-reservation" onClick={onClose}>
              Done & Return to FlavorDash
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableReservationModal;
