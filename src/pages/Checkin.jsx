import { useState, useRef, useEffect } from 'react';
import client from '../api/client.js';
import { CheckCircle, XCircle, Keyboard, ArrowLeft, Clock, Camera, CameraOff } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { Link } from 'react-router-dom';

export default function Checkin() {
  const [dni, setDni] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const inputRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!escaneando) {
      inputRef.current?.focus();
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [escaneando]);

  const iniciarEscaneo = async () => {
    setResultado(null);
    setEscaneando(true);
    setTimeout(async () => {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            handleCheckin(decodedText);
            detenerEscaneo();
          },
          () => {} // Silenciar errores de escaneo fallido (frames sin QR)
        );
      } catch (err) {
        console.error("Error al iniciar cámara:", err);
        setEscaneando(false);
      }
    }, 100);
  };

  const detenerEscaneo = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (e) {}
    }
    setEscaneando(false);
  };

  const handleCheckin = async (dniParaCheckin) => {
    const valorDni = dniParaCheckin || dni;
    if (!valorDni.trim() || valorDni.length < 7) return;
    
    setLoading(true);
    setResultado(null);
    try {
      const res = await client.post('/checkin', { dni: valorDni.trim() });
      setResultado({ success: true, ...res.data });
      setDni('');
      setTimeout(() => setResultado(null), 5000);
    } catch (err) {
      setResultado({
        success: false,
        error: err.response?.data?.error || 'Error al procesar'
      });
      setTimeout(() => setResultado(null), 5000);
    } finally {
      setLoading(false);
      if (!escaneando) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && dni.length >= 7 && !escaneando) {
        handleCheckin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dni, escaneando]);

  return (
    <div className="min-h-screen bg-forest flex flex-col items-center justify-center px-4 relative">
      <Link to="/" className="absolute top-4 left-4 text-cream/50 hover:text-cream flex items-center gap-1 text-sm transition-colors">
        <ArrowLeft size={16} /> Volver
      </Link>

      {/* Logo */}
      <div className="text-center mb-8">
        <img src="/logo.jpeg" alt="RAM Performance" className="w-32 md:w-48 mx-auto mb-4 rounded-lg" />
        <h1 className="font-display text-3xl md:text-4xl text-cream">CHECK-IN</h1>
        <p className="text-cream/50 text-sm mt-1">Registrá tu entrada al gimnasio</p>
      </div>

      {/* Selector de modo */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => { if (escaneando) detenerEscaneo(); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${!escaneando ? 'bg-cream text-forest-dark' : 'bg-cream/10 text-cream/40'}`}
        >
          <Keyboard size={16} /> Teclado
        </button>
        <button
          onClick={() => { if (!escaneando) iniciarEscaneo(); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${escaneando ? 'bg-cream text-forest-dark' : 'bg-cream/10 text-cream/40'}`}
        >
          <Camera size={16} /> Escáner QR
        </button>
      </div>

      {/* Contenedor de entrada */}
      <div className="w-full max-w-md">
        {escaneando ? (
          <div className="relative bg-black rounded-3xl overflow-hidden border-2 border-cream/20 aspect-square mb-4 shadow-2xl">
            <div id="reader" className="w-full h-full"></div>
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border-2 border-cream/40 rounded-xl animate-pulse"></div>
            </div>
            <button
              onClick={detenerEscaneo}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <CameraOff size={14} /> Detener Cámara
            </button>
          </div>
        ) : (
          <>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={dni}
                onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="DNI"
                className="w-full bg-cream/5 border-2 border-cream/20 rounded-xl px-6 py-5 text-center text-4xl md:text-5xl text-cream placeholder-cream/20 font-display tracking-wider focus:outline-none focus:border-cream/50 transition-colors"
                autoFocus
              />
              <Keyboard size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/20" />
            </div>

            <button
              onClick={() => handleCheckin()}
              disabled={loading || dni.length < 7}
              className="w-full mt-4 bg-cream text-forest-dark py-4 rounded-xl font-semibold text-lg hover:bg-cream-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cream/10"
            >
              {loading ? 'Procesando...' : 'Registrar entrada'}
            </button>
          </>
        )}
      </div>

      {/* Resultado */}
      {resultado && (
        <div className={`mt-8 w-full max-w-md rounded-xl p-8 text-center animate-pulse ${
          resultado.success
            ? 'bg-green-500/10 border-2 border-green-500/30'
            : 'bg-red-500/10 border-2 border-red-500/30'
        }`}>
          {resultado.success ? (
            <>
              <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
              <h2 className="font-display text-3xl text-green-400 mb-2">¡BIENVENIDO!</h2>
              <p className="text-cream text-lg mb-1">{resultado.message}</p>
              {resultado.clase && (
                <p className="text-cream/70 text-sm">{resultado.clase} - {resultado.hora}:00 hs</p>
              )}
              {resultado.creditosRestantes !== undefined && (
                <p className="text-cream/60 text-sm mt-2">Te quedan {resultado.creditosRestantes} clases</p>
              )}
            </>
          ) : (
            <>
              <XCircle size={64} className="text-red-400 mx-auto mb-4" />
              <h2 className="font-display text-3xl text-red-400 mb-2">UPS</h2>
              <p className="text-cream text-lg mb-4">{resultado.error}</p>
              {resultado.turnosHoy && resultado.turnosHoy.length > 0 && (
                <div className="mt-2 bg-forest/50 rounded-lg p-3">
                  <p className="text-cream/60 text-xs mb-2 font-medium">TURNOS DISPONIBLES HOY:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {resultado.turnosHoy.map((t, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-cream/5 rounded-md px-2.5 py-1 text-xs text-cream/80">
                        <Clock size={12} />
                        {t.hora}:00 · {t.clase}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
