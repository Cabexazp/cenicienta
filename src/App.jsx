import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Crown, Calendar, Clock, MapPin, Volume2, VolumeX, Mail, MessageCircle, UserCheck } from 'lucide-react';

// === COMPONENTE ELECTRIC BORDER POTENCIADO CON IMAGEN DE FONDO INTERNA ===
function ElectricBorder({ children, className = "", backgroundImage = "" }) {
  return (
    <div className={`relative group p-[4px] rounded-[28px] overflow-hidden ${className}`}>
      {/* 1. Resplandor exterior multidireccional */}
      <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#38bdf8,#fef08a,#38bdf8,#a855f7,#38bdf8)] animate-spin-fast opacity-90 blur-xl z-0" />
      
      {/* 2. Filtro Eléctrico SVG Animado (Siempre encima del resplandor de fondo) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-[28px] z-30 overflow-visible">
        <filter id="electric-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComponentTransfer in="blur" result="glow">
            <feFuncA type="linear" slope="2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <rect
          x="3"
          y="3"
          width="calc(100% - 6px)"
          height="calc(100% - 6px)"
          rx="24"
          fill="none"
          stroke="url(#electric-gradient)"
          strokeWidth="4"
          strokeDasharray="18 10"
          filter="url(#electric-glow)"
          className="animate-electric-dash"
        />
        <defs>
          <linearGradient id="electric-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3. Contenedor Interior Traslúcido con la IMAGEN DE FONDO y Cristal Acrílico */}
      <div 
        className="relative h-full w-full bg-slate-950/85 rounded-[24px] shadow-[0_0_50px_rgba(56,189,248,0.4)] z-10 border border-sky-300/30 bg-cover bg-center overflow-hidden flex flex-col"
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}
      >
        {/* Capa de superposición para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950/95 z-0" />
        
        {/* Contenido adaptable al alto */}
        <div className="relative z-10 flex-1 flex flex-col justify-between p-5 text-center">
            {children}
        </div>
      </div>

      <style>{`
        @keyframes electricDash {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 280; }
        }
        .animate-electric-dash {
          animation: electricDash 1.8s linear infinite;
        }
        @keyframes spinFast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-fast {
          animation: spinFast 4.5s linear infinite;
        }
      `}</style>
    </div>
  );
}

// === COMPONENTE DE TEXTO NEÓN DORADO EN ACRÍLICO ===
function NeonGoldName({ text }) {
  return (
    <div className="relative inline-block p-3 sm:p-5 my-1 select-none w-full z-10">
      <div 
        className="absolute inset-0 rounded-3xl bg-amber-200/10 backdrop-blur-[2px] border border-amber-300/30" 
        style={{
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.2)'
        }}
      />
      <h1 
        className="relative text-2xl sm:text-4xl md:text-5xl font-normal tracking-wide text-amber-100 break-words leading-tight"
        style={{
          fontFamily: "'Great Vibes', 'Sacramento', cursive",
          textShadow: `
            0 0 2px #fff,
            0 0 5px #fff,
            0 0 10px #ffe600,
            0 0 20px #ffb700,
            0 0 30px #ff9900
          `
        }}
      >
        {text}
      </h1>
    </div>
  );
}

// === COMPONENTE MASKED HEADING ===
function MaskedHeading({ text }) {
  return (
    <div className="relative overflow-hidden inline-block py-1 my-1 z-10">
      <p 
        className="text-base sm:text-lg font-medium tracking-[0.35em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 animate-masked-reveal"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.6))' }}
      >
        {text}
      </p>

      <style>{`
        @keyframes maskedReveal {
          0% {
            clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            transform: translateY(0%);
            opacity: 1;
          }
        }
        .animate-masked-reveal {
          animation: maskedReveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1) translateY(0px); }
          50% { transform: scale(1.04) translateY(-8px); }
        }
        .animate-breath {
          animation: breathing 4.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState('cover'); // 'cover' -> 'card' -> 'details'
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const eventDate = new Date('2026-10-10T19:00:00');
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +eventDate - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Partículas Mágicas
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 1,
      color: Math.random() > 0.3 ? 'rgba(186, 230, 253, ' : 'rgba(255, 255, 255, ',
      alpha: Math.random() * 0.7 + 0.3,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      isStar: Math.random() > 0.7
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        if (p.isStar) {
          ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color + p.alpha + ')';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#38bdf8';
        } else {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color + p.alpha + ')';
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#ffffff';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleOpenCard = () => {
    setStep('card');
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleOpenDetails = () => {
    setStep('details');
  };

  const handleWhatsappRsvp = () => {
    const message = encodeURIComponent("¡Hola! Confirmo mi asistencia para los 15 años de Manuela Rengifo Quintero.");
    window.open(`https://wa.me/+34641403657?text=${message}`, '_blank');
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans select-none bg-slate-950 text-white flex flex-col">
      
      {/* Música MP3 */}
      <audio ref={audioRef} src="/musica.mp3" loop preload="auto" />

      {/* Fondo Original Fijo en Todos los Pasos */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 z-0 transform scale-105"
        style={{ backgroundImage: `url('/fondo-jardin.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/60 to-slate-950/45" />
      </div>

      {/* Partículas Mágicas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Botón de Música */}
      <button
        onClick={toggleMusic}
        className="fixed top-5 right-5 z-50 p-3.5 rounded-full bg-sky-950/60 backdrop-blur-md border border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)] text-sky-200 hover:scale-110 active:scale-95 transition-all"
      >
        {isPlaying ? <Volume2 className="w-6 h-6 animate-pulse text-sky-300" /> : <VolumeX className="w-6 h-6 text-sky-200/70" />}
      </button>

      {/* PASO 1: PORTADA */}
      {step === 'cover' && (
        <div className="relative z-30 min-h-screen max-w-lg mx-auto flex flex-col justify-between items-center px-4 py-6 flex-grow">
          <div className="pt-2 z-20">
            <div className="p-2.5 rounded-full bg-slate-900/50 backdrop-blur-md border border-amber-300/40 shadow-[0_0_15px_rgba(251,191,36,0.3)] inline-block">
              <Crown className="w-8 h-8 text-amber-200 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
            </div>
          </div>

          <div className="relative w-full flex-1 flex items-center justify-between my-auto py-2 px-1 z-30">
            <div className="w-[55%] flex flex-col justify-center items-start text-left space-y-2 z-30 pl-1">
              <div className="w-full transform scale-105 origin-left">
                <NeonGoldName text="Manuela Rengifo Quintero" />
              </div>
              <div className="pl-1">
                <MaskedHeading text="Mis 15 Años" />
              </div>
            </div>

            <div className="absolute right-[-15%] sm:right-[-10%] top-1/2 -translate-y-1/2 z-40 pointer-events-none flex items-center justify-end">
              <div className="relative h-[85vh] max-h-[450px] w-auto flex items-center justify-center animate-breath">
                <div className="absolute inset-0 bg-sky-400/25 rounded-full blur-3xl -z-10 scale-90" />
                <img 
                  src="/princesa.png" 
                  alt="Princesa" 
                  className="h-full w-auto max-w-none object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] scale-125 origin-bottom"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenCard}
            className="relative z-30 w-full py-4 rounded-full bg-gradient-to-r from-sky-400 via-cyan-500 to-sky-600 text-slate-950 font-bold text-lg shadow-[0_0_25px_rgba(56,189,248,0.5)] border border-sky-200/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Abrir Invitación Real</span>
          </button>
        </div>
      )}

      {/* PASO 2: TARJETA FLOTANTE ADAPTABLE AL ALTO CON ELECTRIC BORDER E IMAGEN INTERNA DE FONDO */}
      {step === 'card' && (
        <div className="relative z-30 min-h-screen max-w-md mx-auto flex flex-col justify-center items-center px-4 py-8 animate-fade-in flex-grow">
          
          {/* w-full max-w-sm, y h-[90vh] max-h-[700px] para adaptarse al alto del celular */}
          <ElectricBorder 
            className="w-full max-w-sm h-[90vh] max-h-[500px] my-auto" 
            backgroundImage="/fondo-quince.jpg"
          >
            {/* Contenido adaptable distribuido con flexbox */}
            
            {/* Cabecera superior (Nombres y Título) */}
            <div className="pt-2">
                <div className="p-2 mb-3 inline-block rounded-full bg-slate-950/70 backdrop-blur-md border border-amber-300/50 shadow-lg">
                    <Crown className="w-7 h-7 text-amber-200 drop-shadow-[0_0_8px_rgba(253,224,71,0.9)]" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] tracking-wide mb-1 leading-tight">
                Manuela Rengifo Quintero
                </h1>

                <p className="text-sky-200 font-semibold text-xs tracking-[0.3em] uppercase mb-4 drop-shadow-[0_0_5px_#38bdf8]">
                Mis 15 Años
                </p>
            </div>

            {/* Espacio flexible intermedio (puedes añadir aquí una foto de perfil pequeña si quieres o dejarlo vacío para lucir el fondo) */}
            <div className="flex-1 flex items-center justify-center my-4 overflow-hidden rounded-2xl border border-amber-300/20 bg-slate-950/30">
                {/* Aquí podría ir un elemento visual extra o simplemente el fondo de los globos luciéndose */}
                <Sparkles className="w-16 h-16 text-amber-300/30 animate-pulse" />
            </div>

            {/* Parte inferior (Mensaje y Botón) */}
            <div className="pb-2">
                <p className="text-white/95 italic text-xs sm:text-sm leading-relaxed mb-6 px-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                "Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que amas los hace inolvidables."
                </p>

                <button
                onClick={handleOpenDetails}
                className="relative z-30 w-full py-4 rounded-full bg-gradient-to-r from-sky-400 via-cyan-500 to-sky-600 text-slate-950 font-bold text-lg shadow-[0_0_25px_rgba(56,189,248,0.5)] border border-sky-200/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                >
                <UserCheck className="w-5 h-5 fill-slate-950" />
                <span>Pase Personal</span>
                </button>
            </div>
          </ElectricBorder>

        </div>
      )}

      {/* PASO 3: DETALLES COMPLETOS DEL EVENTO */}
      {step === 'details' && (
        <main className="relative z-30 max-w-md mx-auto px-5 py-10 space-y-6 text-center animate-fade-in flex-grow">
          <header className="space-y-2 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-sky-400/30 shadow-2xl">
            <h1 className="text-3xl font-serif font-bold text-amber-200 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">
              Manuela Rengifo Quintero
            </h1>
            <p className="text-sky-100/90 italic text-sm leading-relaxed">
              "Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que amas los hace inolvidables."
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-1 rounded-full bg-sky-500/20 border border-sky-300/40 text-sky-200 text-xs font-semibold uppercase tracking-wider">
                Pase Personal Confirmado
              </span>
            </div>
          </header>

          <section className="bg-slate-900/80 backdrop-blur-md border border-sky-400/30 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-sky-300 font-serif font-semibold mb-3 text-xs tracking-wider uppercase">
              <Clock className="w-4 h-4" />
              <span>Cuenta Regresiva</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Días', val: timeLeft.days },
                { label: 'Horas', val: timeLeft.hours },
                { label: 'Min', val: timeLeft.minutes },
                { label: 'Seg', val: timeLeft.seconds },
              ].map((item, i) => (
                <div key={i} className="p-2.5 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-sky-300/20">
                  <span className="block text-2xl font-bold text-sky-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">{item.val}</span>
                  <span className="text-[10px] text-sky-300/80 uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 text-left">
            <div className="bg-slate-900/80 backdrop-blur-md border border-sky-400/30 rounded-3xl p-5 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-300/30">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-amber-200">Fecha y Hora</h2>
                  <p className="text-sm text-sky-100 font-medium">Sábado, 10 de Octubre de 2026</p>
                  <p className="text-xs text-sky-300 font-semibold mt-0.5">7:00 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-sky-400/30 rounded-3xl p-5 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-300/30">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-amber-200">Lugar</h2>
                  <p className="text-sm text-sky-100 font-medium">Hotel Catedral Almería</p>
                  <a 
                    href="https://maps.google.com/?q=Hotel+Catedral+Almería" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 text-xs text-sky-300 underline mt-2 hover:text-sky-100"
                  >
                    Ver Ubicación en Mapa
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-sky-400/30 rounded-3xl p-5 shadow-xl text-center">
              <Mail className="w-6 h-6 text-sky-300 mx-auto mb-1" />
              <h2 className="text-base font-serif font-bold text-amber-200 uppercase tracking-wider">Lluvia de Sobres</h2>
              <p className="text-xs text-sky-100/80 mt-1">
                Su presencia es nuestro mejor regalo. Si desean tener un detalle con la quinceañera, se dispondrá de buzón para lluvia de sobres.
              </p>
            </div>
          </section>

          <button
            onClick={handleWhatsappRsvp}
            className="w-full py-4 rounded-full bg-gradient-to-r from-sky-400 via-cyan-500 to-sky-600 text-slate-950 font-bold text-base shadow-[0_0_25px_rgba(56,189,248,0.4)] border border-sky-200/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-slate-950" />
            <span>Confirmar por WhatsApp</span>
          </button>
        </main>
      )}
    </div>
  );
}