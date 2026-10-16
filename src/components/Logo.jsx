import React from 'react';

/**
 * Reusable Wallet and Coin Logo for Masroofy Tracker
 * Matches the reference image: teal wallet, golden coin with £ symbol, dark clasp.
 */
export default function Logo({ size = 44, className = '', showText = false, showTagline = false }) {
  return (
    <div className={`masroofy-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <filter id={`shadow-${size}`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#044439" floodOpacity="0.22" />
          </filter>
          <filter id={`coin-glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#F59E0B" floodOpacity="0.35" />
          </filter>
          <linearGradient id={`wallet-grad-${size}`} x1="60" y1="120" x2="450" y2="460" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="35%" stopColor="#14B8A6" />
            <stop offset="75%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#044E45" />
          </linearGradient>
          <linearGradient id={`back-pocket-${size}`} x1="80" y1="100" x2="420" y2="350" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F766E" />
            <stop offset="100%" stopColor="#042F2E" />
          </linearGradient>
          <linearGradient id={`coin-grad-${size}`} x1="160" y1="40" x2="340" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#FBBF24" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id={`coin-rim-${size}`} x1="170" y1="50" x2="330" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id={`clasp-grad-${size}`} x1="330" y1="230" x2="460" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#164E63" />
            <stop offset="60%" stopColor="#0F2D36" />
            <stop offset="100%" stopColor="#081D23" />
          </linearGradient>
          <linearGradient id={`btn-grad-${size}`} x1="390" y1="260" x2="430" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>
        </defs>

        {/* Back Pocket */}
        <rect x="75" y="110" width="345" height="180" rx="42" fill={`url(#back-pocket-${size})`} />

        {/* Peeking Gold Coin with £ */}
        <g filter={`url(#coin-glow-${size})`}>
          <circle cx="260" cy="140" r="95" fill={`url(#coin-grad-${size})`} stroke={`url(#coin-rim-${size})`} strokeWidth="7" />
          <circle cx="260" cy="140" r="80" fill="none" stroke="#D97706" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.65" />
          
          <path
            d="M 276 102 C 266 97 248 100 244 112 C 240 123 246 135 252 144 L 240 144 C 236 144 234 147 234 151 C 234 155 236 158 240 158 L 261 158 C 257 165 249 174 240 178 C 234 180 231 184 233 189 C 235 194 240 196 246 196 L 285 196 C 290 196 294 192 294 187 C 294 182 290 178 285 178 L 262 178 C 272 170 282 159 285 147 C 286 144 284 141 281 140 C 278 139 275 141 273 144 C 268 152 260 160 252 165 L 268 165 C 272 165 275 162 275 158 C 275 154 272 151 268 151 L 253 151 C 250 142 248 134 251 126 C 254 118 263 114 272 118 C 276 120 281 117 282 112 C 283 107 280 103 276 102 Z"
            fill="#78350F"
          />
        </g>

        {/* Front Wallet Body */}
        <g filter={`url(#shadow-${size})`}>
          <path
            d="M 60 190 C 60 152 92 122 130 122 L 360 122 C 398 122 430 152 430 190 L 430 380 C 430 424 394 460 350 460 L 140 460 C 96 460 60 424 60 380 Z"
            fill={`url(#wallet-grad-${size})`}
          />
          <path
            d="M 64 210 C 130 215 220 200 320 215 C 380 224 415 245 430 265 L 430 380 C 430 424 394 460 350 460 L 140 460 C 96 460 60 424 60 380 Z"
            fill="#0D9488"
            opacity="0.35"
          />
          <path
            d="M 90 140 C 180 148 290 148 400 140 C 418 140 424 150 424 165 C 320 162 180 165 66 178 C 66 156 74 140 90 140 Z"
            fill="#FFFFFF"
            opacity="0.22"
          />
        </g>

        {/* Side Clasp */}
        <g filter={`url(#shadow-${size})`}>
          <rect x="330" y="245" width="130" height="85" rx="36" fill={`url(#clasp-grad-${size})`} stroke="#115E59" strokeWidth="3" />
          <circle cx="415" cy="287" r="22" fill={`url(#btn-grad-${size})`} />
          <circle cx="415" cy="287" r="14" fill="#042F2E" />
          <circle cx="413" cy="285" r="5" fill="#5EEAD4" opacity="0.8" />
        </g>
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontFamily: 'var(--font-arabic-display)',
            fontSize: size > 40 ? '1.5rem' : '1.15rem',
            fontWeight: 800,
            color: 'var(--primary-800)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em'
          }}>
            مصروفي
          </span>
          {showTagline && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              مصاريفك .. تحت السيطرة
            </span>
          )}
        </div>
      )}
    </div>
  );
}
