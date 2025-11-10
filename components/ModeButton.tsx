import React from 'react';

interface ModeButtonProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
  activeClass: string;
}

const ModeButton: React.FC<ModeButtonProps> = ({ label, icon, isActive, onClick, activeClass }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center';
  const classes = isActive ? activeClass : 'bg-gray-700 hover:bg-gray-600';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${classes}`}
    >
      <i className={`${icon} mr-2`}></i>
      {label}
    </button>
  );
};

export default ModeButton;