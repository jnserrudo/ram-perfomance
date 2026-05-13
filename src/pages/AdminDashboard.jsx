import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, Clock, CreditCard, AlertCircle,
  ChevronRight, CheckCircle, XCircle, Dumbbell,
  TrendingUp, Calendar, ArrowUpRight, ArrowDownRight,
  Target, BarChart3, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import GuiaContextual from '../components/common/GuiaContextual.jsx';

export default function AdminDashboard() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [modalDuplicado, setModalDuplicado] = useState({ show: false, data: null, solicitudId: null });

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      const [s, d] = await Promise.all([
        client.get('/solicitudes').catch(() => ({ data: [] })),
        client.get('/dashboard/metricas').catch(() => null)
      ]);
      
      setSolicitudes(s.data.filter(x => x.estado === 'PENDIENTE'));
      if (d) setData(d.data);
    } catch (e) {
      console.error('Error al cargar datos:', e);
      setMensaje({ tipo: 'error', texto: 'Error al conectar con el servidor.' });
    } finally {
      setCargando(false);
    }
  };

  const aprobar = async (id, estado, forzar = false) => {
    setProcesandoId(id);
    try {
      await client.put(`/solicitudes/${id}/aprobar`, { estado, forzar });
      setMensaje({ 
        tipo: 'success', 
        texto: forzar ? 'Duplicado resuelto correctamente' : (estado === 'APROBADA' ? 'Solicitud aprobada' : 'Solicitud rechazada') 
      });
      setModalDuplicado({ show: false, data: null, solicitudId: null });
      cargarDatos();
    } catch (err) {
      if (err.response?.status === 409) {
        // Manejar duplicado con el modal
        setModalDuplicado({ 
          show: true, 
          data: err.response.data.usuario, 
          solicitudId: id 
        });
      } else {
        const errorMsg = err.response?.data?.error || 'Error al procesar';
        setMensaje({ tipo: 'error', texto: errorMsg });
      }
    } finally {
      setProcesandoId(null);
    }
    setTimeout(() => setMensaje(null), 5000);
  };

  const pasosGuia = [
    { titulo: 'Métricas clave', descripcion: 'Revisá los KPIs principales como usuarios activos, ventas y asistencias de hoy.' },
    { titulo: 'Gráficos de rendimiento', descripcion: 'Analizá visualmente la distribución de asistencias por día y las clases más populares.' },
    { titulo: 'Acceso a Inscriptos', descripcion: 'Usá el acceso rápido a "Inscriptos" para ver quiénes están anotados en cada turno de la semana.' },
    { titulo: 'Solicitudes pendientes', descripcion: 'Aprobá o rechazá las nuevas inscripciones al gimnasio desde la parte inferior.' }
  ];

  if (cargando) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cream/10 border-t-cream rounded-full animate-spin"></div>
          <span className="text-cream font-medium tracking-widest text-xs uppercase">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-cream tracking-wider">PANEL DE CONTROL</h1>
            <p className="text-cream/40 text-sm font-medium mt-1 uppercase tracking-tighter">Resumen operativo y métricas en tiempo real</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-cream/5 border border-cream/10 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-cream/60 text-[10px] font-bold uppercase tracking-widest">Sistema Online</span>
          </div>
        </div>

        <GuiaContextual seccion="dashboard" pasos={pasosGuia} />

        {mensaje && (
          <div className={`mb-6 rounded-xl px-4 py-3 text-sm animate-in fade-in slide-in-from-top duration-300 ${
            mensaje.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              {mensaje.tipo === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {mensaje.texto}
            </div>
          </div>
        )}

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={<Users className="text-blue-400" />} 
            label="Usuarios Activos" 
            value={kpis.usuariosActivos} 
            to="/admin/usuarios"
            subtext={`${kpis.totalUsuarios} totales`}
          />
          <StatCard 
            icon={<Calendar className="text-orange-400" />} 
            label="Reservas Hoy" 
            value={kpis.reservasHoy} 
            to="/admin/inscriptos"
          />
          <StatCard 
            icon={<UserCheck className="text-green-400" />} 
            label="Asistencias Hoy" 
            value={kpis.asistenciasHoy}
            to="/checkin"
          />
          <StatCard 
            icon={<TrendingUp className="text-emerald-400" />} 
            label="Ventas Mes" 
            value={`$${kpis.ventasMes?.toLocaleString('es-AR')}`}
            to="/admin/compras"
            subtext={`${kpis.creditosVendidosMes} créditos`}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <QuickLink to="/admin/inscriptos" icon={<Users size={18} />} label="Inscriptos" />
          <QuickLink to="/admin/horarios" icon={<Clock size={18} />} label="Horarios" />
          <QuickLink to="/admin/clases" icon={<Dumbbell size={18} />} label="Clases" />
          <QuickLink to="/admin/paquetes" icon={<CreditCard size={18} />} label="Paquetes" />
          <QuickLink to="/admin/reportes" icon={<BarChart3 size={18} />} label="Reportes" />
          <QuickLink to="/admin/auditoria" icon={<Target size={18} />} label="Auditoría" />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-cream/5 border border-cream/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-cream font-semibold flex items-center gap-2">
                <BarChart3 size={18} className="text-cream/60" />
                Asistencias por día
              </h2>
              <span className="text-[10px] text-cream/40 uppercase font-bold tracking-widest">Últimos 28 días</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.asistenciasPorDia}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EAE5C9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EAE5C9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE5C905" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#EAE5C940', fontSize: 11 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#EAE5C940', fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E2A1E', border: '1px solid #EAE5C920', borderRadius: '12px', color: '#EAE5C9' }}
                    itemStyle={{ color: '#EAE5C9' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#EAE5C9" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-cream/5 border border-cream/10 rounded-2xl p-6">
            <h2 className="text-cream font-semibold mb-6 flex items-center gap-2">
              <Target size={18} className="text-cream/60" />
              Clases Populares
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.clasesPopulares}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.clasesPopulares?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#EAE5C9', '#D4CFA8', '#8B9B8B', '#4A5D4A', '#2F3E2F'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E2A1E', border: '1px solid #EAE5C920', borderRadius: '12px', color: '#EAE5C9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {charts.clasesPopulares?.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-cream/70">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#EAE5C9', '#D4CFA8', '#8B9B8B', '#4A5D4A', '#2F3E2F'][i % 5] }}></div>
                    {c.name}
                  </div>
                  <span className="text-cream font-bold">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requests & Lists */}
        <div className="bg-cream/5 border border-cream/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-cream/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-400" />
              <h2 className="font-semibold text-cream">Solicitudes de inscripción</h2>
              {solicitudes.length > 0 && (
                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {solicitudes.length} pendientes
                </span>
              )}
            </div>
          </div>

          {solicitudes.length === 0 ? (
            <div className="px-6 py-12 text-center text-cream/20 flex flex-col items-center gap-3">
              <CheckCircle size={40} strokeWidth={1} />
              <span className="text-sm font-medium">No hay solicitudes pendientes en este momento</span>
            </div>
          ) : (
            <div className="divide-y divide-cream/5">
              {solicitudes.map(s => (
                <div key={s.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-cream/5 transition-colors group">
                  <div className="mb-3 md:mb-0">
                    <div className="text-cream font-semibold">{s.nombre} {s.apellido}</div>
                    <div className="text-cream/40 text-xs mt-0.5 font-medium uppercase tracking-tight">
                      DNI: {s.dni} · Cel: {s.celular} · Registrado el {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => aprobar(s.id, 'APROBADA')}
                      disabled={procesandoId !== null}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-all border border-green-500/20 disabled:opacity-50"
                    >
                      {procesandoId === s.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      Aprobar
                    </button>
                    <button
                      onClick={() => aprobar(s.id, 'RECHAZADA')}
                      disabled={procesandoId !== null}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all border border-red-500/20 disabled:opacity-50"
                    >
                      {procesandoId === s.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Usuario Duplicado */}
      {modalDuplicado.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-forest border border-cream/20 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-black/50">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 border border-orange-500/20">
                <AlertCircle className="text-orange-400" size={32} />
              </div>
              
              <h3 className="text-2xl font-display text-cream mb-2 uppercase tracking-wide">DNI ya registrado</h3>
              
              <div className="bg-cream/5 border border-cream/10 rounded-2xl p-4 w-full mb-6">
                <p className="text-cream font-bold text-lg mb-1">{modalDuplicado.data?.nombre} {modalDuplicado.data?.apellido}</p>
                <p className="text-cream/40 text-[10px] font-black uppercase tracking-widest">
                  Estado actual: {modalDuplicado.data?.activo ? 'ACTIVO' : 'INACTIVO'}
                </p>
              </div>

              <div className="space-y-4 text-cream/60 text-sm leading-relaxed mb-8">
                {modalDuplicado.data?.activo ? (
                  <p>
                    Este usuario <span className="text-cream font-bold">ya está activo</span> en el sistema. Probablemente sea una solicitud duplicada. ¿Querés marcarla como resuelta?
                  </p>
                ) : (
                  <p>
                    Este es un <span className="text-cream font-bold">alumno antiguo</span> que se encuentra inactivo. ¿Querés reactivarlo y aprobar esta nueva solicitud?
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => setModalDuplicado({ show: false, data: null, solicitudId: null })}
                  className="py-3 rounded-xl border border-cream/10 text-cream/40 text-xs font-bold uppercase tracking-widest hover:bg-cream/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => aprobar(modalDuplicado.solicitudId, 'APROBADA', true)}
                  disabled={procesandoId !== null}
                  className="py-3 rounded-xl bg-cream text-forest-dark text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cream/10"
                >
                  {procesandoId ? <Loader2 size={16} className="animate-spin" /> : (modalDuplicado.data?.activo ? 'Resolver' : 'Reactivar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, to, subtext }) {
  const content = (
    <div className="bg-cream/5 border border-cream/10 rounded-2xl p-5 hover:bg-cream/10 hover:border-cream/30 transition-all group h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 bg-forest-dark rounded-xl border border-cream/5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <ArrowUpRight size={16} className="text-cream/20 group-hover:text-cream/60 transition-colors" />
      </div>
      <div className="text-cream/40 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</div>
      <div className="font-display text-4xl text-cream leading-none mb-2">{value ?? '0'}</div>
      {subtext && <div className="text-[10px] text-cream/30 font-medium">{subtext}</div>}
    </div>
  );
  return to ? <Link to={to} className="h-full">{content}</Link> : content;
}

function QuickLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center bg-cream/5 border border-cream/10 rounded-2xl p-4 hover:bg-cream hover:text-forest-dark transition-all group"
    >
      <div className="mb-2 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </Link>
  );
}
