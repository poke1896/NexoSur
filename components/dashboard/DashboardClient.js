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
  }, [artisanSlug]);

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

  if (loading || !data) return <div className="flex justify-center items-center py-20 animate-fade-in"><div className="text-gray-500">Cargando dashboard…</div></div>;
  const artisan = data.artisan;
  const products = artisan?.products || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Dashboard — {artisan?.name || artisanSlug}</h1>
        {stats && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-4 animate-slide-up border-l-4 border-brand shadow-md hover:shadow-lg transition-shadow" style={{ animationDelay: '100ms' }}>
              <div className="text-sm text-gray-600">Visitas al emprendimiento</div>
              <div className="text-2xl font-bold text-brand">{stats.artisanVisits}</div>
            </div>
            <div className="card p-4 animate-slide-up border-l-4 border-emerald-600 shadow-md hover:shadow-lg transition-shadow" style={{ animationDelay: '200ms' }}>
              <div className="text-sm text-gray-600">Visitas a productos</div>
              <div className="text-2xl font-bold text-emerald-600">{stats.totalProductVisits}</div>
            </div>
            <div className="card p-4 animate-slide-up border-l-4 border-amber-500 shadow-md hover:shadow-lg transition-shadow" style={{ animationDelay: '300ms' }}>
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

      <div className="card p-4 animate-slide-up border border-slate-200 shadow-md" style={{ animationDelay: '400ms' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h2 className="font-bold text-lg text-gray-900">{editingId ? '✏️ Editar producto seleccionado' : '➕ Agregar producto nuevo'}</h2>
          {editingId && (
            <Button variant="outline" onClick={cancelEdit} type="button">Cancelar edición</Button>
          )}
        </div>
        {!editingId && (
          <p className="text-sm text-gray-600 mb-3">Para editar, selecciona un producto en la lista y pulsa &quot;Editar&quot;.</p>
        )}
        <form onSubmit={addOrUpdateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {editingId && (
            <input className="border border-slate-300 rounded-lg px-3 py-2 bg-slate-100 text-gray-600 cursor-not-allowed" placeholder="ID del producto" value={form.id} disabled />
          )}
          <input className="border border-slate-300 rounded-lg px-3 py-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30 transition-all" placeholder="Título (ES)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="border border-slate-300 rounded-lg px-3 py-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30 transition-all" placeholder="Title (EN)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
          <input className="border border-slate-300 rounded-lg px-3 py-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30 transition-all" placeholder="Precio" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input className="border border-slate-300 rounded-lg px-3 py-2 sm:col-span-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30 transition-all" placeholder="URL de imagen" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
          <textarea className="border border-slate-300 rounded-lg px-3 py-2 sm:col-span-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30 transition-all" placeholder="Descripción (ES)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <textarea className="border border-slate-300 rounded-lg px-3 py-2 sm:col-span-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30 transition-all" placeholder="Description (EN)" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit" className="bg-gradient-to-r from-brand to-emerald-600">Guardar</Button>
          </div>
        </form>
      </div>

      <div className="card p-4 animate-slide-up border border-slate-200 shadow-md" style={{ animationDelay: '500ms' }}>
        <h2 className="font-bold text-lg text-gray-900 mb-4">📦 Tus productos</h2>
        {products.length === 0 ? (
          <Alert>Sin productos aún. ¡Crea tu primer producto!</Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <div key={p.id} className="card overflow-hidden border border-slate-200 hover:border-brand/40 hover:shadow-lg transition-all animate-slide-up" style={{ animationDelay: `${600 + i * 50}ms` }}>
                <img src={p.image} alt={p.title} className="w-full aspect-square object-cover rounded-t-xl hover:scale-105 transition-transform" />
                <div className="p-3">
                  <div className="font-semibold text-gray-900">{p.title}</div>
                  <div className="text-brand font-bold text-lg mt-1">{formatPrice(p.price)}</div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" onClick={() => startEdit(p)} className="flex-1">Editar</Button>
                    <Button variant="danger" onClick={() => remove(p.id)} className="flex-1">Eliminar</Button>
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
