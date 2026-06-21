import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// 1. Builder for the premium 3D Barber/Salon toolset
function createSalonToolsetModel() {
  const group = new THREE.Group();

  // 1. GOLD METALLIC SHEARS (SCISSORS)
  const shearsGroup = new THREE.Group();
  
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xD5C4A1, // Primary luxury brand gold
    metalness: 0.95,
    roughness: 0.12,
    flatShading: true
  });
  
  const jointMaterial = new THREE.MeshStandardMaterial({
    color: 0x3A3A3C, // Deep steel accent
    metalness: 0.8,
    roughness: 0.2
  });

  // Blade geometry outline
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.045, 0.055);
  bladeShape.lineTo(0.02, 0.85);
  bladeShape.lineTo(0.004, 0.85);
  bladeShape.lineTo(-0.012, 0.055);
  bladeShape.lineTo(0, 0);

  const extrudeSettings = {
    depth: 0.014,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.005,
    bevelThickness: 0.005
  };
  const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);

  // Scissor handles (torus)
  const handleGeom = new THREE.TorusGeometry(0.14, 0.024, 16, 64);

  // Left shear half (blade, handle loop, finger rest)
  const leftShear = new THREE.Group();
  const leftBlade = new THREE.Mesh(bladeGeom, goldMaterial);
  leftBlade.position.y = 0.08;
  const leftHandle = new THREE.Mesh(handleGeom, goldMaterial);
  leftHandle.position.set(-0.075, -0.17, 0);
  leftHandle.rotation.z = Math.PI / 4.5;
  const fingerRestGeom = new THREE.CylinderGeometry(0.01, 0.003, 0.11, 8);
  const fingerRest = new THREE.Mesh(fingerRestGeom, goldMaterial);
  fingerRest.position.set(-0.18, -0.25, 0);
  fingerRest.rotation.z = -Math.PI / 4;
  leftShear.add(leftBlade);
  leftShear.add(leftHandle);
  leftShear.add(fingerRest);

  // Right shear half (mirrored)
  const rightShear = new THREE.Group();
  const rightBlade = new THREE.Mesh(bladeGeom, goldMaterial);
  rightBlade.position.y = 0.08;
  rightBlade.rotation.y = Math.PI; // Mirror Y
  const rightHandle = new THREE.Mesh(handleGeom, goldMaterial);
  rightHandle.position.set(0.075, -0.17, 0);
  rightHandle.rotation.z = -Math.PI / 4.5;
  rightShear.add(rightBlade);
  rightShear.add(rightHandle);

  // Pivot screw
  const screwGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.05, 16);
  const screw = new THREE.Mesh(screwGeom, jointMaterial);
  screw.rotation.x = Math.PI / 2;

  shearsGroup.add(leftShear);
  shearsGroup.add(rightShear);
  shearsGroup.add(screw);

  shearsGroup.scale.setScalar(1.2);
  shearsGroup.position.set(-0.32, 0.22, 0);
  shearsGroup.rotation.z = -Math.PI / 6;
  group.add(shearsGroup);

  // 2. PREMIUM HAIRSTYLING COMB
  const combGroup = new THREE.Group();
  const combMaterial = new THREE.MeshStandardMaterial({
    color: 0x1A1A1E, // Matte charcoal
    metalness: 0.6,
    roughness: 0.35
  });

  const combSpineGeom = new THREE.BoxGeometry(0.85, 0.055, 0.015);
  const combSpine = new THREE.Mesh(combSpineGeom, combMaterial);
  combGroup.add(combSpine);

  const toothGeom = new THREE.CylinderGeometry(0.004, 0.004, 0.18, 6);
  const combTeethCount = 25;
  for (let i = 0; i < combTeethCount; i++) {
    const tooth = new THREE.Mesh(toothGeom, combMaterial);
    const x = -0.39 + (i * 0.78 / (combTeethCount - 1));
    tooth.position.set(x, -0.09, 0);
    combGroup.add(tooth);
  }
  combGroup.position.set(-0.35, -0.32, -0.05);
  combGroup.rotation.z = Math.PI / 7;
  group.add(combGroup);

  // 3. SPINNING CLASSIC BARBER POLE
  const poleGroup = new THREE.Group();
  
  // Gold cap bases and rounded dome tops
  const capGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.09, 32);
  const capTopBase = new THREE.Mesh(capGeom, goldMaterial);
  capTopBase.position.y = 0.52;
  const domeTopGeom = new THREE.SphereGeometry(0.15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const capTopDome = new THREE.Mesh(domeTopGeom, goldMaterial);
  capTopDome.position.y = 0.565;
  
  const capBotBase = new THREE.Mesh(capGeom, goldMaterial);
  capBotBase.position.y = -0.52;
  const domeBotGeom = new THREE.SphereGeometry(0.15, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const capBotDome = new THREE.Mesh(domeBotGeom, goldMaterial);
  capBotDome.position.y = -0.565;
  
  poleGroup.add(capTopBase);
  poleGroup.add(capTopDome);
  poleGroup.add(capBotBase);
  poleGroup.add(capBotDome);

  // Inner Rotating Cylinder
  const innerCylGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.94, 32);
  
  // Create Stripe Canvas Texture dynamically in memory
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);
  
  // Traditional Barber Stripes: Red, White, Blue, White
  const colors = ['#d32f2f', '#ffffff', '#1976d2', '#ffffff']; 
  const stripeW = 32;
  for (let i = -8; i < 16; i++) {
    ctx.fillStyle = colors[Math.abs(i) % 4];
    ctx.beginPath();
    ctx.moveTo(i * stripeW, 0);
    ctx.lineTo((i + 1) * stripeW, 0);
    ctx.lineTo((i - 2) * stripeW, 256);
    ctx.lineTo((i - 3) * stripeW, 256);
    ctx.closePath();
    ctx.fill();
  }
  
  const stripeTexture = new THREE.CanvasTexture(canvas);
  stripeTexture.wrapS = THREE.RepeatWrapping;
  stripeTexture.wrapT = THREE.RepeatWrapping;
  stripeTexture.repeat.set(1, 1.25);

  const innerCylMat = new THREE.MeshBasicMaterial({
    map: stripeTexture
  });
  const innerCyl = new THREE.Mesh(innerCylGeom, innerCylMat);
  poleGroup.add(innerCyl);

  // Outer Glass case
  const glassGeom = new THREE.CylinderGeometry(0.142, 0.142, 0.96, 32);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.28,
    roughness: 0.05,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  const glassCyl = new THREE.Mesh(glassGeom, glassMat);
  poleGroup.add(glassCyl);

  // Wall Mount Brackets
  const bracketGeom = new THREE.BoxGeometry(0.04, 0.06, 0.15);
  const topBracket = new THREE.Mesh(bracketGeom, jointMaterial);
  topBracket.position.set(0, 0.46, -0.14);
  const botBracket = new THREE.Mesh(bracketGeom, jointMaterial);
  botBracket.position.set(0, -0.46, -0.14);
  poleGroup.add(topBracket);
  poleGroup.add(botBracket);

  poleGroup.position.set(0.38, 0.0, 0.05);
  poleGroup.rotation.z = Math.PI / 16;
  group.add(poleGroup);

  group.scale.setScalar(1.22);
  group.position.set(0, -0.05, 0);

  return {
    group,
    leftShear,
    rightShear,
    innerCyl,
    stripeTexture
  };
}

export default function ThreeCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const width = containerRef.current?.clientWidth || 300;
    const height = containerRef.current?.clientHeight || 350;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lights Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Warm Golden Key Light
    const goldLight = new THREE.PointLight(0xFFE082, 8, 100);
    goldLight.position.set(5, 5, 5);
    scene.add(goldLight);

    // Cyan Fill Light
    const cyanLight = new THREE.PointLight(0x66FCF1, 4, 100);
    cyanLight.position.set(-5, -5, 4);
    scene.add(cyanLight);

    // Purple Rim Light
    const purpleLight = new THREE.PointLight(0x9c27b0, 3, 50);
    purpleLight.position.set(0, 5, -5);
    scene.add(purpleLight);

    // 5. Build Premium Barber & Salon Toolset Group
    const salonData = createSalonToolsetModel();
    const salonGroup = salonData.group;
    scene.add(salonGroup);

    // 6. Floating Starfield Particles (Warm luxury golden stars)
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.5 + Math.random() * 1.5;

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xD5C4A1, // Match primary gold
      size: 0.032,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(starField);

    // 7. Mouse Tracker for tilt effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      targetX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      targetY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 8. Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. Render Loop
    const startTime = performance.now();
    let animationFrameId;

    const tick = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      // Lerp mouse coordinates
      mouseX += (targetX - mouseX) * 0.07;
      mouseY += (targetY - mouseY) * 0.07;

      // Group auto-rotation + mouse tilt
      salonGroup.rotation.y = elapsed * 0.2 + mouseX * 0.6;
      salonGroup.rotation.x = -0.1 + mouseY * 0.4;
      salonGroup.rotation.z = Math.sin(elapsed * 0.4) * 0.03;

      // Scissor cutting movement (open and close)
      const cutAngle = Math.sin(elapsed * 3.5) * 0.06 + 0.06; // 0 to 0.12 radians
      salonData.leftShear.rotation.z = cutAngle;
      salonData.rightShear.rotation.z = -cutAngle;

      // Rotate/scroll the Barber Pole stripes
      salonData.stripeTexture.offset.y -= 0.005; // scrolling downward creates moving up effect

      // Starfield reverse rotation
      starField.rotation.y = -elapsed * 0.03;
      starField.rotation.x = -elapsed * 0.01;

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(tick);
    };

    tick();

    // 10. Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);

      // Recursive disposal
      salonGroup.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      if (salonData.stripeTexture) {
        salonData.stripeTexture.dispose();
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="three-canvas-container glass-panel animate-fade-in"
      style={{
        width: '100%',
        height: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'radial-gradient(circle at center, rgba(197, 168, 128, 0.03) 0%, transparent 80%)',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 30px rgba(102, 252, 241, 0.01)'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          outline: 'none',
          display: 'block' 
        }} 
      />
    </div>
  );
}
