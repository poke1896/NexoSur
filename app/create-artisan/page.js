"use client";

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

export default function CreateArtisanPage() {
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [shortDescription, setShort] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const { show } = useToast();
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/artisan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, image, shortDescription, whatsapp }),
      });
      if (res.ok) {
        show('Emprendimiento creado/actualizado', { type: 'success' });
        router.push(`/artisans/${slug}`);
      } else {
        show('Error al guardar', { type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Crear Emprendimiento</h1>
      <Alert>Provisional (sin base de datos). Necesitas iniciar sesión para guardar.</Alert>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
        <input className="border rounded px-3 py-2" placeholder="Slug único (ej: mi-emprendimiento)" value={slug} onChange={(e) => setSlug(e.target.value.trim().toLowerCase())} required />
        <input className="border rounded px-3 py-2" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="border rounded px-3 py-2" placeholder="URL de imagen" value={image} onChange={(e) => setImage(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Descripción corta" value={shortDescription} onChange={(e) => setShort(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="WhatsApp (ej: 5068XXXXXXX)" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        <div>
          <Button type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Guardar'}</Button>
        </div>
      </form>
    </div>
  );
}
