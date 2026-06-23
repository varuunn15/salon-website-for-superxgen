import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, Check, RefreshCw, Scissors, Heart, ShieldAlert } from 'lucide-react';

export default function FaceAnalysis({
  currentCity,
  salons,
  addToCart,
  openCart,
  onSaveDiagnostics
}) {
  const [stream, setStream] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [photoCaptured, setPhotoCaptured] = useState(null);
  const [report, setReport] = useState(null);
  const [addedItems, setAddedItems] = useState({});

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Start Camera
  const startCamera = async () => {
    setPhotoCaptured(null);
    setReport(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access failed: ", err);
      alert("Unable to access camera. Please upload an image instead.");
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPhotoCaptured(dataUrl);

    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    // Trigger AI Scan Simulation
    triggerScanSimulation();
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoCaptured(event.target.result);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      triggerScanSimulation();
    };
    reader.readAsDataURL(file);
  };

  // Scan simulation with canvas drawing overlays
  const triggerScanSimulation = () => {
    setScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          generateDiagnosticReport();
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Canvas drawing loop for cyber scanner
  useEffect(() => {
    if (!scanning || !canvasRef.current || !photoCaptured) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = photoCaptured;

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw base image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 1. Draw glowing cyan laser scanline moving up and down
      const time = Date.now() * 0.003;
      const laserY = (Math.sin(time) * 0.5 + 0.5) * canvas.height;
      
      ctx.strokeStyle = '#66FCF1';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#66FCF1';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(0, laserY);
      ctx.lineTo(canvas.width, laserY);
      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;

      // 2. Draw mock facial tracking nodes (mesh points on eyes, nose, mouth, jawline)
      const nodes = [
        { x: 320, y: 150 }, // Forehead center
        { x: 260, y: 200 }, // Left eye
        { x: 380, y: 200 }, // Right eye
        { x: 320, y: 250 }, // Nose bridge
        { x: 320, y: 280 }, // Nose tip
        { x: 280, y: 330 }, // Left mouth corner
        { x: 360, y: 330 }, // Right mouth corner
        { x: 320, y: 350 }, // Lip bottom
        { x: 200, y: 230 }, // Left cheek contour
        { x: 440, y: 230 }, // Right cheek contour
        { x: 230, y: 350 }, // Left jaw
        { x: 410, y: 350 }, // Right jaw
        { x: 320, y: 400 }  // Chin tip
      ];

      ctx.fillStyle = '#66FCF1';
      nodes.forEach((n, idx) => {
        ctx.beginPath();
        // Pulsate radius
        const rad = 4 + Math.sin(time * 2 + idx) * 2;
        ctx.arc(n.x, n.y, rad, 0, 2 * Math.PI);
        ctx.fill();

        // Draw connections for cyber mesh look
        ctx.strokeStyle = 'rgba(102, 252, 241, 0.25)';
        ctx.lineWidth = 1;
        nodes.forEach((otherN, otherIdx) => {
          if (idx !== otherIdx && Math.abs(idx - otherIdx) <= 2) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(otherN.x, otherN.y);
            ctx.stroke();
          }
        });
      });

      // 3. Draw text indicators on the sides
      ctx.fillStyle = 'rgba(6, 7, 10, 0.7)';
      ctx.fillRect(10, 10, 180, 70);
      ctx.strokeStyle = '#FFE082';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 180, 70);

      ctx.fillStyle = '#fff';
      ctx.font = '10px monospace';
      ctx.fillText("AI DETECT ENGINE: ACTIVE", 20, 25);
      ctx.fillText(`SCAN RATE: ${Math.round(scanProgress)}%`, 20, 42);
      ctx.fillStyle = '#66FCF1';
      ctx.fillText("FACIAL GEOMETRY: MAPPING", 20, 58);

      animId = requestAnimationFrame(draw);
    };

    img.onload = () => {
      draw();
    };

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [scanning, photoCaptured, scanProgress]);

  // Generates randomized but realistic diagnostic data
  const generateDiagnosticReport = () => {
    const faceShapes = ["Oval", "Round", "Square", "Heart"];
    const skinTones = ["Fair (Warm-under)", "Fair (Cool-under)", "Wheatish / Olive", "Warm Honey"];
    const acneGrades = ["None (Clean)", "Mild (Grade 1)", "Moderate (Grade 2)"];
    
    // Choose randomly based on seed or simple random for variety
    const faceShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
    const skinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
    const acne = acneGrades[Math.floor(Math.random() * acneGrades.length)];

    // Find custom beauty treatments from nearby salons to offer direct booking
    const currentSalons = salons.filter(s => currentCity.toLowerCase() === 'all cities' || s.city.toLowerCase() === currentCity.toLowerCase());
    const matchedSalon = currentSalons[0] || { name: "Bodycraft Salon", services: [] };
    
    // Try to find a haircut and a facial in the salon
    const recommendedHaircut = matchedSalon.services?.find(s => s.category === 'hair') || { id: 'sh1', name: "Precision Haircut", price: 1200 };
    const recommendedFacial = matchedSalon.services?.find(s => s.category === 'facial') || { id: 'sf1', name: "Brightening Medifacial", price: 3500 };

    const reportData = {
      metrics: {
        faceShape,
        hairline: "Receding Taper (Normal)",
        beardDensity: "Medium / Trimmed stubble",
        mustacheGrowth: "Thick Chevron style",
        hairTexture: "Wavy & Textured",
        hairDensity: "High density",
        forehead: "Balanced proportions",
        jawline: "Strong angle",
        skinTone,
        acne,
        pigmentation: "Minimal (Sun spots only)",
        darkCircles: "Slight (Fatigue based)"
      },
      recommendations: {
        bestHairstyle: faceShape === 'Oval' ? "Textured Crop / Side Swept Pompadour" : faceShape === 'Round' ? "High Volume Pompadour / Undercut Fade" : "Slicked Back Undercut / Buzz Cut",
        avoidHairstyle: faceShape === 'Round' ? "Fringe cuts covering forehead" : "Middle parted shags",
        bestBeard: "Short Boxed Beard / Tailored Stubble",
        bestMustache: "Chevron Trimmed",
        hairColor: "Warm Gold highlights / Mocha Ash brown",
        fade: "Mid-skin drop fade with razor finish",
        facial: `${recommendedFacial.name} at ${matchedSalon.name}`,
        facialService: recommendedFacial,
        haircutService: recommendedHaircut,
        salon: matchedSalon,
        skincare: "Salicylic acid foaming cleanser + Vitamin C glow serum with SPF 50 daily",
        facialText: `${recommendedFacial.name} at ${matchedSalon.name}`,
        haircutText: `${recommendedHaircut.name} at ${matchedSalon.name}`
      }
    };

    setReport(reportData);
    if (onSaveDiagnostics) {
      onSaveDiagnostics(reportData);
    }
  };

  const handleBookTreatment = (salon, service) => {
    addToCart({
      ...service,
      salonId: salon.id,
      salonName: salon.name,
      city: salon.city
    });
    setAddedItems(prev => ({ ...prev, [service.id]: true }));
    
    setTimeout(() => {
      openCart();
    }, 500);
  };

  return (
    <div className="face-scan-container glass-panel animate-fade-in" style={{ padding: '24px', position: 'relative' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 className="font-display gradient-text" style={{ fontSize: '2.2rem', margin: '0 0 4px' }}>AI Face Diagnostics Scanner</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Upload a selfie or capture from camera. Aura will map your features and generate localized styling and skincare recommendations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: photoCaptured ? '1fr 1fr' : '1fr', gap: '24px' }}>
        {/* Left Side: Video Capture / Scanner Canvas */}
        <div 
          className="scanner-viewport glass-panel" 
          style={{ 
            height: '400px', 
            position: 'relative', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border-light)'
          }}
        >
          {/* 1. Camera Live Feed */}
          {stream && !photoCaptured && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <button 
                className="btn-primary" 
                onClick={capturePhoto}
                style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', gap: '8px' }}
              >
                <Camera size={16} /> Capture Selfie
              </button>
            </div>
          )}

          {/* 2. Photo Scanner Canvas */}
          {photoCaptured && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {scanning ? (
                <canvas 
                  ref={canvasRef} 
                  width={640} 
                  height={480} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <img 
                  src={photoCaptured} 
                  alt="Captured Selfie" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              )}
            </div>
          )}

          {/* 3. Empty State controls */}
          {!stream && !photoCaptured && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div 
                className="logo-symbol" 
                style={{ margin: '0 auto 20px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(102, 252, 241, 0.1)', color: 'var(--primary-cyan)' }}
              >
                <Camera size={28} />
              </div>
              <p style={{ fontWeight: '600', marginBottom: '16px' }}>Choose scan capture method:</p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn-primary" onClick={startCamera} style={{ gap: '8px' }}>
                  <Camera size={16} /> Open Web Camera
                </button>
                <button 
                  className="service-cat-tab" 
                  onClick={() => fileInputRef.current.click()}
                  style={{ gap: '8px', display: 'flex', alignItems: 'center' }}
                >
                  <Upload size={16} /> Upload Selfie Photo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>
            </div>
          )}

          {/* Scanning Progress Overlay */}
          {scanning && (
            <div 
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(6, 7, 10, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <h3 style={{ color: 'var(--primary-cyan)', marginBottom: '8px', fontWeight: 'bold' }}>AI SCANNING IN PROGRESS</h3>
              <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', background: 'var(--primary-cyan)', transition: 'width 0.1s ease' }}></div>
              </div>
              <span style={{ fontSize: '0.8rem', marginTop: '6px', color: '#aaa' }}>Mapping face points... {scanProgress}%</span>
            </div>
          )}
        </div>

        {/* Right Side: Detailed Diagnostics & Reports */}
        {photoCaptured && !scanning && report && (
          <div className="diagnostics-panel animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={18} style={{ color: 'var(--primary-gold)' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>Face Analysis Report</h2>
              </div>
              <button 
                className="service-cat-tab" 
                onClick={startCamera}
                style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RefreshCw size={12} /> Scan Again
              </button>
            </div>

            {/* Diagnostic Metrics Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              {Object.entries(report.metrics).map(([key, val]) => (
                <div key={key} style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', padding: '4px 0' }}>
                  <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{val}</strong>
                </div>
              ))}
            </div>

            {/* AI Custom Styling Recommendations */}
            <div className="recommendations-box" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--primary-gold)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                💇 Styling Diagnostics
              </h3>

              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.8rem' }}>
                <div style={{ marginBottom: '6px' }}>🟢 <strong>Hairstyle to Choose:</strong> {report.recommendations.bestHairstyle}</div>
                <div style={{ marginBottom: '6px', color: '#ff4d4d' }}>❌ <strong>Avoid Haircuts:</strong> {report.recommendations.avoidHairstyle}</div>
                <div style={{ marginBottom: '6px' }}>🧔 <strong>Beard Styling:</strong> {report.recommendations.bestBeard} ({report.recommendations.bestMustache})</div>
                <div>⚡ <strong>Fade Cut:</strong> {report.recommendations.fade}</div>
              </div>

              <h3 style={{ fontSize: '0.9rem', color: 'var(--primary-cyan)', margin: '8px 0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🧴 Skin Care Diagnostics
              </h3>

              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.8rem' }}>
                <div style={{ marginBottom: '6px' }}>✨ <strong>Recommended Skincare:</strong> {report.recommendations.skincare}</div>
                <div>🏥 <strong>Clinical Facial:</strong> {report.recommendations.facial}</div>
              </div>
            </div>

            {/* Quick Actions / Directly Book the recommendations */}
            <div 
              style={{ 
                marginTop: 'auto', 
                borderTop: '1px solid var(--border-light)', 
                paddingTop: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                📍 Real-world packages matching diagnostics at **{report.recommendations.salon.name}** in Indiranagar:
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Haircut booking button */}
                <button
                  className="btn-primary"
                  onClick={() => handleBookTreatment(report.recommendations.salon, report.recommendations.haircutService)}
                  disabled={addedItems[report.recommendations.haircutService.id]}
                  style={{ flexGrow: 1, padding: '10px', fontSize: '0.75rem', gap: '4px' }}
                >
                  {addedItems[report.recommendations.haircutService.id] ? (
                    <>
                      <Check size={12} /> Haircut Booked
                    </>
                  ) : (
                    <>
                      <Scissors size={12} /> Book Haircut (₹{report.recommendations.haircutService.price})
                    </>
                  )}
                </button>

                {/* Facial booking button */}
                <button
                  className="btn-primary"
                  onClick={() => handleBookTreatment(report.recommendations.salon, report.recommendations.facialService)}
                  disabled={addedItems[report.recommendations.facialService.id]}
                  style={{ flexGrow: 1, padding: '10px', fontSize: '0.75rem', gap: '4px', background: 'linear-gradient(135deg, #FFE082, #D4AF37)', color: '#000' }}
                >
                  {addedItems[report.recommendations.facialService.id] ? (
                    <>
                      <Check size={12} /> Facial Booked
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} /> Book Facial (₹{report.recommendations.facialService.price})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
