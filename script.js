/* ----------  ELEMENTOS  ---------- */
const coche = document.querySelector('.coche');
const hero  = document.querySelector('.hero');
const body  = document.body;

let scrollBloqueado = false;
let forzandoSubida = false;

/* ----------  1.  MOVIMIENTO PEGADO AL SCROLL (NORMAL)  ---------- */
function updateCoche() {
  if (forzandoSubida) return;               // mientras forzamos, no movemos
  const heroRect = hero.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, 1 - heroRect.bottom / window.innerHeight));
  const travel   = window.innerHeight + coche.offsetHeight;
 const offset = 30; // % que queremos que asome por abajo
 coche.style.transform = `translateX(-50%) translateY(calc(${offset}% - ${progress * travel}px))`;
}

/* ----------  2.  BLOQUEAR / LIBERAR  ---------- */
function bloquear()  { body.style.overflow = 'hidden';  scrollBloqueado = true;  }
function liberar()   { body.style.overflow = '';        scrollBloqueado = false; }

/* ----------  3.  FORZAR SUBIDA FINAL  ---------- */
function forzarSubida() {
  forzandoSubida = true;
  coche.classList.add('hide');   // solo opacidad → transform sigue suave
}
/* ----------  4.  INTERSECTION OBSERVER  ---------- */
const io = new IntersectionObserver(
  ([e]) => {
    if (e.isIntersecting) {
      liberar();
      coche.classList.remove('hide');
    } else {
      // hero va a salir → bloqueamos y forzamos subida
      bloquear();
      forzarSubida();
    }
  },
  { threshold: 0.01 }
);
io.observe(hero);

/* ----------  5.  AL TERMINAR LA TRANSICIÓN  ---------- */
coche.addEventListener('transitionend', () => {
  if (forzandoSubida) {
    forzandoSubida = false;
    coche.classList.add('hide'); // opcional: desvanecer
    liberar();
  }
});

/* ----------  6.  CSS DINÁMICO (suavizado)  ---------- */
const style = document.createElement('style');
style.textContent = `
  .coche {
    /* suavizado MIENTRAS scrolleas */
    transition: transform 0.35s cubic-bezier(.25,.46,.45,.94);
  }
  .coche.hide {
    /* solo desvanecer, sin tocar transform */
    opacity: 0;
    transition: opacity 0.5s ease-out;
  }
`;
document.head.appendChild(style);

/* ----------  7.  SCROLL LISTENER  ---------- */
window.addEventListener('scroll', updateCoche);
updateCoche(); // primera pintada


/* ----------  ONDA DE FONDO AL PASAR EL COCHE  ---------- */
const ondaFondo = document.querySelector('.onda-fondo');
const centro    = window.innerHeight / 2;
let abajo       = true;

window.addEventListener('scroll', () => {
  const rect     = coche.getBoundingClientRect();
  const cruzando = rect.top < centro && rect.bottom > centro;

  if (cruzando && abajo) {          // cruza hacia arriba
    abajo = false;
    ondaFondo.classList.remove('activo');
    void ondaFondo.offsetWidth;     // fuerza reflujo
    ondaFondo.classList.add('activo');
  } else if (!cruzando && !abajo) {
    abajo = true;
  }
});

/* ----------  OCULTAR TEXTO CUANDO SALGA DEL HERO  ---------- */
const texto = document.querySelector('.hero-text');

const ioTexto = new IntersectionObserver(
  ([e]) => {
    texto.classList.toggle('hide', !e.isIntersecting); // fuera → hide
  },
  { threshold: 0.0 }
);
ioTexto.observe(hero);

const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

/* ----------- ANTES Y DESPUÉS DRAG (TOUCH + MOUSE) ----------- */
const comparador = document.querySelector('.comparador');
const despues    = document.getElementById('despues');
const barra      = document.getElementById('barra');

function mueveBarra(clientX) {
  const rect = comparador.getBoundingClientRect();
  let x = clientX - rect.left;
  x = Math.max(0, Math.min(x, rect.width));
  const porcentaje = (x / rect.width) * 100;

  /* recorta la imagen "después" y mueve la barra */
  despues.style.clipPath = `inset(0 ${100 - porcentaje}% 0 0)`;
  barra.style.left = porcentaje + '%';
}

let activo = false;

/* mouse */
barra.addEventListener('mousedown', () => activo = true);
window.addEventListener('mouseup', () => activo = false);
window.addEventListener('mousemove', (e) => activo && mueveBarra(e.clientX));

/* touch */
barra.addEventListener('touchstart', () => activo = true);
window.addEventListener('touchend', () => activo = false);
window.addEventListener('touchmove', (e) => {
  if (!activo) return;
  mueveBarra(e.touches[0].clientX);
});


/* ----------  GIRO 360° LIBRETA (sin solapar otras funciones) ---------- */
const objeto = document.getElementById('objeto360');

objeto.addEventListener('click', () => {
  objeto.style.animation = 'none';
  void objeto.offsetWidth;
  objeto.style.animation = 'gira360 1.8s ease forwards';
});

const styleLibreta = document.createElement('style');
styleLibreta.textContent = `
  @keyframes gira360 {
    to { transform: rotateY(360deg); }
  }
`;
document.head.appendChild(styleLibreta);
