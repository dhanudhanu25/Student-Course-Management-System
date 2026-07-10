import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';

  if (fullScreen) {
    return (
      <div className="loading-fullscreen d-flex flex-column align-items-center justify-content-center">
        <div className={`spinner-border text-primary ${sizeClass}`} role="status">
          <span className="visually-hidden">{text}</span>
        </div>
        <p className="mt-3 text-muted">{text}</p>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <div className={`spinner-border text-primary ${sizeClass}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
