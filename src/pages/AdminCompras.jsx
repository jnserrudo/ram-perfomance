import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { CreditCard, CheckCircle, Search } from 'lucide-react';
import GuiaContextual from '../components/common/GuiaContextual.jsx';

export default function AdminCompras() {
  const [usuarios, setUsuarios] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [compras, setCompras] = useState([]);
  const [form, setForm] = useState({ usuarioId: '', paqueteId: '', metodoPago: 'Efectivo' });
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => { cargarTodo(); }, []);

  const cargarTodo = async () => {
    const [u, p, c] = await Promise.all([
      client.get('/usuarios'),
      client.get('/paquetes/admin'),
      client.get('/compras')
    ]);
    setUsuarios(u.data);
    setPaquetes(p.data);
    setCompras(c.data);
  };

  const registrar = async (e) => {
    e.preventDefault();
    try {
      await client.post('/compras', form);
      setForm({ usuarioId: '', paqueteId: '', metodoPago: 'Efectivo' });
      cargarTodo();
      setMensaje({ tipo: 'success', texto: 'Compra registrada exitosamente' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.error || 'Error al registrar' });
    }
    setTimeout(() => setMensaje(null), 4000);
  };

  const usuariosFiltrados = usuarios.filter(u =>
    `${u.nombre} ${u.apellido} ${u.dni}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl text-cream mb-6">REGISTRAR VENTA</h1>

        <GuiaContextual 
          seccion="ventas" 
          pasos={[
            { titulo: 'Identificar Alumno', descripcion: 'Buscá al alumno por su nombre o DNI en el buscador principal.' },
            { titulo: 'Elegir Paquete', descripcion: 'Seleccioná el paquete de clases que el alumno desea adquirir.' },
            { titulo: 'Método de Pago', descripcion: 'Indicá si el pago fue en efectivo, transferencia o tarjeta para el registro contable.' },
            { titulo: 'Acreditación', descripcion: 'Al registrar, los créditos se suman automáticamente al perfil del alumno y se le envía un WhatsApp.' }
          ]} 
        />

        {mensaje && <div className={`mb-4 rounded-md px-4 py-3 text-sm ${mensaje.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{mensaje.texto}</div>}

        <div className="bg-cream/5 border border-cream/10 rounded-lg p-6 mb-8">
          <form onSubmit={registrar} className="space-y-4">
            <div>
              <label className="block text-xs text-cream/60 mb-2">Buscar usuario</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
                <input
                  type="text" placeholder="Nombre, apellido o DNI..."
                  value={busqueda} onChange={e => setBusqueda(e.target.value)}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md pl-9 pr-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50"
                />
              </div>
            </div>

            {busqueda && usuariosFiltrados.length > 0 && !form.usuarioId && (
              <div className="bg-forest-dark border border-cream/10 rounded-md max-h-48 overflow-y-auto">
                {usuariosFiltrados.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { setForm({ ...form, usuarioId: u.id }); setBusqueda(`${u.nombre} ${u.apellido} (${u.dni})`); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-cream/5 text-sm text-cream border-b border-cream/5 last:border-0 transition-colors"
                  >
                    <span className="font-medium">{u.nombre} {u.apellido}</span>
                    <span className="text-cream/50 ml-2">DNI {u.dni} · {u.creditos} créditos</span>
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-cream/60 mb-1">Paquete</label>
                <select
                  required value={form.paqueteId} onChange={e => setForm({ ...form, paqueteId: e.target.value })}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream focus:outline-none focus:border-cream/50"
                >
                  <option value="" className="bg-forest-dark">Seleccionar...</option>
                  {paquetes.filter(p => p.activo).map(p => (
                    <option key={p.id} value={p.id} className="bg-forest-dark">{p.titulo} - {p.cantidadCreditos} créditos (${p.precio.toLocaleString('es-AR')})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Método de pago</label>
                <select
                  value={form.metodoPago} onChange={e => setForm({ ...form, metodoPago: e.target.value })}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 text-sm text-cream focus:outline-none focus:border-cream/50"
                >
                  <option className="bg-forest-dark">Efectivo</option>
                  <option className="bg-forest-dark">Transferencia</option>
                  <option className="bg-forest-dark">Tarjeta</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!form.usuarioId || !form.paqueteId}
              className="flex items-center justify-center gap-2 w-full bg-cream text-forest-dark py-3 rounded-md font-semibold text-sm hover:bg-cream-dark transition-colors disabled:opacity-40"
            >
              <CreditCard size={18} /> Registrar compra
            </button>
          </form>
        </div>

        <h2 className="font-display text-2xl text-cream mb-4">HISTORIAL DE COMPRAS</h2>
        <div className="bg-cream/5 border border-cream/10 rounded-lg divide-y divide-cream/5">
          {compras.map(c => (
            <div key={c.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-cream font-medium text-sm">{c.usuario?.nombre} {c.usuario?.apellido}</div>
                <div className="text-cream/50 text-xs mt-0.5">{c.paquete?.titulo} · {c.metodoPago} · {new Date(c.fechaPago).toLocaleDateString('es-AR')}</div>
              </div>
              <div className="text-right">
                <div className="text-cream font-medium text-sm">${c.totalPagado.toLocaleString('es-AR')}</div>
                <div className="text-green-400 text-xs">+{c.creditosOtorgados} créditos</div>
              </div>
            </div>
          ))}
          {compras.length === 0 && <div className="px-4 py-8 text-center text-cream/40 text-sm">Sin compras registradas</div>}
        </div>
      </div>
    </div>
  );
}
