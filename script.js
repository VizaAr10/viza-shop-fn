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
const SHOP_ENDPOINTS = [
  'https://fortnite-api.com/v2/shop?language=es-419',
  'https://fortnite-api.com/v2/shop?language=es',
  'https://fortnite-api.com/v2/shop'
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
    ...(Array.isArray(entry?.instruments) ? entry.instruments : []),
    ...(Array.isArray(entry?.tracks) ? entry.tracks : []),
    ...(Array.isArray(entry?.cars) ? entry.cars : []),
    ...(Array.isArray(entry?.legoKits) ? entry.legoKits : [])
  ].filter(Boolean);
}

function getSection(entry){
  return cleanText(entry?.section?.name || entry?.section?.id || entry?.layout?.name || entry?.layout?.id || 'Destacados');
}

function getName(entry){
  const items = allGrantedItems(entry);
  const names = [];
  if(entry?.displayName) names.push(entry.displayName);
  if(entry?.bundle?.name) names.push(entry.bundle.name);
  items.forEach(item => item?.name && names.push(item.name));
  if(entry?.devName){
    const dev = entry.devName.split(' for ')[0].split(' x ').pop();
    if(dev) names.push(dev);
  }
  return cleanText(names[0] || 'Cosmético Fortnite');
}

function imageFromItem(item){
  return item?.images?.featured || item?.images?.icon || item?.images?.smallIcon || item?.images?.large || item?.albumArt || item?.image || '';
}

function getImage(entry){
  const items = allGrantedItems(entry);
  const candidates = [
    entry?.newDisplayAsset?.materialInstances?.[0]?.images?.Background,
    entry?.newDisplayAsset?.materialInstances?.[0]?.images?.OfferImage,
    entry?.newDisplayAsset?.materialInstances?.[0]?.images?.ProductImage,
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
  const possibleArrays = [
    data?.entries,
    data?.shopEntries,
    data?.catalogEntries,
    data?.featured?.entries,
    data?.daily?.entries,
    data?.specialFeatured?.entries,
    data?.specialDaily?.entries
  ];

  let entries = [];
  possibleArrays.forEach(arr => {
    if(Array.isArray(arr)) entries.push(...arr);
  });

  // Fallback por si la API cambia el nombre de alguna sección.
  Object.values(data || {}).forEach(value => {
    if(value && typeof value === 'object' && Array.isArray(value.entries)) {
      entries.push(...value.entries);
    }
  });

  const seen = new Set();
  return entries.filter(entry => {
    const key = entry?.offerId || entry?.devName || `${getName(entry)}-${getPrice(entry)}`;
    if(!key || seen.has(key)) return false;
    seen.add(key);
    return getPrice(entry) > 0;
  });
}

function buildTabs(){
  const sections = ['Todas', ...new Set(allEntries.map(getSection).filter(Boolean))];
  shopTabs.innerHTML = sections.map(section => `
    <button class="shop-tab ${section === selectedSection ? 'active' : ''}" data-section="${section}">${section}</button>
  `).join('');
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
    shopGrid.innerHTML = '<div class="empty-shop"><h3>No hay artículos en esta sección</h3><p>Prueba con otra sección o actualiza la tienda.</p></div>';
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

async function fetchJsonWithTimeout(url, timeoutMs = 12000){
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try{
    const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if(!res.ok) throw new Error(`Respuesta ${res.status}`);
    return await res.json();
  }finally{
    clearTimeout(timer);
  }
}

async function loadShop(){
  if(!shopGrid || !shopStatus) return;
  shopStatus.textContent = 'Cargando tienda en vivo...';
  shopCount.textContent = '';
  shopTabs.innerHTML = '';
  shopGrid.innerHTML = '<div class="empty-shop"><h3>Cargando artículos...</h3><p>Espera un momento.</p></div>';

  let lastError = null;
  for(const url of SHOP_ENDPOINTS){
    try{
      const json = await fetchJsonWithTimeout(url);
      const entries = extractEntries(json);
      if(!entries.length) throw new Error('La API respondió, pero no devolvió artículos');

      allEntries = entries.slice(0, 160);
      selectedSection = 'Todas';
      buildTabs();
      renderShop();

      const dateText = json?.data?.date || json?.data?.lastUpdate?.date || json?.data?.lastUpdate || null;
      const updated = dateText ? new Date(dateText).toLocaleString('es-MX') : 'hoy';
      shopStatus.textContent = `Tienda actualizada: ${updated}`;
      return;
    }catch(error){
      lastError = error;
    }
  }

  shopStatus.textContent = 'No se pudo cargar la tienda en vivo.';
  shopCount.textContent = '';
  shopTabs.innerHTML = '';
  shopGrid.innerHTML = `
    <div class="empty-shop">
      <h3>Tienda no disponible</h3>
      <p>La API externa no respondió o bloqueó la carga. Intenta actualizar más tarde.</p>
      <small style="opacity:.65">Detalle técnico: ${cleanText(lastError?.message || 'error desconocido')}</small>
    </div>`;
}

refreshShop?.addEventListener('click', loadShop);
loadShop();
