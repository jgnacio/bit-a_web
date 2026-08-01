import React from 'react';
import Button from './Button';

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'ring';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function CTAButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  disabled = false,
  type = 'button'
}: CTAButtonProps) {
  // Mapear los tamaños de CTAButton a los tamaños de Button
  const sizeMap = {
    small: 'sm',
    medium: 'lg',
    large: 'xl'
  } as const;
  
  // Mapear las variantes de CTAButton a las variantes de Button
  const variantMap = {
    primary: 'primary',
    secondary: 'secondary',
    outline: 'outline',
    ghost: 'ghost',
    glass: 'glass',
    ring: 'ring'
  } as const;
  
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variantMap[variant]}
      size={sizeMap[size]}
      className={className}
    >
      {children}
    </Button>
  );
} 