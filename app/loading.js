export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 text-gray-700">
        <div className="loader-circle" aria-hidden="true" />
        <p className="text-sm font-medium">Cargando experiencia NexoSur…</p>
      </div>
    </div>
  );
}
