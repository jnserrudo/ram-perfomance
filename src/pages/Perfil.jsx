import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import client from '../api/client.js';
import { User, Lock, Save, Eye, EyeOff, Users, Copy, Check } from 'lucide-react';

export default function Perfil() {
  const { user, login } = useAuth();
  const [perfil, setPerfil] = useState({ nombre: '', apellido: '', email: '', celular: '' });
  const [passwordForm, setPasswordForm] = useState({ passwordActual: '', passwordNuevo: '', passwordConfirm: '' });
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);
  const [referidos, setReferidos] = useState([]);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (user) {
      setPerfil({ nombre: user.nombre || '', apellido: user.apellido || '', email: user.email || '', celular: user.celular || '' });
      cargarReferidos();
    }
  }, [user]);

  const cargarReferidos = async () => {
    try {
      const res = await client.get(`/referidos/usuario/${user.id}`);
      setReferidos(res.data);
    } catch (error) {
      console.error('Error cargando referidos:', error);
    }
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(user?.codigoReferido || '');
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await client.put('/usuarios/perfil', perfil);
      setMensaje({ tipo: 'success', texto: res.data.message });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.error || 'Error al guardar' });
    } finally {
      setLoading(false);
      setTimeout(() => setMensaje(null), 4000);
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.passwordNuevo !== passwordForm.passwordConfirm) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
      return;
    }
    setLoading(true);
    try {
      const res = await client.put('/usuarios/password', {
        passwordActual: passwordForm.passwordActual,
        passwordNuevo: passwordForm.passwordNuevo
      });
      setMensaje({ tipo: 'success', texto: res.data.message });
      setPasswordForm({ passwordActual: '', passwordNuevo: '', passwordConfirm: '' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.error || 'Error al cambiar contraseña' });
    } finally {
      setLoading(false);
      setTimeout(() => setMensaje(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-forest py-4 md:py-8 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display text-xl sm:text-3xl text-cream mb-3 md:mb-6">MI PERFIL</h1>

        {mensaje && (
          <div className={`mb-4 rounded-md px-4 py-3 text-sm ${
            mensaje.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {mensaje.texto}
          </div>
        )}

        <div className="bg-cream/5 border border-cream/10 rounded-lg p-3 md:p-6 mb-3 md:mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-cream" />
            <h2 className="font-semibold text-cream">Datos personales</h2>
          </div>
          <form onSubmit={guardarPerfil} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-cream/60 mb-1">Nombre</label>
                <input
                  type="text" value={perfil.nombre} onChange={e => setPerfil({ ...perfil, nombre: e.target.value })}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Apellido</label>
                <input
                  type="text" value={perfil.apellido} onChange={e => setPerfil({ ...perfil, apellido: e.target.value })}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-cream/60 mb-1">Email</label>
              <input
                type="email" value={perfil.email} onChange={e => setPerfil({ ...perfil, email: e.target.value })}
                className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
              />
            </div>
            <div>
              <label className="block text-xs text-cream/60 mb-1">Celular</label>
              <input
                type="tel" value={perfil.celular} onChange={e => setPerfil({ ...perfil, celular: e.target.value })}
                className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-cream/40 pt-2">
              <span>DNI: {user?.dni}</span>
              <span className="text-cream/20">|</span>
              <span>Rol: {user?.rol === 'ADMIN' ? 'Administrador' : 'Miembro'}</span>
            </div>
            <button
              type="submit" disabled={loading}
              className="flex items-center gap-2 bg-cream text-forest-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-cream-dark transition-colors disabled:opacity-50"
            >
              <Save size={16} /> Guardar cambios
            </button>
          </form>
        </div>

        <div className="bg-cream/5 border border-cream/10 rounded-lg p-3 md:p-6 mb-3 md:mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-cream" />
            <h2 className="font-semibold text-cream">Cambiar contraseña</h2>
          </div>
          <form onSubmit={cambiarPassword} className="space-y-4">
            <div>
              <label className="block text-xs text-cream/60 mb-1">Contraseña actual</label>
              <div className="relative">
                <input
                  type={showPass1 ? 'text' : 'password'}
                  value={passwordForm.passwordActual} onChange={e => setPasswordForm({ ...passwordForm, passwordActual: e.target.value })}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 pr-10 text-sm text-cream focus:outline-none focus:border-cream/50"
                />
                <button type="button" onClick={() => setShowPass1(!showPass1)} className="absolute right-2 top-1/2 -translate-y-1/2 text-cream/40">
                  {showPass1 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-cream/60 mb-1">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPass2 ? 'text' : 'password'}
                  value={passwordForm.passwordNuevo} onChange={e => setPasswordForm({ ...passwordForm, passwordNuevo: e.target.value })}
                  className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 pr-10 text-sm text-cream focus:outline-none focus:border-cream/50"
                />
                <button type="button" onClick={() => setShowPass2(!showPass2)} className="absolute right-2 top-1/2 -translate-y-1/2 text-cream/40">
                  {showPass2 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-cream/60 mb-1">Repetir nueva contraseña</label>
              <input
                type="password"
                value={passwordForm.passwordConfirm} onChange={e => setPasswordForm({ ...passwordForm, passwordConfirm: e.target.value })}
                className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-cream/50"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="flex items-center gap-2 bg-cream text-forest-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-cream-dark transition-colors disabled:opacity-50"
            >
              <Lock size={16} /> Cambiar contraseña
            </button>
          </form>
        </div>

        {/* Sección de Referidos */}
        <div className="bg-cream/5 border border-cream/10 rounded-lg p-3 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-cream" />
            <h2 className="font-semibold text-cream">Sistema de Referidos</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-cream/60 text-sm mb-3">
              Compartí tu código con amigos. Cuando se registren y sean aprobados, <strong className="text-cream">ambos reciben 2 clases gratis</strong>.
            </p>
            
            <div className="bg-cream/10 border border-cream/20 rounded-lg p-4">
              <label className="block text-xs text-cream/60 mb-2">Tu código de referido:</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-forest-dark border border-cream/30 rounded-md px-4 py-3 text-cream font-mono text-lg">
                  {user?.codigoReferido || 'Cargando...'}
                </code>
                <button
                  onClick={copiarCodigo}
                  className="flex items-center gap-2 bg-cream text-forest-dark px-4 py-3 rounded-md text-sm font-medium hover:bg-cream-dark transition-colors"
                >
                  {copiado ? <Check size={16} /> : <Copy size={16} />}
                  {copiado ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-cream font-medium text-sm mb-3">
              Amigos referidos ({referidos.length})
            </h3>
            {referidos.length === 0 ? (
              <p className="text-cream/40 text-sm text-center py-4">
                Aún no has referido a nadie. ¡Compartí tu código!
              </p>
            ) : (
              <div className="space-y-2">
                {referidos.map(ref => (
                  <div key={ref.id} className="bg-cream/5 border border-cream/10 rounded-md px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-cream font-medium text-sm">{ref.referidoNombre}</p>
                      <p className="text-cream/60 text-xs">DNI: {ref.referidoDni}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ref.estado === 'COMPLETADO' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {ref.estado === 'COMPLETADO' ? '✓ Completado' : 'Pendiente'}
                      </span>
                      {ref.estado === 'COMPLETADO' && (
                        <p className="text-cream/60 text-xs mt-1">+{ref.creditosOtorgados} clases</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
