import { useState, useEffect } from 'react';
import client from '../api/client.js';
import { CreditCard, ShoppingBag, CheckCircle } from 'lucide-react';

export default function Paquetes() {
  const [paquetes, setPaquetes] = useState([]);
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    client.get('/paquetes').then(r => setPaquetes(r.data));
    client.get('/compras/mias').then(r => setCompras(r.data));
  }, []);

  return (
    <div className="min-h-screen bg-forest py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl text-cream mb-2">PAQUETES</h1>
        <p className="text-cream/60 text-sm mb-6">Estos son los paquetes disponibles. Acercate a recepción para comprar el que más te convenga.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {paquetes.map(p => (
            <div key={p.id} className="bg-cream/5 border border-cream/10 rounded-lg p-6 hover:border-cream/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag size={20} className="text-cream" />
                <h3 className="font-semibold text-cream">{p.titulo}</h3>
              </div>
              <p className="text-cream/60 text-sm mb-4">{p.descripcion}</p>
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-display text-3xl text-cream">{p.cantidadCreditos}</div>
                  <div className="text-cream/50 text-xs">clases</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-cream text-lg">${p.precio.toLocaleString('es-AR')}</div>
                  <div className="text-cream/40 text-xs">por paquete</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl text-cream mb-4">MIS COMPRAS</h2>
        {compras.length === 0 ? (
          <div className="text-center py-8 text-cream/40 text-sm">Aún no tenés compras registradas</div>
        ) : (
          <div className="space-y-3">
            {compras.map(c => (
              <div key={c.id} className="bg-cream/5 border border-cream/10 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-cream/5 text-green-400">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <div className="font-medium text-cream text-sm">{c.paquete?.titulo}</div>
                    <div className="text-cream/50 text-xs mt-0.5">
                      {c.creditosOtorgados} clases - {new Date(c.fechaPago).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                </div>
                <div className="text-cream font-medium text-sm">${c.totalPagado.toLocaleString('es-AR')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
