import React from 'react';

interface BackgroundModeIndicatorProps {
  isVisible: boolean;
}

const BackgroundModeIndicator: React.FC<BackgroundModeIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="background-mode-indicator"
      className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-pulse transition-opacity duration-300"
      role="status"
      aria-live="polite"
    >
      <i className="fas fa-sync-alt animate-spin"></i>
      <span>El temporizador sigue funcionando en segundo plano</span>
    </div>
  );
};

export default BackgroundModeIndicator;