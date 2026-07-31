import React from 'react';
import './OrderTracker.css';

const OrderTracker = ({ status = 'CONFIRMED' }) => {
  const steps = [
    { id: 'PENDING', label: 'Order Placed', icon: '📋', time: '12:00 PM' },
    { id: 'CONFIRMED', label: 'Chef Cooking', icon: '🍳', time: '12:02 PM' },
    { id: 'PAID', label: 'Out for Delivery', icon: '🛵', time: '12:15 PM' },
    { id: 'DELIVERED', label: 'Delivered', icon: '🏠', time: '12:28 PM' }
  ];

  const getStepIndex = (st) => steps.findIndex(s => s.id === st);
  const currentIndex = getStepIndex(status) === -1 ? 1 : getStepIndex(status);
  const isCancelled = status === 'CANCELLED';

  const getProgressWidth = () => {
    if (isCancelled) return '100%';
    return `${(currentIndex / (steps.length - 1)) * 100}%`;
  };

  return (
    <div className="order-tracker-god">
      <div className="live-event-banner">
        <div className="live-pulse-dot"></div>
        <span className="live-event-text">
          {currentIndex === 0 && '⚡ Event: Order Accepted by Kitchen'}
          {currentIndex === 1 && '🍳 Event: Chef is preparing your hot meal (Kafka Sync)'}
          {currentIndex === 2 && '🛵 Event: Delivery partner Ramesh is en route to doorstep'}
          {currentIndex === 3 && '✅ Event: Order delivered hot & fresh!'}
        </span>
      </div>

      <div className="stepper">
        <div className="connecting-line">
          <div 
            className={`connecting-line-progress ${isCancelled ? 'cancelled' : ''}`}
            style={{ width: getProgressWidth() }}
          ></div>
        </div>

        {steps.map((step, index) => {
          let stepState = '';
          if (isCancelled) {
            stepState = 'cancelled';
          } else if (index < currentIndex) {
            stepState = 'completed';
          } else if (index === currentIndex) {
            stepState = 'active';
          }

          return (
            <div key={step.id} className={`step ${stepState}`}>
              <div className="step-circle">
                {step.icon}
              </div>
              <div className="step-label">{step.label}</div>
              <div className="step-time">{step.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
