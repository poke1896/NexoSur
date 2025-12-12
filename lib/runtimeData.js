import { artisans as baseArtisans } from '@/data/artisans';
import { readJSON, writeJSON } from './store';

const FILE = 'artisans.json';

export async function getOverrides() {
  const data = await readJSON(FILE, {});
  return data || {};
}

export async function setOverrides(data) {
  await writeJSON(FILE, data || {});
}

export function mergeArtisan(base, override) {
  if (!override) return base;
  const merged = { ...base, ...override };
  if (override.products) merged.products = override.products;
  return merged;
}

export async function getMergedArtisans() {
  const overrides = await getOverrides();
  const baseMap = new Map(baseArtisans.map((a) => [a.slug, a]));
  const list = baseArtisans.map((a) => mergeArtisan(a, overrides[a.slug]));
  for (const slug of Object.keys(overrides || {})) {
    if (!baseMap.has(slug)) {
      const o = overrides[slug];
      list.push(mergeArtisan({ slug, id: slug, name: slug, shortDescription: '', description: '', image: '', products: [] }, o));
    }
  }
  return list;
}

export async function getMergedArtisan(slug) {
  const overrides = await getOverrides();
  const base = baseArtisans.find((a) => a.slug === slug);
  if (!base) return mergeArtisan({ slug, id: slug, name: slug, shortDescription: '', description: '', image: '', products: [] }, overrides[slug]);
  return mergeArtisan(base, overrides[slug]);
}

export async function upsertProduct(slug, product) {
  const overrides = await getOverrides();
  const current = overrides[slug] || {};
  const products = current.products || [];
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) products[idx] = product;
  else products.push(product);
  overrides[slug] = { ...current, products };
  await setOverrides(overrides);
  
  // Devolver el artesano merged (base + override) con todos los productos
  const merged = await getMergedArtisan(slug);
  return merged;
}

export async function deleteProduct(slug, productId) {
  const overrides = await getOverrides();
  const current = overrides[slug] || {};
  const products = (current.products || []).filter((p) => p.id !== productId);
  overrides[slug] = { ...current, products };
  await setOverrides(overrides);
  
  // Devolver el artesano merged (base + override) con todos los productos
  const merged = await getMergedArtisan(slug);
  return merged;
}

export async function upsertArtisanMeta(slug, meta) {
  if (!slug) throw new Error('slug required');
  const overrides = await getOverrides();
  const current = overrides[slug] || {};
  const merged = { products: current.products || [], ...current, ...meta, slug, id: slug };
  overrides[slug] = merged;
  await setOverrides(overrides);
  return merged;
}
