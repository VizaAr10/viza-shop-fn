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
let allEntries = [];
let selectedSection = 'Todas';

function mxnFromVbucks(vbucks){
  const price = Number(vbucks || 0) * (RATE_PER_100 / 100);
  return price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
}

function cleanText(text){
  return String(text || '').replace(/[<>]/g, '').trim();
}

function getSection(entry){
  return cleanText(entry?.section?.name || entry?.section?.id || entry?.layout?.name || 'Destacados');
}

function getName(entry){
  const names = [];
  if(entry?.displayName) names.push(entry.displayName);
  if(entry?.bundle?.name) names.push(entry.bundle.name);
  if(Array.isArray(entry?.granted)) entry.granted.forEach(g => g?.name && names.push(g.name));
  if(entry?.devName){
    const dev = entry.devName.split(' for ')[0].split(' x ').pop();
    if(dev) names.push(dev);
  }
  return cleanText(names[0] || 'Cosmético Fortnite');
}

function getImage(entry){
  const candidates = [
    entry?.newDisplayAsset?.materialInstances?.[0]?.images?.Background,
    entry?.newDisplayAsset?.materialInstances?.[0]?.images?.OfferImage,
    entry?.displayAssets?.[0]?.url,
    entry?.bundle?.image,
    entry?.granted?.[0]?.images?.featured,
    entry?.granted?.[0]?.images?.icon
  ];
  return candidates.find(Boolean) || '';
}

function getRarity(entry){
  const rarity = entry?.granted?.[0]?.rarity?.displayValue || entry?.granted?.[0]?.series?.value || entry?.layout?.name || 'Objeto';
  return cleanText(rarity);
}

function getPrice(entry){
  return Number(entry?.finalPrice ?? entry?.regularPrice ?? entry?.price?.finalPrice ?? 0);
}

function isWide(entry){
  const n = getName(entry).toLowerCase();
  const grants = Array.isArray(entry?.granted) ? entry.granted.length : 0;
  return grants >= 3 || n.includes('lote') || n.includes('paquete') || n.includes('bundle');
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
            <span class="vbuck-price">${vbucks.toLocaleString('es-MX')} pavos</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

async function loadShop(){
  if(!shopGrid || !shopStatus) return;
  shopStatus.textContent = 'Cargando tienda en vivo...';
  shopCount.textContent = '';
  shopGrid.innerHTML = '<div class="empty-shop"><h3>Cargando artículos...</h3><p>Espera un momento.</p></div>';
  try{
    const res = await fetch('https://fortnite-api.com/v2/shop/br?language=es-419', { cache: 'no-store' });
    if(!res.ok) throw new Error('No se pudo conectar con la API');
    const json = await res.json();
    const entries = json?.data?.entries || [
      ...(json?.data?.featured?.entries || []),
      ...(json?.data?.daily?.entries || [])
    ];
    allEntries = entries.filter(e => getPrice(e) > 0).slice(0, 120);
    selectedSection = 'Todas';
    if(!allEntries.length) throw new Error('Sin artículos disponibles');
    buildTabs();
    renderShop();
    const updated = json?.data?.date ? new Date(json.data.date).toLocaleString('es-MX') : 'ahora';
    shopStatus.textContent = `Tienda actualizada: ${updated}`;
  }catch(error){
    shopStatus.textContent = 'No se pudo cargar la tienda en vivo.';
    shopCount.textContent = '';
    shopTabs.innerHTML = '';
    shopGrid.innerHTML = '<div class="empty-shop"><h3>Tienda no disponible</h3><p>La API externa no respondió. Intenta actualizar más tarde.</p></div>';
  }
}

refreshShop?.addEventListener('click', loadShop);
loadShop();
