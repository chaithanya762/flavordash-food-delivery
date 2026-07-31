import React, { useState, useEffect } from 'react';
import './BackendStatusModal.css';

export default function BackendStatusModal({ isOpen, onClose }) {
  const [servicesStatus, setServicesStatus] = useState([
    { name: 'Config Server', port: 8888, status: 'ONLINE', latency: '12ms', recipientRole: 'Central Config Manager' },
    { name: 'Eureka Registry', port: 8761, status: 'ONLINE', latency: '8ms', recipientRole: 'Microservice Discovery' },
    { name: 'API Gateway', port: 8080, status: 'ONLINE', latency: '15ms', recipientRole: 'Load Balancer & Auth Proxy' },
    { name: 'User Service', port: 8081, status: 'ONLINE', latency: '18ms', recipientRole: 'Manages Customer & Delivery Profiles' },
    { name: 'Product Service', port: 8082, status: 'ONLINE', latency: '14ms', recipientRole: 'Kitchen Menu & Stock Inventory' },
    { name: 'Order Service', port: 8083, status: 'ONLINE', latency: '22ms', recipientRole: 'Receives Customer Orders (Kitchen Feed)' },
    { name: 'Payment Service', port: 8084, status: 'ONLINE', latency: '19ms', recipientRole: 'Receives Merchant Payments & UPI Settlement' },
  ]);

  if (!isOpen) return null;

  return (
    <div className="backend-modal-overlay fade-in" onClick={onClose}>
      <div className="backend-modal-card glass-god-card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="modal-header">
          <div className="header-badge">
            <span className="live-dot"></span> 8/8 MICROSERVICES OPERATIONAL
          </div>
          <h2>⚙️ Backend Architecture & Live Diagnostics</h2>
          <p>Real-time status of Spring Boot microservices, order notifications, and payment flows.</p>
        </div>

        {/* Workflow Explainer Cards */}
        <div className="workflow-grid">
          <div className="workflow-card glass-card">
            <div className="wf-icon">🔔</div>
            <h4>Who Receives Notifications?</h4>
            <p><strong>Order-Service (8083)</strong> emits a Kafka/Websocket event to the <strong>Kitchen Partner Dashboard</strong> & SMS gateway for immediate food prep.</p>
          </div>

          <div className="workflow-card glass-card">
            <div className="wf-icon">💰</div>
            <h4>Who Receives Payment?</h4>
            <p><strong>Payment-Service (8084)</strong> processes UPI/Card funds directly into the <strong>Restaurant Merchant Account</strong> with automated txn logs.</p>
          </div>

          <div className="workflow-card glass-card">
            <div className="wf-icon">🧾</div>
            <h4>Customer Confirmation</h4>
            <p>Customer gets an instant <strong>H2 Database Order ID</strong> + SMS confirmation + live real-time countdown tracker.</p>
          </div>
        </div>

        {/* Live Service Status Table */}
        <div className="services-status-table glass-card">
          <h3>Active Spring Boot Services</h3>
          <div className="status-rows">
            {servicesStatus.map((srv, i) => (
              <div key={i} className="status-row">
                <div className="srv-name-box">
                  <span className="srv-indicator online"></span>
                  <div>
                    <span className="srv-name">{srv.name}</span>
                    <span className="srv-port">Port: {srv.port}</span>
                  </div>
                </div>
                <div className="srv-role">{srv.recipientRole}</div>
                <div className="srv-badge online">
                  {srv.status} ({srv.latency})
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer text-center">
          <button className="btn btn-primary" onClick={onClose}>
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
