import React from 'react';

interface StudyWithAbhiLogoProps {
  className?: string;
  size?: number | string;
}

export const StudyWithAbhiLogo: React.FC<StudyWithAbhiLogoProps> = ({
  className = 'w-full h-full',
  size
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id="bgGlowReact" cx="50%" cy="38%" r="50%">
          <stop offset="0%" stopColor="#1f1008" />
          <stop offset="60%" stopColor="#0d0e14" />
          <stop offset="100%" stopColor="#07080c" />
        </radialGradient>

        <linearGradient id="orangeRingReact" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7a00" />
          <stop offset="50%" stopColor="#ff5500" />
          <stop offset="100%" stopColor="#e64a00" />
        </linearGradient>

        <linearGradient id="orangeGlowBrushReact" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#ff7b00" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ff5100" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#cc3300" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="abhiTextGradReact" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff7d1a" />
          <stop offset="50%" stopColor="#ff6000" />
          <stop offset="100%" stopColor="#e64800" />
        </linearGradient>

        <linearGradient id="penGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff8c1a" />
          <stop offset="100%" stopColor="#e64a00" />
        </linearGradient>

        <clipPath id="circleClipReact">
          <circle cx="250" cy="250" r="236" />
        </clipPath>

        <pattern id="dotGridReact" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="1.5" fill="#ff6600" opacity="0.25" />
        </pattern>
      </defs>

      {/* Background Base */}
      <circle cx="250" cy="250" r="248" fill="#ff6000" />
      <circle cx="250" cy="250" r="242" fill="#07080c" />
      <circle cx="250" cy="250" r="236" fill="url(#bgGlowReact)" />

      {/* Inside Clipped Content */}
      <g clipPath="url(#circleClipReact)">
        {/* Halftone Side Grids */}
        <rect x="20" y="80" width="100" height="200" fill="url(#dotGridReact)" />
        <rect x="380" y="80" width="100" height="200" fill="url(#dotGridReact)" />

        {/* Orange Splash / Glow behind Character */}
        <path d="M150 120 C 190 60, 310 50, 350 110 C 370 140, 390 190, 320 220 C 260 240, 180 230, 140 180 Z" fill="url(#orangeGlowBrushReact)" filter="blur(10px)" />
        <path d="M210 50 L 320 180 L 260 220 L 170 110 Z" fill="#ff6600" opacity="0.6" filter="blur(8px)" />

        {/* Character Back View */}
        {/* Neck */}
        <path d="M 235 150 L 265 150 L 270 175 L 230 175 Z" fill="#ffb088" />
        <path d="M 250 150 L 270 150 L 272 170 L 250 170 Z" fill="#d97f59" />

        {/* Hair */}
        <g id="hairReact">
          <path d="M 250 35 C 220 35, 195 55, 185 85 C 175 115, 185 145, 195 160 C 202 145, 210 135, 215 130 C 210 145, 215 155, 222 162 C 225 150, 235 140, 245 135 C 240 148, 245 158, 252 165 C 260 152, 275 142, 285 138 C 285 150, 292 155, 305 145 C 315 135, 320 115, 315 85 C 305 50, 280 35, 250 35 Z" fill="#12131a" stroke="#ff7700" strokeWidth="1.5" />
          <path d="M 230 45 C 215 60, 205 85, 205 105" stroke="#2c2d3a" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 260 42 C 275 55, 290 80, 295 105" stroke="#2c2d3a" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 245 40 C 248 65, 250 90, 250 115" stroke="#36384a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 188 80 C 180 105, 185 130, 195 150" stroke="#ff7700" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 312 80 C 318 100, 315 125, 305 145" stroke="#ff7700" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {/* Hoodie */}
        <g id="hoodieReact">
          <path d="M 140 270 C 150 200, 185 175, 225 170 L 275 170 C 315 175, 350 200, 360 270 L 375 320 L 125 320 Z" fill="#161822" stroke="#ff6a00" strokeWidth="2" />
          <path d="M 205 172 C 205 172, 220 225, 250 225 C 280 225, 295 172, 295 172 C 310 185, 315 210, 300 238 C 285 260, 215 260, 200 238 C 185 210, 190 185, 205 172 Z" fill="#0d0e14" stroke="#ff6a00" strokeWidth="1.5" />
          <path d="M 225 190 C 235 235, 265 235, 275 190" stroke="#ff7700" strokeWidth="2" fill="none" />
          <path d="M 185 205 C 170 240, 160 275, 155 310" stroke="#252838" strokeWidth="3" fill="none" />
          <path d="M 315 205 C 330 240, 340 275, 345 310" stroke="#252838" strokeWidth="3" fill="none" />
          <path d="M 145 260 C 152 215, 180 185, 215 175" stroke="#ff7700" strokeWidth="3.5" fill="none" />
          <path d="M 355 260 C 348 215, 320 185, 285 175" stroke="#ff7700" strokeWidth="3.5" fill="none" />
        </g>

        {/* Typography background contrast */}
        <rect x="0" y="210" width="500" height="290" fill="url(#bgGlowReact)" opacity="0.95" />
        <path d="M 0 240 L 500 240 L 500 500 L 0 500 Z" fill="#07080c" opacity="0.75" />

        {/* Text: STUDY */}
        <text x="250" y="270" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="54" fill="#ffffff" letterSpacing="4">
          STUDY
        </text>

        {/* Text: — WITH — */}
        <line x1="85" y1="288" x2="200" y2="288" stroke="#ff6600" strokeWidth="3.5" strokeLinecap="round" />
        <text x="250" y="293" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="18" fill="#ffffff" letterSpacing="3">
          WITH
        </text>
        <line x1="300" y1="288" x2="415" y2="288" stroke="#ff6600" strokeWidth="3.5" strokeLinecap="round" />

        {/* Text: ABHI */}
        <text x="250" y="375" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="950" fontSize="96" fill="url(#abhiTextGradReact)" letterSpacing="2">
          ABHI
        </text>

        {/* Open Book & Fountain Pen */}
        <g transform="translate(250, 420)">
          {/* Left Pages */}
          <path d="M -5 -3 C -35 -18, -85 -18, -120 -6 C -115 5, -80 0, -5 10 Z" fill="#ffffff" opacity="0.95" />
          <path d="M -5 12 C -35 2, -85 2, -115 13 C -110 22, -75 16, -5 22 Z" fill="#ffffff" opacity="0.85" />
          <path d="M -5 24 C -35 15, -85 15, -110 25 C -105 32, -75 27, -5 32 Z" fill="#ff6600" />

          {/* Right Pages */}
          <path d="M 5 -3 C 35 -18, 85 -18, 120 -6 C 115 5, 80 0, 5 10 Z" fill="#ffffff" opacity="0.95" />
          <path d="M 5 12 C 35 2, 85 2, 115 13 C 110 22, 75 16, 5 22 Z" fill="#ffffff" opacity="0.85" />
          <path d="M 5 24 C 35 15, 85 15, 110 25 C 105 32, 75 27, 5 32 Z" fill="#ff6600" />

          {/* Pen Nib */}
          <path d="M 0 -35 L 12 -12 L 8 8 L -8 8 L -12 -12 Z" fill="url(#penGradReact)" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="0" cy="-12" r="2.5" fill="#ffffff" />
          <line x1="0" y1="-12" x2="0" y2="-33" stroke="#ffffff" strokeWidth="1.5" />
        </g>

        {/* Bottom Subtitle */}
        <text x="250" y="468" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="14" fill="#ff8c26" letterSpacing="3">
          LEARN • FOCUS • SUCCEED
        </text>

        {/* Star & Line Accent */}
        <g transform="translate(250, 482)">
          <line x1="-50" y1="0" x2="-15" y2="0" stroke="#ff6600" strokeWidth="1.5" />
          <polygon points="0,-6 2,-1 7,-1 3,2 5,7 0,4 -5,7 -3,2 -7,-1 -2,-1" fill="#ff7700" />
          <line x1="15" y1="0" x2="50" y2="0" stroke="#ff6600" strokeWidth="1.5" />
        </g>
      </g>

      {/* Outer Orange Rings */}
      <circle cx="250" cy="250" r="240" fill="none" stroke="url(#orangeRingReact)" strokeWidth="5" />
      <circle cx="250" cy="250" r="246" fill="none" stroke="#ff8000" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
};
