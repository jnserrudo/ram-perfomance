import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Calendar, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

const ESTADOS = {
  RESERVADA: { label: 'Confirmada', color: 'text-green-400', icon: CheckCircle },
  ASISTIO: { label: 'Asististe', color: 'text-green-400', icon: CheckCircle },
  NO_ASISTIO: { label: 'No fuiste', color: 'text-red-400', icon: XCircle },
  CANCELADA: { label: 'Cancelada', color: 'text-cream/40', icon: XCircle },
};

export default function Historial() {
  const [reservas, setReservas] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [tab, setTab] = useState('reservas');
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    client.get('/reservas/mias').then(r => setReservas(r.data));
    client.get('/asistencias/mias').then(r => setAsistencias(r.data));
  }, []);

  const formatearFecha = (fecha) => {
    const f = new Date(fecha);
    return f.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  const reservasFiltradas = reservas.filter(r =>
    r.horario?.tipoClase?.titulo?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl text-cream mb-6">HISTORIAL</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-cream/5 rounded-lg p-1">
          <button
            onClick={() => setTab('reservas')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'reservas' ? 'bg-cream/10 text-cream' : 'text-cream/50 hover:text-cream/70'
            }`}
          >
            Reservas ({reservas.length})
          </button>
          <button
            onClick={() => setTab('asistencias')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'asistencias' ? 'bg-cream/10 text-cream' : 'text-cream/50 hover:text-cream/70'
            }`}
          >
            Asistencias ({asistencias.length})
          </button>
        </div>

        {/* Filtro */}
        <div className="relative mb-4">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
          <input
            type="text"
            placeholder="Buscar por clase..."
            value={filtro} onChange={e => setFiltro(e.target.value)}
            className="w-full bg-cream/5 border border-cream/10 rounded-md pl-9 pr-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/30"
          />
        </div>

        {tab === 'reservas' ? (
          <div className="space-y-3">
            {reservasFiltradas.length === 0 ? (
              <div className="text-center py-12 text-cream/40 text-sm">No tenés reservas registradas</div>
            ) : (
              reservasFiltradas.map(r => {
                const estado = ESTADOS[r.estado] || ESTADOS.CANCELADA;
                const Icon = estado.icon;
                return (
                  <div key={r.id} className="bg-cream/5 border border-cream/10 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md bg-cream/5 ${estado.color}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-cream text-sm">{r.horario?.tipoClase?.titulo}</div>
                        <div className="flex items-center gap-2 text-cream/50 text-xs mt-1">
                          <Calendar size={12} /> {formatearFecha(r.fecha)}
                          <Clock size={12} /> {r.horario?.horaInicio}:00 hs
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-md bg-cream/5 ${estado.color}`}>
                      {estado.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {asistencias.length === 0 ? (
              <div className="text-center py-12 text-cream/40 text-sm">No tenés asistencias registradas</div>
            ) : (
              asistencias.map(a => (
                <div key={a.id} className="bg-cream/5 border border-cream/10 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-cream/5 text-green-400">
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-cream text-sm">{a.horario?.tipoClase?.titulo}</div>
                      <div className="flex items-center gap-2 text-cream/50 text-xs mt-1">
                        <Calendar size={12} /> {formatearFecha(a.fecha)}
                        <Clock size={12} /> {a.horario?.horaInicio}:00 hs
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-cream/40">
                    {a.metodo === 'RESERVA' ? 'Por reserva' : 'Check-in'}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
