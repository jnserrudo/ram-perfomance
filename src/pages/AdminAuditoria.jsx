import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Search, ChevronDown, ChevronUp, Shield, Filter } from 'lucide-react';

const ACCIONES = {
  CREATE: 'Crear', UPDATE: 'Modificar', DELETE: 'Eliminar',
  LOGIN: 'Ingreso', LOGOUT: 'Salida', CHECKIN: 'Check-in',
  RESERVA: 'Reserva', CANCELACION: 'Cancelación', COMPRA: 'Compra',
  APROBACION: 'Aprobación', RECHAZO: 'Rechazo', CREDITOS: 'Créditos',
  REACTIVAR: 'Reactivar', DESACTIVAR: 'Desactivar', OTRO: 'Otro'
};

const ENTIDADES = {
  USUARIO: 'Usuario', CLASE: 'Clase', HORARIO: 'Horario',
  RESERVA: 'Reserva', ASISTENCIA: 'Asistencia', COMPRA: 'Compra',
  CREDITO: 'Créditos', SOLICITUD: 'Solicitud', COMUNICADO: 'Comunicado',
  PAQUETE: 'Paquete', SISTEMA: 'Sistema'
};

const IMPACTOS = {
  ALTO: 'bg-red-500/10 text-red-400',
  MEDIO: 'bg-orange-500/10 text-orange-400',
  BAJO: 'bg-blue-500/10 text-blue-400',
  NINGUNO: 'bg-cream/5 text-cream/50'
};

export default function AdminAuditoria() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ accion: '', entidad: '', impacto: '', usuarioDni: '' });
  const [expanded, setExpanded] = useState(null);
  const limit = 25;

  useEffect(() => { cargar(); }, [page, filters]);

  const cargar = async () => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters.accion) params.append('accion', filters.accion);
    if (filters.entidad) params.append('entidad', filters.entidad);
    if (filters.impacto) params.append('impacto', filters.impacto);
    if (filters.usuarioDni) params.append('usuarioDni', filters.usuarioDni);

    const res = await client.get(`/auditoria?${params}`);
    setLogs(res.data.logs);
    setTotal(res.data.total);
  };

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl text-cream mb-6">AUDITORÍA</h1>

        <div className="bg-cream/5 border border-cream/10 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3 text-cream/60 text-sm">
            <Filter size={14} /> Filtros
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text" placeholder="DNI del usuario..."
              value={filters.usuarioDni}
              onChange={e => { setFilters({ ...filters, usuarioDni: e.target.value }); setPage(1); }}
              className="bg-forest-dark border border-cream/10 rounded-md px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/30"
            />
            <select
              value={filters.accion}
              onChange={e => { setFilters({ ...filters, accion: e.target.value }); setPage(1); }}
              className="bg-forest-dark border border-cream/10 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/30"
            >
              <option value="" className="bg-forest-dark">Todas las acciones</option>
              {Object.entries(ACCIONES).map(([k, v]) => (
                <option key={k} value={k} className="bg-forest-dark">{v}</option>
              ))}
            </select>
            <select
              value={filters.entidad}
              onChange={e => { setFilters({ ...filters, entidad: e.target.value }); setPage(1); }}
              className="bg-forest-dark border border-cream/10 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/30"
            >
              <option value="" className="bg-forest-dark">Todas las entidades</option>
              {Object.entries(ENTIDADES).map(([k, v]) => (
                <option key={k} value={k} className="bg-forest-dark">{v}</option>
              ))}
            </select>
            <select
              value={filters.impacto}
              onChange={e => { setFilters({ ...filters, impacto: e.target.value }); setPage(1); }}
              className="bg-forest-dark border border-cream/10 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/30"
            >
              <option value="" className="bg-forest-dark">Todo impacto</option>
              <option value="ALTO" className="bg-forest-dark">Alto</option>
              <option value="MEDIO" className="bg-forest-dark">Medio</option>
              <option value="BAJO" className="bg-forest-dark">Bajo</option>
            </select>
          </div>
        </div>

        <div className="bg-cream/5 border border-cream/10 rounded-lg divide-y divide-cream/5">
          {logs.map(log => (
            <div key={log.id} className="hover:bg-cream/5 transition-colors">
              <button
                onClick={() => toggleExpand(log.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 ${IMPACTOS[log.impacto] || IMPACTOS.NINGUNO}`}>
                    {log.impacto}
                  </span>
                  <div className="min-w-0">
                    <div className="text-cream text-sm font-medium truncate">
                      {ACCIONES[log.accion] || log.accion} · {ENTIDADES[log.entidad] || log.entidad}
                    </div>
                    <div className="text-cream/50 text-xs mt-0.5">
                      {log.usuarioDni || 'Sistema'} · {new Date(log.fechaHora).toLocaleString('es-AR')} · {log.observacion}
                    </div>
                  </div>
                </div>
                {expanded === log.id ? (
                  <ChevronUp size={16} className="text-cream/40 shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-cream/40 shrink-0" />
                )}
              </button>

              {expanded === log.id && (
                <div className="px-4 pb-4 pl-16">
                  <div className="grid md:grid-cols-2 gap-4">
                    {log.estadoAnterior && (
                      <div className="bg-forest-dark rounded-md p-3">
                        <div className="text-cream/50 text-xs font-medium mb-1.5">Estado anterior</div>
                        <pre className="text-cream/70 text-xs overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(log.estadoAnterior, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.estadoPosterior && (
                      <div className="bg-forest-dark rounded-md p-3">
                        <div className="text-cream/50 text-xs font-medium mb-1.5">Estado posterior</div>
                        <pre className="text-cream/70 text-xs overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(log.estadoPosterior, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  {log.ipAddress && (
                    <div className="text-cream/30 text-xs mt-3">IP: {log.ipAddress}</div>
                  )}
                </div>
              )}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="px-4 py-8 text-center text-cream/40 text-sm">No hay registros</div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 text-cream/50 text-sm">
          <span>Mostrando {logs.length} de {total} registros</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-md bg-cream/5 border border-cream/10 text-cream/70 hover:text-cream disabled:opacity-30 transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5">Página {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * limit >= total}
              className="px-3 py-1.5 rounded-md bg-cream/5 border border-cream/10 text-cream/70 hover:text-cream disabled:opacity-30 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
