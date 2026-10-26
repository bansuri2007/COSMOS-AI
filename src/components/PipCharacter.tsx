import React from 'react';
import { PipState } from '../types/pip';

interface PipCharacterProps {
  state: PipState;
  scale?: number;
  facing?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const PipCharacter: React.FC<PipCharacterProps> = ({
  state = 'idle',
  scale = 1.0,
  facing = 'right',
  className = '',
  onClick,
  interactive = true,
}) => {
  // High-Tech Cyber Visor Eye HUD
  const renderVisorHUD = () => {
    switch (state) {
      case 'thinking':
        return (
          <g>
            {/* Holographic scanning wave */}
            <path
              d="M 66 82 Q 80 72 90 82 T 114 82"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <circle cx="75" cy="82" r="3" fill="#a855f7" />
            <circle cx="105" cy="82" r="3" fill="#a855f7" />
            {/* Binary data tick marks */}
            <line x1="72" y1="70" x2="72" y2="74" stroke="#c084fc" strokeWidth="2" />
            <line x1="78" y1="70" x2="78" y2="73" stroke="#38bdf8" strokeWidth="2" />
            <line x1="102" y1="70" x2="102" y2="73" stroke="#38bdf8" strokeWidth="2" />
            <line x1="108" y1="70" x2="108" y2="74" stroke="#c084fc" strokeWidth="2" />
          </g>
        );

      case 'welcome':
      case 'celebrating':
        return (
          <g>
            {/* Futuristic glowing cyber optic arcs */}
            <path
              d="M 68 84 Q 76 72 84 84"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 6px #06b6d4)"
            />
            <path
              d="M 96 84 Q 104 72 112 84"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 6px #06b6d4)"
            />
            <circle cx="90" cy="94" r="2.5" fill="#c084fc" />
          </g>
        );

      case 'studying':
        return (
          <g>
            {/* Focused scanning optics with target reticles */}
            <circle cx="76" cy="85" r="7" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            <circle cx="76" cy="85" r="3" fill="#38bdf8" />
            <circle cx="104" cy="85" r="7" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            <circle cx="104" cy="85" r="3" fill="#38bdf8" />
            <line x1="76" y1="94" x2="104" y2="94" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2" />
          </g>
        );

      case 'encouraging':
        return (
          <g>
            {/* Warm energetic aperture glow */}
            <ellipse cx="76" cy="83" rx="6.5" ry="8" fill="#a855f7" filter="drop-shadow(0 0 8px #9333ea)" />
            <circle cx="74" cy="80" r="2.5" fill="#ffffff" />
            <ellipse cx="104" cy="83" rx="6.5" ry="8" fill="#a855f7" filter="drop-shadow(0 0 8px #9333ea)" />
            <circle cx="102" cy="80" r="2.5" fill="#ffffff" />
            <path d="M 85 95 Q 90 99 95 95" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'sleeping':
        return (
          <g>
            {/* Dim standby lines */}
            <line x1="68" y1="84" x2="84" y2="84" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <line x1="96" y1="84" x2="112" y2="84" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <circle cx="90" cy="94" r="1.5" fill="#4338ca" />
          </g>
        );

      case 'idle':
      case 'walking':
      case 'explaining':
      default:
        return (
          <g className="animate-pip-blink" style={{ transformOrigin: '90px 83px' }}>
            {/* High-tech dual-ring cyber eyes */}
            <circle cx="76" cy="83" r="8" fill="none" stroke="#6366f1" strokeWidth="1.5" />
            <ellipse cx="76" cy="83" rx="5" ry="6.5" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)" />
            <circle cx="74" cy="80" r="2" fill="#ffffff" />

            <circle cx="104" cy="83" r="8" fill="none" stroke="#6366f1" strokeWidth="1.5" />
            <ellipse cx="104" cy="83" rx="5" ry="6.5" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)" />
            <circle cx="102" cy="80" r="2" fill="#ffffff" />

            {/* Micro HUD sensor line */}
            <path
              d="M 84 94 L 96 94"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
              filter="drop-shadow(0 0 4px #06b6d4)"
            />
          </g>
        );
    }
  };

  // Holographic Data Projections
  const renderHolograms = () => {
    switch (state) {
      case 'thinking':
        return (
          <g className="animate-pulse">
            {/* Floating rotating neural dodecahedron */}
            <polygon
              points="130,25 145,15 160,25 155,42 135,42"
              fill="rgba(56, 189, 248, 0.2)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              filter="drop-shadow(0 0 8px #38bdf8)"
            />
            <line x1="145" y1="15" x2="145" y2="35" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="130" y1="25" x2="160" y2="25" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        );

      case 'studying':
        return (
          <g style={{ transform: 'translate(65px, 114px)' }}>
            {/* Floating Cyber Holographic Data Slate */}
            <rect
              x="0"
              y="0"
              width="50"
              height="30"
              rx="6"
              fill="rgba(15, 23, 42, 0.85)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              filter="drop-shadow(0 0 10px rgba(56, 189, 248, 0.6))"
            />
            {/* Holographic matrix lines */}
            <line x1="6" y1="8" x2="22" y2="8" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="14" x2="18" y2="14" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="6" y1="20" x2="20" y2="20" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="28" y1="8" x2="44" y2="8" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="28" y1="14" x2="40" y2="14" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="28" y1="20" x2="42" y2="20" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'celebrating':
        return (
          <g>
            {/* High-energy plasma rings */}
            <circle cx="90" cy="85" r="54" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="6 4" className="animate-spin" style={{ animationDuration: '6s', transformOrigin: '90px 85px' }} />
            <polygon points="40,35 44,45 54,49 44,53 40,63 36,53 26,49 36,45" fill="#facc15" filter="drop-shadow(0 0 8px #eab308)" />
            <polygon points="140,38 143,46 151,49 143,52 140,60 137,52 129,49 137,46" fill="#38bdf8" filter="drop-shadow(0 0 8px #0284c7)" />
          </g>
        );

      case 'explaining':
        return (
          <g>
            {/* Holographic target laser guide */}
            <line x1="140" y1="105" x2="175" y2="80" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 6px #38bdf8)" />
            <circle cx="175" cy="80" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="175" cy="80" r="1.5" fill="#ffffff" />
          </g>
        );

      default:
        return null;
    }
  };

  const getMotionClass = () => {
    switch (state) {
      case 'walking':
        return 'animate-pip-walk';
      case 'celebrating':
        return 'animate-pip-celebrate';
      case 'welcome':
        return 'animate-pip-breathing';
      case 'sleeping':
        return 'opacity-80';
      case 'idle':
      default:
        return 'animate-pip-float animate-pip-breathing';
    }
  };

  return (
    <div
      onClick={interactive ? onClick : undefined}
      style={{
        transform: `scale(${scale}) ${facing === 'left' ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'bottom center',
      }}
      className={`relative inline-block select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:brightness-110 active:scale-95' : ''
      } ${className}`}
      title="Pip AI Companion — Click to interact"
    >
      <div className={`relative ${getMotionClass()}`}>
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_15px_35px_rgba(147,51,234,0.35)]"
        >
          <defs>
            {/* Sleek Dark Titanium / Obsidian Metallic Chassis */}
            <linearGradient id="chassis-grad" x1="40" y1="30" x2="140" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2e2a4a" />
              <stop offset="40%" stopColor="#181628" />
              <stop offset="85%" stopColor="#0d0c18" />
              <stop offset="100%" stopColor="#080710" />
            </linearGradient>

            {/* Futuristic Deep Glass Visor with Cyberpunk Neon Blue Edge */}
            <linearGradient id="cyber-visor-grad" x1="60" y1="60" x2="120" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#080b14" />
              <stop offset="100%" stopColor="#020408" />
            </linearGradient>

            {/* Neon Quantum Violet-Cyan Gradient */}
            <linearGradient id="quantum-neon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            {/* Metallic rim edge highlight */}
            <linearGradient id="titanium-rim" x1="50" y1="40" x2="130" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>

            {/* Glowing Ground Warp Shadow */}
            <radialGradient id="warp-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#4f46e5" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* GROUND WARP GLOW */}
          <ellipse cx="90" cy="170" rx="52" ry="8" fill="url(#warp-shadow)" />

          {/* HOLOGRAPHIC PROJECTIONS */}
          {renderHolograms()}

          {/* ROTATING QUANTUM GYRO HALO RING (Super Futuristic) */}
          <g>
            <ellipse
              cx="90"
              cy="40"
              rx="48"
              ry="10"
              fill="none"
              stroke="url(#quantum-neon)"
              strokeWidth="1.8"
              strokeDasharray="14 8"
              opacity="0.85"
              filter="drop-shadow(0 0 6px #8b5cf6)"
              className="animate-spin"
              style={{ transformOrigin: '90px 40px', animationDuration: '8s' }}
            />
            {/* Halo Energy Nodes */}
            <circle cx="42" cy="40" r="2.5" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
            <circle cx="138" cy="40" r="2.5" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
          </g>

          {/* HEAD UNIT CHASSIS */}
          <rect
            x="50"
            y="42"
            width="80"
            height="72"
            rx="36"
            fill="url(#chassis-grad)"
            stroke="url(#titanium-rim)"
            strokeWidth="1.8"
          />

          {/* Side Cybernetic Communication Discs */}
          <rect x="46" y="70" width="6" height="20" rx="3" fill="#6366f1" />
          <circle cx="48" cy="80" r="2" fill="#38bdf8" />
          <rect x="128" y="70" width="6" height="20" rx="3" fill="#6366f1" />
          <circle cx="132" cy="80" r="2" fill="#38bdf8" />

          {/* CYBER VISOR SCREEN */}
          <rect
            x="58"
            y="62"
            width="64"
            height="46"
            rx="18"
            fill="url(#cyber-visor-grad)"
            stroke="#4338ca"
            strokeWidth="1.5"
            filter="drop-shadow(0 0 12px rgba(99, 102, 241, 0.4))"
          />

          {/* Visor Cyber Grid lines */}
          <path
            d="M 64 68 L 116 68 M 64 102 L 116 102"
            stroke="#1e1b4b"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* VISOR EYES / HUD SENSORS */}
          {renderVisorHUD()}

          {/* NECK PIVOT BEARING */}
          <rect x="78" y="112" width="24" height="6" rx="3" fill="#312e81" stroke="#4338ca" strokeWidth="1" />

          {/* MAIN TORSO / CYBER BODY */}
          <path
            d="M 66 116 C 58 116 54 126 58 144 C 62 154 74 156 90 156 C 106 156 118 154 122 144 C 126 126 122 116 114 116 Z"
            fill="url(#chassis-grad)"
            stroke="url(#titanium-rim)"
            strokeWidth="1.6"
          />

          {/* REACTIVE QUANTUM ARC CORE (Chest Reactor) */}
          <circle cx="90" cy="134" r="9" fill="#0f172a" stroke="#4f46e5" strokeWidth="1.5" />
          <circle
            cx="90"
            cy="134"
            r="6"
            fill="url(#quantum-neon)"
            filter="drop-shadow(0 0 10px #a855f7)"
            className="animate-pulse"
          />
          <circle cx="90" cy="134" r="2.5" fill="#ffffff" />

          {/* Body Cyber Circuit Lines */}
          <path
            d="M 72 134 L 80 134 M 100 134 L 108 134"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 90 144 L 90 150"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* ARTICULATED CYBER ARMS */}
          {state === 'welcome' ? (
            <g>
              <g className="animate-pip-wave" style={{ transformOrigin: '56px 122px' }}>
                <path d="M 58 124 Q 40 106 36 92" fill="none" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
                <circle cx="36" cy="90" r="5" fill="#38bdf8" filter="drop-shadow(0 0 5px #38bdf8)" />
              </g>
              <path d="M 122 124 Q 130 136 128 146" fill="none" stroke="#4338ca" strokeWidth="5" strokeLinecap="round" />
              <circle cx="128" cy="146" r="4.5" fill="#a855f7" />
            </g>
          ) : state === 'explaining' ? (
            <g>
              <path d="M 58 124 Q 52 136 56 146" fill="none" stroke="#4338ca" strokeWidth="5" strokeLinecap="round" />
              <circle cx="56" cy="146" r="4.5" fill="#a855f7" />
              <path d="M 122 124 Q 136 116 144 104" fill="none" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
              <circle cx="144" cy="104" r="5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
            </g>
          ) : state === 'celebrating' ? (
            <g>
              <path d="M 60 122 Q 44 106 40 90" fill="none" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
              <circle cx="40" cy="90" r="5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
              <path d="M 120 122 Q 136 106 140 90" fill="none" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
              <circle cx="140" cy="90" r="5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
            </g>
          ) : (
            <g>
              <path d="M 58 124 Q 50 136 54 146" fill="none" stroke="#4338ca" strokeWidth="5" strokeLinecap="round" />
              <circle cx="54" cy="146" r="4.5" fill="#a855f7" />
              <path d="M 122 124 Q 130 136 126 146" fill="none" stroke="#4338ca" strokeWidth="5" strokeLinecap="round" />
              <circle cx="126" cy="146" r="4.5" fill="#a855f7" />
            </g>
          )}

          {/* CYBER THRUSTER LEGS */}
          <g className={state === 'walking' ? 'animate-pip-walk' : ''}>
            <rect x="73" y="154" width="8" height="12" rx="4" fill="#312e81" stroke="#4f46e5" strokeWidth="1" />
            <ellipse cx="77" cy="167" rx="7" ry="3.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            {/* Plasma thrust glow */}
            <circle cx="77" cy="168" r="2" fill="#38bdf8" filter="drop-shadow(0 0 4px #06b6d4)" />

            <rect x="99" y="154" width="8" height="12" rx="4" fill="#312e81" stroke="#4f46e5" strokeWidth="1" />
            <ellipse cx="103" cy="167" rx="7" ry="3.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="103" cy="168" r="2" fill="#38bdf8" filter="drop-shadow(0 0 4px #06b6d4)" />
          </g>
        </svg>
      </div>
    </div>
  );
};
