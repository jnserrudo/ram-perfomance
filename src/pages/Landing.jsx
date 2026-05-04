import { useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client.js';
import {
  Dumbbell, Clock, Users, MapPin, Phone, Mail,
  ChevronRight, Star, Zap, ArrowRight
} from 'lucide-react';

export default function Landing() {
  const [form, setForm] = useState({ nombre: '', apellido: '', dni: '', celular: '', email: '', codigoReferido: '' });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/solicitudes', form);
      setEnviado(true);
      setForm({ nombre: '', apellido: '', dni: '', celular: '', email: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Hubo un problema. Intentá de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-forest">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/banner.jpeg" alt="RAM Performance" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/80 to-forest" />
        </div>
        {/* Brand badge top-left */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
          <img src="/logo.jpeg" alt="RAM Performance" className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-cream/30 shadow-lg" />
          <span className="font-display text-lg md:text-xl text-cream tracking-wide hidden sm:block">RAM PERFORMANCE</span>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream mb-4 tracking-wide">
            RAM PERFORMANCE
          </h1>
          <p className="text-lg md:text-xl text-cream/80 max-w-2xl mx-auto mb-8 font-light">
            Tu fuerza, nuestro compromiso. Entrenamiento funcional y musculación
            con horarios flexibles y sistema de créditos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-cream text-forest-dark px-8 py-3.5 rounded-md font-semibold text-base hover:bg-cream-dark transition-colors"
            >
              Quiero inscribirme <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream px-8 py-3.5 rounded-md font-medium text-base hover:bg-cream/10 transition-colors"
            >
              Ya soy miembro
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-12">¿POR QUÉ ELEGIRNOS?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Zap size={32} />} title="Créditos Flexibles" desc="No te amarres a días fijos. Usá tus créditos cuando quieras." />
            <FeatureCard icon={<Clock size={32} />} title="Horarios Amplios" desc="Mañana, tarde y noche. Encontrá tu momento ideal." />
            <FeatureCard icon={<Users size={32} />} title="Grupos Reducidos" desc="Máximo 12 personas por turno para entrenar tranquilo." />
            <FeatureCard icon={<Star size={32} />} title="Entrenamiento Real" desc="Musculación y funcional con profes que te guían." />
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 px-4 bg-forest-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-8">HORARIOS</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <HorarioCard titulo="Mañana" horas="7:00 - 10:00" bloque="MANANA" />
            <HorarioCard titulo="Tarde" horas="13:00 - 17:00" bloque="TARDE" />
            <HorarioCard titulo="Noche" horas="18:00 - 21:00" bloque="NOCHE" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-4xl md:text-5xl mb-6">CONTACTO</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-cream/80">
                  <MapPin size={20} />
                  <span>Dirección del gimnasio</span>
                </div>
                <div className="flex items-center gap-3 text-cream/80">
                  <Phone size={20} />
                  <span>+54 9 XXX XXXX-XXXX</span>
                </div>
                <div className="flex items-center gap-3 text-cream/80">
                  <Mail size={20} />
                  <span>info@ramperformance.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-4">Solicitá tu inscripción</h3>
              {enviado ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                  <div className="text-green-400 font-semibold text-lg mb-2">¡Solicitud enviada!</div>
                  <p className="text-cream/70">Nos pondremos en contacto con vos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text" placeholder="Nombre" required
                      value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                      className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50"
                    />
                    <input
                      type="text" placeholder="Apellido" required
                      value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })}
                      className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50"
                    />
                  </div>
                  <input
                    type="text" placeholder="DNI" required
                    value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50"
                  />
                  <input
                    type="tel" placeholder="Celular" required
                    value={form.celular} onChange={e => setForm({ ...form, celular: e.target.value })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50"
                  />
                  <input
                    type="email" placeholder="Email" required
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50"
                  />
                  <input
                    type="text" placeholder="Código de referido (opcional)"
                    value={form.codigoReferido} onChange={e => setForm({ ...form, codigoReferido: e.target.value })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50"
                  />
                  <p className="text-cream/40 text-xs -mt-2">¿Te invitó un amigo? Ingresá su código para que ambos reciban 2 clases gratis 🎉</p>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button type="submit" className="w-full bg-cream text-forest-dark py-3 rounded-md font-semibold text-sm hover:bg-cream-dark transition-colors">
                    Enviar solicitud
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream/10 py-8 px-4 text-center text-cream/50 text-sm">
        RAM Performance - Desarrollado By JNSIX. Todos los derechos reservados. 
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-cream/5 border border-cream/10 rounded-lg p-6 hover:border-cream/20 transition-colors">
      <div className="text-cream mb-3">{icon}</div>
      <h3 className="font-semibold text-cream mb-2">{title}</h3>
      <p className="text-cream/70 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function HorarioCard({ titulo, horas }) {
  return (
    <div className="bg-cream/5 border border-cream/10 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={18} className="text-cream" />
        <h3 className="font-semibold text-cream">{titulo}</h3>
      </div>
      <p className="text-cream/70 text-sm">{horas}</p>
    </div>
  );
}
