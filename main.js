/* Рендер страницы из window.SITE (config.js). Править обычно не нужно. */
(function () {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const has = (a) => Array.isArray(a) && a.length > 0;
  const img = (src, alt = "") => `<div class="ph">${src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : ""}</div>`;
  const head = (o) => `<div class="section-head">${o.eyebrow ? `<div class="eyebrow">${esc(o.eyebrow)}</div>` : ""}<h2>${esc(o.title)}</h2></div>`;
  const section = (id, cls, inner) => `<section class="section ${cls}" id="${id}"><div class="container reveal">${inner}</div></section>`;

  /* --- Тема и SEO --- */
  const t = S.theme, root = document.documentElement.style;
  root.setProperty("--accent", t.accent);
  root.setProperty("--accent-dark", t.accentDark);
  root.setProperty("--dark", t.dark);
  root.setProperty("--light", t.light);
  root.setProperty("--text", t.text);
  root.setProperty("--heading", t.headingFont);
  root.setProperty("--body", t.bodyFont);
  root.setProperty("--radius", t.radius);
  document.documentElement.lang = S.lang || "ru";
  document.title = S.seo.title;
  $('meta[name="description"]').content = S.seo.description;
  if (t.fontsUrl) $('link[href="styles.css"]').insertAdjacentHTML("beforebegin", `<link rel="stylesheet" href="${esc(t.fontsUrl)}">`);
  const meta = (p, c) => c && document.head.insertAdjacentHTML("beforeend", `<meta property="${p}" content="${esc(c)}">`);
  meta("og:title", S.seo.title); meta("og:description", S.seo.description); meta("og:image", S.seo.ogImage);

  /* --- Шапка --- */
  $("#header").innerHTML = `<div class="container bar">
    <a class="logo" href="#top">${S.brand.logoImg ? `<img src="${esc(S.brand.logoImg)}" alt="${esc(S.brand.name)}">` : esc(S.brand.logoText || S.brand.name)}</a>
    <nav class="nav" id="nav">${(S.nav || []).map((n) => `<a href="${esc(n.href)}">${esc(n.label)}</a>`).join("")}
      <a class="btn sm" href="${esc(S.cta.href)}">${esc(S.cta.label)}</a></nav>
    <button class="burger" id="burger" aria-label="Меню" aria-expanded="false"><span></span><span></span><span></span></button></div>`;

  /* --- Секции --- */
  const h = S.hero, b = S.booking, a = S.about, parts = [];

  parts.push(`<section class="hero" id="top"><div class="bg ph">${h.video ? `<video src="${esc(h.video)}" autoplay muted loop playsinline></video>` : h.image ? `<img src="${esc(h.image)}" alt="">` : ""}</div>
    <div class="container"><div class="content"><h1>${esc(h.title)}</h1><p>${esc(h.subtitle)}</p>
    <div class="actions">${h.primary ? `<a class="btn" href="${esc(h.primary.href)}">${esc(h.primary.label)}</a>` : ""}${h.secondary ? `<a class="btn ghost" href="${esc(h.secondary.href)}">${esc(h.secondary.label)}</a>` : ""}</div></div></div></section>`);

  const today = new Date().toISOString().slice(0, 10);
  parts.push(`<div class="booking" id="booking"><div class="container"><form action="${esc(b.action || "#contacts")}" method="${esc(b.method || "GET")}" id="bookform">
    <div class="field"><label for="d1">Заезд</label><input type="date" id="d1" name="checkin" min="${today}" required></div>
    <div class="field"><label for="d2">Выезд</label><input type="date" id="d2" name="checkout" min="${today}" required></div>
    <div class="field"><label for="g">Гостей</label><select id="g" name="guests">${Array.from({ length: b.guestsMax || 6 }, (_, i) => `<option>${i + 1}</option>`).join("")}</select></div>
    <button class="btn" type="submit">Найти номера</button>${b.note ? `<p class="note">✓ ${esc(b.note)}</p>` : ""}</form></div></div>`);

  if (has(S.stats)) parts.push(`<div class="container reveal"><div class="stats">${S.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}</div></div>`);

  if (a) parts.push(section("about", "", `<div class="about${a.image ? "" : " solo"}"><div><div class="eyebrow">${esc(a.eyebrow)}</div><h2>${esc(a.title)}</h2>${(a.text || []).map((p) => `<p>${esc(p)}</p>`).join("")}
    ${has(a.highlights) ? `<div class="highlights">${a.highlights.map((x) => `<div class="hl">${x.image ? img(x.image, x.title) : ""}<h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`).join("")}</div>` : ""}</div>${a.image ? img(a.image, a.title) : ""}</div>`));

  if (S.rooms && has(S.rooms.items)) parts.push(section("rooms", "alt", head(S.rooms) + `<div class="grid c4">${S.rooms.items.map((r) => `<article class="card">${img(r.image, r.name)}<div class="body"><h3>${esc(r.name)}</h3>
    ${has(r.meta) ? `<ul class="meta">${r.meta.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>` : ""}<p>${esc(r.text)}</p>
    <div class="foot"><span class="price">${esc(r.price)}</span><a class="btn sm" href="${esc(r.href || "#booking")}">Выбрать</a></div></div></article>`).join("")}</div>`));

  if (S.activities && has(S.activities.items)) parts.push(section("activities", "", head(S.activities) + `<div class="acts">${S.activities.items.map((x) => `<article class="act ph">${x.image ? `<img src="${esc(x.image)}" alt="${esc(x.title)}" loading="lazy">` : ""}<div class="act-body"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div></article>`).join("")}</div>`));

  if (S.gallery && has(S.gallery.images)) parts.push(section("gallery", "alt", head(S.gallery) + `<div class="gallery">${S.gallery.images.map((s, i) => img(s, `${S.brand.name} ${i + 1}`)).join("")}</div>`));

  if (S.offers && has(S.offers.items)) parts.push(section("offers", "dark", head(S.offers) + `<div class="grid c3">${S.offers.items.map((o) => `<div class="offer"><span class="badge">${esc(o.badge)}</span><h3>${esc(o.title)}</h3><p>${esc(o.text)}</p><a class="btn sm" href="${esc(o.href || "#booking")}">Подробнее</a></div>`).join("")}</div>`));

  if (S.reviews && has(S.reviews.items)) parts.push(section("reviews", "", head(S.reviews) + `<div class="grid c3">${S.reviews.items.map((r) => `<figure class="review" style="margin:0"><div class="stars" aria-label="${r.rating} из 5">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div><p>${esc(r.text)}</p><p class="who">${esc(r.name)}</p><span class="src">${esc(r.source)}</span></figure>`).join("")}</div>`));

  if (S.location) {
    const l = S.location, d = 0.012 * Math.pow(2, 15 - (l.zoom || 15));
    const hasPin = typeof l.lat === "number" && typeof l.lon === "number";
    const map = l.mapEmbed || (hasPin ? `https://www.openstreetmap.org/export/embed.html?bbox=${l.lon - d * 1.6},${l.lat - d},${l.lon + d * 1.6},${l.lat + d}&layer=mapnik&marker=${l.lat},${l.lon}` : "");
    const links = hasPin ? `<a class="btn sm" target="_blank" rel="noopener" href="https://yandex.ru/maps/?pt=${l.lon},${l.lat}&z=${l.zoom || 15}&l=map">Яндекс Карты</a>
      <a class="btn sm ghost-dark" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${l.lat},${l.lon}">Google Maps</a>` : "";
    parts.push(section("location", "alt", head(l) + `<div class="loc"><div class="loc-info">
      ${l.text ? `<p class="lead">${esc(l.text)}</p>` : ""}
      ${links ? `<div class="maplinks">${links}</div>` : ""}</div>
      <div class="map ph">${map ? `<iframe src="${esc(map)}" loading="lazy" title="Карта проезда"></iframe>` : ""}</div></div>`));
  }

  if (S.faq && has(S.faq.items)) parts.push(section("faq", "", head(S.faq) + `<div class="faq">${S.faq.items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>`));

  const c = S.contacts;
  parts.push(section("contacts", "dark", `<div class="contacts"><div class="cinfo"><h2>${esc(c.title)}</h2><p>${esc(c.text)}</p>
    <p class="big"><a href="tel:${esc(c.phone.replace(/[^+\d]/g, ""))}">${esc(c.phone)}</a></p>
    <p><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p><p>${esc(c.address)}</p><p>${esc(c.hours)}</p>
    ${has(c.socials) ? `<div class="socials">${c.socials.map((s) => `<a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}</div>` : ""}</div>
    <form class="cform" id="cform" ${c.formAction ? `action="${esc(c.formAction)}" method="POST"` : ""}>
      <div class="field"><label for="n">Имя</label><input id="n" name="name" required autocomplete="name"></div>
      <div class="field"><label for="p">Телефон</label><input id="p" name="phone" type="tel" required autocomplete="tel"></div>
      <div class="field"><label for="m">Сообщение</label><textarea id="m" name="message" rows="3"></textarea></div>
      <button class="btn" type="submit">Отправить заявку</button><p class="ok" id="ok">Спасибо! Мы свяжемся с вами.</p></form></div>`));

  $("#app").innerHTML = parts.join("");

  /* --- Футер --- */
  const f = S.footer;
  $("#footer").innerHTML = `<div class="container row"><span>${esc(f.legal)}</span><span>${(f.links || []).map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join("")}</span></div>`;

  /* --- Поведение --- */
  const header = $("#header"), nav = $("#nav"), burger = $("#burger");
  const onScroll = () => header.classList.toggle("solid", window.scrollY > 40);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

  // Выезд не раньше заезда
  const d1 = $("#d1"), d2 = $("#d2");
  d1.addEventListener("change", () => { d2.min = d1.value; if (d2.value && d2.value < d1.value) d2.value = d1.value; });

  // Если движок бронирования не подключён — переносим даты в сообщение формы контактов
  $("#bookform").addEventListener("submit", (e) => {
    if (b.action) return;
    e.preventDefault();
    $("#m").value = `Заезд: ${d1.value}, выезд: ${d2.value}, гостей: ${$("#g").value}`;
    $("#contacts").scrollIntoView({ behavior: "smooth" });
    $("#n").focus({ preventScroll: true });
  });

  // Форма заявки: без formAction открываем почтовый клиент
  $("#cform").addEventListener("submit", (e) => {
    if (c.formAction) return;
    e.preventDefault();
    const body = `Имя: ${$("#n").value}\nТелефон: ${$("#p").value}\n\n${$("#m").value}`;
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent("Заявка с сайта")}&body=${encodeURIComponent(body)}`;
    $("#ok").style.display = "block";
  });

  // Анимация появления
  const io = "IntersectionObserver" in window ? new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.1 }) : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
})();
