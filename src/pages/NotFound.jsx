import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4 text-cream">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <img src="/logo.jpeg" alt="RAM Performance" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-cream/20" />
          <h1 className="font-display text-6xl text-cream mb-2">404</h1>
          <h2 className="font-display text-2xl text-cream mb-4">Página no encontrada</h2>
          <p className="text-cream/60 mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-cream text-forest-dark px-6 py-3 rounded-md font-semibold hover:bg-cream-dark transition-colors"
          >
            <Home size={18} />
            Ir al inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream px-6 py-3 rounded-md font-medium hover:bg-cream/10 transition-colors"
          >
            <ArrowLeft size={18} />
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}
