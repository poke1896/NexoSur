"use client";

import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useI18n } from '@/i18n/I18nProvider';
import { useToast } from '@/components/ui/ToastProvider';
import { useCallback, useEffect, useState } from 'react';

export default function DashboardClient({ artisanSlug }) {
  const { t, lx, formatPrice } = useI18n();
  const { show } = useToast();
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: '', title: '', title_en: '', price: 0, image: '', description: '', description_en: '' });
  const [editingId, setEditingId] = useState('');

  const fetchProducts = useCallback(async () => {
    const r = await fetch(`/api/dashboard/products?slug=${encodeURIComponent(artisanSlug)}`);
    const j = await r.json();
    setData(j);
  }, []);

  const fetchStats = useCallback(async () => {
    const r = await fetch(`/api/analytics/stats?slug=${artisanSlug}`);
    const j = await r.json();
    setStats(j);
  }, [artisanSlug]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await Promise.all([fetchProducts(), fetchStats()]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [fetchProducts, fetchStats]);

  async function addOrUpdateProduct(e) {
    e.preventDefault();
    const res = await fetch(`/api/dashboard/products?slug=${encodeURIComponent(artisanSlug)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: { ...form, price: Number(form.price) } }),
    });
    if (res.ok) {
      await fetchProducts();
      show(editingId ? 'Producto actualizado' : 'Producto guardado', { type: 'success' });
      setForm({ id: '', title: '', title_en: '', price: 0, image: '', description: '', description_en: '' });
      setEditingId('');
    } else {
      show('Error al guardar', { type: 'error' });
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      id: p.id,
      title: p.title || '',
      title_en: p.title_en || '',
      price: p.price || 0,
      image: p.image || '',
      description: p.description || '',
      description_en: p.description_en || '',
    });
  }

  function cancelEdit() {
    setEditingId('');
    setForm({ id: '', title: '', title_en: '', price: 0, image: '', description: '', description_en: '' });
  }

  async function remove(id) {
    const res = await fetch(`/api/dashboard/products?id=${encodeURIComponent(id)}&slug=${encodeURIComponent(artisanSlug)}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchProducts();
      show('Producto eliminado', { type: 'success' });
    } else {
      show('Error al eliminar', { type: 'error' });
    }
  }

  if (loading || !data) return <p>Cargando…</p>;
  const artisan = data.artisan;
  const products = artisan?.products || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard — {artisan?.name || artisanSlug}</h1>
        {stats && (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="card p-4">
              <div className="text-sm text-gray-600">Visitas al emprendimiento</div>
              <div className="text-2xl font-bold">{stats.artisanVisits}</div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-gray-600">Visitas a productos</div>
              <div className="text-2xl font-bold">{stats.totalProductVisits}</div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-gray-600">Top productos</div>
              <div className="mt-2 space-y-1 max-h-32 overflow-auto">
                {(stats.topProducts || []).map((p) => (
                  <div key={p.id} className="flex justify-between text-sm">
                    <span>{p.id}</span>
                    <span className="text-gray-600">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h2 className="font-semibold">{editingId ? 'Editar producto seleccionado' : 'Agregar producto nuevo'}</h2>
          {editingId && (
            <Button variant="outline" onClick={cancelEdit} type="button">Cancelar edición</Button>
          )}
        </div>
        {!editingId && (
          <p className="text-sm text-gray-600 mb-3">Para editar, selecciona un producto en la lista y pulsa "Editar".</p>
        )}
        <form onSubmit={addOrUpdateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="ID único" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} required />
          <input className="border rounded px-3 py-2" placeholder="Título (ES)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="border rounded px-3 py-2" placeholder="Title (EN)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Precio" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input className="border rounded px-3 py-2 sm:col-span-2" placeholder="URL de imagen" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
          <textarea className="border rounded px-3 py-2 sm:col-span-2" placeholder="Descripción (ES)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <textarea className="border rounded px-3 py-2 sm:col-span-2" placeholder="Description (EN)" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </div>

      <div className="card p-4">
        <h2 className="font-semibold mb-3">Tus productos</h2>
        {products.length === 0 ? (
          <Alert>Sin productos aún.</Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="card">
                <img src={p.image} alt={p.title} className="w-full aspect-square object-cover rounded-t-xl" />
                <div className="p-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-brand font-semibold">{formatPrice(p.price)}</div>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" onClick={() => startEdit(p)}>Editar</Button>
                    <Button variant="danger" onClick={() => remove(p.id)}>Eliminar</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
