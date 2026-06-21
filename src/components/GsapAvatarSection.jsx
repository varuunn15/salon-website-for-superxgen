import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Inline SVG Icons for all tools to keep it self-contained
const toolIcons = [
  {
    name: 'Scissors',
    symbol: '✂️',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"/>
        <circle cx="6" cy="18" r="3"/>
        <line x1="9.8" y1="8.2" x2="20" y2="17"/>
        <line x1="9.8" y1="15.8" x2="20" y2="7"/>
      </svg>
    )
  },
  {
    name: 'Hairdryer',
    symbol: '💨',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.5A2.5 2.5 0 0 0 6.5 17h4.75L15 21l1.5-1.5L14 15h1.5A3.5 3.5 0 0 0 19 11.5v-3A2.5 2.5 0 0 0 16.5 6H5a3 3 0 0 0-3 3v2.5A3 3 0 0 0 4 14.5z"/>
        <line x1="2" y1="9" x2="16" y2="9"/>
      </svg>
    )
  },
  {
    name: 'Comb',
    symbol: '🪮',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="4" rx="1"/>
        <line x1="4" y1="9" x2="4" y2="18"/>
        <line x1="7" y1="9" x2="7" y2="18"/>
        <line x1="10" y1="9" x2="10" y2="18"/>
        <line x1="13" y1="9" x2="13" y2="18"/>
        <line x1="16" y1="9" x2="16" y2="18"/>
        <line x1="19" y1="9" x2="19" y2="18"/>
        <line x1="22" y1="9" x2="22" y2="18"/>
      </svg>
    )
  },
  {
    name: 'Nail File',
    symbol: '📁',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="14" height="4" rx="1"/>
        <path d="M16 10l6 2-6 2v-4z"/>
      </svg>
    )
  },
  {
    name: 'Hair Brush',
    symbol: '🖌️',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2" width="10" height="12" rx="3"/>
        <line x1="12" y1="14" x2="12" y2="22"/>
        <circle cx="10" cy="5" r="0.75" fill="currentColor"/>
        <circle cx="12" cy="5" r="0.75" fill="currentColor"/>
        <circle cx="14" cy="5" r="0.75" fill="currentColor"/>
        <circle cx="10" cy="8" r="0.75" fill="currentColor"/>
        <circle cx="12" cy="8" r="0.75" fill="currentColor"/>
        <circle cx="14" cy="8" r="0.75" fill="currentColor"/>
        <circle cx="10" cy="11" r="0.75" fill="currentColor"/>
        <circle cx="12" cy="11" r="0.75" fill="currentColor"/>
        <circle cx="14" cy="11" r="0.75" fill="currentColor"/>
      </svg>
    )
  },
  {
    name: 'Hair Clip',
    symbol: '💇',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11c0-2 1.8-3.5 4-3.5h10c2.2 0 4 1.5 4 3.5v1c0 2-1.8 3.5-4 3.5H7c-2.2 0-4-1.5-4-3.5v-1z"/>
        <line x1="6" y1="11.5" x2="18" y2="11.5"/>
      </svg>
    )
  },
  {
    name: 'Curling Iron',
    symbol: '🌀',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="3" width="4" height="13" rx="1"/>
        <rect x="9" y="16" width="6" height="5" rx="1"/>
        <path d="M12 2v1"/>
      </svg>
    )
  },
  {
    name: 'Razor',
    symbol: '🪒',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2" width="10" height="4" rx="1"/>
        <line x1="12" y1="6" x2="12" y2="22"/>
        <line x1="4" y1="4" x2="7" y2="4"/>
        <line x1="17" y1="4" x2="20" y2="4"/>
      </svg>
    )
  }
];

export default function GsapAvatarSection() {
  const containerRef = useRef(null);
  const avatarRef = useRef(null);
  const toolsRef = useRef([]);
  const tooltipsRef = useRef([]);
  
  // Custom Ref settings for orbit animations
  const orbitSettings = useRef({ multiplier: 1, angle: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const magneticPos = useRef({ x: 0, y: 0 });

  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Initial Position of Orbiting Tools Container & Avatar
    gsap.set(avatarRef.current, { transformOrigin: 'center center' });
    
    // 2. Avatar Float Animation (sine wave floating up and down)
    const floatAnim = gsap.to(avatarRef.current, {
      y: -20,
      ease: 'sine.inOut',
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      paused: prefersReducedMotion
    });

    // 3. Orbiting Tools Axis Rotation (Spinning slowly on their own axis)
    const spinAnims = toolsRef.current.map((tool) => {
      return gsap.to(tool, {
        rotation: 360,
        repeat: -1,
        ease: 'none',
        duration: 8,
        paused: prefersReducedMotion
      });
    });

    // 4. Mathematical Orbit Animation using GSAP Ticker
    // Tracks horizontal (rx) and vertical (ry) radii to form an elliptical orbit path
    const quickX = gsap.quickTo(magneticPos.current, 'x', { duration: 0.8, ease: 'power2.out' });
    const quickY = gsap.quickTo(magneticPos.current, 'y', { duration: 0.8, ease: 'power2.out' });

    const updateOrbit = () => {
      if (prefersReducedMotion) return;

      // Increment angle
      orbitSettings.current.angle += 0.005;

      const baseRx = 220; // Horizontal radius
      const baseRy = 120; // Vertical radius
      const rx = baseRx * orbitSettings.current.multiplier;
      const ry = baseRy * orbitSettings.current.multiplier;

      toolsRef.current.forEach((tool, idx) => {
        if (!tool) return;
        
        // Equal spacing layout offset around the ellipse
        const offset = (idx / toolIcons.length) * Math.PI * 2;
        const theta = orbitSettings.current.angle + offset;

        // Position coordinates with magnetic cursor follow added
        const x = Math.cos(theta) * rx + magneticPos.current.x * 0.18;
        const y = Math.sin(theta) * ry + magneticPos.current.y * 0.18;

        gsap.set(tool, { x, y });
      });
    };

    gsap.ticker.add(updateOrbit);

    // 5. Cursor Movement Listener for Magnetic Follow
    const handleMouseMove = (e) => {
      if (prefersReducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate coordinates relative to container center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Send to quickTo targets
      quickX(dx);
      quickY(dy);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. ScrollTrigger Parallax Effect
    let trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      animation: gsap.timeline()
        .to(avatarRef.current, { y: 60, ease: 'none' }, 0)
        // Orbit tools move at a different parallax speed
        .to(toolsRef.current, { y: '+=100', ease: 'none', stagger: 0.01 }, 0)
    });

    // 7. Glitter Particles Generator (Floating sparkles)
    let particleInterval;
    if (!prefersReducedMotion) {
      particleInterval = setInterval(() => {
        if (!containerRef.current) return;

        const particle = document.createElement('div');
        particle.className = 'glitter-particle';
        
        // Random style assignments (size, color shades of gold/pink)
        const size = gsap.utils.random(5, 10);
        const color = gsap.utils.random(['#FF6A88', '#FF99AC', '#D5C4A1', '#76AFFF']);
        
        Object.assign(particle.style, {
          position: 'absolute',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: color,
          pointerEvents: 'none',
          boxShadow: `0 0 10px ${color}`,
          zIndex: 1,
          left: `${gsap.utils.random(20, 280)}px`,
          top: '320px',
          opacity: 0
        });

        containerRef.current.appendChild(particle);

        // Animate floating upwards
        gsap.fromTo(particle, 
          { y: 0, opacity: 0.8, scale: 0.5 },
          { 
            y: -gsap.utils.random(150, 250), 
            x: `+=${gsap.utils.random(-30, 30)}`,
            opacity: 0, 
            scale: 1.2,
            duration: gsap.utils.random(3.5, 5.5),
            ease: 'power1.out',
            onComplete: () => particle.remove()
          }
        );
      }, 900);
    }

    // 8. Wavy Hair Strands Drifting Across background
    let strandInterval;
    if (!prefersReducedMotion) {
      strandInterval = setInterval(() => {
        if (!containerRef.current) return;

        const svgStrand = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgStrand.setAttribute('viewBox', '0 0 100 50');
        svgStrand.setAttribute('class', 'hair-strand');
        Object.assign(svgStrand.style, {
          position: 'absolute',
          width: '70px',
          height: '35px',
          zIndex: 1,
          left: '-80px',
          top: `${gsap.utils.random(40, 280)}px`,
          pointerEvents: 'none',
          opacity: 0.35
        });

        // Wavy hair curve path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 0 25 C 25 50, 50 0, 75 40 C 90 50, 95 30, 100 25');
        path.setAttribute('stroke', '#FF99AC');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('fill', 'none');
        svgStrand.appendChild(path);

        containerRef.current.appendChild(svgStrand);

        // Drift across screen
        gsap.to(svgStrand, {
          x: 480,
          rotation: gsap.utils.random(-45, 45),
          duration: gsap.utils.random(9, 14),
          ease: 'power1.inOut',
          onComplete: () => svgStrand.remove()
        });
      }, 7000);
    }

    // 9. Interactive Heartbeat Pulse animation for CTA Booking Buttons
    gsap.to('.btn-primary', {
      scale: 1.04,
      duration: 0.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      paused: prefersReducedMotion
    });

    // Clean up on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(updateOrbit);
      floatAnim.kill();
      spinAnims.forEach(anim => anim.kill());
      trigger.kill();
      if (particleInterval) clearInterval(particleInterval);
      if (strandInterval) clearInterval(strandInterval);
    };
  }, []);

  // Click Avatar -> Burst Outwards & Elastic Snapback Animation
  const handleAvatarClick = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    // Scale avatar click reaction
    gsap.timeline()
      .to(avatarRef.current, { scale: 0.9, duration: 0.1, ease: 'power2.out' })
      .to(avatarRef.current, { scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' });

    // Orbit tools burst out multiplier timeline
    gsap.timeline()
      .to(orbitSettings.current, {
        multiplier: 1.8,
        duration: 0.35,
        ease: 'power2.out'
      })
      .to(orbitSettings.current, {
        multiplier: 1,
        duration: 0.85,
        ease: 'elastic.out(1.2, 0.5)'
      });

    // Expand tools sizes and restore
    gsap.timeline()
      .to(toolsRef.current, {
        scale: 1.25,
        duration: 0.25,
        stagger: 0.03,
        ease: 'power2.out'
      })
      .to(toolsRef.current, {
        scale: 1,
        duration: 0.6,
        stagger: 0.02,
        ease: 'elastic.out(1, 0.5)'
      });
  };

  // Hover Tool -> Scale up + Tooltip Display
  const handleToolMouseEnter = (idx, event) => {
    setActiveTooltip(idx);
    gsap.to(event.currentTarget, {
      scale: 1.3,
      ease: 'bounce.out',
      duration: 0.4
    });
  };

  const handleToolMouseLeave = (idx, event) => {
    setActiveTooltip(null);
    gsap.to(event.currentTarget, {
      scale: 1,
      ease: 'power2.out',
      duration: 0.3
    });
  };

  // Click anywhere in section -> Glitter Burst particles effect
  const handleSectionClick = (e) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    // Prevent burst trigger if click was directly on avatar
    if (avatarRef.current && avatarRef.current.contains(e.target)) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Create 15 tiny glitter shards
    const shardCount = 15;
    for (let i = 0; i < shardCount; i++) {
      const shard = document.createElement('div');
      const size = gsap.utils.random(4, 8);
      const color = gsap.utils.random(['#FF6A88', '#FF99AC', '#76AFFF', '#FFFFFF', '#D5C4A1']);
      
      Object.assign(shard.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 8px ${color}`,
        pointerEvents: 'none',
        left: `${clickX}px`,
        top: `${clickY}px`,
        zIndex: 10
      });

      containerRef.current.appendChild(shard);

      // Angle dispersion
      const angle = (i / shardCount) * Math.PI * 2 + gsap.utils.random(-0.2, 0.2);
      const distance = gsap.utils.random(40, 110);
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      gsap.fromTo(shard, 
        { scale: 1, opacity: 1 },
        {
          x: targetX,
          y: targetY,
          scale: 0,
          opacity: 0,
          duration: gsap.utils.random(0.6, 1.2),
          ease: 'power2.out',
          onComplete: () => shard.remove()
        }
      );
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="gsap-avatar-container glass-panel animate-fade-in"
      onClick={handleSectionClick}
      style={{
        width: '100%',
        height: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundImage: "url('https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(255, 106, 136, 0.15)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(255, 106, 136, 0.08)',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      {/* Light luxury glassmorphic overlay to tint background and match site design */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255, 230, 235, 0.5) 0%, rgba(230, 240, 255, 0.55) 50%, rgba(255, 245, 230, 0.5) 100%)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 1. Interactive floating glassmorphic brand emblem */}
      <div 
        ref={avatarRef}
        onClick={handleAvatarClick}
        style={{
          width: '190px',
          height: '190px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.88)',
          border: '2.5px solid #FF99AC',
          boxShadow: '0 15px 35px rgba(255, 106, 136, 0.12), 0 0 20px rgba(255, 255, 255, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          cursor: 'pointer',
          position: 'relative',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        {/* Soft pulsing gold aura glow behind */}
        <div 
          style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 106, 136, 0.2) 0%, transparent 70%)',
            zIndex: 0,
            animation: 'pulseGlow 4s ease-in-out infinite'
          }}
        />
        
        {/* Brand Logo inside */}
        <span 
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.9rem',
            fontWeight: '700',
            letterSpacing: '0.25em',
            color: '#1A1D20',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.6)',
            marginRight: '-0.25em',
            zIndex: 2
          }}
        >
          AURA
        </span>
        <span 
          style={{
            fontSize: '0.62rem',
            letterSpacing: '0.3em',
            color: '#FF6A88',
            textTransform: 'uppercase',
            marginTop: '5px',
            marginRight: '-0.3em',
            fontWeight: '700',
            zIndex: 2
          }}
        >
          LUXURY SALON
        </span>
      </div>

      {/* 2. Floating Orbit Tools */}
      {toolIcons.map((tool, idx) => (
        <div
          key={tool.name}
          ref={el => toolsRef.current[idx] = el}
          onMouseEnter={(e) => handleToolMouseEnter(idx, e)}
          onMouseLeave={(e) => handleToolMouseLeave(idx, e)}
          style={{
            position: 'absolute',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #FF99AC',
            color: '#FF6A88',
            boxShadow: '0 6px 15px rgba(255, 106, 136, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 6,
            cursor: 'pointer'
          }}
        >
          {tool.svg}

          {/* 3. Glassmorphic Tooltip */}
          {activeTooltip === idx && (
            <div 
              ref={el => tooltipsRef.current[idx] = el}
              className="gsap-tooltip"
              style={{
                position: 'absolute',
                bottom: '62px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(26, 29, 32, 0.9)',
                color: '#FFF',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255,255,255,0.1)',
                zIndex: 20
              }}
            >
              {tool.symbol} {tool.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
