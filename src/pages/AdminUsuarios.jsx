import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { Search, UserCheck, UserX, CreditCard, Pencil, X, CheckCircle, Plus, UserPlus, Copy, Check } from 'lucide-react';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState(null);
  const [creditosEdit, setCreditosEdit] = useState(0);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({ dni: '', nombre: '', apellido: '', email: '', celular: '' });
  const [usuarioCreado, setUsuarioCreado] = useState(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const res = await client.get('/usuarios');
    setUsuarios(res.data);
  };

  const actualizarCreditos = async (id) => {
    try {
      await client.put(`/usuarios/${id}/creditos`, { creditos: creditosEdit });
      setEditando(null);
      cargar();
      setMensaje({ tipo: 'success', texto: 'Créditos actualizados' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al actualizar' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    try {
      const res = await client.post('/usuarios', nuevoUsuario);
      setUsuarioCreado(res.data.usuario);
      setNuevoUsuario({ dni: '', nombre: '', apellido: '', email: '', celular: '' });
      cargar();
      setMensaje({ tipo: 'success', texto: 'Usuario creado exitosamente' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.error || 'Error al crear usuario' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const reactivarUsuario = async (id) => {
    try {
      await client.put(`/usuarios/${id}/reactivar`);
      cargar();
      setMensaje({ tipo: 'success', texto: 'Usuario reactivado correctamente' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al reactivar' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const copiarCredenciales = () => {
    if (!usuarioCreado) return;
    const text = `DNI: ${usuarioCreado.dni}\nContraseña: ${usuarioCreado.passwordTemporal}`;
    navigator.clipboard.writeText(text);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const usuariosFiltrados = usuarios.filter(u =>
    `${u.nombre} ${u.apellido} ${u.dni} ${u.email}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-cream">USUARIOS</h1>
          <button
            onClick={() => { setMostrarModal(true); setUsuarioCreado(null); setNuevoUsuario({ dni: '', nombre: '', apellido: '', email: '', celular: '' }); }}
            className="flex items-center gap-2 bg-cream text-forest-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-cream-dark transition-colors"
          >
            <Plus size={16} /> Nuevo usuario
          </button>
        </div>

        {mensaje && <div className={`mb-4 rounded-md px-4 py-3 text-sm ${mensaje.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{mensaje.texto}</div>}

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
          <input
            type="text" placeholder="Buscar por nombre, DNI, email..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            className="w-full bg-cream/5 border border-cream/10 rounded-md pl-9 pr-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/30"
          />
        </div>

        <div className="bg-cream/5 border border-cream/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream/10 text-cream/50 text-xs uppercase">
                  <th className="text-left px-4 py-3 font-medium">Usuario</th>
                  <th className="text-left px-4 py-3 font-medium">DNI</th>
                  <th className="text-left px-4 py-3 font-medium">Celular</th>
                  <th className="text-left px-4 py-3 font-medium">Créditos</th>
                  <th className="text-left px-4 py-3 font-medium">Estado</th>
                  <th className="text-left px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5">
                {usuariosFiltrados.map(u => (
                  <tr key={u.id} className="hover:bg-cream/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-cream font-medium">{u.nombre} {u.apellido}</div>
                      <div className="text-cream/50 text-xs">{u.email}</div>
                    </td>
                    <td className="px-4 py-3 text-cream/70">{u.dni}</td>
                    <td className="px-4 py-3 text-cream/70">{u.celular}</td>
                    <td className="px-4 py-3">
                      {editando === u.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number" min={0} value={creditosEdit}
                            onChange={e => setCreditosEdit(parseInt(e.target.value) || 0)}
                            className="w-20 bg-cream/5 border border-cream/20 rounded px-2 py-1 text-sm text-cream focus:outline-none focus:border-cream/50"
                          />
                          <button onClick={() => actualizarCreditos(u.id)} className="p-1 text-green-400 hover:text-green-300"><CheckCircle size={16} /></button>
                          <button onClick={() => setEditando(null)} className="p-1 text-cream/50 hover:text-cream"><X size={16} /></button>
                        </div>
                      ) : (
                        <span className={`font-medium ${u.creditos < 3 ? 'text-orange-400' : 'text-cream'}`}>{u.creditos}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.activo ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {u.activo ? <UserCheck size={12} /> : <UserX size={12} />}
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditando(u.id); setCreditosEdit(u.creditos); }}
                          className="p-1.5 rounded hover:bg-cream/10 text-cream/50 hover:text-cream transition-colors"
                          title="Editar créditos"
                        >
                          <CreditCard size={16} />
                        </button>
                        {u.activo && u.rol !== 'ADMIN' && (
                          <button
                            onClick={() => desactivarUsuario(u.id)}
                            className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                            title="Desactivar usuario"
                          >
                            <UserX size={16} />
                          </button>
                        )}
                        {!u.activo && (
                          <button
                            onClick={() => reactivarUsuario(u.id)}
                            className="p-1.5 rounded hover:bg-green-500/10 text-green-400 hover:text-green-300 transition-colors"
                            title="Reactivar usuario"
                          >
                            <UserPlus size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {usuariosFiltrados.length === 0 && (
            <div className="px-4 py-8 text-center text-cream/40 text-sm">No se encontraron usuarios</div>
          )}
        </div>
      </div>

      {/* Modal crear usuario */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-forest border border-cream/20 rounded-xl max-w-md w-full p-6 relative">
            <button onClick={() => setMostrarModal(false)} className="absolute top-4 right-4 text-cream/40 hover:text-cream">
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl text-cream mb-4">CREAR USUARIO</h2>

            {usuarioCreado ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-medium">Usuario creado exitosamente</p>
                </div>
                <div className="bg-cream/5 border border-cream/10 rounded-lg p-4 space-y-2">
                  <p className="text-cream/60 text-xs uppercase tracking-wide">Credenciales</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cream/70 text-sm">DNI (usuario):</span>
                    <span className="text-cream font-mono font-medium">{usuarioCreado.dni}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cream/70 text-sm">Contraseña temporal:</span>
                    <span className="text-cream font-mono font-medium">{usuarioCreado.passwordTemporal}</span>
                  </div>
                </div>
                <button
                  onClick={copiarCredenciales}
                  className="flex items-center justify-center gap-2 w-full bg-cream text-forest-dark py-2.5 rounded-md font-medium text-sm hover:bg-cream-dark transition-colors"
                >
                  {copiado ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar credenciales</>}
                </button>
                <button
                  onClick={() => { setMostrarModal(false); setUsuarioCreado(null); }}
                  className="w-full border border-cream/20 text-cream py-2.5 rounded-md text-sm hover:bg-cream/5 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={crearUsuario} className="space-y-3">
                <input type="text" placeholder="DNI" required value={nuevoUsuario.dni} onChange={e => setNuevoUsuario({...nuevoUsuario, dni: e.target.value})} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Nombre" required value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50" />
                  <input type="text" placeholder="Apellido" required value={nuevoUsuario.apellido} onChange={e => setNuevoUsuario({...nuevoUsuario, apellido: e.target.value})} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50" />
                </div>
                <input type="email" placeholder="Email" required value={nuevoUsuario.email} onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50" />
                <input type="tel" placeholder="Celular" required value={nuevoUsuario.celular} onChange={e => setNuevoUsuario({...nuevoUsuario, celular: e.target.value})} className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50" />
                <button type="submit" className="flex items-center justify-center gap-2 w-full bg-cream text-forest-dark py-2.5 rounded-md font-medium text-sm hover:bg-cream-dark transition-colors">
                  <UserPlus size={16} /> Crear usuario
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
