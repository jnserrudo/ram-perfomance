import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Trophy, Award, TrendingUp } from 'lucide-react';
import BadgeCard from '../components/BadgeCard.jsx';

export default function Logros() {
  const { user } = useAuth();
  const [logros, setLogros] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [l, r] = await Promise.all([
        client.get(`/logros/usuario/${user.id}`),
        client.get('/logros/ranking')
      ]);
      setLogros(l.data);
      setRanking(r.data);
    } catch (error) {
      console.error('Error cargando logros:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest">
        <div className="text-cream/60 text-sm">Cargando...</div>
      </div>
    );
  }

  const miPosicion = ranking.findIndex(u => u.id === user.id) + 1;

  return (
    <div className="min-h-screen bg-forest pb-8">
      <div className="bg-forest-dark border-b border-cream/10">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <Trophy size={32} className="text-cream" />
            <h1 className="font-display text-3xl md:text-4xl text-cream">MIS LOGROS</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Ranking del mes */}
        <div className="bg-forest-dark border border-cream/10 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-cream" />
            <h2 className="text-cream font-medium text-lg">Ranking del Mes</h2>
          </div>
          
          {miPosicion > 0 && (
            <div className="mb-4 bg-cream/5 border border-cream/20 rounded-md px-4 py-2 text-cream/80 text-sm">
              Tu posición: <span className="font-bold">#{miPosicion}</span>
            </div>
          )}

          <div className="space-y-2">
            {ranking.map((u, index) => (
              <div
                key={u.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-md ${
                  u.id === user.id
                    ? 'bg-cream/10 border border-cream/20'
                    : 'bg-cream/5'
                }`}
              >
                <div className={`font-bold ${
                  index === 0 ? 'text-yellow-400' :
                  index === 1 ? 'text-gray-300' :
                  index === 2 ? 'text-amber-600' :
                  'text-cream/60'
                }`}>
                  #{index + 1}
                </div>
                <div className="flex-1 text-cream">{u.nombre}</div>
                <div className="text-cream/60 text-sm">{u.asistencias} asistencias</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logros desbloqueados */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Award size={20} className="text-cream" />
            <h2 className="text-cream font-medium text-lg">
              Logros Desbloqueados ({logros.length})
            </h2>
          </div>
        </div>

        {logros.length === 0 ? (
          <div className="bg-forest-dark border border-cream/10 rounded-lg p-8 text-center">
            <Trophy size={48} className="text-cream/20 mx-auto mb-3" />
            <p className="text-cream/60">Aún no has desbloqueado ningún logro</p>
            <p className="text-cream/40 text-sm mt-2">¡Seguí entrenando para conseguir tu primer badge!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logros.map(logro => (
              <BadgeCard key={logro.id} logro={logro} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
