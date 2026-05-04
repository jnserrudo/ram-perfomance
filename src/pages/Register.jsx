import { useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client.js';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', apellido: '', dni: '', celular: '', email: '' });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await client.post('/solicitudes', form);
      setEnviado(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Hubo un error. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-cream/60 hover:text-cream text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        {enviado ? (
          <div className="text-center">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h1 className="font-display text-3xl text-cream mb-3">¡Solicitud enviada!</h1>
            <p className="text-cream/70 mb-6">Te vamos a contactar por WhatsApp o email para confirmar tu inscripción. Tu DNI va a ser tu usuario.</p>
            <Link to="/login" className="inline-block bg-cream text-forest-dark px-6 py-2.5 rounded-md font-medium text-sm hover:bg-cream-dark transition-colors">
              Ir al login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl text-cream mb-2">Inscripción</h1>
            <p className="text-cream/60 text-sm mb-6">Completá tus datos para solicitar tu lugar en RAM Performance</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-cream/70 mb-1">Nombre</label>
                  <input
                    type="text" required
                    value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-1">Apellido</label>
                  <input
                    type="text" required
                    value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-1">DNI</label>
                <input
                  type="text" required
                  value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50"
                  placeholder="Sin puntos ni espacios"
                />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-1">Celular</label>
                <input
                  type="tel" required
                  value={form.celular} onChange={e => setForm({ ...form, celular: e.target.value })}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50"
                  placeholder="Ej: 5491123456789"
                />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-1">Email</label>
                <input
                  type="email" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-md px-4 py-2.5 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cream text-forest-dark py-3 rounded-md font-semibold text-sm hover:bg-cream-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </form>

            <p className="mt-4 text-center text-cream/50 text-sm">
              ¿Ya sos miembro? <Link to="/login" className="text-cream hover:underline">Ingresá acá</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
