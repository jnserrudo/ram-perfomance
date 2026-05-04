export default function BadgeCard({ logro }) {
  return (
    <div className="bg-forest-dark border border-cream/10 rounded-lg p-4 hover:border-cream/30 transition-all">
      <div className="flex items-start gap-3">
        <div className="text-4xl">{logro.icono}</div>
        <div className="flex-1">
          <h3 className="text-cream font-medium">{logro.titulo}</h3>
          <p className="text-cream/60 text-sm mt-1">{logro.descripcion}</p>
          <p className="text-cream/40 text-xs mt-2">
            Desbloqueado: {new Date(logro.fechaObtenido).toLocaleDateString('es-AR')}
          </p>
        </div>
      </div>
    </div>
  );
}
