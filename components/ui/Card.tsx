import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md'
}) => {
  const hoverStyles = hover ? 'hover:shadow-medium transition-shadow duration-300' : '';

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-soft ${hoverStyles} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
