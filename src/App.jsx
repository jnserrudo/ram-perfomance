import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import Perfil from './pages/Perfil.jsx';
import Historial from './pages/Historial.jsx';
import Paquetes from './pages/Paquetes.jsx';
import Logros from './pages/Logros.jsx';
import MiPlan from './pages/MiPlan.jsx';
import Actividad from './pages/Actividad.jsx';
import Checkin from './pages/Checkin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminClasses from './pages/AdminClasses.jsx';
import AdminSchedules from './pages/AdminSchedules.jsx';
import AdminPaquetes from './pages/AdminPaquetes.jsx';
import AdminCompras from './pages/AdminCompras.jsx';
import AdminComunicados from './pages/AdminComunicados.jsx';
import AdminReportes from './pages/AdminReportes.jsx';
import AdminUsuarios from './pages/AdminUsuarios.jsx';
import AdminAuditoria from './pages/AdminAuditoria.jsx';
import CambiarPassword from './pages/CambiarPassword.jsx';

function PrivateRoute({ children, adminOnly = false, allowCambioPassword = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-forest flex items-center justify-center text-cream">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.requiereCambioPassword && !allowCambioPassword) return <Navigate to="/cambiar-password" />;
  if (adminOnly && user.rol !== 'ADMIN') return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkin" element={<Checkin />} />
      <Route element={<Layout />}>
        <Route path="/cambiar-password" element={<PrivateRoute allowCambioPassword><CambiarPassword /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/historial" element={<PrivateRoute><Historial /></PrivateRoute>} />
        <Route path="/paquetes" element={<PrivateRoute><Paquetes /></PrivateRoute>} />
        <Route path="/logros" element={<PrivateRoute><Logros /></PrivateRoute>} />
        <Route path="/mi-plan" element={<PrivateRoute><MiPlan /></PrivateRoute>} />
        <Route path="/actividad" element={<PrivateRoute><Actividad /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/clases" element={<PrivateRoute adminOnly><AdminClasses /></PrivateRoute>} />
        <Route path="/admin/horarios" element={<PrivateRoute adminOnly><AdminSchedules /></PrivateRoute>} />
        <Route path="/admin/paquetes" element={<PrivateRoute adminOnly><AdminPaquetes /></PrivateRoute>} />
        <Route path="/admin/compras" element={<PrivateRoute adminOnly><AdminCompras /></PrivateRoute>} />
        <Route path="/admin/comunicados" element={<PrivateRoute adminOnly><AdminComunicados /></PrivateRoute>} />
        <Route path="/admin/reportes" element={<PrivateRoute adminOnly><AdminReportes /></PrivateRoute>} />
        <Route path="/admin/usuarios" element={<PrivateRoute adminOnly><AdminUsuarios /></PrivateRoute>} />
        <Route path="/admin/auditoria" element={<PrivateRoute adminOnly><AdminAuditoria /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
