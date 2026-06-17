const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

const shopGrid = document.getElementById('shopGrid');
const shopTabs = document.getElementById('shopTabs');
const shopStatus = document.getElementById('shopStatus');
const shopCount = document.getElementById('shopCount');
const refreshShop = document.getElementById('refreshShop');

const RATE_PER_100 = 9.5;
const API_URL = 'https://fortnite-api.com/v2/shop?language=es-419';
const ENDPOINTS = [
  { name: 'Fortnite-API directo', url: API_URL },
  { name: 'Fortnite-API ES', url: 'https://fortnite-api.com/v2/shop?language=es' },
  { name: 'Proxy AllOrigins', url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent(API_URL) },
  { name: 'Proxy Corsproxy', url: 'https://corsproxy.io/?' + encodeURIComponent(API_URL) }
];

let allEntries = [];
let selectedSection = 'Todas';

function mxnFromVbucks(vbucks){
  const price = Number(vbucks || 0) * (RATE_PER_100 / 100);
  return price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
}

function cleanText(text){
  return String(text || '').replace(/[<>]/g, '').trim();
}

function allGrantedItems(entry){
  return [
    ...(Array.isArray(entry?.granted) ? entry.granted : []),
    ...(Array.isArray(entry?.items) ? entry.items : []),
    ...(Array.isArray(entry?.brItems) ? entry.brItems : []),
    ...(Array.isArray(entry?.tracks) ? entry.tracks : []),
    ...(Array.isArray(entry?.instruments) ? entry.instruments : []),
    ...(Array.isArray(entry?.cars) ? entry.cars : []),
    ...(Array.isArray(entry?.legoKits) ? entry.legoKits : []),
    ...(Array.isArray(entry?.fallbackItems) ? entry.fallbackItems : [])
  ].filter(Boolean);
}

function getSection(entry){
  return cleanText(entry?.section?.name || entry?.section?.displayName || entry?.section?.id || entry?.layout?.name || entry?.layout?.id || 'Destacados');
}

function getName(entry){
  const items = allGrantedItems(entry);
  const names = [];
  if(entry?.displayName) names.push(entry.displayName);
  if(entry?.bundle?.name) names.push(entry.bundle.name);
  if(entry?.newDisplayAsset?.renderImages?.[0]?.productName) names.push(entry.newDisplayAsset.renderImages[0].productName);
  items.forEach(item => item?.name && names.push(item.name));
  if(entry?.devName){
    const dev = entry.devName.replace(/\[VIRTUAL\].*?x\s*/i,'').split(' for ')[0].split(' x ').pop();
    if(dev) names.push(dev);
  }
  return cleanText(names[0] || 'Cosmético Fortnite');
}

function imageFromItem(item){
  return item?.images?.featured || item?.images?.icon || item?.images?.smallIcon || item?.images?.large || item?.albumArt || item?.image || '';
}

function getImage(entry){
  const items = allGrantedItems(entry);
  const materialImages = entry?.newDisplayAsset?.materialInstances?.flatMap(mi => Object.values(mi?.images || {})) || [];
  const candidates = [
    ...materialImages,
    entry?.newDisplayAsset?.renderImages?.[0]?.image,
    entry?.displayAssets?.[0]?.url,
    entry?.displayAssets?.[0]?.background,
    entry?.bundle?.image,
    ...items.map(imageFromItem)
  ];
  return candidates.find(Boolean) || '';
}

function getRarity(entry){
  const item = allGrantedItems(entry)[0];
  const rarity = item?.rarity?.displayValue || item?.series?.value || item?.rarity?.value || entry?.layout?.name || 'Objeto';
  return cleanText(rarity);
}

function getPrice(entry){
  return Number(entry?.finalPrice ?? entry?.regularPrice ?? entry?.price?.finalPrice ?? entry?.price?.regularPrice ?? entry?.price ?? 0);
}

function isWide(entry){
  const n = getName(entry).toLowerCase();
  const grants = allGrantedItems(entry).length;
  return grants >= 3 || n.includes('lote') || n.includes('paquete') || n.includes('bundle');
}

function extractEntries(json){
  const data = json?.data || json || {};
  const arrays = [];
  const pushArray = (arr) => { if(Array.isArray(arr)) arrays.push(arr); };

  pushArray(data.entries);
  pushArray(data.shopEntries);
  pushArray(data.catalogEntries);
  pushArray(data.featured?.entries);
  pushArray(data.daily?.entries);
  pushArray(data.specialFeatured?.entries);
  pushArray(data.specialDaily?.entries);

  Object.values(data || {}).forEach(value => {
    if(Array.isArray(value)) pushArray(value);
    if(value && typeof value === 'object'){
      pushArray(value.entries);
      pushArray(value.shopEntries);
      pushArray(value.catalogEntries);
    }
  });

  const entries = arrays.flat().filter(Boolean);
  const seen = new Set();
  return entries.filter(entry => {
    const vbucks = getPrice(entry);
    const key = entry?.offerId || entry?.devName || `${getName(entry)}-${vbucks}`;
    if(!key || seen.has(key)) return false;
    seen.add(key);
    return vbucks > 0;
  });
}

function buildTabs(){
  const sections = ['Todas', ...new Set(allEntries.map(getSection).filter(Boolean))].slice(0, 30);
  shopTabs.innerHTML = sections.map(section => `<button class="shop-tab ${section === selectedSection ? 'active' : ''}" data-section="${section}">${section}</button>`).join('');
  shopTabs.querySelectorAll('.shop-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSection = btn.dataset.section;
      buildTabs();
      renderShop();
    });
  });
}

function renderShop(){
  if(!shopGrid) return;
  const filtered = selectedSection === 'Todas' ? allEntries : allEntries.filter(e => getSection(e) === selectedSection);
  shopCount.textContent = `${filtered.length} artículos`;
  if(!filtered.length){
    shopGrid.innerHTML = '<div class="empty-shop"><div><h3>No hay artículos en esta sección</h3><p>Prueba con otra sección o actualiza la tienda.</p></div></div>';
    return;
  }
  shopGrid.innerHTML = filtered.map((entry, index) => {
    const name = getName(entry);
    const img = getImage(entry);
    const vbucks = getPrice(entry);
    const rarity = getRarity(entry);
    const featured = index === 0 || isWide(entry);
    return `
      <article class="shop-item ${featured ? 'featured' : ''}">
        <span class="shop-rarity">${rarity}</span>
        <div class="shop-img-wrap">${img ? `<img src="${img}" alt="${name}" loading="lazy">` : ''}</div>
        <div class="shop-info">
          <h3>${name}</h3>
          <div class="shop-prices">
            <span class="mxn-price">${mxnFromVbucks(vbucks)}</span>
            <span class="vbuck-price">${Number(vbucks).toLocaleString('es-MX')} pavos</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

async function fetchJson(url, timeoutMs = 15000){
  const separator = url.includes('?') ? '&' : '?';
  const finalUrl = `${url}${separator}_=${Date.now()}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try{
    const res = await fetch(finalUrl, { cache: 'no-store', signal: controller.signal, headers: { 'Accept': 'application/json' } });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { throw new Error('La respuesta no fue JSON válido'); }
  } finally { clearTimeout(timer); }
}

async function loadShop(){
  if(!shopGrid || !shopStatus) return;
  shopStatus.textContent = 'Cargando tienda en vivo...';
  shopCount.textContent = '';
  shopTabs.innerHTML = '';
  shopGrid.innerHTML = '<div class="empty-shop"><div><h3>Cargando artículos...</h3><p>Espera un momento.</p></div></div>';

  const errors = [];
  for(const endpoint of ENDPOINTS){
    try{
      shopStatus.textContent = `Cargando tienda en vivo... (${endpoint.name})`;
      const json = await fetchJson(endpoint.url);
      const entries = extractEntries(json);
      if(!entries.length) throw new Error('La API respondió sin artículos de tienda');
      allEntries = entries.slice(0, 180);
      selectedSection = 'Todas';
      buildTabs();
      renderShop();
      const dateText = json?.data?.date || json?.data?.lastUpdate?.date || json?.data?.lastUpdate || null;
      const updated = dateText ? new Date(dateText).toLocaleString('es-MX') : 'hoy';
      shopStatus.textContent = `Tienda actualizada: ${updated}`;
      return;
    } catch(error){
      errors.push(`${endpoint.name}: ${error.message}`);
    }
  }

  shopStatus.textContent = 'No se pudo cargar la tienda en vivo.';
  shopCount.textContent = '';
  shopTabs.innerHTML = '';
  shopGrid.innerHTML = `
    <div class="empty-shop">
      <div>
        <h3>Tienda no disponible</h3>
        <p>La API externa no cargó desde este navegador.</p>
        <p><strong>Prueba esto:</strong> desactiva Brave Shields para esta página, abre la web en Chrome/Edge o presiona Ctrl + F5.</p>
        <small style="opacity:.72">Detalle: ${errors.map(cleanText).join(' | ')}</small>
      </div>
    </div>`;
}

refreshShop?.addEventListener('click', loadShop);
loadShop();
