import React, { useState } from 'react';

interface AbhyvexaLogoProps {
  className?: string;
  size?: number | string;
  showTagline?: boolean;
  variant?: 'icon' | 'badge' | 'full';
  alt?: string;
}

export const AbhyvexaLogo: React.FC<AbhyvexaLogoProps> = ({
  className = 'w-full h-full',
  size,
  showTagline = false,
  variant = 'full',
  alt = 'ABHYVEXA — Learn Beyond Limits'
}) => {
  const [imageError, setImageError] = useState(false);

  // If raster PNG is present in public directory, render image with preserved aspect ratio
  if (!imageError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
        style={size ? { width: size, height: size } : undefined}
      >
        <img
          src="/abhyvexa_logo.png"
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-xl"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Vector SVG Fallback (High-fidelity reproduction of the official ABHYVEXA emblem)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      style={{ display: 'block' }}
      aria-label={alt}
    >
      <defs>
        <radialGradient id="abhyGlowBgReact" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#0a1f1a" />
          <stop offset="50%" stopColor="#061210" />
          <stop offset="100%" stopColor="#040608" />
        </radialGradient>

        <linearGradient id="neonBorderGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5c4" />
          <stop offset="45%" stopColor="#00e5a3" />
          <stop offset="70%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#00f0ff" />
        </linearGradient>

        <linearGradient id="orbitGradReact" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f5c4" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#00d296" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="leftBladeGradReact" x1="20%" y1="10%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="35%" stopColor="#34d399" />
          <stop offset="70%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>

        <linearGradient id="rightBladeGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#e2e8f0" />
          <stop offset="70%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        <linearGradient id="vexaTextGradReact" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#00f5c4" />
        </linearGradient>

        <linearGradient id="silverGradReact" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        <filter id="neonSoftGlowReact" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Base Squircle & Background */}
      <rect x="15" y="15" width="470" height="470" rx="95" ry="95" fill="#040608" />
      <rect x="18" y="18" width="464" height="464" rx="92" ry="92" fill="url(#abhyGlowBgReact)" />

      {/* Outer Neon Glowing Border */}
      <rect
        x="20"
        y="20"
        width="460"
        height="460"
        rx="90"
        ry="90"
        fill="none"
        stroke="url(#neonBorderGradReact)"
        strokeWidth="3"
        filter="url(#neonSoftGlowReact)"
        opacity="0.9"
      />
      {/* Corner Glow Accents */}
      <circle cx="110" cy="22" r="3" fill="#ffffff" filter="url(#neonSoftGlowReact)" />
      <circle cx="390" cy="22" r="3" fill="#ffffff" filter="url(#neonSoftGlowReact)" />
      <circle cx="22" cy="250" r="3.5" fill="#00f5c4" filter="url(#neonSoftGlowReact)" />
      <circle cx="478" cy="250" r="3.5" fill="#00f5c4" filter="url(#neonSoftGlowReact)" />
      <circle cx="250" cy="478" r="3" fill="#00f5c4" filter="url(#neonSoftGlowReact)" />

      {/* Central Ambience */}
      <circle cx="250" cy="210" r="130" fill="#00f5c4" opacity="0.08" />

      {/* 1. Orbital Ring (Rear) */}
      <ellipse
        cx="255"
        cy="195"
        rx="145"
        ry="55"
        transform="rotate(-24 255 195)"
        fill="none"
        stroke="url(#orbitGradReact)"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* 2. Main Emblem: 'A' Character */}
      {/* Left Curved Blade */}
      <path
        d="M 248 85 C 248 85, 235 120, 200 190 C 170 248, 115 315, 115 315 C 135 318, 175 305, 205 270 C 220 252, 245 180, 248 160 Z"
        fill="url(#leftBladeGradReact)"
      />

      {/* Swooping 3D Ribbon Wrap extending from left leg over the front */}
      <path
        d="M 100 270 C 95 230, 140 185, 200 170 C 265 152, 330 195, 345 220 C 315 208, 250 185, 190 205 C 145 220, 110 250, 100 270 Z"
        fill="url(#orbitGradReact)"
        filter="url(#neonSoftGlowReact)"
      />

      {/* Right Sharp Precision Blade / Wedge */}
      <path d="M 250 80 L 385 315 L 340 315 L 282 205 L 246 130 Z" fill="url(#rightBladeGradReact)" />

      {/* Central Apex Shading */}
      <path d="M 247 80 L 253 80 L 278 185 L 240 185 Z" fill="#ffffff" opacity="0.25" />

      {/* 3. Open Book Icon in Lower Core */}
      <g transform="translate(250, 280)">
        <path d="M -5 18 C -25 8, -50 8, -58 14 C -56 5, -30 2, -5 8 Z" fill="#00e5a3" opacity="0.7" />
        <path d="M 5 18 C 25 8, 50 8, 58 14 C 56 5, 30 2, 5 8 Z" fill="#00e5a3" opacity="0.7" />
        <path d="M -4 4 C -22 -6, -46 -6, -56 2 C -54 18, -26 12, -4 20 Z" fill="#ffffff" />
        <path d="M -8 6 C -22 -2, -40 -2, -48 4 C -46 14, -26 10, -8 16 Z" fill="#e2e8f0" opacity="0.4" />
        <path d="M 4 4 C 22 -6, 46 -6, 56 2 C 54 18, 26 12, 4 20 Z" fill="#ffffff" />
        <path d="M 8 6 C 22 -2, 40 -2, 48 4 C 46 14, 26 10, 8 16 Z" fill="#a7f3d0" opacity="0.5" />
        <path d="M 0 4 L 0 22" stroke="#00f5c4" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* 4. Star Sparkle at Top-Right */}
      <g transform="translate(382, 140)">
        <path
          d="M 0 -22 C 1 -7, 7 -1, 22 0 C 7 1, 1 7, 0 22 C -1 7, -7 1, -22 0 C -7 -1, -1 -7, 0 -22 Z"
          fill="#ffffff"
          filter="url(#neonSoftGlowReact)"
        />
        <circle cx="0" cy="0" r="4" fill="#a7f3d0" />
      </g>

      {/* 5. Typography: "ABHYVEXA" */}
      <g transform="translate(250, 385)">
        <text
          x="-215"
          y="0"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="52"
          fill="url(#silverGradReact)"
          letterSpacing="4"
        >
          ABHY
        </text>
        <text
          x="32"
          y="0"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="52"
          fill="url(#vexaTextGradReact)"
          letterSpacing="4"
          filter="url(#neonSoftGlowReact)"
        >
          VEXA
        </text>
      </g>

      {/* 6. Tagline: "— LEARN BEYOND LIMITS —" */}
      <g transform="translate(250, 422)">
        <line x1="-195" y1="-5" x2="-145" y2="-5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="14.5"
          fill="#f1f5f9"
          letterSpacing="5"
        >
          LEARN BEYOND LIMITS
        </text>
        <line x1="145" y1="-5" x2="195" y2="-5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      </g>
    </svg>
  );
};

// Re-export as StudyWithAbhiLogo for zero-breaking-change backwards compatibility
export const StudyWithAbhiLogo = AbhyvexaLogo;
