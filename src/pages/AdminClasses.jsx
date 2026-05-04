import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Plus, Pencil, Trash2, Dumbbell, X, CheckCircle } from 'lucide-react';

export default function AdminClasses() {
  const [clases, setClases] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ titulo: '', descripcion: '' });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarClases();
  }, []);

  const cargarClases = async () => {
    const res = await client.get('/clases');
    setClases(res.data);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await client.put(`/clases/${editando}`, form);
      } else {
        await client.post('/clases', form);
      }
      setModal(false);
      setEditando(null);
      setForm({ titulo: '', descripcion: '' });
      cargarClases();
      setMensaje({ tipo: 'success', texto: editando ? 'Clase actualizada' : 'Clase creada' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.error || 'Error al guardar' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta clase?')) return;
    try {
      await client.delete(`/clases/${id}`);
      cargarClases();
      setMensaje({ tipo: 'success', texto: 'Clase eliminada' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const abrirEditar = (clase) => {
    setEditando(clase.id);
    setForm({ titulo: clase.titulo, descripcion: clase.descripcion });
    setModal(true);
  };

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-cream">TIPOS DE CLASE</h1>
          <button
            onClick={() => { setModal(true); setEditando(null); setForm({ titulo: '', descripcion: '' }); }}
            className="flex items-center gap-2 bg-cream text-forest-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-cream-dark transition-colors"
          >
            <Plus size={18} /> Nueva clase
          </button>
        </div>

        {mensaje && (
          <div className={`mb-4 rounded-md px-4 py-3 text-sm ${
            mensaje.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {mensaje.texto}
          </div>
        )}

        <div className="bg-cream/5 border border-cream/10 rounded-lg divide-y divide-cream/5">
          {clases.map(c => (
            <div key={c.id} className="px-4 py-4 flex items-center justify-between hover:bg-cream/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-cream/5">
                  <Dumbbell size={18} className="text-cream" />
                </div>
                <div>
                  <div className="text-cream font-medium text-sm">{c.titulo}</div>
                  <div className="text-cream/50 text-xs mt-0.5">{c.descripcion}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => abrirEditar(c)} className="p-2 rounded-md hover:bg-cream/10 text-cream/60 hover:text-cream transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => eliminar(c.id)} className="p-2 rounded-md hover:bg-red-500/10 text-cream/60 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {clases.length === 0 && (
            <div className="px-4 py-8 text-center text-cream/40 text-sm">No hay clases creadas</div>
          )}
        </div>

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-forest-dark border border-cream/20 rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-cream">{editando ? 'Editar clase' : 'Nueva clase'}</h2>
                <button onClick={() => setModal(false)} className="text-cream/50 hover:text-cream">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={guardar} className="space-y-4">
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Título</label>
                  <input
                    type="text" required value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Descripción</label>
                  <textarea
                    rows={3} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                    className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                  />
                </div>
                <button type="submit" className="w-full bg-cream text-forest-dark py-2.5 rounded-md font-medium text-sm hover:bg-cream-dark transition-colors">
                  {editando ? 'Guardar cambios' : 'Crear clase'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
