import { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, X, Lightbulb } from 'lucide-react';

export default function GuiaContextual({ seccion, pasos }) {
  const [abierta, setAbierta] = useState(false);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const guiaVista = localStorage.getItem(`guia_${seccion}`);
    if (!guiaVista) {
      setAbierta(true);
    } else {
      setVisto(true);
    }
  }, [seccion]);

  const cerrarPermanente = () => {
    localStorage.setItem(`guia_${seccion}`, 'true');
    setAbierta(false);
    setVisto(true);
  };

  if (!abierta && visto) {
    return (
      <button
        onClick={() => setAbierta(true)}
        className="fixed bottom-6 right-6 z-40 bg-cream text-forest-dark p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <HelpCircle size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-medium text-sm">
          Guía de uso
        </span>
      </button>
    );
  }

  if (!abierta) return null;

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
      <div className="bg-cream/10 border border-cream/20 rounded-xl overflow-hidden backdrop-blur-md">
        <div className="bg-cream/10 px-6 py-3 flex items-center justify-between border-b border-cream/10">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-cream text-forest-dark rounded-md">
              <Lightbulb size={18} />
            </div>
            <h3 className="font-display text-lg text-cream tracking-wide uppercase">Cómo funciona esta sección</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={cerrarPermanente}
              className="p-1 text-cream/40 hover:text-cream transition-colors"
              title="No volver a mostrar automáticamente"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pasos.map((paso, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cream/10 border border-cream/30 text-cream flex items-center justify-center font-display text-lg">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-cream font-semibold text-sm mb-1">{paso.titulo}</h4>
                    <p className="text-cream/60 text-xs leading-relaxed">{paso.descripcion}</p>
                  </div>
                </div>
                {index < pasos.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-4 text-cream/10">
                    <ChevronDown size={20} className="-rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-cream/5 flex justify-end">
            <button
              onClick={() => setAbierta(false)}
              className="text-cream/40 hover:text-cream text-xs font-medium transition-colors underline underline-offset-4"
            >
              Entendido, ocultar guía
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
