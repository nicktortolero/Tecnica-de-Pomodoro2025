import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  let baseClasses = 'font-bold py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  if (variant === 'primary') {
    baseClasses += ' bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
  } else if (variant === 'secondary') {
    baseClasses += ' bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500';
  } else if (variant === 'danger') {
    baseClasses += ' bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
  } else if (variant === 'ghost') {
    baseClasses += ' bg-transparent hover:bg-gray-700 text-white focus:ring-gray-500';
  }

  if (size === 'sm') {
    baseClasses += ' text-sm py-1 px-3';
  } else if (size === 'lg') {
    baseClasses += ' text-lg py-3 px-6';
  }

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {icon && <i className={`${icon} mr-2`}></i>}
      {children}
    </button>
  );
};

export default Button;