import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useState, useEffect } from 'react';
import client from '../../api/client.js';
import {
  Menu, X, User, Bell, ChevronDown, Shield,
  LogOut, Home, Calendar, CreditCard, History, Dumbbell, Trophy, ClipboardList, Activity
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = user?.rol === 'ADMIN';

  useEffect(() => {
    if (user) {
      client.get('/notificaciones/no-leidas').then(r => setNotifCount(r.data.count));
      client.get('/notificaciones').then(r => setNotificaciones(r.data.slice(0, 5)));
    }
  }, [user]);

  const marcarLeida = async (id) => {
    await client.put(`/notificaciones/${id}/leer`);
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    setNotifCount(Math.max(0, notifCount - 1));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const navLinks = isAdmin
    ? [
        { to: '/admin', label: 'Panel', icon: Shield },
        { to: '/admin/usuarios', label: 'Usuarios', icon: User },
        { to: '/admin/clases', label: 'Clases', icon: Dumbbell },
        { to: '/admin/horarios', label: 'Horarios', icon: Calendar },
        { to: '/admin/compras', label: 'Ventas', icon: CreditCard },
        { to: '/admin/reportes', label: 'Reportes', icon: CreditCard },
        { to: '/admin/auditoria', label: 'Auditoría', icon: Shield },
      ]
    : [
        { to: '/dashboard', label: 'Inicio', icon: Home },
        { to: '/paquetes', label: 'Paquetes', icon: CreditCard },
        { to: '/historial', label: 'Historial', icon: History },
        { to: '/logros', label: 'Logros', icon: Trophy },
        { to: '/mi-plan', label: 'Mi Plan', icon: ClipboardList },
        { to: '/actividad', label: 'Actividad', icon: Activity },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-dark border-b border-cream/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2">
            <img src="/icono.jpeg" alt="RAM" className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover" />
            <span className="font-display text-lg md:text-xl tracking-wider text-cream">RAM</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-cream/10 text-cream'
                    : 'text-cream/70 hover:text-cream hover:bg-cream/5'
                }`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Notificaciones */}
            {!isAdmin && (
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); setMenuOpen(false); }}
                  className="relative p-2 rounded-full hover:bg-cream/10 transition-colors"
                >
                  <Bell size={18} className="md:w-5 md:h-5" />
                  {notifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notifCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-forest-dark border border-cream/20 rounded-lg shadow-xl overflow-hidden">
                    <div className="p-3 border-b border-cream/10 font-medium text-sm">Notificaciones</div>
                    {notificaciones.length === 0 ? (
                      <div className="p-4 text-center text-cream/50 text-sm">Sin notificaciones</div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto">
                        {notificaciones.map(n => (
                          <button
                            key={n.id}
                            onClick={() => marcarLeida(n.id)}
                            className={`w-full text-left p-3 hover:bg-cream/5 border-b border-cream/5 text-sm transition-colors ${n.leida ? 'opacity-60' : ''}`}
                          >
                            <div className="font-medium text-cream">{n.titulo}</div>
                            <div className="text-cream/70 text-xs mt-0.5">{n.mensaje}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); setMenuOpen(false); }}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-cream/10 transition-colors"
              >
                <User size={20} />
                <span className="hidden sm:block text-sm font-medium">{user?.nombre}</span>
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-forest-dark border border-cream/20 rounded-lg shadow-xl overflow-hidden">
                  <Link to="/perfil" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-cream/5 transition-colors">
                    <User size={16} /> Mi Perfil
                  </Link>
                  {isAdmin && (
                    <Link to="/checkin" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-cream/5 transition-colors">
                      <Shield size={16} /> Check-in
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors"
                  >
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false); setUserMenuOpen(false); }}
              className="md:hidden p-2 rounded-full hover:bg-cream/10 transition-colors"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-cream/10 bg-forest-dark">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm ${
                  location.pathname === link.to
                    ? 'bg-cream/10 text-cream'
                    : 'text-cream/70 hover:text-cream hover:bg-cream/5'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
