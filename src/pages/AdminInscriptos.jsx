import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Calendar, ChevronLeft, ChevronRight, Users, Clock, Search, Filter, Info, Phone, BarChart3, X } from 'lucide-react';
import GuiaContextual from '../components/common/GuiaContextual.jsx';

const BLOQUES = {
  MANANA: 'MAÑANA',
  TARDE: 'TARDE',
  NOCHE: 'NOCHE'
};

export default function AdminInscriptos() {
  const [semana, setSemana] = useState([]);
  const [fechaBase, setFechaBase] = useState(new Date());
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroBloque, setFiltroBloque] = useState('TODOS');
  const [turnoDetalle, setTurnoDetalle] = useState(null);
  const [modalHistorico, setModalHistorico] = useState(false);
  const [rangoHistorico, setRangoHistorico] = useState({ desde: '', hasta: '' });
  const [datosHistoricos, setDatosHistoricos] = useState([]);
  const [buscandoHistorico, setBuscandoHistorico] = useState(false);

  useEffect(() => {
    cargarInscriptos();
  }, [fechaBase]);

  const cargarHistorico = async () => {
    if (!rangoHistorico.desde || !rangoHistorico.hasta) return;
    setBuscandoHistorico(true);
    try {
      const res = await client.get(`/dashboard/historico-inscriptos?desde=${rangoHistorico.desde}&hasta=${rangoHistorico.hasta}`);
      setDatosHistoricos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setBuscandoHistorico(false);
    }
  };

  const cargarInscriptos = async () => {
    setCargando(true);
    try {
      const res = await client.get(`/dashboard/inscriptos-semana?fecha=${fechaBase.toISOString().split('T')[0]}`);
      setSemana(res.data);
    } catch (err) {
      console.error('Error al cargar inscriptos:', err);
    } finally {
      setCargando(false);
    }
  };

  const cambiarSemana = (dias) => {
    const nueva = new Date(fechaBase);
    nueva.setDate(nueva.getDate() + dias);
    setFechaBase(nueva);
    setTurnoDetalle(null);
  };

  const pasosGuia = [
    { titulo: 'Seleccionar semana', descripcion: 'Usá las flechas para navegar entre semanas y ver la planificación.' },
    { titulo: 'Ver cupos por día', descripcion: 'Cada día muestra los horarios disponibles y cuánta gente se anotó.' },
    { titulo: 'Detalle de alumnos', descripcion: 'Hacé click en un turno para ver la lista completa de alumnos inscriptos y sus datos.' },
    { titulo: 'Filtros rápidos', descripcion: 'Podés filtrar por mañana/tarde/noche o buscar alumnos específicos.' }
  ];

  const formatearRangoSemana = () => {
    if (semana.length === 0) return '';
    const inicio = new Date(semana[0].fecha);
    const fin = new Date(semana[6].fecha);
    return `${inicio.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} - ${fin.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`;
  };

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl text-cream">INSCRIPTOS POR CUPO</h1>
            <p className="text-cream/50 text-sm">Gestioná los alumnos anotados en cada turno de la semana</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center bg-forest-dark border border-cream/20 rounded-lg px-3 py-1.5">
              <Calendar size={14} className="text-cream/40 mr-2" />
              <input 
                type="date" 
                value={fechaBase.toISOString().split('T')[0]}
                onChange={(e) => setFechaBase(new Date(e.target.value))}
                className="bg-transparent text-cream text-xs focus:outline-none [color-scheme:dark]"
              />
            </div>
            
            <div className="flex items-center bg-cream/5 border border-cream/10 rounded-lg p-1">
              <button onClick={() => cambiarSemana(-7)} className="p-2 hover:bg-cream/10 text-cream rounded-md transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 flex flex-col items-center min-w-[160px]">
                <span className="text-cream font-medium text-sm">{formatearRangoSemana()}</span>
                <button 
                  onClick={() => setFechaBase(new Date())}
                  className="text-[10px] text-cream/40 uppercase tracking-widest hover:text-cream transition-colors"
                >
                  Volver a hoy
                </button>
              </div>
              <button onClick={() => cambiarSemana(7)} className="p-2 hover:bg-cream/10 text-cream rounded-md transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <GuiaContextual seccion="inscriptos" pasos={pasosGuia} />

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar de filtros */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-cream/5 border border-cream/10 rounded-xl p-4">
              <h3 className="text-cream font-medium text-sm mb-3 flex items-center gap-2">
                <Filter size={14} /> Filtros
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-cream/40 uppercase tracking-wider mb-1 block">Bloque horario</label>
                  <select 
                    value={filtroBloque}
                    onChange={(e) => setFiltroBloque(e.target.value)}
                    className="w-full bg-forest-dark border border-cream/20 rounded-md px-3 py-2 text-xs text-cream focus:outline-none focus:border-cream/50"
                  >
                    <option value="TODOS">Todos los bloques</option>
                    <option value="MANANA">Mañana</option>
                    <option value="TARDE">Tarde</option>
                    <option value="NOCHE">Noche</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-cream/40 uppercase tracking-wider mb-1 block">Buscar alumno</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cream/30" />
                    <input 
                      type="text"
                      placeholder="DNI o Nombre..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full bg-forest-dark border border-cream/20 rounded-md pl-8 pr-3 py-2 text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setModalHistorico(true)}
              className="w-full bg-cream/10 border border-cream/20 rounded-xl p-4 text-cream text-xs font-medium hover:bg-cream hover:text-forest-dark transition-all flex items-center justify-center gap-2 group"
            >
              <BarChart3 size={16} className="group-hover:scale-110 transition-transform" />
              Ver Histórico por Rango
            </button>

            {turnoDetalle && (
              <div className="bg-cream/10 border border-cream/30 rounded-xl p-4 animate-in fade-in zoom-in duration-300 ring-2 ring-cream/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-cream font-bold text-sm tracking-tight uppercase">Detalle del Turno</h3>
                  <button onClick={() => setTurnoDetalle(null)} className="text-cream/40 hover:text-cream">
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-2 mb-4 bg-forest-dark/40 p-3 rounded-lg border border-cream/5">
                  <div className="flex items-center gap-2 text-cream text-xs">
                    <Clock size={12} className="text-cream/40" />
                    <span className="font-bold text-base">{turnoDetalle.hora}:00 hs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-cream text-forest-dark px-2 py-0.5 rounded text-[10px] font-bold uppercase">{turnoDetalle.clase}</span>
                    <span className="text-cream/40 text-[10px] uppercase font-medium">{BLOQUES[turnoDetalle.bloque] || turnoDetalle.bloque}</span>
                  </div>
                  <div className="flex items-center gap-2 text-cream text-[11px] pt-1">
                    <Users size={12} className="text-cream/40" />
                    <span className="font-medium">{turnoDetalle.inscriptos.length} alumnos inscriptos</span>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {turnoDetalle.inscriptos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 bg-forest-dark/20 rounded-lg border border-dashed border-cream/10">
                      <Users size={24} className="text-cream/10 mb-2" />
                      <p className="text-cream/30 text-[10px] text-center italic leading-tight">
                        No hay alumnos anotados para este turno todavía.
                      </p>
                    </div>
                  ) : (
                    turnoDetalle.inscriptos.map(u => (
                      <div key={u.id} className="bg-forest-dark border border-cream/10 rounded-lg p-3 hover:border-cream/40 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex flex-col">
                            <span className="text-cream font-bold text-xs">{u.nombre} {u.apellido}</span>
                            {u.realizadaEl && (
                              <span className="text-cream/30 text-[9px] flex items-center gap-1 mt-0.5 font-medium">
                                <Clock size={8} /> 
                                Realizada el {new Date(u.realizadaEl).toLocaleString('es-AR', { 
                                  day: '2-digit', 
                                  month: '2-digit', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            )}
                          </div>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black tracking-tighter ${
                            u.estado === 'ASISTIO' ? 'bg-green-500 text-forest-dark' : 'bg-cream/20 text-cream'
                          }`}>
                            {u.estado}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-cream/5">
                          <span className="text-cream/40 text-[10px] font-medium tracking-tight">DNI {u.dni}</span>
                          <a 
                            href={`https://wa.me/${u.celular}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-2 py-1 rounded hover:bg-green-500 hover:text-white transition-all text-[10px] font-bold"
                          >
                            <Phone size={10} /> WhatsApp
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Grilla principal */}
          <div className="lg:col-span-3">
            {cargando ? (
              <div className="flex flex-col items-center justify-center py-20 text-cream/40 gap-3">
                <div className="w-10 h-10 border-4 border-cream/10 border-t-cream rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Cargando planificación...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {semana.map((dia, idx) => (
                  <div key={idx} className="bg-cream/5 border border-cream/10 rounded-xl overflow-hidden flex flex-col h-full">
                    <div className="bg-cream/10 px-4 py-3 border-b border-cream/10">
                      <div className="text-[10px] text-cream/40 uppercase tracking-widest font-bold">{dia.diaNombre}</div>
                      <div className="text-cream font-display text-lg leading-tight">
                        {new Date(dia.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                      </div>
                    </div>
                    
                    <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                      {dia.turnos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-cream/20 gap-2">
                          <Calendar size={32} strokeWidth={1} />
                          <span className="text-[10px] uppercase font-medium">Sin turnos</span>
                        </div>
                      ) : (
                        dia.turnos
                          .filter(t => filtroBloque === 'TODOS' || t.bloque === filtroBloque)
                          .map(t => {
                            const pct = (t.inscriptos.length / t.cupoMaximo) * 100;
                            const isLleno = pct >= 100;
                            const isCasiLleno = pct >= 80;
                            
                            return (
                              <button 
                                key={t.id}
                                onClick={() => setTurnoDetalle(t)}
                                className={`w-full text-left bg-forest-dark/30 border rounded-xl p-3 hover:scale-[1.02] transition-all group relative overflow-hidden ${
                                  turnoDetalle?.id === t.id ? 'border-cream ring-1 ring-cream' : 'border-cream/10'
                                }`}
                              >
                                {isLleno && <div className="absolute top-0 right-0 w-8 h-8 bg-red-500/20 flex items-center justify-center rounded-bl-xl"><Info size={12} className="text-red-400" /></div>}
                                
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="px-2 py-1 bg-cream/10 rounded-lg flex flex-col items-center justify-center min-w-[36px]">
                                      <span className="text-cream font-bold text-sm leading-none">{t.hora}</span>
                                      <span className="text-[7px] font-black text-cream/40 -mt-0.5">HS</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-cream font-semibold text-xs leading-none">{t.clase}</span>
                                      <span className="text-cream/40 text-[9px] uppercase tracking-tighter mt-0.5">{BLOQUES[t.bloque] || t.bloque}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="text-cream/50">Ocupación</span>
                                    <span className={`font-bold ${isLleno ? 'text-red-400' : isCasiLleno ? 'text-orange-400' : 'text-green-400'}`}>
                                      {t.inscriptos.length}/{t.cupoMaximo}
                                    </span>
                                  </div>
                                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-500 rounded-full ${
                                        isLleno ? 'bg-red-500' : isCasiLleno ? 'bg-orange-500' : 'bg-green-500'
                                      }`}
                                      style={{ width: `${Math.min(100, pct)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </button>
                            );
                          })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Histórico */}
      {modalHistorico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-forest-dark border border-cream/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-cream/10 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-cream tracking-tight">HISTÓRICO DE INSCRIPTOS</h2>
                <p className="text-cream/40 text-xs uppercase tracking-widest font-bold">Seleccioná un rango de fechas para auditar</p>
              </div>
              <button onClick={() => setModalHistorico(false)} className="text-cream/40 hover:text-cream bg-cream/5 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 bg-cream/5 flex flex-col md:flex-row gap-4 items-end border-b border-cream/10">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] text-cream/40 uppercase font-black tracking-tighter">Fecha Desde</label>
                <input 
                  type="date" 
                  value={rangoHistorico.desde}
                  onChange={e => setRangoHistorico({...rangoHistorico, desde: e.target.value})}
                  className="w-full bg-forest border border-cream/20 rounded-lg px-4 py-2.5 text-cream text-sm focus:border-cream/50 outline-none [color-scheme:dark]"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] text-cream/40 uppercase font-black tracking-tighter">Fecha Hasta</label>
                <input 
                  type="date" 
                  value={rangoHistorico.hasta}
                  onChange={e => setRangoHistorico({...rangoHistorico, hasta: e.target.value})}
                  className="w-full bg-forest border border-cream/20 rounded-lg px-4 py-2.5 text-cream text-sm focus:border-cream/50 outline-none [color-scheme:dark]"
                />
              </div>
              <button 
                onClick={cargarHistorico}
                disabled={buscandoHistorico}
                className="bg-cream text-forest-dark px-8 py-2.5 rounded-lg font-bold text-sm hover:scale-105 transition-all disabled:opacity-50"
              >
                {buscandoHistorico ? 'Buscando...' : 'Consultar'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {datosHistoricos.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-cream/20 gap-4 opacity-50">
                  <Search size={64} strokeWidth={1} />
                  <p className="font-medium">No hay registros para este rango o no se ha realizado la búsqueda</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {datosHistoricos.map((res, i) => (
                    <div key={i} className="bg-forest border border-cream/10 rounded-xl p-4 flex items-start gap-4 hover:border-cream/40 transition-colors">
                      <div className="w-12 h-12 bg-cream/5 rounded-full flex flex-col items-center justify-center flex-shrink-0 border border-cream/10">
                        <span className="text-cream font-bold text-sm leading-none">{new Date(res.fecha).getDate()}</span>
                        <span className="text-cream/40 text-[9px] uppercase font-black tracking-tighter">
                          {new Date(res.fecha).toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="text-cream font-bold text-sm">{res.usuario.nombre} {res.usuario.apellido}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            res.estado === 'ASISTIO' ? 'bg-green-500/20 text-green-400' : 'bg-cream/10 text-cream/60'
                          }`}>
                            {res.estado}
                          </span>
                        </div>
                        <div className="text-cream/40 text-[10px] mt-1 font-medium italic">
                          {res.horario.tipoClase.titulo} · {res.horario.horaInicio}:00 hs
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-cream/5">
                          <span className="text-cream/30 text-[10px]">DNI {res.usuario.dni}</span>
                          <a href={`https://wa.me/${res.usuario.celular}`} target="_blank" rel="noreferrer" className="text-green-400 text-[10px] font-bold hover:underline">WhatsApp</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
