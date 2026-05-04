import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import client from '../api/client.js';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function CambiarPassword() {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmar) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await client.put('/usuarios/password', {
        passwordActual: user.dni,
        passwordNuevo: password
      });
      toast.success('¡Contraseña actualizada! Ahora podés usar la app.');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al cambiar la contraseña. Verificá que estés usando tu contraseña actual.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cream/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-cream" />
          </div>
          <h1 className="font-display text-3xl text-cream tracking-wide">CAMBIAR CONTRASEÑA</h1>
          <p className="text-cream/60 mt-2 text-sm">
            Es tu primer ingreso. Creá una contraseña segura para proteger tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-cream/5 border border-cream/10 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-xs text-cream/60 mb-1.5">Contraseña nueva</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 pr-10 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-cream/60 mb-1.5">Confirmar contraseña</label>
            <div className="relative">
              <input
                type={showConfirmar ? 'text' : 'password'}
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                placeholder="Repetí la contraseña"
                required
                className="w-full bg-cream/5 border border-cream/20 rounded-md px-3 py-2.5 pr-10 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmar(!showConfirmar)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
              >
                {showConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-cream text-forest-dark py-3 rounded-md font-semibold text-sm hover:bg-cream-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : <>Guardar y continuar <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
