import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, Clock, CreditCard, AlertCircle,
  ChevronRight, CheckCircle, XCircle, Dumbbell
} from 'lucide-react';

export default function AdminDashboard() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [stats, setStats] = useState({ usuarios: 0, reservasHoy: 0, asistenciasHoy: 0, creditosVendidos: 0 });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      const [s, u, r, a, c] = await Promise.all([
        client.get('/solicitudes'),
        client.get('/usuarios'),
        client.get('/reservas/mias').catch(() => ({ data: [] })),
        client.get('/asistencias').catch(() => ({ data: [] })),
        client.get('/compras').catch(() => ({ data: [] }))
      ]);
      setSolicitudes(s.data.filter(x => x.estado === 'PENDIENTE'));

      const hoy = new Date().toDateString();
      setStats({
        usuarios: u.data.length,
        reservasHoy: r.data?.filter(x => new Date(x.fecha).toDateString() === hoy).length || 0,
        asistenciasHoy: a.data?.filter(x => new Date(x.fecha).toDateString() === hoy).length || 0,
        creditosVendidos: c.data?.reduce((sum, x) => sum + x.creditosOtorgados, 0) || 0
      });
    } catch (e) {
      console.error(e);
    }
  };

  const aprobar = async (id, estado) => {
    try {
      await client.put(`/solicitudes/${id}/aprobar`, { estado });
      setMensaje({ tipo: 'success', texto: estado === 'APROBADA' ? 'Solicitud aprobada' : 'Solicitud rechazada' });
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al procesar' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl text-cream mb-6">PANEL DE ADMINISTRACIÓN</h1>

        {mensaje && (
          <div className={`mb-4 rounded-md px-4 py-3 text-sm ${
            mensaje.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users size={20} />} label="Usuarios activos" value={stats.usuarios} to="/admin/usuarios" />
          <StatCard icon={<Clock size={20} />} label="Reservas hoy" value={stats.reservasHoy} />
          <StatCard icon={<UserCheck size={20} />} label="Asistencias hoy" value={stats.asistenciasHoy} />
          <StatCard icon={<CreditCard size={20} />} label="Créditos vendidos" value={stats.creditosVendidos} to="/admin/compras" />
        </div>

        {/* Accesos rápidos */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <QuickLink to="/admin/clases" icon={<Dumbbell size={18} />} label="Clases" />
          <QuickLink to="/admin/horarios" icon={<Clock size={18} />} label="Horarios" />
          <QuickLink to="/admin/compras" icon={<CreditCard size={18} />} label="Ventas" />
          <QuickLink to="/admin/reportes" icon={<Users size={18} />} label="Reportes" />
          <QuickLink to="/admin/auditoria" icon={<AlertCircle size={18} />} label="Auditoría" />
          <QuickLink to="/checkin" icon={<UserCheck size={18} />} label="Check-in" />
        </div>

        {/* Solicitudes pendientes */}
        <div className="bg-cream/5 border border-cream/10 rounded-lg">
          <div className="px-4 py-3 border-b border-cream/10 flex items-center gap-2">
            <AlertCircle size={18} className="text-orange-400" />
            <h2 className="font-semibold text-cream">Solicitudes pendientes</h2>
            {solicitudes.length > 0 && (
              <span className="bg-orange-500/20 text-orange-400 text-xs font-medium px-2 py-0.5 rounded-full">
                {solicitudes.length}
              </span>
            )}
          </div>

          {solicitudes.length === 0 ? (
            <div className="px-4 py-8 text-center text-cream/40 text-sm">No hay solicitudes pendientes</div>
          ) : (
            <div className="divide-y divide-cream/5">
              {solicitudes.map(s => (
                <div key={s.id} className="px-4 py-3 flex items-center justify-between hover:bg-cream/5 transition-colors">
                  <div>
                    <div className="text-cream font-medium text-sm">{s.nombre} {s.apellido}</div>
                    <div className="text-cream/50 text-xs mt-0.5">DNI: {s.dni} · {s.celular}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => aprobar(s.id, 'APROBADA')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20 transition-colors"
                    >
                      <CheckCircle size={14} /> Aprobar
                    </button>
                    <button
                      onClick={() => aprobar(s.id, 'RECHAZADA')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                    >
                      <XCircle size={14} /> Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, to }) {
  const content = (
    <div className="bg-cream/5 border border-cream/10 rounded-lg p-4 hover:border-cream/20 transition-colors">
      <div className="flex items-center gap-2 text-cream/60 mb-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="font-display text-3xl text-cream">{value}</div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function QuickLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between bg-cream/5 border border-cream/10 rounded-lg px-4 py-3 hover:bg-cream/10 hover:border-cream/20 transition-colors"
    >
      <div className="flex items-center gap-2 text-cream/80 text-sm">
        {icon}
        {label}
      </div>
      <ChevronRight size={16} className="text-cream/30" />
    </Link>
  );
}
