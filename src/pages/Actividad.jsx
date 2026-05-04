import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import client from '../api/client.js';
import { Activity, Plus, X } from 'lucide-react';

export default function Actividad() {
  const { user } = useAuth();
  const [actividades, setActividades] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    pasos: '',
    caloriasQuemadas: '',
    frecuenciaCardiacaPromedio: '',
    duracionMinutos: ''
  });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      const res = await client.get(`/actividad/usuario/${user.id}`);
      setActividades(res.data);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/actividad', {
        usuarioId: user.id,
        ...form,
        pasos: form.pasos ? parseInt(form.pasos) : null,
        caloriasQuemadas: form.caloriasQuemadas ? parseInt(form.caloriasQuemadas) : null,
        frecuenciaCardiacaPromedio: form.frecuenciaCardiacaPromedio ? parseInt(form.frecuenciaCardiacaPromedio) : null,
        duracionMinutos: form.duracionMinutos ? parseInt(form.duracionMinutos) : null
      });
      setMensaje({ tipo: 'success', texto: 'Actividad registrada exitosamente' });
      setForm({
        fecha: new Date().toISOString().split('T')[0],
        pasos: '',
        caloriasQuemadas: '',
        frecuenciaCardiacaPromedio: '',
        duracionMinutos: ''
      });
      setMostrarForm(false);
      cargarActividades();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al registrar actividad' });
    } finally {
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-forest py-4 md:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 md:mb-6">
          <h1 className="font-display text-lg sm:text-2xl text-cream">REGISTRO DE ACTIVIDAD</h1>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="flex items-center justify-center gap-2 bg-cream text-forest-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-cream-dark transition-colors"
          >
            {mostrarForm ? <X size={16} /> : <Plus size={16} />}
            {mostrarForm ? 'Cancelar' : 'Nueva actividad'}
          </button>
        </div>

        {mensaje && (
          <div className={`mb-4 rounded-md px-4 py-3 text-sm ${
            mensaje.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {mostrarForm && (
          <div className="bg-cream/5 border border-cream/10 rounded-lg p-3 md:p-6 mb-3 md:mb-6">
            <h2 className="text-cream font-medium mb-4">Registrar nueva actividad</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-cream/60 mb-1">Fecha</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={e => setForm({ ...form, fecha: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Pasos</label>
                  <input
                    type="number"
                    value={form.pasos}
                    onChange={e => setForm({ ...form, pasos: e.target.value })}
                    placeholder="Ej: 10000"
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Calorías quemadas</label>
                  <input
                    type="number"
                    value={form.caloriasQuemadas}
                    onChange={e => setForm({ ...form, caloriasQuemadas: e.target.value })}
                    placeholder="Ej: 500"
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Frecuencia cardíaca promedio</label>
                  <input
                    type="number"
                    value={form.frecuenciaCardiacaPromedio}
                    onChange={e => setForm({ ...form, frecuenciaCardiacaPromedio: e.target.value })}
                    placeholder="Ej: 120"
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    value={form.duracionMinutos}
                    onChange={e => setForm({ ...form, duracionMinutos: e.target.value })}
                    placeholder="Ej: 60"
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-cream text-forest-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-cream-dark transition-colors"
              >
                Guardar actividad
              </button>
            </form>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-cream font-medium">Historial (últimos 30 días)</h2>
          {actividades.length === 0 ? (
            <div className="bg-cream/5 border border-cream/10 rounded-lg p-8 text-center">
              <Activity size={48} className="text-cream/20 mx-auto mb-3" />
              <p className="text-cream/60">No hay actividades registradas</p>
            </div>
          ) : (
            actividades.map(act => (
              <div key={act.id} className="bg-cream/5 border border-cream/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cream font-medium">
                    {new Date(act.fecha).toLocaleDateString('es-AR')}
                  </span>
                  <span className="text-cream/60 text-xs">{act.fuente}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {act.pasos && (
                    <div>
                      <span className="text-cream/60">Pasos:</span>
                      <span className="text-cream ml-2">{act.pasos.toLocaleString()}</span>
                    </div>
                  )}
                  {act.caloriasQuemadas && (
                    <div>
                      <span className="text-cream/60">Calorías:</span>
                      <span className="text-cream ml-2">{act.caloriasQuemadas}</span>
                    </div>
                  )}
                  {act.frecuenciaCardiacaPromedio && (
                    <div>
                      <span className="text-cream/60">FC:</span>
                      <span className="text-cream ml-2">{act.frecuenciaCardiacaPromedio} bpm</span>
                    </div>
                  )}
                  {act.duracionMinutos && (
                    <div>
                      <span className="text-cream/60">Duración:</span>
                      <span className="text-cream ml-2">{act.duracionMinutos} min</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
