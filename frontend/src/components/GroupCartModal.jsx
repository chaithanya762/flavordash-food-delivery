import React, { useState } from 'react';
import './GroupCartModal.css';

export default function GroupCartModal({ isOpen, onClose, cartItems, totalPrice }) {
  const [roomCode] = useState('FLAVOR-4892');
  const [copied, setCopied] = useState(false);

  const members = [
    { name: 'Alex Johnson (You)', items: cartItems.slice(0, 2), share: Math.round(totalPrice * 0.55), paid: true },
    { name: 'Priya Sharma 🟢', items: cartItems.slice(2, 3), share: Math.round(totalPrice * 0.25), paid: true },
    { name: 'Rahul Verma 🔴', items: cartItems.slice(3), share: Math.round(totalPrice * 0.20), paid: false },
  ];

  if (!isOpen) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(`https://flavordash.app/group/${roomCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="group-modal-card glass-god-card" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>✕</button>

        <div className="modal-header text-center">
          <span className="modal-icon">👥</span>
          <h2>Multi-User Collaborative Cart</h2>
          <p>Share room code to add items together & split bill instantly!</p>
        </div>

        {/* Room Share Box */}
        <div className="room-share-box glass-card">
          <div className="room-code-info">
            <span className="room-label">ROOM PASSCODE</span>
            <span className="room-code">{roomCode}</span>
          </div>
          <button className="copy-btn" onClick={copyCode}>
            {copied ? 'Copied! 🚀' : 'Copy Link 🔗'}
          </button>
        </div>

        {/* Members Split List */}
        <div className="members-split-section">
          <h3>Group Members & Split Shares</h3>
          <div className="members-list">
            {members.map((member, idx) => (
              <div key={idx} className="member-row glass-card">
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-items-count">
                    {member.items.length > 0 
                      ? member.items.map(i => i.product.name).join(', ') 
                      : 'Selected items'}
                  </span>
                </div>
                <div className="member-share">
                  <span className="share-amount">₹{member.share}</span>
                  <span className={`pay-status ${member.paid ? 'paid' : 'pending'}`}>
                    {member.paid ? 'Paid via UPI ✅' : 'Pending ⏳'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary btn-block" onClick={onClose}>
            Request Pending Split (₹{Math.round(totalPrice * 0.20)})
          </button>
        </div>
      </div>
    </div>
  );
}
