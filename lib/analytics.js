import { readJSON, writeJSON } from './store';

const FILE = 'analytics.json';

export async function getAnalytics() {
  const data = await readJSON(FILE, { artisanVisits: {}, productVisits: {} });
  data.artisanVisits ||= {};
  data.productVisits ||= {};
  return data;
}

export async function incrementArtisanVisit(slug) {
  const data = await getAnalytics();
  data.artisanVisits[slug] = (data.artisanVisits[slug] || 0) + 1;
  await writeJSON(FILE, data);
  return data.artisanVisits[slug];
}

export async function incrementProductVisit(slug, productId) {
  const data = await getAnalytics();
  data.productVisits[slug] ||= {};
  data.productVisits[slug][productId] = (data.productVisits[slug][productId] || 0) + 1;
  await writeJSON(FILE, data);
  return data.productVisits[slug][productId];
}

export async function getArtisanStats(slug) {
  const data = await getAnalytics();
  const artisan = data.artisanVisits[slug] || 0;
  const products = data.productVisits[slug] || {};
  const totalProductVisits = Object.values(products).reduce((a, b) => a + b, 0);
  const top = Object.entries(products)
    .map(([id, cnt]) => ({ id, count: cnt }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  return { artisanVisits: artisan, totalProductVisits, topProducts: top };
}
