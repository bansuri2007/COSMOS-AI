import React, { useState, useEffect } from 'react';

export type AnimalType = 'cat' | 'dog' | 'owl' | 'fox' | 'dolphin';
export type AnimalPersonality =
  | 'Smart & Playful'
  | 'Calm & Intelligent'
  | 'Funny & Energetic'
  | 'Mysterious & Futuristic';

export type AnimalBehaviorState = 'idle' | 'walk' | 'sit' | 'action' | 'sleep';

interface RealisticAnimalCompanionProps {
  animal: AnimalType;
  personality: AnimalPersonality;
  state?: AnimalBehaviorState;
  scale?: number;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  reactionMessage?: string;
}

export const RealisticAnimalCompanion: React.FC<RealisticAnimalCompanionProps> = ({
  animal = 'cat',
  personality = 'Calm & Intelligent',
  state = 'idle',
  scale = 1.0,
  interactive = true,
  onClick,
  className = '',
  reactionMessage,
}) => {
  const [internalState, setInternalState] = useState<AnimalBehaviorState>(state);
  const [isHovered, setIsHovered] = useState(false);
  const [blink, setBlink] = useState(false);

  // Sync external state changes
  useEffect(() => {
    setInternalState(state);
  }, [state]);

  // Natural biological blinking cycle (every 3.5 - 6 seconds)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 4200);
    return () => clearInterval(blinkInterval);
  }, []);

  // Natural behavior cycle (idling, sniffing/grooming, looking around)
  useEffect(() => {
    if (state !== 'idle') return;

    const behaviorCycle = setInterval(() => {
      // Random natural behavior
      const r = Math.random();
      if (r > 0.65) {
        setInternalState('action');
        setTimeout(() => setInternalState('idle'), 3200);
      } else if (r > 0.4) {
        setInternalState('sit');
        setTimeout(() => setInternalState('idle'), 4000);
      }
    }, 9000);

    return () => clearInterval(behaviorCycle);
  }, [state]);

  const handleInteraction = () => {
    if (!interactive) return;
    setInternalState('action');
    setTimeout(() => setInternalState('idle'), 2800);
    if (onClick) onClick();
  };

  // 1. REALISTIC CAT (Lifelike British Shorthair / Bengal feline)
  const renderCat = () => {
    return (
      <svg
        width="220"
        height="180"
        viewBox="0 0 220 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 ease-out"
      >
        <defs>
          {/* Authentic fur coat gradient with natural highlights and depth */}
          <linearGradient id="cat-fur-body" x1="40" y1="50" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8a8f98" />
            <stop offset="35%" stopColor="#5c626e" />
            <stop offset="70%" stopColor="#3d434d" />
            <stop offset="100%" stopColor="#252930" />
          </linearGradient>

          {/* Underbelly soft pale fur */}
          <linearGradient id="cat-fur-belly" x1="80" y1="110" x2="130" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="60%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>

          {/* Natural feline iris gradient with golden-amber depth */}
          <radialGradient id="cat-iris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </radialGradient>

          {/* Soft natural contact ground shadow */}
          <radialGradient id="cat-ground-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#030712" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#030712" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Contact Shadow */}
        <ellipse cx="110" cy="168" rx="65" ry="9" fill="url(#cat-ground-shadow)" />

        {/* TAIL (Sinusoidal swaying tail animation) */}
        <g
          className={internalState === 'action' ? 'animate-pulse' : ''}
          style={{
            transformOrigin: '50px 120px',
            transform: internalState === 'action' ? 'rotate(-12deg)' : 'rotate(0deg)',
            transition: 'transform 1.2s ease-in-out',
          }}
        >
          <path
            d="M 55 125 C 30 115 15 90 22 68 C 26 56 40 52 44 62 C 48 74 38 98 62 120 Z"
            fill="url(#cat-fur-body)"
            stroke="#1f242d"
            strokeWidth="0.8"
          />
        </g>

        {/* HIND QUARTERS & THIGH (Muscular realistic feline posture) */}
        <path
          d="M 52 122 C 45 105 52 82 75 80 C 95 78 112 92 110 125 C 105 145 90 156 68 154 C 54 152 48 138 52 122 Z"
          fill="url(#cat-fur-body)"
        />

        {/* REAR PAWS */}
        <ellipse cx="62" cy="158" rx="14" ry="7" fill="#374151" />
        <line x1="58" y1="156" x2="58" y2="162" stroke="#1f2937" strokeWidth="1" />
        <line x1="63" y1="156" x2="63" y2="163" stroke="#1f2937" strokeWidth="1" />

        {/* TORSO & RIB CAGE (Breathing movement) */}
        <g style={{ transform: internalState === 'sleep' ? 'scale(0.96, 1.02)' : 'none' }}>
          <path
            d="M 72 82 C 95 80 135 84 152 104 C 158 115 155 138 140 148 C 122 156 86 156 68 148 C 58 140 60 110 72 82 Z"
            fill="url(#cat-fur-body)"
          />
          {/* Pale chest & underbelly fur */}
          <path
            d="M 125 102 C 142 110 148 128 140 142 C 132 150 112 152 98 148 C 114 140 120 120 125 102 Z"
            fill="url(#cat-fur-belly)"
            opacity="0.85"
          />
        </g>

        {/* FRONT LEGS & PAWS */}
        <path
          d="M 132 114 C 134 130 132 148 130 160 C 130 163 138 164 144 163 C 146 150 146 130 144 116 Z"
          fill="url(#cat-fur-body)"
        />
        {/* Front Right Paws with natural toe definition */}
        <ellipse cx="137" cy="162" rx="9" ry="5.5" fill="#4b5563" />
        <line x1="134" y1="160" x2="134" y2="165" stroke="#1f2937" strokeWidth="1" />
        <line x1="138" y1="160" x2="138" y2="165" stroke="#1f2937" strokeWidth="1" />

        <path
          d="M 148 112 C 150 128 148 146 146 158 C 146 162 154 163 158 161 C 160 148 160 126 156 114 Z"
          fill="url(#cat-fur-body)"
        />
        <ellipse cx="153" cy="160" rx="9" ry="5.5" fill="#374151" />

        {/* HEAD (Realistic feline skull proportions) */}
        <g
          style={{
            transformOrigin: '155px 78px',
            transform:
              internalState === 'action'
                ? 'rotate(-6deg) translateY(-2px)'
                : isHovered
                ? 'rotate(3deg)'
                : 'rotate(0deg)',
            transition: 'transform 0.6s ease',
          }}
        >
          {/* EARS with natural pinkish interior fur */}
          <path d="M 134 52 L 144 24 L 158 46 Z" fill="url(#cat-fur-body)" />
          <path d="M 138 48 L 145 32 L 154 46 Z" fill="#9ca3af" opacity="0.6" />

          <path d="M 166 48 L 180 26 L 188 54 Z" fill="url(#cat-fur-body)" />
          <path d="M 170 47 L 178 33 L 184 50 Z" fill="#9ca3af" opacity="0.6" />

          {/* Head cranium */}
          <ellipse cx="160" cy="68" rx="25" ry="22" fill="url(#cat-fur-body)" />

          {/* Muzzle pad (Authentic whiskered muzzle) */}
          <ellipse cx="160" cy="77" rx="14" ry="10" fill="#4b5563" />
          <ellipse cx="154" cy="78" rx="6" ry="5" fill="#6b7280" />
          <ellipse cx="166" cy="78" rx="6" ry="5" fill="#6b7280" />

          {/* Textured feline nose leather */}
          <path d="M 157 73 L 163 73 L 160 76 Z" fill="#f472b6" opacity="0.85" />
          <line x1="160" y1="76" x2="160" y2="81" stroke="#1f2937" strokeWidth="1" />

          {/* REALISTIC EYES (Amber-gold irises with vertical slit pupils) */}
          {blink || internalState === 'sleep' ? (
            <g>
              <path d="M 144 65 Q 150 69 155 65" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 165 65 Q 170 69 176 65" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              {/* Left Eye */}
              <ellipse cx="149" cy="64" rx="5.5" ry="5" fill="url(#cat-iris)" />
              {/* Vertical Slit Pupil */}
              <ellipse cx="149" cy="64" rx="1.4" ry="4.2" fill="#09090b" />
              {/* Corneal specular glint */}
              <circle cx="147.5" cy="62" r="1.2" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="171" cy="64" rx="5.5" ry="5" fill="url(#cat-iris)" />
              <ellipse cx="171" cy="64" rx="1.4" ry="4.2" fill="#09090b" />
              <circle cx="169.5" cy="62" r="1.2" fill="#ffffff" />
            </g>
          )}

          {/* Authentic Whisker Strands */}
          <g stroke="#e5e7eb" strokeWidth="0.7" opacity="0.75">
            <line x1="150" y1="78" x2="124" y2="74" />
            <line x1="150" y1="80" x2="122" y2="82" />
            <line x1="150" y1="82" x2="126" y2="89" />
            <line x1="170" y1="78" x2="196" y2="74" />
            <line x1="170" y1="80" x2="198" y2="82" />
            <line x1="170" y1="82" x2="194" y2="89" />
          </g>
        </g>
      </svg>
    );
  };

  // 2. REALISTIC DOG (Golden / German Shepherd mix with natural posture & tail wag)
  const renderDog = () => {
    return (
      <svg
        width="220"
        height="180"
        viewBox="0 0 220 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 ease-out"
      >
        <defs>
          <linearGradient id="dog-fur-body" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="40%" stopColor="#b45309" />
            <stop offset="80%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          <radialGradient id="dog-iris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="70%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1c1917" />
          </radialGradient>
        </defs>

        <ellipse cx="115" cy="168" rx="68" ry="9" fill="url(#cat-ground-shadow)" />

        {/* WAGGING TAIL (Active sinusoidal oscillation) */}
        <g
          style={{
            transformOrigin: '48px 115px',
            transform:
              internalState === 'action' || isHovered ? 'rotate(18deg)' : 'rotate(4deg)',
            transition: 'transform 0.35s ease-in-out',
          }}
        >
          <path
            d="M 48 116 C 26 100 12 70 20 48 C 24 38 36 40 38 52 C 40 68 34 88 56 112 Z"
            fill="url(#dog-fur-body)"
          />
        </g>

        {/* HIND BODY & FLANK */}
        <path
          d="M 46 118 C 42 98 55 80 78 78 C 102 76 122 92 120 124 C 114 146 96 156 72 154 C 54 152 45 136 46 118 Z"
          fill="url(#dog-fur-body)"
        />
        <ellipse cx="64" cy="158" rx="15" ry="7" fill="#78350f" />

        {/* CHEST & TORSO */}
        <path
          d="M 75 80 C 100 78 142 82 156 104 C 164 116 160 140 144 148 C 122 158 86 156 68 148 C 58 138 60 108 75 80 Z"
          fill="url(#dog-fur-body)"
        />

        {/* FORELEGS */}
        <path d="M 136 114 L 134 160 L 146 160 L 148 114 Z" fill="#92400e" />
        <ellipse cx="140" cy="162" rx="10" ry="6" fill="#78350f" />
        <path d="M 152 112 L 150 158 L 162 158 L 164 112 Z" fill="#78350f" />
        <ellipse cx="156" cy="160" rx="10" ry="6" fill="#581c87" opacity="0.3" />

        {/* HEAD (Canine muzzle and pricked expressive ears) */}
        <g
          style={{
            transformOrigin: '160px 72px',
            transform:
              internalState === 'action'
                ? 'rotate(8deg) translateY(-3px)'
                : isHovered
                ? 'rotate(-5deg)'
                : 'rotate(0deg)',
            transition: 'transform 0.4s ease',
          }}
        >
          {/* EARS */}
          <path d="M 142 46 L 152 14 L 168 38 Z" fill="#92400e" />
          <path d="M 172 40 L 188 18 L 196 48 Z" fill="#78350f" />

          {/* Cranium */}
          <ellipse cx="166" cy="62" rx="26" ry="22" fill="url(#dog-fur-body)" />

          {/* Elongated canine muzzle */}
          <path
            d="M 166 62 L 194 68 C 198 70 198 78 192 82 L 164 82 Z"
            fill="#b45309"
          />

          {/* Moist black nose leather */}
          <path d="M 190 68 C 196 68 198 72 196 76 C 193 78 188 76 188 72 Z" fill="#1c1917" />
          <circle cx="192" cy="70" r="1.2" fill="#ffffff" opacity="0.6" />

          {/* EXPRESSIVE CANINE EYES */}
          {blink || internalState === 'sleep' ? (
            <line x1="154" y1="58" x2="164" y2="58" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <g>
              <circle cx="159" cy="58" r="5.5" fill="url(#dog-iris)" />
              <circle cx="159" cy="58" r="3" fill="#0c0a09" />
              <circle cx="157.5" cy="56.5" r="1.3" fill="#ffffff" />
            </g>
          )}
        </g>
      </svg>
    );
  };

  // 3. REALISTIC OWL (Great Horned Owl on realistic wood perch)
  const renderOwl = () => {
    return (
      <svg
        width="220"
        height="180"
        viewBox="0 0 220 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 ease-out"
      >
        <defs>
          <linearGradient id="owl-plumage" x1="60" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="30%" stopColor="#451a03" />
            <stop offset="70%" stopColor="#292524" />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>

          <radialGradient id="owl-iris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
        </defs>

        {/* NATURAL WOOD BRANCH PERCH */}
        <path
          d="M 20 152 C 60 148 140 152 200 148 L 200 162 C 140 165 60 162 20 164 Z"
          fill="#44403c"
          stroke="#292524"
          strokeWidth="1.2"
        />

        {/* TAIL FEATHERS EXTENDING BELOW BRANCH */}
        <path d="M 100 140 L 105 174 L 115 174 L 112 140 Z" fill="#292524" />

        {/* BODY PLUMAGE */}
        <ellipse cx="110" cy="105" rx="34" ry="42" fill="url(#owl-plumage)" />

        {/* CHEST FEATHER BARS & TEXTURE */}
        <g stroke="#d6d3d1" strokeWidth="1.2" opacity="0.65" strokeLinecap="round">
          <path d="M 96 90 Q 110 96 124 90" />
          <path d="M 94 102 Q 110 108 126 102" />
          <path d="M 96 114 Q 110 120 124 114" />
          <path d="M 98 126 Q 110 132 122 126" />
        </g>

        {/* RAPTOR TALONS GRIPPING WOOD BRANCH */}
        <g fill="#d97706" stroke="#451a03" strokeWidth="1">
          <ellipse cx="98" cy="150" rx="4" ry="7" />
          <ellipse cx="104" cy="150" rx="4" ry="7" />
          <ellipse cx="118" cy="150" rx="4" ry="7" />
          <ellipse cx="124" cy="150" rx="4" ry="7" />
        </g>

        {/* OWL HEAD (180-Degree Anatomical Rotation on Saccade) */}
        <g
          style={{
            transformOrigin: '110px 52px',
            transform:
              internalState === 'action'
                ? 'rotate(-25deg)'
                : isHovered
                ? 'rotate(18deg)'
                : 'rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
          }}
        >
          {/* Feather Ear Tufts */}
          <path d="M 88 32 L 80 14 L 98 28 Z" fill="#451a03" />
          <path d="M 132 32 L 140 14 L 122 28 Z" fill="#451a03" />

          {/* Facial Disc Frame */}
          <ellipse cx="110" cy="52" rx="32" ry="28" fill="#57534e" />
          <circle cx="96" cy="52" r="16" fill="#292524" />
          <circle cx="124" cy="52" r="16" fill="#292524" />

          {/* LARGE FORWARD-FACING PREDATORY RAPTOR EYES */}
          {blink || internalState === 'sleep' ? (
            <g>
              <line x1="88" y1="52" x2="104" y2="52" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="116" y1="52" x2="132" y2="52" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              {/* Left Eye */}
              <circle cx="96" cy="52" r="11" fill="url(#owl-iris)" />
              <circle cx="96" cy="52" r="6" fill="#09090b" />
              <circle cx="93.5" cy="49" r="1.8" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="124" cy="52" r="11" fill="url(#owl-iris)" />
              <circle cx="124" cy="52" r="6" fill="#09090b" />
              <circle cx="121.5" cy="49" r="1.8" fill="#ffffff" />
            </g>
          )}

          {/* Curved Hooked Beak */}
          <path d="M 107 54 L 113 54 L 110 68 Z" fill="#1c1917" stroke="#44403c" strokeWidth="0.8" />
        </g>
      </svg>
    );
  };

  // 4. REALISTIC FOX (Vulpes vulpes with bushy white-tipped tail & keen muzzle)
  const renderFox = () => {
    return (
      <svg
        width="220"
        height="180"
        viewBox="0 0 220 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 ease-out"
      >
        <defs>
          <linearGradient id="fox-russet-fur" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="45%" stopColor="#c2410c" />
            <stop offset="80%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>

          <radialGradient id="fox-iris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#1c1917" />
          </radialGradient>
        </defs>

        <ellipse cx="112" cy="168" rx="66" ry="9" fill="url(#cat-ground-shadow)" />

        {/* BUSHY WHITE-TIPPED FOX TAIL */}
        <g
          style={{
            transformOrigin: '48px 120px',
            transform:
              internalState === 'action' ? 'rotate(-15deg)' : isHovered ? 'rotate(10deg)' : 'rotate(0deg)',
            transition: 'transform 0.8s ease',
          }}
        >
          <path
            d="M 50 120 C 20 110 5 80 14 55 C 20 40 38 42 42 58 C 48 76 42 98 64 122 Z"
            fill="url(#fox-russet-fur)"
          />
          {/* Characteristic White Tail Tip */}
          <path d="M 14 55 C 20 40 38 42 42 58 C 36 62 24 64 14 55 Z" fill="#f8fafc" />
        </g>

        {/* FLANK & REAR LEGS */}
        <path
          d="M 48 120 C 44 102 54 84 76 80 C 98 78 116 92 114 124 C 108 144 92 154 70 152 C 54 150 46 136 48 120 Z"
          fill="url(#fox-russet-fur)"
        />
        {/* Dark Paws (Black stockings characteristic of Red Fox) */}
        <ellipse cx="64" cy="158" rx="13" ry="6" fill="#18181b" />

        {/* TORSO & WHITE CHEST FUR */}
        <path
          d="M 72 82 C 96 80 138 84 152 104 C 158 116 154 138 138 148 C 118 156 84 156 68 148 C 58 138 60 108 72 82 Z"
          fill="url(#fox-russet-fur)"
        />
        <path d="M 128 104 C 142 114 148 130 140 144 C 132 150 116 150 106 146 Z" fill="#f8fafc" opacity="0.9" />

        {/* FORELEGS WITH BLACK ACCENTS */}
        <path d="M 134 114 L 132 160 L 142 160 L 144 114 Z" fill="#18181b" />
        <path d="M 148 112 L 146 158 L 156 158 L 158 112 Z" fill="#18181b" />

        {/* VULPINE HEAD & POINTED MUZZLE */}
        <g
          style={{
            transformOrigin: '158px 72px',
            transform:
              internalState === 'action'
                ? 'rotate(-8deg) translateY(-2px)'
                : isHovered
                ? 'rotate(5deg)'
                : 'rotate(0deg)',
            transition: 'transform 0.4s ease',
          }}
        >
          {/* Black-Backed Alert Fox Ears */}
          <path d="M 136 48 L 146 16 L 160 38 Z" fill="#18181b" />
          <path d="M 140 45 L 146 25 L 154 40 Z" fill="#f8fafc" />

          <path d="M 168 40 L 182 18 L 192 46 Z" fill="#18181b" />
          <path d="M 172 40 L 180 26 L 186 44 Z" fill="#f8fafc" />

          {/* Cranium */}
          <ellipse cx="160" cy="64" rx="24" ry="20" fill="url(#fox-russet-fur)" />

          {/* Slender Pointed Muzzle */}
          <path d="M 158 64 L 190 70 C 194 72 194 78 188 80 L 156 80 Z" fill="#f8fafc" />
          <path d="M 158 64 L 190 70 L 176 80 Z" fill="url(#fox-russet-fur)" />

          {/* Black nose tip */}
          <ellipse cx="190" cy="72" rx="3.5" ry="2.5" fill="#09090b" />

          {/* AMBER SLANTED VULPINE EYES */}
          {blink || internalState === 'sleep' ? (
            <line x1="148" y1="60" x2="158" y2="60" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <g>
              <ellipse cx="154" cy="60" rx="4.8" ry="4" fill="url(#fox-iris)" />
              <ellipse cx="154" cy="60" rx="1.5" ry="3.5" fill="#09090b" />
              <circle cx="152.5" cy="58.5" r="1.2" fill="#ffffff" />
            </g>
          )}
        </g>
      </svg>
    );
  };

  // 5. REALISTIC DOLPHIN (Bottlenose Dolphin with smooth cetacean skin & fluid fluke glide)
  const renderDolphin = () => {
    return (
      <svg
        width="220"
        height="180"
        viewBox="0 0 220 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 ease-out"
      >
        <defs>
          {/* Smooth Cetacean Slate-Gray Countershaded Skin */}
          <linearGradient id="dolphin-skin" x1="30" y1="40" x2="190" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="85%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Ventral White Countershading */}
          <linearGradient id="dolphin-belly" x1="100" y1="100" x2="160" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Underwater Marine Caustics Glow */}
          <radialGradient id="marine-caustics" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Marine Light Caustics Aura */}
        <ellipse cx="110" cy="90" rx="90" ry="60" fill="url(#marine-caustics)" />

        {/* CETACEAN BODY & FLUKE (Fluid gliding wave) */}
        <g
          style={{
            transformOrigin: '70px 100px',
            transform:
              internalState === 'action'
                ? 'rotate(-8deg) translateY(-4px)'
                : isHovered
                ? 'rotate(5deg)'
                : 'rotate(0deg)',
            transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Caudal Fluke (Horizontal dolphin tail fins) */}
          <path
            d="M 38 108 C 22 96 10 98 12 108 C 20 114 28 112 36 112 C 28 114 20 122 14 128 C 12 136 24 136 38 120 Z"
            fill="url(#dolphin-skin)"
          />

          {/* Torso & Peduncle */}
          <path
            d="M 36 112 C 60 108 90 92 124 82 C 158 72 186 78 196 90 C 190 98 174 108 140 114 C 104 120 62 120 36 116 Z"
            fill="url(#dolphin-skin)"
          />

          {/* White Ventral Countershading */}
          <path
            d="M 96 106 C 126 102 158 98 178 94 C 172 104 152 112 124 114 C 108 115 98 110 96 106 Z"
            fill="url(#dolphin-belly)"
            opacity="0.85"
          />

          {/* FALCATE DORSAL FIN */}
          <path d="M 106 88 C 114 70 120 64 130 68 C 128 76 122 84 120 86 Z" fill="url(#dolphin-skin)" />

          {/* PECTORAL FLIPPER */}
          <path d="M 136 106 C 146 118 152 130 148 132 C 144 132 138 122 134 110 Z" fill="url(#dolphin-skin)" />

          {/* ROSTRUM / BEAK & BLOWHOLE */}
          <ellipse cx="152" cy="79" rx="2" ry="1" fill="#0f172a" opacity="0.6" />
          <path d="M 186 86 C 198 86 206 88 208 90 C 204 93 194 94 184 92 Z" fill="url(#dolphin-skin)" />

          {/* INTELLIGENT EYE */}
          {blink || internalState === 'sleep' ? (
            <line x1="168" y1="88" x2="174" y2="88" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <g>
              <circle cx="171" cy="88" r="3.5" fill="#020617" />
              <circle cx="170" cy="87" r="1.1" fill="#ffffff" />
            </g>
          )}
        </g>
      </svg>
    );
  };

  const getRenderFunction = () => {
    switch (animal) {
      case 'dog':
        return renderDog();
      case 'owl':
        return renderOwl();
      case 'fox':
        return renderFox();
      case 'dolphin':
        return renderDolphin();
      case 'cat':
      default:
        return renderCat();
    }
  };

  return (
    <div
      onClick={handleInteraction}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
      }}
      className={`relative inline-block select-none ${
        interactive ? 'cursor-pointer hover:drop-shadow-[0_10px_25px_rgba(56,189,248,0.25)] active:scale-95' : ''
      } ${className}`}
      title={`${animal.toUpperCase()} (${personality}) — Click to interact`}
    >
      {/* Speech / Reaction Bubble */}
      {reactionMessage && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 border border-cyan-500/40 px-3 py-1.5 rounded-full text-xs text-white shadow-xl backdrop-blur-md animate-bubble-pop">
          {reactionMessage}
        </div>
      )}

      {getRenderFunction()}
    </div>
  );
};
