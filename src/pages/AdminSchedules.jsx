import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Plus, Pencil, Trash2, X, Clock, Users } from 'lucide-react';
import GuiaContextual from '../components/common/GuiaContextual.jsx';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HORAS_MANANA = [7, 8, 9, 10];
const HORAS_TARDE = [13, 14, 15, 16, 17];
const HORAS_NOCHE = [18, 19, 20, 21];
const BLOQUES = { MANANA: 'Mañana', TARDE: 'Tarde', NOCHE: 'Noche' };

export default function AdminSchedules() {
  const [horarios, setHorarios] = useState([]);
  const [clases, setClases] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ tipoClaseId: '', diaSemana: 1, horaInicio: 9, bloque: 'MANANA', cupoMaximo: 12 });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [h, c] = await Promise.all([client.get('/horarios'), client.get('/clases')]);
    setHorarios(h.data);
    setClases(c.data);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await client.put(`/horarios/${editando}`, form);
      } else {
        await client.post('/horarios', form);
      }
      setModal(false);
      setEditando(null);
      cargarDatos();
      setMensaje({ tipo: 'success', texto: editando ? 'Horario actualizado' : 'Horario creado' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.error || 'Error al guardar' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este horario?')) return;
    try {
      await client.delete(`/horarios/${id}`);
      cargarDatos();
      setMensaje({ tipo: 'success', texto: 'Horario eliminado' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const abrirEditar = (h) => {
    setEditando(h.id);
    setForm({
      tipoClaseId: h.tipoClaseId,
      diaSemana: h.diaSemana,
      horaInicio: h.horaInicio,
      bloque: h.bloque,
      cupoMaximo: h.cupoMaximo
    });
    setModal(true);
  };

  const horariosPorDia = DIAS.map((_, i) =>
    horarios.filter(h => h.diaSemana === i).sort((a, b) => a.horaInicio - b.horaInicio)
  );

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-cream">HORARIOS</h1>
          <button
            onClick={() => { setModal(true); setEditando(null); setForm({ tipoClaseId: '', diaSemana: 1, horaInicio: 9, bloque: 'MANANA', cupoMaximo: 12 }); }}
            className="flex items-center gap-2 bg-cream text-forest-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-cream-dark transition-colors"
          >
            <Plus size={18} /> Nuevo horario
          </button>
        </div>

        <GuiaContextual 
          seccion="horarios" 
          pasos={[
            { titulo: 'Configurar Horarios', descripcion: 'Definí la grilla semanal de clases. Cada horario se repite todas las semanas.' },
            { titulo: 'Asignar Clases', descripcion: 'Elegí el tipo de clase para cada horario (Musculación, HIIT, etc.).' },
            { titulo: 'Bloques y Cupos', descripcion: 'Organizá por bloques (Mañana/Tarde/Noche) y definí el límite de personas por turno.' },
            { titulo: 'Edición Rápida', descripcion: 'Podés modificar o eliminar horarios existentes usando los iconos en cada tarjeta.' }
          ]} 
        />

        {mensaje && (
          <div className={`mb-4 rounded-md px-4 py-3 text-sm ${
            mensaje.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {mensaje.texto}
          </div>
        )}

        <div className="space-y-6">
          {DIAS.map((dia, i) => (
            <div key={i}>
              <h2 className="font-display text-xl text-cream/80 mb-3">{dia}</h2>
              {horariosPorDia[i].length === 0 ? (
                <div className="text-cream/30 text-sm py-2">Sin horarios</div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {horariosPorDia[i].map(h => (
                    <div key={h.id} className="bg-cream/5 border border-cream/10 rounded-lg p-4 hover:border-cream/20 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-cream" />
                          <span className="font-display text-xl text-cream">{h.horaInicio}:00</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => abrirEditar(h)} className="p-1.5 rounded hover:bg-cream/10 text-cream/50 hover:text-cream">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => eliminar(h.id)} className="p-1.5 rounded hover:bg-red-500/10 text-cream/50 hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-cream font-medium text-sm">{h.tipoClase.titulo}</div>
                      <div className="text-cream/50 text-xs mt-1">{BLOQUES[h.bloque]}</div>
                      <div className="flex items-center gap-1 mt-2 text-cream/40 text-xs">
                        <Users size={12} /> Cupo: {h.cupoMaximo}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-forest-dark border border-cream/20 rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-cream">{editando ? 'Editar horario' : 'Nuevo horario'}</h2>
                <button onClick={() => setModal(false)} className="text-cream/50 hover:text-cream"><X size={20} /></button>
              </div>
              <form onSubmit={guardar} className="space-y-4">
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Clase</label>
                  <select
                    required value={form.tipoClaseId} onChange={e => setForm({ ...form, tipoClaseId: e.target.value })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                  >
                    <option value="" className="bg-forest-dark">Seleccionar...</option>
                    {clases.map(c => (
                      <option key={c.id} value={c.id} className="bg-forest-dark">{c.titulo}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-cream/60 mb-1">Día</label>
                    <select
                      value={form.diaSemana} onChange={e => setForm({ ...form, diaSemana: parseInt(e.target.value) })}
                      className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                    >
                      {DIAS.map((d, i) => (
                        <option key={i} value={i} className="bg-forest-dark">{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-cream/60 mb-1">Bloque</label>
                    <select
                      value={form.bloque} onChange={e => {
                        const bloque = e.target.value;
                        const horas = bloque === 'MANANA' ? 9 : bloque === 'TARDE' ? 14 : 19;
                        setForm({ ...form, bloque, horaInicio: horas });
                      }}
                      className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                    >
                      <option value="MANANA" className="bg-forest-dark">Mañana</option>
                      <option value="TARDE" className="bg-forest-dark">Tarde</option>
                      <option value="NOCHE" className="bg-forest-dark">Noche</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Hora</label>
                  <select
                    value={form.horaInicio} onChange={e => setForm({ ...form, horaInicio: parseInt(e.target.value) })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                  >
                    {(form.bloque === 'MANANA' ? HORAS_MANANA : form.bloque === 'TARDE' ? HORAS_TARDE : HORAS_NOCHE).map(h => (
                      <option key={h} value={h} className="bg-forest-dark">{h}:00</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Cupo máximo</label>
                  <input
                    type="number" min={1} max={50} value={form.cupoMaximo}
                    onChange={e => setForm({ ...form, cupoMaximo: parseInt(e.target.value) })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                  />
                </div>
                <button type="submit" className="w-full bg-cream text-forest-dark py-2.5 rounded-md font-medium text-sm hover:bg-cream-dark transition-colors">
                  {editando ? 'Guardar cambios' : 'Crear horario'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
