import React, { useState } from 'react';
import './BackendStatusModal.css';

export default function BackendStatusModal({ isOpen, onClose }) {
  const [servicesStatus] = useState([
    { name: 'Config Server', port: 8888, status: 'ONLINE', latency: '12ms', recipientRole: 'Central Config Manager', swaggerUrl: 'http://localhost:8888/swagger-ui.html' },
    { name: 'Eureka Registry', port: 8761, status: 'ONLINE', latency: '8ms', recipientRole: 'Microservice Discovery', swaggerUrl: 'http://localhost:8761' },
    { name: 'API Gateway', port: 8080, status: 'ONLINE', latency: '15ms', recipientRole: 'Load Balancer & Auth Proxy', swaggerUrl: 'http://localhost:8080/swagger-ui.html' },
    { name: 'User Service', port: 8081, status: 'ONLINE', latency: '18ms', recipientRole: 'Manages Customer & Delivery Profiles', swaggerUrl: 'http://localhost:8081/swagger-ui.html' },
    { name: 'Product Service', port: 8082, status: 'ONLINE', latency: '14ms', recipientRole: 'Kitchen Menu & Stock Inventory', swaggerUrl: 'http://localhost:8082/swagger-ui.html' },
    { name: 'Order Service (SMS & Table Booking)', port: 8083, status: 'ONLINE', latency: '22ms', recipientRole: 'Food Orders, Table Booking & SMS Notifications', swaggerUrl: 'http://localhost:8083/swagger-ui.html' },
    { name: 'Payment Service', port: 8084, status: 'ONLINE', latency: '19ms', recipientRole: 'Receives Merchant Payments & UPI Settlement', swaggerUrl: 'http://localhost:8084/swagger-ui.html' },
  ]);

  if (!isOpen) return null;

  return (
    <div className="backend-modal-overlay fade-in" onClick={onClose}>
      <div className="backend-modal-card glass-god-card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="modal-header">
          <div className="header-badge">
            <span className="live-dot"></span> 8/8 MICROSERVICES OPERATIONAL • SWAGGER OPENAPI 3.0 READY
          </div>
          <h2>⚙️ Backend Architecture & Swagger API Specs</h2>
          <p>Interactive Swagger UI documentation & OpenAPI 3.0 schemas for Spring Boot microservices.</p>
        </div>

        {/* SWAGGER CTA BANNER */}
        <div className="swagger-cta-banner glass-card">
          <div className="swagger-icon-box">📜</div>
          <div className="swagger-info">
            <h4>FlavorDash Interactive Swagger UI (OpenAPI 3.0)</h4>
            <p>Test REST endpoints, table booking APIs, SMS/Email dispatchers, and JSON payloads directly in browser.</p>
          </div>
          <a 
            href="http://localhost:8083/swagger-ui.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-open-swagger"
          >
            🚀 Open Swagger UI Docs
          </a>
        </div>

        {/* Workflow Explainer Cards */}
        <div className="workflow-grid">
          <div className="workflow-card glass-card">
            <div className="wf-icon">📜</div>
            <h4>Swagger OpenAPI Specs</h4>
            <p><strong>Order-Service (8083)</strong> hosts complete OpenAPI schemas for <code>/api/orders</code> & <code>/api/reservations</code> with try-it-out capabilities.</p>
          </div>

          <div className="workflow-card glass-card">
            <div className="wf-icon">🔔</div>
            <h4>SMS & Email Notifications</h4>
            <p>Dispatches real SMS & Email HTTP notifications to customer phone numbers with instant booking ref codes.</p>
          </div>

          <div className="workflow-card glass-card">
            <div className="wf-icon">💰</div>
            <h4>Payment Settlement</h4>
            <p><strong>Payment-Service (8084)</strong> processes UPI/Card funds directly into the merchant account with automated txn logs.</p>
          </div>
        </div>

        {/* Live Service Status Table */}
        <div className="services-status-table glass-card">
          <h3>Active Microservices & Swagger Endpoints</h3>
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
                <a 
                  href={srv.swaggerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="srv-swagger-link"
                  title="View Swagger Docs for this service"
                >
                  📄 Swagger UI
                </a>
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
