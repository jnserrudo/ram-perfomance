import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(dni, password);
      if (data.user.requiereCambioPassword) {
        navigate('/cambiar-password');
      } else if (data.user.rol === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'DNI o contraseña incorrectos';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/icono.jpeg" alt="RAM" className="w-16 h-16 mx-auto mb-4 rounded-full" />
          <h1 className="font-display text-3xl text-cream mb-1">INGRESAR</h1>
          <p className="text-cream/60 text-sm">Ingresá con tu DNI y contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cream/80 mb-1.5">DNI</label>
            <input
              type="text" required
              value={dni} onChange={e => setDni(e.target.value)}
              className="w-full bg-cream/5 border border-cream/20 rounded-md px-4 py-3 text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50 text-base"
              placeholder="Ingresá tu DNI"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream/80 mb-1.5">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-cream/5 border border-cream/20 rounded-md px-4 py-3 pr-10 text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50 text-base"
                placeholder="Tu contraseña"
              />
              <button
                type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cream text-forest-dark py-3 rounded-md font-semibold text-base hover:bg-cream-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-cream/60 text-sm hover:text-cream transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
