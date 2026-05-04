import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Plus, Pencil, Trash2, X, Megaphone, CheckCircle } from 'lucide-react';

export default function AdminComunicados() {
  const [comunicados, setComunicados] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ titulo: '', mensaje: '' });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const res = await client.get('/comunicados');
    setComunicados(res.data);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await client.put(`/comunicados/${editando}`, form);
      } else {
        await client.post('/comunicados', form);
      }
      setModal(false); setEditando(null); setForm({ titulo: '', mensaje: '' });
      cargar();
      setMensaje({ tipo: 'success', texto: editando ? 'Actualizado' : 'Comunicado publicado' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este comunicado?')) return;
    try { await client.delete(`/comunicados/${id}`); cargar(); }
    catch (e) { setMensaje({ tipo: 'error', texto: 'Error al eliminar' }); }
  };

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-cream">COMUNICADOS</h1>
          <button onClick={() => { setModal(true); setEditando(null); }} className="flex items-center gap-2 bg-cream text-forest-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-cream-dark transition-colors">
            <Plus size={18} /> Nuevo
          </button>
        </div>
        {mensaje && <div className={`mb-4 rounded-md px-4 py-3 text-sm ${mensaje.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{mensaje.texto}</div>}

        <div className="space-y-3">
          {comunicados.map(c => (
            <div key={c.id} className="bg-cream/5 border border-cream/10 rounded-lg p-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-cream/5 mt-0.5"><Megaphone size={18} className="text-cream" /></div>
                <div>
                  <div className="text-cream font-medium text-sm">{c.titulo}</div>
                  <div className="text-cream/60 text-sm mt-1">{c.mensaje}</div>
                  <div className="text-cream/40 text-xs mt-2">{new Date(c.createdAt).toLocaleDateString('es-AR')}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditando(c.id); setForm({ titulo: c.titulo, mensaje: c.mensaje }); setModal(true); }} className="p-1.5 rounded hover:bg-cream/10 text-cream/50 hover:text-cream"><Pencil size={14} /></button>
                <button onClick={() => eliminar(c.id)} className="p-1.5 rounded hover:bg-red-500/10 text-cream/50 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {comunicados.length === 0 && <div className="text-center py-12 text-cream/40 text-sm">Sin comunicados</div>}
        </div>

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-forest-dark border border-cream/20 rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-cream">{editando ? 'Editar' : 'Nuevo comunicado'}</h2>
                <button onClick={() => setModal(false)} className="text-cream/50 hover:text-cream"><X size={20} /></button>
              </div>
              <form onSubmit={guardar} className="space-y-4">
                <div><label className="block text-xs text-cream/60 mb-1">Título</label><input type="text" required value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50" /></div>
                <div><label className="block text-xs text-cream/60 mb-1">Mensaje</label><textarea rows={4} required value={form.mensaje} onChange={e => setForm({ ...form, mensaje: e.target.value })} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50" /></div>
                <button type="submit" className="w-full bg-cream text-forest-dark py-2.5 rounded-md font-medium text-sm hover:bg-cream-dark transition-colors">{editando ? 'Guardar cambios' : 'Publicar'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
