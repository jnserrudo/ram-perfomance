import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import client from '../api/client.js';
import { Dumbbell, Calendar } from 'lucide-react';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function MiPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPlan();
  }, []);

  const cargarPlan = async () => {
    try {
      const res = await client.get(`/planes/usuario/${user.id}`);
      setPlan(res.data);
    } catch (error) {
      console.error('Error cargando plan:', error);
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

  if (!plan) {
    return (
      <div className="min-h-screen bg-forest py-4 md:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-lg sm:text-2xl text-cream mb-3 md:mb-6">MI PLAN DE ENTRENAMIENTO</h1>
          <div className="bg-cream/5 border border-cream/10 rounded-lg p-4 md:p-6 text-center">
            <Dumbbell size={48} className="text-cream/20 mx-auto mb-4" />
            <p className="text-cream/60">Aún no tenés un plan de entrenamiento asignado</p>
            <p className="text-cream/40 text-sm mt-2">Consultá con tu entrenador para que te arme una rutina personalizada</p>
          </div>
        </div>
      </div>
    );
  }

  const ejerciciosPorDia = plan.ejercicios.reduce((acc, ej) => {
    if (!acc[ej.diaSemana]) acc[ej.diaSemana] = [];
    acc[ej.diaSemana].push(ej);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-forest py-4 md:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-3 md:mb-6">
          <h1 className="font-display text-lg sm:text-2xl text-cream mb-1.5">{plan.titulo}</h1>
          <p className="text-cream/60 text-sm sm:text-base">{plan.objetivo}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-cream/10 border border-cream/20 rounded-full text-cream text-xs">
            Nivel: {plan.nivel}
          </span>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 0].map(dia => {
            const ejercicios = ejerciciosPorDia[dia] || [];
            if (ejercicios.length === 0) return null;

            return (
              <div key={dia} className="bg-cream/5 border border-cream/10 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={18} className="text-cream" />
                  <h2 className="font-semibold text-cream">{DIAS[dia]}</h2>
                </div>
                <div className="space-y-3">
                  {ejercicios.map(ej => (
                    <div key={ej.id} className="bg-cream/5 border border-cream/10 rounded-md p-4">
                      <h3 className="text-cream font-medium mb-2">{ej.nombre}</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-cream/60">Series:</span>
                          <span className="text-cream ml-2">{ej.series}</span>
                        </div>
                        <div>
                          <span className="text-cream/60">Repeticiones:</span>
                          <span className="text-cream ml-2">{ej.repeticiones}</span>
                        </div>
                        <div>
                          <span className="text-cream/60">Descanso:</span>
                          <span className="text-cream ml-2">{ej.descanso}</span>
                        </div>
                      </div>
                      {ej.notas && (
                        <p className="text-cream/60 text-xs mt-2 italic">Nota: {ej.notas}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
