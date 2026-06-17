<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Viza Shop FN | Cosméticos y regalos de Fortnite</title>
  <meta name="description" content="Viza Shop FN: cosméticos y regalos de Fortnite. Rápido, seguro, económico y confiable. Pedidos por WhatsApp, Instagram o Facebook." />
  <meta name="theme-color" content="#08090d" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6TaYfa1z5Vz7IGIhjT2T7kENQE0LlbwprWc9bB55wT0jCpg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="site-header">
    <nav class="nav" aria-label="Navegación principal">
      <a class="brand" href="#inicio" aria-label="Inicio Viza Shop FN">
        <img src="assets/logo.png" alt="Logo de Viza Shop FN" />
        <span>Viza Shop FN</span>
      </a>
      <button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false">
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="nav-links" id="navLinks">
        <a href="#inicio">Inicio</a>
        <a href="#precios">Precios</a>
        <a href="#tienda">Tienda en vivo</a>
        <a href="#como-comprar">Cómo comprar</a>
        <a href="#contacto">Contacto</a>
      </div>
    </nav>
  </header>

  <main class="page">
    <section class="hero" id="inicio">
      <div class="glow glow-blue"></div>
      <div class="glow glow-gold"></div>

      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Rápido · Seguro · Económico</p>
          <h1>Cosméticos y regalos de Fortnite</h1>
          <p class="subtitle">Compra tus cosméticos favoritos de forma fácil y confiable. Haz tu pedido por DM o WhatsApp.</p>
          <div class="cta-row">
            <a class="btn btn-primary" href="https://wa.me/527298723378?text=Hola%2C%20quiero%20cotizar%20un%20cosm%C3%A9tico%20de%20Fortnite" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Pedir por WhatsApp</a>
            <a class="btn btn-secondary" href="https://www.instagram.com/vizashopfn/" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Instagram</a>
          </div>
          <div class="trust-row" aria-label="Beneficios">
            <span><i class="fa-solid fa-shield-halved"></i> Seguro</span>
            <span><i class="fa-solid fa-bolt"></i> Rápido</span>
            <span><i class="fa-solid fa-dollar-sign"></i> Económico</span>
            <span><i class="fa-solid fa-headset"></i> Confiable</span>
          </div>
        </div>

        <div class="hero-card">
          <img src="assets/logo.png" alt="Emblema Viza Shop FN" />
          <h2>Viza Shop FN</h2>
          <p>ID de Epic</p>
          <strong>VizaAr10</strong>
        </div>
      </div>
    </section>

    <section class="section cards" aria-label="Beneficios principales">
      <article>
        <span class="icon"><i class="fa-solid fa-tags"></i></span>
        <h3>Precios accesibles</h3>
        <p>Precio base desde $9.50 MXN por cada 100 pavos.</p>
      </article>
      <article>
        <span class="icon"><i class="fa-solid fa-bolt"></i></span>
        <h3>Entrega rápida</h3>
        <p>Proceso claro para que recibas tus regalos sin complicaciones.</p>
      </article>
      <article>
        <span class="icon"><i class="fa-solid fa-shield-halved"></i></span>
        <h3>Compra segura</h3>
        <p>Te explico cada paso antes de realizar tu pedido.</p>
      </article>
      <article>
        <span class="icon"><i class="fa-solid fa-comments"></i></span>
        <h3>Atención directa</h3>
        <p>Contáctame por WhatsApp, Instagram o Facebook.</p>
      </article>
    </section>

    <section class="section split" id="precios">
      <div>
        <p class="eyebrow">Lista de precios</p>
        <h2>Pavos y precios</h2>
        <p class="muted">Todos los precios están en MXN. Precio base: <strong>$9.50 MXN por cada 100 pavos</strong>.</p>
      </div>
      <div class="price-box">
        <div class="price-head"><span>Pavos</span><span>Precio MXN</span></div>
        <div class="price-row"><span>500</span><strong>$47.50</strong></div>
        <div class="price-row"><span>800</span><strong>$76.00</strong></div>
        <div class="price-row"><span>1,200</span><strong>$114.00</strong></div>
        <div class="price-row"><span>1,500</span><strong>$142.50</strong></div>
        <div class="price-row"><span>2,500</span><strong>$237.50</strong></div>
        <div class="price-row"><span>3,000</span><strong>$285.00</strong></div>
        <div class="price-row"><span>3,500</span><strong>$332.50</strong></div>
      </div>
    </section>

    <section class="section shop-section" id="tienda">
      <div class="section-title">
        <p class="eyebrow center">Actualización diaria</p>
        <h2 class="center">Tienda de Fortnite en vivo</h2>
        <p class="muted center">Aquí se cargan cosméticos actuales de la tienda. El precio en MXN se calcula con tu precio base de $9.50 por cada 100 pavos.</p>
      </div>
      <div class="shop-status" id="shopStatus">Cargando tienda...</div>
      <div class="shop-grid" id="shopGrid" aria-live="polite"></div>
    </section>

    <section class="section" id="como-comprar">
      <p class="eyebrow center">Proceso sencillo</p>
      <h2 class="center">¿Cómo comprar?</h2>
      <div class="steps">
        <div class="step"><b>01</b><p>Mándame solicitud en Epic. ID: <strong>VizaAr10</strong></p></div>
        <div class="step"><b>02</b><p>Envíame DM con tu nombre de Epic.</p></div>
        <div class="step"><b>03</b><p>Espera a que acepte la solicitud y el tiempo requerido para enviar regalos.</p></div>
        <div class="step"><b>04</b><p>Dime qué cosméticos quieres.</p></div>
        <div class="step"><b>05</b><p>Paga y envíame captura de tu pago.</p></div>
        <div class="step"><b>06</b><p>Te envío tus regalos.</p></div>
      </div>
    </section>

    <section class="section contact" id="contacto">
      <div>
        <p class="eyebrow">Contacto</p>
        <h2>Haz tu pedido</h2>
        <p class="muted">Mándame mensaje y dime qué cosmético quieres cotizar.</p>
      </div>
      <div class="contact-buttons social-buttons">
        <a class="btn btn-whatsapp" href="https://wa.me/527298723378?text=Hola%2C%20quiero%20cotizar%20un%20cosm%C3%A9tico%20de%20Fortnite" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
        <a class="btn btn-instagram" href="https://www.instagram.com/vizashopfn/" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Instagram</a>
        <a class="btn btn-facebook" href="https://www.facebook.com/profile.php?id=61590679092110" target="_blank" rel="noopener"><i class="fa-brands fa-facebook-f"></i> Facebook</a>
      </div>
    </section>

    <footer>
      <p>© <span id="year"></span> Viza Shop FN. Todos los derechos reservados.</p>
      <p class="disclaimer">Viza Shop FN no está afiliado, respaldado ni patrocinado por Epic Games. La tienda en vivo usa datos de Fortnite-API.com, un servicio público de datos de Fortnite.</p>
    </footer>
  </main>

  <script src="script.js"></script>
</body>
</html>
