import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { 
  MessageSquare, Send, X, Sparkles, ShoppingCart, Check, 
  Volume2, VolumeX, Mic, MicOff, Camera, Compass, Landmark 
} from 'lucide-react';
import { INDIAN_CITIES } from '../data/dataGenerator';

// A seedable LCG random for localized fallback logic
function createRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export default function AuraAssistant({
  isOpen,
  onClose,
  currentCity,
  setCurrentCity,
  addToCart,
  openCart,
  activeTab,
  setActiveTab,
  onSelectSalon,
  salons,
  bookings = [],
  triggerFaceScan // callback to open the Face Analysis page
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am Aura, your Personal AI Beauty Consultant. 🌟 I can analyze your face, optimize services to fit your budget, find the nearest salons, or book appointments by voice.\n\nTry saying: 'Optimize ₹1500 budget' or 'Take me to the map'."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true); // voice toggle
  const [aiState, setAiState] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [addedItems, setAddedItems] = useState({});

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // 3D Scene Refs for Real-Time Animation Control
  const sphereRef = useRef(null);
  const wireRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const starFieldRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
        setAiState('listening');
      };

      rec.onend = () => {
        setIsListening(false);
        if (aiState === 'listening') setAiState('idle');
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error: ", e);
        setIsListening(false);
        setAiState('idle');
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        processUserMessage(text);
      };

      recognitionRef.current = rec;
    }
  }, [aiState]);

  // Trigger speech synthesis
  const speakText = (text) => {
    if (!isSpeaking || !synthRef.current) return;
    
    // Stop ongoing speech
    synthRef.current.cancel();

    // Clean markdown formatting before speaking
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/•/g, '')
      .replace(/₹/g, 'Rupees ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    // Speak with a female/assistant voice if available
    const voices = synthRef.current.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Female") || v.name.includes("Zira"));
    if (premiumVoice) utterance.voice = premiumVoice;

    utterance.onstart = () => setAiState('speaking');
    utterance.onend = () => setAiState('idle');
    utterance.onerror = () => setAiState('idle');

    synthRef.current.speak(utterance);
  };

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      if (aiState === 'speaking') setAiState('idle');
    } else {
      setIsSpeaking(true);
    }
  };

  const startVoiceListening = () => {
    if (recognitionRef.current) {
      synthRef.current.cancel();
      recognitionRef.current.start();
    } else {
      alert("Speech Recognition API is not supported in this browser. Please type your message.");
    }
  };

  const processUserMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setAiState('thinking');

    // Simulate small latency
    setTimeout(() => {
      const response = generateAuraResponse(text);
      setMessages(prev => [...prev, response]);
      
      // Auto Navigation Check
      checkVoiceNavigation(text);
      
      // Speak the response
      speakText(response.text);
    }, 1200);
  };

  // Checks user queries for keywords and navigates automatically
  const checkVoiceNavigation = (query) => {
    const q = query.toLowerCase();
    if (q.includes('map') || q.includes('location') || q.includes('nearby') || q.includes('nearest')) {
      setActiveTab('map');
      speakText("Navigating to the Smart Location Map.");
    } else if (q.includes('scan') || q.includes('face') || q.includes('selfie') || q.includes('analyse') || q.includes('hairline')) {
      if (triggerFaceScan) triggerFaceScan();
      speakText("Opening the AI Face Scanner.");
    } else if (q.includes('budget') || q.includes('optimize') || q.includes('have ₹')) {
      setActiveTab('budget');
      speakText("Opening the AI Budget Optimizer.");
    } else if (q.includes('partner') || q.includes('business') || q.includes('shop') || q.includes('merchant')) {
      setActiveTab('dashboard');
      speakText("Entering the Partner Business Center.");
    } else if (q.includes('booking') || q.includes('appointment') || q.includes('my dashboard') || q.includes('dashboard')) {
      setActiveTab('bookings');
      speakText("Opening your booking dashboard.");
    } else if (q.includes('home') || q.includes('explore') || q.includes('salon list') || q.includes('browse')) {
      setActiveTab('browse');
      speakText("Browsing the luxury beauty marketplace.");
    }
  };

  // AI Response Engine for Aura (Understands: location, budget, face shape, wedding plans, booking, past history)
  const generateAuraResponse = (query) => {
    const q = query.toLowerCase();
    const rand = createRandom(query.length);

    // 0. Past bookings or History query
    if (q.includes('history') || q.includes('past booking') || q.includes('what did i book') || q.includes('last time') || q.includes('previous')) {
      if (bookings.length === 0) {
        return {
          sender: 'bot',
          text: "I don't see any past bookings on your profile yet. Once you complete a styling session, I'll remember it here to recommend follow-up treatments!"
        };
      }
      
      const lastBooking = bookings[bookings.length - 1];
      const servicesNames = lastBooking.services.map(s => s.name).join(', ');
      
      return {
        sender: 'bot',
        text: `Looking at your past appointments, your last visit was on **${lastBooking.bookingDate}** at **${lastBooking.salonName}** in ${lastBooking.city}.
        
• **Services received:** ${servicesNames}
• **Stylist:** ${lastBooking.stylistName}
• **Status:** ${lastBooking.status}

Based on this, you're due for a follow-up trim or deep conditioning hair spa in about 3 weeks. Would you like me to recommend nearby salons?`
      };
    }

    // 1. Face Scan Reference
    if (q.includes('face') || q.includes('selfie') || q.includes('acne') || q.includes('hairline')) {
      return {
        sender: 'bot',
        text: "I can help with that! Let's scan your face to detect face shape, beard density, skin tone, and hairline constraints. Click the **Camera Icon** at the top right to start a selfie scan!"
      };
    }

    // 2. Budget optimization recommendation
    if (q.includes('budget') || q.includes('optimize') || q.includes('i have ₹') || q.includes('have rs') || q.includes('rupees')) {
      const budgetMatch = q.match(/\d+/g);
      const budget = budgetMatch ? Math.max(...budgetMatch.map(Number)) : 2000;
      
      return {
        sender: 'bot',
        text: `Opening the Budget Optimizer to find the best grooming service package under ₹${budget}. Let me calculate combinations for you...`
      };
    }

    // 3. Wedding query (Generates absolute Beauty Plan)
    if (q.includes('wedding') || q.includes('marriage') || q.includes('bride') || q.includes('groom')) {
      return {
        sender: 'bot',
        text: `Congratulations! 💍 I have generated a custom **Pre-Wedding Beauty Plan** for you:

• **Timeline:** 1 Day Before
• **Suggested Package:**
  1. *Bridal HD Makeup Ritual* or *VIP Grooming Package*
  2. *Medifacial Brightening Treatment*
  3. *Luxury Moroccanoil Hair Spa*
• **Approximate Cost:** ₹15,500
• **Expected Duration:** 4.5 hours
• **Why:** Rejuvenates skin elasticity and gives a luminous photography-ready glow.

Would you like me to book this at mirrors luxury salon?`
      };
    }

    // 4. City-wise nearest recommendation
    let detectedCity = currentCity;
    const cities = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Lucknow", "Kochi", "Chandigarh"];
    for (const city of cities) {
      if (q.includes(city.toLowerCase())) {
        detectedCity = city;
        setCurrentCity(city);
        break;
      }
    }

    // Get salons matching current city
    const citySalons = salons.filter(s => s.city.toLowerCase() === detectedCity.toLowerCase());
    
    if (citySalons.length === 0) {
      return {
        sender: 'bot',
        text: `I couldn't find any salon listed in ${detectedCity}. Can you try searching in Bangalore, Mumbai, or Delhi?`
      };
    }

    // Haircut query
    if (q.includes('haircut') || q.includes('cut') || q.includes('hair styling')) {
      const topSalon = citySalons.sort((a,b) => b.rating - a.rating)[0];
      const haircutService = topSalon.services.find(s => s.category === 'hair') || topSalon.services[0];
      
      return {
        sender: 'bot',
        text: `For a haircut in ${detectedCity}, I highly recommend **${topSalon.name}** at ${topSalon.address.split(',')[1]}. 

• **Specialist:** ${topSalon.stylists[0].name} (${topSalon.stylists[0].specialty})
• **Wait Time:** ${topSalon.waitingTime} minutes (Queue: ${topSalon.queueLength} people)
• **Why:** They are rated ${topSalon.rating}★ and specialize in precision styled cuts.`,
        recommendation: {
          salon: topSalon,
          service: haircutService
        }
      };
    }

    // Massage/Spa query
    if (q.includes('massage') || q.includes('spa') || q.includes('relax')) {
      const spaSalon = citySalons.find(s => s.type.includes('Spa') || s.type.includes('Wellness') || s.type.includes('Massage')) || citySalons[0];
      const spaService = spaSalon.services.find(s => s.category === 'spa' || s.category === 'massage') || spaSalon.services[0];

      return {
        sender: 'bot',
        text: `I recommend checking out the relaxation therapies at **${spaSalon.name}**:

• **Service:** ${spaService.name}
• **Pricing:** ₹${spaService.price} (${spaService.duration} mins)
• **Why:** Known for soothing organic aromatherapy oils and highly experienced massagers.`,
        recommendation: {
          salon: spaSalon,
          service: spaService
        }
      };
    }

    // Default Fallback Recommendation
    const featuredSalon = citySalons[Math.floor(rand() * citySalons.length)];
    const featuredService = featuredSalon.services[0];

    return {
      sender: 'bot',
      text: `Welcome to the beauty marketplace! I've selected a top trending service at **${featuredSalon.name}** in ${detectedCity}:
      
• **Service:** ${featuredService.name}
• **Price:** ₹${featuredService.price}
• **Aura Rating:** ${featuredSalon.rating}★

Let me know if you would like to book this or locate it on the map!`,
      recommendation: {
        salon: featuredSalon,
        service: featuredService
      }
    };
  };

  const handleQuickBook = (salon, service) => {
    addToCart({
      ...service,
      salonId: salon.id,
      salonName: salon.name,
      city: salon.city
    });
    setAddedItems(prev => ({ ...prev, [service.id]: true }));
    speakText("Service added to your booking list. Opening checkout!");
    setTimeout(() => {
      openCart();
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    processUserMessage(text);
  };

  // THREE.JS CANVAS RENDER LOOP (Aura holographic brain core)
  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;

    const width = containerRef.current.clientWidth || 300;
    const height = containerRef.current.clientHeight || 300;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.5;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x66FCF1, 8, 50);
    cyanLight.position.set(-3, 3, 3);
    scene.add(cyanLight);

    const goldLight = new THREE.PointLight(0xD4AF37, 8, 50);
    goldLight.position.set(3, -3, 3);
    scene.add(goldLight);

    // 5. 3D Face Core (Holographic Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(0.9, 4);
    
    // Shader-like flat metallic look
    const material = new THREE.MeshStandardMaterial({
      color: 0x06070a,
      roughness: 0.1,
      metalness: 0.95,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Secondary cyan glowing outline wireframe
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x66FCF1,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wire = new THREE.Mesh(geometry, wireMat);
    wire.scale.setScalar(1.005);
    scene.add(wire);
    wireRef.current = wire;

    // 6. Orbital Rings (Consciousness nodes)
    const ring1Geom = new THREE.TorusGeometry(1.2, 0.015, 8, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.9,
      roughness: 0.2
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    scene.add(ring1);
    ring1Ref.current = ring1;

    const ring2Geom = new THREE.TorusGeometry(1.4, 0.01, 8, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x66FCF1,
      metalness: 0.9,
      roughness: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 2.5;
    scene.add(ring2);
    ring2Ref.current = ring2;

    // 7. Nebula particles dust
    const partCount = 150;
    const partGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(partCount * 3);

    for (let i = 0; i < partCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);
      const r = 1.3 + Math.random() * 0.9;
      
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i+2] = r * Math.cos(phi);
    }
    partGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x66FCF1,
      size: 0.025,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(partGeom, partMat);
    scene.add(starField);
    starFieldRef.current = starField;

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Anim loop
    let animId;
    const startTime = performance.now();

    const tick = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      // Render scale changes based on AI State
      // 1. Idle: slow breathe
      // 2. Listening: rapid soundwaves
      // 3. Thinking: complex morph noise
      // 4. Speaking: lip sync simulation
      
      if (sphereRef.current && wireRef.current) {
        const positionAttribute = sphereRef.current.geometry.attributes.position;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
          vertex.fromBufferAttribute(positionAttribute, i);
          
          let distMultiplier = 1;
          if (aiState === 'listening') {
            // wavy sound ripples
            distMultiplier = 1 + Math.sin(vertex.y * 10 + elapsed * 20) * 0.05;
            wireMat.color.setHex(0x66FCF1);
          } else if (aiState === 'thinking') {
            // morphing noise (slow)
            distMultiplier = 1 + Math.sin(vertex.x * 6 + elapsed * 8) * Math.cos(vertex.z * 6 + elapsed * 8) * 0.08;
            wireMat.color.setHex(0xD4AF37); // switches to golden hue
          } else if (aiState === 'speaking') {
            // Speech lip sync simulator (moves the lower half y < 0 and front z > 0)
            if (vertex.y < 0 && vertex.z > 0) {
              distMultiplier = 1 + Math.sin(elapsed * 25) * 0.12 * Math.abs(vertex.y);
            }
            wireMat.color.setHex(0x00FF87); // Green pulse for talking
          } else {
            // Idle breathing
            distMultiplier = 1 + Math.sin(elapsed * 2) * 0.02;
            wireMat.color.setHex(0x66FCF1);
          }
          
          // Re-scale vector
          vertex.normalize().multiplyScalar(0.95 * distMultiplier);
          positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        positionAttribute.needsUpdate = true;
        sphereRef.current.geometry.computeVertexNormals();

        // Sync visual outline mesh
        wireRef.current.geometry = sphereRef.current.geometry;
      }

      // Rotate Outer Rings
      if (ring1Ref.current && ring2Ref.current) {
        const ringSpeed = aiState === 'thinking' ? 5 : aiState === 'listening' ? 2 : 1;
        ring1Ref.current.rotation.y = elapsed * 0.4 * ringSpeed;
        ring1Ref.current.rotation.x = elapsed * 0.15 * ringSpeed;

        ring2Ref.current.rotation.x = elapsed * 0.25 * ringSpeed;
        ring2Ref.current.rotation.z = -elapsed * 0.3 * ringSpeed;
      }

      // Rotate Star field
      if (starFieldRef.current) {
        starFieldRef.current.rotation.y = -elapsed * 0.08;
      }

      renderer.render(scene, camera);
      animId = window.requestAnimationFrame(tick);
    };

    tick();

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animId);
      geometry.dispose();
      material.dispose();
      wireMat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      partGeom.dispose();
      partMat.dispose();
      renderer.dispose();
    };
  }, [isOpen, aiState]);

  if (!isOpen) return null;

  return (
    <div className="aura-overlay-container animate-fade-in">
      {/* Aura Sidebar Drawer */}
      <div className="aura-drawer glass-panel-glow animate-slide-in">
        {/* Header */}
        <div className="aura-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-symbol" style={{ background: 'linear-gradient(135deg, #FFE082, #D4AF37)', color: '#000', width: '32px', height: '32px', fontSize: '1rem' }}>
              A
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                AURA AI
                <Sparkles size={14} className="animate-pulse" style={{ color: 'var(--primary-gold)' }} />
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--primary-teal)' }}>PERSONAL BEAUTY OPERATING SYSTEM</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Camera Shortcut */}
            <button 
              className="drawer-close-btn" 
              onClick={() => { triggerFaceScan(); onClose(); }}
              style={{ position: 'static', color: '#fff', width: '32px', height: '32px' }}
              title="Open Face Scanner"
            >
              <Camera size={16} />
            </button>
            {/* Voice Toggle */}
            <button 
              className="drawer-close-btn" 
              onClick={handleVoiceToggle}
              style={{ position: 'static', color: isSpeaking ? 'var(--primary-cyan)' : 'var(--text-muted)', width: '32px', height: '32px' }}
              title={isSpeaking ? "Mute Voice Response" : "Unmute Voice Response"}
            >
              {isSpeaking ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            {/* Close Button */}
            <button 
              className="drawer-close-btn" 
              onClick={onClose}
              style={{ position: 'static', width: '32px', height: '32px' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 3D Core Viewport */}
        <div 
          ref={containerRef} 
          style={{ 
            height: '240px', 
            background: 'radial-gradient(circle, rgba(102, 252, 241, 0.05) 0%, transparent 70%)', 
            position: 'relative',
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          
          {/* Glowing State Badge Overlay */}
          <div 
            className="badge-cyan" 
            style={{ 
              position: 'absolute', 
              bottom: '12px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              borderColor: aiState === 'listening' ? '#ff3b30' : aiState === 'thinking' ? '#ffcc00' : aiState === 'speaking' ? '#00e676' : 'var(--primary-cyan)',
              color: '#fff',
              background: 'rgba(6,7,10,0.85)',
              textTransform: 'uppercase',
              fontSize: '0.65rem',
              letterSpacing: '0.1em'
            }}
          >
            {aiState === 'listening' ? '🔴 LISTENING...' : aiState === 'thinking' ? '⏳ THINKING...' : aiState === 'speaking' ? '🗣️ SPEAKING...' : '🌐 AURA LIVE'}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="aura-messages-list">
          {messages.map((msg, index) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end', marginBottom: '12px' }}>
                <div 
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line',
                    background: isBot ? 'rgba(255, 255, 255, 0.03)' : 'var(--primary-gold)',
                    color: isBot ? 'var(--text-primary)' : '#06070a',
                    border: isBot ? '1px solid var(--border-light)' : 'none',
                    borderRadiusStyle: isBot ? '0 16px 16px 16px' : '16px 16px 0 16px',
                    boxShadow: isBot ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.2)'
                  }}
                >
                  {msg.text}
                </div>

                {/* Recommend Attachments inside Drawer */}
                {isBot && msg.recommendation && (
                  <div 
                    className="glass-panel" 
                    style={{
                      marginTop: '8px',
                      padding: '12px',
                      width: '100%',
                      background: 'rgba(197, 168, 128, 0.03)',
                      border: '1px solid var(--border-glow)',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary-gold)' }}>{msg.recommendation.salon.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>📍 {msg.recommendation.salon.address}</div>
                      </div>
                      <span className="badge-cyan" style={{ fontSize: '0.6rem' }}>★ {msg.recommendation.salon.rating}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', marginTop: '8px', paddingTop: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '500' }}>{msg.recommendation.service.name}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>₹{msg.recommendation.service.price}</div>
                      </div>
                      <button
                        className="btn-primary"
                        style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', gap: '4px' }}
                        onClick={() => handleQuickBook(msg.recommendation.salon, msg.recommendation.service)}
                        disabled={addedItems[msg.recommendation.service.id]}
                      >
                        {addedItems[msg.recommendation.service.id] ? (
                          <>
                            <Check size={12} />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={12} />
                            Book Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Voice Prompt Tags */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '6px', overflowX: 'auto', background: 'rgba(0,0,0,0.2)' }}>
          <button 
            className="service-cat-tab" 
            style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
            onClick={() => processUserMessage("Suggest a master haircut in Bangalore")}
          >
            💇 Haircut Bangalore
          </button>
          <button 
            className="service-cat-tab" 
            style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
            onClick={() => processUserMessage("I have a wedding tomorrow")}
          >
            💍 Wedding Plan
          </button>
          <button 
            className="service-cat-tab" 
            style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
            onClick={() => processUserMessage("Take me to the map")}
          >
            🗺️ Show Map
          </button>
        </div>

        {/* Footer Input and Mic controls */}
        <div className="aura-input-footer">
          <button 
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={startVoiceListening}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isListening ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255,255,255,0.03)',
              border: isListening ? '2px solid #ff3b30' : '1px solid var(--border-light)',
              color: isListening ? '#ff3b30' : 'var(--primary-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: isListening ? '0 0 15px rgba(255, 59, 48, 0.4)' : 'none',
              transition: 'all 0.3s ease'
            }}
            title="Talk to Aura"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Ask Aura... (e.g. Optimize ₹1500)" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ flexGrow: 1, padding: '10px 14px', fontSize: '0.85rem' }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', borderRadius: '8px' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
