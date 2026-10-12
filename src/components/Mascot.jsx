import React from 'react';

export default function Mascot({ mood = 'idle', size = 'medium', slope = 0, className = '' }) {
  const sizePx = size === 'large' ? 120 : size === 'medium' ? 80 : 50;

  // Calculate tilt angle for antenna based on slope: angle = atan(slope)
  // Clamp angle between -60deg and +60deg
  const tiltDeg = typeof slope === 'number' && !isNaN(slope)
    ? Math.max(-60, Math.min(60, Math.atan(slope) * (180 / Math.PI)))
    : 0;

  return (
    <div
      className={`mascot-robot mascot-mood-${mood} ${className}`}
      style={{ width: sizePx, height: sizePx, display: 'inline-block' }}
      title={`Grady (${mood})`}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#3f51b5" />
            <stop offset="100%" stopColor="#7c5cbf" />
          </linearGradient>
          <linearGradient id="antennaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd54f" />
            <stop offset="100%" stopColor="#ff7043" />
          </linearGradient>
          <filter id="gradyGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Slope-Tilting Antenna */}
        <g transform={`rotate(${-tiltDeg}, 50, 16)`}>
          <line x1="50" y1="16" x2="50" y2="4" stroke="#ffd54f" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="50" cy="4" r="4" fill="#ff7043" filter="url(#gradyGlow)" />
        </g>

        {/* Robot Head / Body (Compass / Hexagon Shape) */}
        <polygon
          points="50,16 86,34 86,76 50,94 14,76 14,34"
          fill="url(#gradyGrad)"
          filter="url(#gradyGlow)"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Coordinate Crosshairs on Body */}
        <line x1="24" y1="55" x2="76" y2="55" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="50" y1="30" x2="50" y2="80" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="2,2" />

        {/* Visor Screen */}
        <ellipse cx="50" cy="54" rx="24" ry="16" fill="#0b0826" stroke="#00e5ff" strokeWidth="1.5" />

        {/* Eyes based on mood */}
        {mood === 'happy' || mood === 'celebrating' ? (
          <>
            <path d="M 38 52 Q 44 45 50 52" stroke="#00e5ff" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 50 52 Q 56 45 62 52" stroke="#00e5ff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'thinking' || mood === 'curious' ? (
          <>
            <circle cx="42" cy="52" r="3.5" fill="#ffd54f" />
            <ellipse cx="58" cy="50" rx="4.5" ry="2.5" fill="#ffd54f" />
          </>
        ) : (
          <>
            <circle cx="41" cy="52" r="3.5" fill="#00e5ff" />
            <circle cx="59" cy="52" r="3.5" fill="#00e5ff" />
          </>
        )}

        {/* Mouth based on mood */}
        {mood === 'celebrating' || mood === 'happy' ? (
          <path d="M 43 61 Q 50 68 57 61" stroke="#ff4081" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : mood === 'thinking' ? (
          <line x1="45" y1="61" x2="55" y2="60" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M 44 61 Q 50 65 56 61" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Side Sensor Ear Buds */}
        <circle cx="14" cy="55" r="3" fill="#00e5ff" />
        <circle cx="86" cy="55" r="3" fill="#00e5ff" />
      </svg>
    </div>
  );
}
