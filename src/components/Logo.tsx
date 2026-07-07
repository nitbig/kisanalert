import React from 'react';

export function LogoFull({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      width="255" 
      height="64" 
      viewBox="0 0 255 64" 
      xmlns="http://www.w3.org/2000/svg" 
      role="img" 
      aria-label="Kisan Alert logo"
    >
      <title>Kisan Alert</title>
      <g fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(0 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(45 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(90 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(135 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(180 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(225 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(270 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(315 32 32)"/>
        <circle cx="32" cy="32" r="2.6"/>
      </g>
      <text x="90" y="40" fontFamily="Montserrat, 'Poppins', system-ui, sans-serif" fontSize="24" fontWeight="700" fill="currentColor" stroke="none">Kisan Alert</text>
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 64 64" 
      xmlns="http://www.w3.org/2000/svg" 
      role="img" 
      aria-label="Kisan Alert logomark"
    >
      <title>Kisan Alert Logo</title>
      <g fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(0 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(45 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(90 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(135 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(180 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(225 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(270 32 32)"/>
        <path d="M32 32 C26.2 28 24.8 16.4 32 9 C39.2 16.4 37.8 28 32 32 Z" transform="rotate(315 32 32)"/>
        <circle cx="32" cy="32" r="2.6"/>
      </g>
    </svg>
  );
}
