/* =====================================================
   SOCIEDAD CIENTÍFICA – script.js
   TODO el contenido editable está en este bloque de DATOS.
   ===================================================== */

/** Proyectos realizados (carrusel orbital). Mínimo 3, recomendado 4 o más. */
const PROYECTOS_REALIZADOS = [
  { nombre: "Proyecto Aurora", imagen: "assets/proyectos/proyecto-01.jpg",
    corta: "Estación meteorológica casera con sensores de bajo costo.",
    larga: "Diseñamos y armamos una estación meteorológica que mide temperatura, humedad y presión, y muestra los datos en tiempo real.",
    objetivo: "Enseñar a recolectar y analizar datos ambientales de la comunidad.",
    info: "Equipo de 5 integrantes · 3 meses" },
  { nombre: "Proyecto Helio", imagen: "assets/proyectos/proyecto-02.jpg",
    corta: "Cargador solar portátil construido con materiales reciclados.",
    larga: "Prototipo de cargador alimentado por paneles solares, con carcasa impresa y baterías recuperadas.",
    objetivo: "Promover el uso de energías limpias en la vida diaria.",
    info: "Presentado en la feria de ciencias" },
  { nombre: "Proyecto Nodo", imagen: "assets/proyectos/proyecto-03.jpg",
    corta: "Brazo robótico controlado desde el celular.",
    larga: "Brazo de cuatro grados de libertad controlado por Bluetooth, pensado para introducir la robótica a los más jóvenes.",
    objetivo: "Acercar la programación y la electrónica de forma práctica.",
    info: "Incluye taller abierto" },
  { nombre: "Proyecto Cuántica", imagen: "assets/proyectos/proyecto-04.jpg",
    corta: "Serie de experimentos de física explicados paso a paso.",
    larga: "Colección de experimentos sencillos sobre luz, magnetismo y movimiento, documentados en video y guías.",
    objetivo: "Divulgar la ciencia de forma entretenida y accesible.",
    info: "Material disponible para descargar" }
];

/** Proyectos futuros (tarjetas laterales). */
const PROYECTOS_FUTUROS = [
  { nombre: "Proyecto Horizonte", imagen: "assets/proyectos/futuro-01.jpg", fecha: "15 / 03 / 2027" },
  { nombre: "Proyecto Nébula",    imagen: "assets/proyectos/futuro-02.jpg", fecha: "20 / 06 / 2027" }
];

/** Proyecto en progreso (tarjeta central). Cambia "porcentaje" para actualizar el avance. */
const PROYECTO_EN_PROGRESO = {
  nombre: "Proyecto Quantum", imagen: "assets/proyectos/progreso-01.jpg",
  porcentaje: 65,
  descripcion: "Estamos construyendo un laboratorio móvil para llevar experimentos a otras comunidades."
};

/* ===================== UTILIDADES ===================== */
const $ = (s, c = document) => c.querySelector(s);
const esc = t => String(t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const bg = url => `background-image:url('${esc(url)}')`;

/* ===================== NAVEGACIÓN ===================== */
const navToggle = $("#navToggle"), navMenu = $("#navMenu");
navToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
navMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}));

/* ===================== HERO: REPETICIONES DELINEADAS ===================== */
const echoes = $("#echoes");
for (let i = 1; i <= 6; i++) {
  const s = document.createElement("span");
  s.textContent = "PROYECTOS";
  s.style.setProperty("--i", i);
  echoes.appendChild(s);
}

/* ===================== CARRUSEL ORBITAL ===================== */
const stage = $("#stage");
const N = PROYECTOS_REALIZADOS.length;
let current = 0;

stage.innerHTML = PROYECTOS_REALIZADOS.map((p, i) => `
  <article class="orbit__card" data-i="${i}">
    <div class="orbit__media" style="${bg(p.imagen)}">
      <div class="orbit__panel" aria-live="polite">
        <strong>Proyecto</strong><h4>${esc(p.nombre)}</h4>
        <span>${esc(p.larga)}</span>
        <strong>Objetivo</strong><span>${esc(p.objetivo)}</span>
        <strong>Más info</strong><span>${esc(p.info)}</span>
      </div>
    </div>
    <h3>${esc(p.nombre)}</h3>
    <p>${esc(p.corta)}</p>
  </article>`).join("");

const orbitCards = [...stage.querySelectorAll(".orbit__card")];

/** Posiciona cada tarjeta según su distancia al proyecto central. */
function renderOrbit() {
  orbitCards.forEach((card, i) => {
    let o = ((i - current) % N + N) % N;
    if (o > N / 2) o -= N;                     // rango circular: ..., -1, 0, 1, ...
    const prev = card._o;
    if (prev !== undefined && Math.abs(o - prev) > 2) {
      // La tarjeta "da la vuelta" por detrás: salta sin recorrer el centro
      card.style.transition = "opacity .8s, filter .8s";
      card.style.setProperty("--o", o);
      void card.offsetWidth;
      card.style.transition = "";
    }
    card._o = o;
    card.style.setProperty("--o", o);
    card.style.setProperty("--a", Math.min(Math.abs(o), 2));
    card.dataset.hide = Math.abs(o) > 1 ? "1" : "0";
    card.classList.toggle("is-center", o === 0);
    if (o !== 0) card.classList.remove("open");
    card.setAttribute("aria-hidden", Math.abs(o) > 1);
  });
}
const go = d => { current = ((current + d) % N + N) % N; renderOrbit(); };

$("#prev").addEventListener("click", () => go(-1));
$("#next").addEventListener("click", () => go(1));
stage.addEventListener("click", e => {
  const card = e.target.closest(".orbit__card");
  if (!card) return;
  if (card.classList.contains("is-center")) card.classList.toggle("open"); // toque en móviles
  else if (card.dataset.hide === "0") go(card._o);                          // centrar lateral
});
$("#orbit").tabIndex = 0;
$("#orbit").addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") go(-1);
  if (e.key === "ArrowRight") go(1);
});
// Deslizar con el dedo
let x0 = null;
stage.addEventListener("pointerdown", e => { x0 = e.clientX; });
stage.addEventListener("pointerup", e => {
  if (x0 !== null && Math.abs(e.clientX - x0) > 50) go(e.clientX < x0 ? 1 : -1);
  x0 = null;
});
renderOrbit();

/* ===================== PROYECTOS FUTUROS Y EN PROGRESO ===================== */
const f = PROYECTOS_FUTUROS, pr = PROYECTO_EN_PROGRESO;
const futuro = p => `
  <article class="card" style="${bg(p.imagen)}">
    <h3 class="card__name">${esc(p.nombre)}</h3>
    <span class="card__tag">Fecha: ${esc(p.fecha)}</span>
  </article>`;
$("#cards").innerHTML = futuro(f[0]) + `
  <article class="card card--main" style="${bg(pr.imagen)}" tabindex="0" role="button" aria-label="Ver avance de ${esc(pr.nombre)}">
    <span class="card__label">EN PROGRESO</span>
    <h3 class="card__name">${esc(pr.nombre)}</h3>
    <span class="card__tag">Avance: ${Number(pr.porcentaje)}%</span>
    <div class="card__over">
      <span class="card__big">${Number(pr.porcentaje)}%</span>
      <p>${esc(pr.descripcion)}</p>
    </div>
  </article>` + futuro(f[1]);

const main = $(".card--main");
main.addEventListener("click", () => main.classList.toggle("open"));
main.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); main.classList.toggle("open"); }
});

/* ===================== APARICIÓN AL HACER SCROLL ===================== */
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: .15 });
document.querySelectorAll(".reveal, .card").forEach((el, i) => {
  el.style.transitionDelay = el.classList.contains("card") ? `${(i % 3) * .12}s` : "0s";
  io.observe(el);
});
