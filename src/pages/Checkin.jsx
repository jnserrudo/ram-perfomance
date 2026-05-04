import { useState, useRef, useEffect } from 'react';
import client from '../api/client.js';
import { CheckCircle, XCircle, Keyboard, ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Checkin() {
  const [dni, setDni] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && dni.length >= 7) {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dni]);

  const handleSubmit = async () => {
    if (!dni.trim() || dni.length < 7) return;
    setLoading(true);
    setResultado(null);
    try {
      const res = await client.post('/checkin', { dni: dni.trim() });
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
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="min-h-screen bg-forest flex flex-col items-center justify-center px-4 relative">
      <Link to="/" className="absolute top-4 left-4 text-cream/50 hover:text-cream flex items-center gap-1 text-sm transition-colors">
        <ArrowLeft size={16} /> Volver
      </Link>

      {/* Logo */}
      <div className="text-center mb-8">
        <img src="/logo.jpeg" alt="RAM Performance" className="w-32 md:w-48 mx-auto mb-4 rounded-lg" />
        <h1 className="font-display text-3xl md:text-4xl text-cream">CHECK-IN</h1>
        <p className="text-cream/50 text-sm mt-1">Ingresá tu DNI para registrar tu entrada</p>
      </div>

      {/* Input gigante */}
      <div className="w-full max-w-md">
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
          onClick={handleSubmit}
          disabled={loading || dni.length < 7}
          className="w-full mt-4 bg-cream text-forest-dark py-4 rounded-xl font-semibold text-lg hover:bg-cream-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Procesando...' : 'Registrar entrada'}
        </button>
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
