import React from 'react';

interface AbhyvexaLogoProps {
  className?: string;
  size?: number | string;
  showTagline?: boolean;
}

export const AbhyvexaLogo: React.FC<AbhyvexaLogoProps> = ({
  className = 'w-full h-full',
  size,
  showTagline = true
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      style={{ display: 'block' }}
      aria-label="ABHYVEXA — Learn Beyond Limits"
    >
      <defs>
        {/* Background Gradients */}
        <radialGradient id="abhyGlowBgReact" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#082b26" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#0a141a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#07080c" stopOpacity="1" />
        </radialGradient>

        {/* Neon Emerald Outer Border Gradient */}
        <linearGradient id="neonBorderGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="30%" stopColor="#06b6d4" />
          <stop offset="70%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        {/* Metallic Silver Gradient */}
        <linearGradient id="silverGradReact" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Vibrant Cyan / Emerald Gradient for A & Accents */}
        <linearGradient id="cyanEmeraldGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="35%" stopColor="#34d399" />
          <stop offset="70%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Ring Swoosh Gradient */}
        <linearGradient id="swooshGradReact" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="40%" stopColor="#10b981" />
          <stop offset="80%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>

        {/* Glow Filters */}
        <filter id="neonGlowReact" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur1" />
          <feGaussianBlur stdDeviation="24" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="softGlowReact" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" opacity="0.8" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Clip Path for Rounded Container */}
        <clipPath id="containerClipReact">
          <rect x="40" y="40" width="720" height="720" rx="140" ry="140" />
        </clipPath>
      </defs>

      {/* Base Dark Background */}
      <rect width="800" height="800" fill="#07080c" />

      {/* Main Container Base with Inner Glow */}
      <g clipPath="url(#containerClipReact)">
        <rect x="40" y="40" width="720" height="720" fill="url(#abhyGlowBgReact)" />
        
        {/* Ambient Center Light Flare */}
        <circle cx="400" cy="360" r="280" fill="#10b981" opacity="0.12" filter="blur(50px)" />
        <circle cx="400" cy="300" r="180" fill="#06b6d4" opacity="0.15" filter="blur(40px)" />

        {/* MAIN EMBLEM: THE STYLIZED 'A' */}
        <g transform="translate(400, 310)">
          {/* Left Leg (Sleek Curve Outer & Inner) */}
          <path d="M 0 -190 L -65 -160 C -120 -40, -170 80, -215 130 C -200 135, -170 135, -135 110 C -95 65, -55 -20, -15 -110 Z" fill="url(#cyanEmeraldGradReact)" />
          
          {/* Right Leg (Sharp Metallic Blade) */}
          <path d="M 0 -190 L 15 -110 C 55 -20, 100 65, 145 125 C 180 140, 215 135, 230 120 C 180 65, 120 -50, 65 -160 Z" fill="url(#silverGradReact)" />
          <path d="M 0 -190 L 65 -160 C 115 -60, 175 40, 220 115 C 205 125, 185 125, 165 110 C 120 40, 65 -50, 15 -110 Z" fill="#e2e8f0" opacity="0.9" />

          {/* Open Book Icon inside lower 'A' notch */}
          <g transform="translate(0, 75) scale(1.15)">
            <path d="M -2 -15 C -25 -28, -55 -25, -75 -12 L -75 25 C -55 12, -25 15, -2 28 Z" fill="#ffffff" filter="url(#softGlowReact)" opacity="0.95" />
            <path d="M -2 -10 C -25 -22, -52 -20, -70 -8 L -70 20 C -52 8, -25 10, -2 22 Z" fill="url(#cyanEmeraldGradReact)" opacity="0.85" />
            
            <path d="M 2 -15 C 25 -28, 55 -25, 75 -12 L 75 25 C 55 12, 25 15, 2 28 Z" fill="#ffffff" filter="url(#softGlowReact)" opacity="0.95" />
            <path d="M 2 -10 C 25 -22, 52 -20, 70 -8 L 70 20 C 52 8, 25 10, 2 22 Z" fill="url(#cyanEmeraldGradReact)" opacity="0.85" />

            <path d="M 0 -18 L 0 30" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Dynamic 3D Orbital Swoosh Ring */}
          <path d="M -240 60 C -260 -10, -160 -90, -10 -10 C 130 65, 240 10, 200 -70 C 180 -95, 120 -110, 50 -80 C 110 -60, 170 -40, 175 -15 C 180 25, 90 40, -40 -15 C -150 -65, -230 -20, -200 40 Z" fill="url(#swooshGradReact)" filter="url(#neonGlowReact)" />
          
          {/* Bright Sparkle / 4-Point Star at Top Right of Ring */}
          <g transform="translate(205, -75) scale(1.3)" filter="url(#softGlowReact)">
            <path d="M 0 -22 Q 0 0 -22 0 Q 0 0 0 22 Q 0 0 22 0 Q 0 0 0 -22 Z" fill="#ffffff" />
            <circle cx="0" cy="0" r="5" fill="#a7f3d0" />
          </g>
        </g>

        {/* BRAND TYPOGRAPHY: ABHYVEXA */}
        <g transform="translate(400, 595)">
          <text x="0" y="0" textAnchor="middle" fontFamily="'Plus Jakarta Sans', 'Montserrat', 'Inter', sans-serif" fontWeight="900" fontSize="78" letterSpacing="12" fill="url(#silverGradReact)" filter="url(#softGlowReact)">
            ABHYVEXA
          </text>
          <text x="0" y="0" textAnchor="middle" fontFamily="'Plus Jakarta Sans', 'Montserrat', 'Inter', sans-serif" fontWeight="900" fontSize="78" letterSpacing="12" fill="none" stroke="url(#cyanEmeraldGradReact)" strokeWidth="2">
            ABHYVEXA
          </text>

          {showTagline && (
            <g transform="translate(0, 50)">
              <line x1="-280" y1="-8" x2="-200" y2="-8" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
              <text x="0" y="0" textAnchor="middle" fontFamily="'Plus Jakarta Sans', 'Montserrat', sans-serif" fontWeight="800" fontSize="22" letterSpacing="9" fill="#e2e8f0">
                LEARN BEYOND LIMITS
              </text>
              <line x1="200" y1="-8" x2="280" y2="-8" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}
        </g>
      </g>

      {/* NEON EMBLEM CONTAINER BORDER & GLOW */}
      <rect x="40" y="40" width="720" height="720" rx="140" ry="140" fill="none" stroke="url(#neonBorderGradReact)" strokeWidth="5" filter="url(#neonGlowReact)" opacity="0.95" />
      <rect x="40" y="40" width="720" height="720" rx="140" ry="140" fill="none" stroke="#67e8f9" strokeWidth="2" opacity="0.8" />

      {/* Corner Light Flares */}
      <circle cx="180" cy="40" r="15" fill="#ffffff" opacity="0.7" filter="blur(6px)" />
      <circle cx="620" cy="40" r="15" fill="#34d399" opacity="0.7" filter="blur(6px)" />
      <circle cx="40" cy="400" r="15" fill="#06b6d4" opacity="0.6" filter="blur(6px)" />
      <circle cx="760" cy="400" r="15" fill="#10b981" opacity="0.6" filter="blur(6px)" />
      <circle cx="400" cy="760" r="18" fill="#34d399" opacity="0.8" filter="blur(8px)" />
    </svg>
  );
};
