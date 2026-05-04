import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Calendar, Clock, CreditCard, CheckCircle, XCircle, Dumbbell,
  ChevronLeft, ChevronRight, AlertTriangle, Users, Package, TrendingUp, BarChart3
} from 'lucide-react';
import AsistenciasChart from '../components/charts/AsistenciasChart.jsx';
import ClasesPorTipoChart from '../components/charts/ClasesPorTipoChart.jsx';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_COMPLETO = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const BLOQUES = { MANANA: 'Mañana', TARDE: 'Tarde', NOCHE: 'Noche' };

export default function UserDashboard() {
  const { user } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [comunicados, setComunicados] = useState([]);
  const [packs, setPacks] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(() => new Date().getDay());

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, [semanaOffset]);

  const cargarDatos = async () => {
    try {
      const [h, r, c, p, e] = await Promise.all([
        client.get('/horarios/semana'),
        client.get('/reservas/mias'),
        client.get('/comunicados'),
        client.get('/compras/mias'),
        client.get(`/estadisticas/usuario/${user.id}`)
      ]);
      setHorarios(h.data);
      setReservas(r.data);
      setComunicados(c.data);
      setEstadisticas(e.data);
      setPacks(p.data.filter(pk => pk.estado === 'ACTIVO'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getFechaSemana = (diaIndex) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diff = diaIndex - hoy.getDay() + (semanaOffset * 7);
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() + diff);
    return fecha;
  };

  const reservar = async (horarioId, fecha) => {
    try {
      const res = await client.post('/reservas', { horarioId, fecha: fecha.toISOString() });
      setMensaje({ tipo: 'success', texto: res.data.message });
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.error || 'No se pudo reservar' });
    }
    setTimeout(() => setMensaje(null), 4000);
  };

  const cancelar = async (reservaId) => {
    try {
      const res = await client.delete(`/reservas/${reservaId}`);
      setMensaje({ tipo: 'success', texto: res.data.message });
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.error || 'No se pudo cancelar' });
    }
    setTimeout(() => setMensaje(null), 4000);
  };

  const horariosDia = horarios.filter(h => h.diaSemana === diaSeleccionado).sort((a, b) => a.horaInicio - b.horaInicio);
  const fechaSeleccionada = getFechaSemana(diaSeleccionado);
  const esHoy = fechaSeleccionada.toDateString() === new Date().toDateString();

  const tieneReserva = (horarioId, fecha) => {
    const f = new Date(fecha);
    f.setHours(0, 0, 0, 0);
    return reservas.find(r =>
      r.horarioId === horarioId &&
      new Date(r.fecha).toDateString() === f.toDateString() &&
      r.estado === 'RESERVADA'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest">
        <div className="text-cream/60 text-sm">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest pb-6">
      {/* Créditos Header */}
      <div className="bg-forest-dark border-b border-cream/10">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cream/60 text-xs mb-0.5">Hola, {user?.nombre}</p>
              <h1 className="font-display text-xl sm:text-3xl md:text-4xl text-cream">TUS CRÉDITOS</h1>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl sm:text-5xl md:text-6xl text-cream">{user?.creditos || 0}</div>
              <p className="text-cream/60 text-xs">clases</p>
            </div>
          </div>

          {user?.creditos < 3 && (
            <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-2.5 text-red-400 text-sm">
              <AlertTriangle size={16} />
              Te quedan pocas clases. Acercate a recepción para recargar.
            </div>
          )}

          {packs.length > 0 && (
            <div className="mt-4 space-y-2">
              {packs.map(pk => {
                const restantes = pk.creditosOtorgados - pk.creditosConsumidos;
                const vence = new Date(pk.fechaVencimiento);
                const diasRestantes = Math.ceil((vence - new Date()) / (1000 * 60 * 60 * 24));
                const alerta = diasRestantes <= 7;
                return (
                  <div key={pk.id} className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 rounded-md px-3 py-2 text-xs ${alerta ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-cream/5 border border-cream/10 text-cream/60'}`}>
                    <div className="flex items-center gap-2">
                      <Package size={14} />
                      <span className="font-medium">{pk.paquete?.titulo || 'Pack'}</span>
                    </div>
                    <span className="sm:ml-auto">
                      {restantes}/{pk.creditosOtorgados} créditos · Vence: {vence.toLocaleDateString('es-AR')}
                      {alerta && ` (${diasRestantes} días)`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Comunicados */}
      {comunicados.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          {comunicados.map(c => (
            <div key={c.id} className="bg-cream/5 border border-cream/20 rounded-md px-4 py-3 mb-2">
              <p className="text-cream font-medium text-sm">{c.titulo}</p>
              <p className="text-cream/70 text-xs mt-1">{c.mensaje}</p>
            </div>
          ))}
        </div>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Card de Asistencias */}
            <div className="bg-forest-dark border border-cream/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-green-400" />
                <h3 className="text-cream font-medium">Asistencias (30 días)</h3>
              </div>
              <AsistenciasChart data={estadisticas.asistenciasPorDia} />
              <div className="mt-4 flex items-center justify-between text-xs text-cream/60">
                <span>Mes actual: {estadisticas.asistenciasMesActual}</span>
                <span>Mes anterior: {estadisticas.asistenciasMesAnterior}</span>
              </div>
            </div>

            {/* Card de Clases por Tipo */}
            <div className="bg-forest-dark border border-cream/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} className="text-blue-400" />
                <h3 className="text-cream font-medium">Clases por Tipo</h3>
              </div>
              <ClasesPorTipoChart data={estadisticas.clasesPorTipo} />
              <div className="mt-4 text-xs text-cream/60 text-center">
                Total de asistencias: {estadisticas.totalAsistencias}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Mensajes */}
        {mensaje && (
          <div className={`mb-4 rounded-md px-4 py-3 text-sm ${
            mensaje.tipo === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* Selector de semana y día */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSemanaOffset(s => s - 1)}
            className="p-2 rounded-md hover:bg-cream/10 text-cream/60 hover:text-cream transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-cream/80 text-sm font-medium">
            {semanaOffset === 0 ? 'Esta semana' : semanaOffset === 1 ? 'Próxima semana' : `Semana +${semanaOffset}`}
          </span>
          <button
            onClick={() => setSemanaOffset(s => Math.min(s + 1, 2))}
            className="p-2 rounded-md hover:bg-cream/10 text-cream/60 hover:text-cream transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Días */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {[1, 2, 3, 4, 5, 6, 0].map(d => {
            const fecha = getFechaSemana(d);
            const activo = diaSeleccionado === d;
            return (
              <button
                key={d}
                onClick={() => setDiaSeleccionado(d)}
                className={`py-3 rounded-md text-center transition-colors ${
                  activo
                    ? 'bg-cream text-forest-dark'
                    : 'bg-cream/5 hover:bg-cream/10 text-cream/70'
                }`}
              >
                <div className="text-xs font-medium">{DIAS[d]}</div>
                <div className="text-lg font-display mt-0.5">{fecha.getDate()}</div>
              </button>
            );
          })}
        </div>

        {/* Horarios del día */}
        <h2 className="font-display text-2xl text-cream mb-4">
          {DIAS_COMPLETO[diaSeleccionado]} {fechaSeleccionada.getDate()}
        </h2>

        {horariosDia.length === 0 ? (
          <div className="text-center py-12 text-cream/40 text-sm">
            No hay turnos este día
          </div>
        ) : (
          <div className="space-y-3">
            {horariosDia.map(h => {
              const miReserva = tieneReserva(h.id, fechaSeleccionada);
              const cupoOcupado = h.cupoOcupado || 0;
              const cupoTotal = h.cupoMaximo;
              const cupoDisponible = cupoTotal - cupoOcupado;
              const estaLleno = cupoDisponible <= 0 && !miReserva;

              return (
                <div
                  key={h.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    miReserva
                      ? 'bg-green-500/5 border-green-500/20'
                      : estaLleno
                        ? 'bg-cream/3 border-cream/5 opacity-50'
                        : 'bg-cream/5 border-cream/10 hover:border-cream/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="font-display text-2xl text-cream">{h.horaInicio}:00</div>
                      <div className="text-cream/50 text-xs">{BLOQUES[h.bloque]}</div>
                    </div>
                    <div>
                      <div className="font-medium text-cream">{h.tipoClase.titulo}</div>
                      <div className="text-cream/60 text-sm">{h.tipoClase.descripcion}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Users size={14} className="text-cream/40" />
                        <span className={`text-xs ${cupoDisponible <= 2 ? 'text-orange-400' : 'text-cream/50'}`}>
                          {cupoDisponible} lugares libres de {cupoTotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {miReserva ? (
                      <button
                        onClick={() => cancelar(miReserva.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                      >
                        <XCircle size={16} /> Cancelar
                      </button>
                    ) : estaLleno ? (
                      <span className="text-cream/30 text-sm font-medium">Completo</span>
                    ) : (
                      <button
                        onClick={() => reservar(h.id, fechaSeleccionada)}
                        disabled={!user?.creditos}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-cream text-forest-dark text-sm font-medium hover:bg-cream-dark transition-colors disabled:opacity-40"
                      >
                        <CheckCircle size={16} /> Reservar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
