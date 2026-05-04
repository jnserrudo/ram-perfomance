import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Plus, Pencil, Trash2, X, ShoppingBag } from 'lucide-react';

export default function AdminPaquetes() {
  const [paquetes, setPaquetes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ titulo: '', descripcion: '', cantidadCreditos: 12, precio: 25000 });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const res = await client.get('/paquetes/admin');
    setPaquetes(res.data);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await client.put(`/paquetes/${editando}`, form);
      } else {
        await client.post('/paquetes', form);
      }
      setModal(false); setEditando(null); setForm({ titulo: '', descripcion: '', cantidadCreditos: 12, precio: 25000 });
      cargar();
      setMensaje({ tipo: 'success', texto: editando ? 'Paquete actualizado' : 'Paquete creado' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.error || 'Error' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este paquete?')) return;
    try { await client.delete(`/paquetes/${id}`); cargar(); setMensaje({ tipo: 'success', texto: 'Eliminado' }); }
    catch (e) { setMensaje({ tipo: 'error', texto: 'Error al eliminar' }); }
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-cream">PAQUETES DE CRÉDITOS</h1>
          <button onClick={() => { setModal(true); setEditando(null); }} className="flex items-center gap-2 bg-cream text-forest-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-cream-dark transition-colors">
            <Plus size={18} /> Nuevo paquete
          </button>
        </div>
        {mensaje && <div className={`mb-4 rounded-md px-4 py-3 text-sm ${mensaje.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{mensaje.texto}</div>}

        <div className="bg-cream/5 border border-cream/10 rounded-lg divide-y divide-cream/5">
          {paquetes.map(p => (
            <div key={p.id} className="px-4 py-4 flex items-center justify-between hover:bg-cream/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-cream/5"><ShoppingBag size={18} className="text-cream" /></div>
                <div>
                  <div className="text-cream font-medium text-sm">{p.titulo}</div>
                  <div className="text-cream/50 text-xs mt-0.5">{p.descripcion} · {p.cantidadCreditos} créditos · ${p.precio.toLocaleString('es-AR')}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditando(p.id); setForm({ titulo: p.titulo, descripcion: p.descripcion, cantidadCreditos: p.cantidadCreditos, precio: p.precio, activo: p.activo }); setModal(true); }} className="p-2 rounded-md hover:bg-cream/10 text-cream/60 hover:text-cream"><Pencil size={16} /></button>
                <button onClick={() => eliminar(p.id)} className="p-2 rounded-md hover:bg-red-500/10 text-cream/60 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-forest-dark border border-cream/20 rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-cream">{editando ? 'Editar paquete' : 'Nuevo paquete'}</h2>
                <button onClick={() => setModal(false)} className="text-cream/50 hover:text-cream"><X size={20} /></button>
              </div>
              <form onSubmit={guardar} className="space-y-4">
                <div><label className="block text-xs text-cream/60 mb-1">Título</label><input type="text" required value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50" /></div>
                <div><label className="block text-xs text-cream/60 mb-1">Descripción</label><textarea rows={2} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-cream/60 mb-1">Créditos</label><input type="number" min={1} required value={form.cantidadCreditos} onChange={e => setForm({ ...form, cantidadCreditos: parseInt(e.target.value) })} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50" /></div>
                  <div><label className="block text-xs text-cream/60 mb-1">Precio ($)</label><input type="number" min={0} required value={form.precio} onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) })} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50" /></div>
                </div>
                <button type="submit" className="w-full bg-cream text-forest-dark py-2.5 rounded-md font-medium text-sm hover:bg-cream-dark transition-colors">{editando ? 'Guardar cambios' : 'Crear paquete'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
