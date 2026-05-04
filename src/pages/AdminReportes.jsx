import { useState, useEffect } from 'react';
import client from '../api/client.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { BarChart3, Users, TrendingUp, DollarSign } from 'lucide-react';

const COLORS = ['#EAE5C9', '#D4CFA8', '#3D503D', '#2F3E2F', '#4A5D4A'];

export default function AdminReportes() {
  const [reportes, setReportes] = useState({ asistencias: null, usuarios: [], financiero: null });
  const [tab, setTab] = useState('asistencias');

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const [a, u, f] = await Promise.all([
      client.get('/reportes/asistencias').catch(() => ({ data: { porClase: {}, porHorario: {} } })),
      client.get('/reportes/usuarios').catch(() => ({ data: [] })),
      client.get('/reportes/financiero').catch(() => ({ data: { porMes: {}, total: 0 } }))
    ]);
    setReportes({ asistencias: a.data, usuarios: u.data, financiero: f.data });
  };

  const asistenciasClase = Object.entries(reportes.asistencias?.porClase || {}).map(([name, value]) => ({ name, value }));
  const financieroMes = Object.entries(reportes.financiero?.porMes || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-3xl text-cream mb-6">REPORTES</h1>

        <div className="flex gap-1 mb-6 bg-cream/5 rounded-lg p-1">
          {['asistencias', 'usuarios', 'financiero'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                tab === t ? 'bg-cream/10 text-cream' : 'text-cream/50 hover:text-cream/70'
              }`}
            >
              {t === 'asistencias' ? 'Asistencias' : t === 'usuarios' ? 'Usuarios' : 'Financiero'}
            </button>
          ))}
        </div>

        {tab === 'asistencias' && (
          <div className="space-y-6">
            <div className="bg-cream/5 border border-cream/10 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-cream" />
                <h2 className="font-semibold text-cream">Asistencias por clase</h2>
              </div>
              {asistenciasClase.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={asistenciasClase}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EAE5C920" />
                    <XAxis dataKey="name" tick={{ fill: '#EAE5C9', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#EAE5C9', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E2A1E', border: '1px solid #EAE5C930', borderRadius: '8px', color: '#EAE5C9' }} />
                    <Bar dataKey="value" fill="#EAE5C9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-cream/40 text-sm">Sin datos de asistencias</div>
              )}
            </div>
          </div>
        )}

        {tab === 'usuarios' && (
          <div className="bg-cream/5 border border-cream/10 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} className="text-cream" />
              <h2 className="font-semibold text-cream">Usuarios más activos</h2>
            </div>
            {reportes.usuarios.length > 0 ? (
              <div className="space-y-3">
                {reportes.usuarios.map((u, i) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-forest-dark rounded-md">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-cream/10 text-cream text-xs flex items-center justify-center font-medium">{i + 1}</span>
                      <div>
                        <div className="text-cream text-sm font-medium">{u.nombre}</div>
                        <div className="text-cream/50 text-xs">DNI {u.dni}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cream font-medium text-sm">{u.asistencias} asistencias</div>
                      <div className="text-cream/50 text-xs">{u.creditos} créditos restantes</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-cream/40 text-sm">Sin datos</div>
            )}
          </div>
        )}

        {tab === 'financiero' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cream/5 border border-cream/10 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={18} className="text-cream" />
                  <span className="text-cream/60 text-xs font-medium">Total recaudado</span>
                </div>
                <div className="font-display text-3xl text-cream">${reportes.financiero?.total?.toLocaleString('es-AR') || 0}</div>
              </div>
              <div className="bg-cream/5 border border-cream/10 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-cream" />
                  <span className="text-cream/60 text-xs font-medium">Compras registradas</span>
                </div>
                <div className="font-display text-3xl text-cream">{reportes.financiero?.compras || 0}</div>
              </div>
            </div>

            <div className="bg-cream/5 border border-cream/10 rounded-lg p-6">
              <h2 className="font-semibold text-cream mb-4">Ingresos por mes</h2>
              {financieroMes.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={financieroMes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EAE5C920" />
                    <XAxis dataKey="name" tick={{ fill: '#EAE5C9', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#EAE5C9', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E2A1E', border: '1px solid #EAE5C930', borderRadius: '8px', color: '#EAE5C9' }} />
                    <Line type="monotone" dataKey="value" stroke="#EAE5C9" strokeWidth={2} dot={{ fill: '#EAE5C9' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-cream/40 text-sm">Sin datos financieros</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
