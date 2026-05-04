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
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/banner.jpeg" alt="RAM Performance" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/80 to-forest" />
        </div>
        {/* Brand badge top-left */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 md:gap-3">
          <img src="/logo.jpeg" alt="RAM Performance" className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-2 border-cream/30 shadow-lg" />
          <span className="font-display text-sm md:text-xl text-cream tracking-wide">RAM</span>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-display text-2xl sm:text-5xl md:text-7xl lg:text-8xl text-cream mb-2 md:mb-4 tracking-wide leading-tight">
            RAM PERFORMANCE
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-cream/80 max-w-2xl mx-auto mb-4 md:mb-8 font-light px-2 leading-snug">
            Tu fuerza, nuestro compromiso. Entrenamiento funcional y musculación
            con horarios flexibles y sistema de créditos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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

      {/* Features + Horarios COMBINADOS */}
      <section className="py-6 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Features compactos */}
          <h2 className="font-display text-lg sm:text-2xl md:text-4xl text-center mb-3 md:mb-6">¿POR QUÉ ELEGIRNOS?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-10">
            <FeatureCard icon={<Zap size={18} className="md:w-6 md:h-6" />} title="Créditos Flexibles" desc="Usá tus créditos cuando quieras." />
            <FeatureCard icon={<Clock size={18} className="md:w-6 md:h-6" />} title="Horarios Amplios" desc="Mañana, tarde y noche." />
            <FeatureCard icon={<Users size={18} className="md:w-6 md:h-6" />} title="Grupos Reducidos" desc="Máximo 12 personas por turno." />
            <FeatureCard icon={<Star size={18} className="md:w-6 md:h-6" />} title="Entrenamiento Real" desc="Musculación y funcional." />
          </div>
          
          {/* Horarios integrados */}
          <div className="bg-forest-dark/50 border border-cream/10 rounded-lg p-4 md:p-6">
            <h3 className="font-display text-base sm:text-xl md:text-2xl text-center mb-3 md:mb-4">HORARIOS</h3>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <HorarioCard titulo="Mañana" horas="7:00 - 10:00" />
              <HorarioCard titulo="Tarde" horas="13:00 - 17:00" />
              <HorarioCard titulo="Noche" horas="18:00 - 21:00" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-6 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5 md:gap-8">
            <div>
              <h2 className="font-display text-lg sm:text-2xl md:text-3xl mb-2 md:mb-4">CONTACTO</h2>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 text-cream/80 text-sm md:text-base">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span>Dirección del gimnasio</span>
                </div>
                <div className="flex items-center gap-2 text-cream/80 text-sm md:text-base">
                  <Phone size={16} className="flex-shrink-0" />
                  <span>+54 9 XXX XXXX-XXXX</span>
                </div>
                <div className="flex items-center gap-2 text-cream/80 text-sm md:text-base">
                  <Mail size={16} className="flex-shrink-0" />
                  <span>info@ramperformance.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-display text-base sm:text-xl mb-2 md:mb-3">Solicitá tu inscripción</h3>
              {enviado ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                  <div className="text-green-400 font-semibold text-lg mb-2">¡Solicitud enviada!</div>
                  <p className="text-cream/70">Nos pondremos en contacto con vos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text" placeholder="Nombre" required
                      value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                      className="w-full bg-cream/5 border border-cream/20 rounded-md px-2.5 py-2 text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50"
                    />
                    <input
                      type="text" placeholder="Apellido" required
                      value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })}
                      className="w-full bg-cream/5 border border-cream/20 rounded-md px-2.5 py-2 text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50"
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
                  <p className="text-cream/40 text-xs -mt-1">¿Te invitó un amigo? Ingresá su código para que ambos reciban 2 clases gratis.</p>
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <button type="submit" className="w-full bg-cream text-forest-dark py-2.5 rounded-md font-semibold text-sm hover:bg-cream-dark transition-colors">
                    Enviar solicitud
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream/10 py-4 md:py-6 px-4 text-center text-cream/50 text-xs md:text-sm">
        RAM Performance - Desarrollado By JNSIX. Todos los derechos reservados. 
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-cream/5 border border-cream/10 rounded-lg p-2.5 md:p-4 hover:border-cream/20 transition-colors text-center">
      <div className="text-cream mb-1.5 flex justify-center">{icon}</div>
      <h3 className="font-semibold text-cream text-xs md:text-sm mb-1 leading-tight">{title}</h3>
      <p className="text-cream/60 text-[10px] md:text-xs leading-tight">{desc}</p>
    </div>
  );
}

function HorarioCard({ titulo, horas }) {
  return (
    <div className="bg-cream/5 border border-cream/10 rounded-lg p-2 md:p-3 text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Clock size={14} className="text-cream" />
        <h3 className="font-semibold text-cream text-xs md:text-sm">{titulo}</h3>
      </div>
      <p className="text-cream/70 text-[10px] md:text-xs">{horas}</p>
    </div>
  );
}
