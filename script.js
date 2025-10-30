/*
  JS para interacción básica
  - Inicializa Swiper
  - Maneja carrito visual simple
  - Mejoras: búsqueda simulada y formulario
*/

// Swiper sliders
const hero = new Swiper('.mySwiper-1', {
  loop: true,
  autoplay: { delay: 4000, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  effect: 'slide',
  speed: 650,
});

const carousels = document.querySelectorAll('.mySwiper-2');
carousels.forEach((el) => {
  new Swiper(el, {
    slidesPerView: 1.2,
    spaceBetween: 16,
    breakpoints: {
      520: { slidesPerView: 2 },
      900: { slidesPerView: 3 },
    },
    navigation: { nextEl: el.querySelector('.swiper-button-next'), prevEl: el.querySelector('.swiper-button-prev') },
  });
});

// Carrito simple
const cartBtn = document.querySelector('.cart-toggle');
const cart = document.querySelector('.cart');
const cartClose = document.querySelector('.cart-close');
const cartItemsEl = document.querySelector('.cart-items');
const cartTotalEl = document.querySelector('.cart-total');
const cartCountEl = document.querySelector('.cart-count');

const cartState = { items: [] };

function format(n) { return Number(n).toFixed(2); }

function openCart() { cart.classList.add('open'); cart.setAttribute('aria-hidden', 'false'); }
function closeCart() { cart.classList.remove('open'); cart.setAttribute('aria-hidden', 'true'); }

cartBtn?.addEventListener('click', openCart);
cartClose?.addEventListener('click', closeCart);
cart.addEventListener('click', (e) => { if (e.target === cart) closeCart(); });

function renderCart() {
  cartItemsEl.innerHTML = '';
  let total = 0;
  cartState.items.forEach((it, idx) => {
    total += it.price * it.qty;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${it.img}" alt="${it.name}" />
      <div class="meta">
        <strong>${it.name}</strong>
        <div class="qty">
          <button aria-label="Quitar" data-action="dec" data-idx="${idx}">−</button>
          <span>${it.qty}</span>
          <button aria-label="Agregar" data-action="inc" data-idx="${idx}">+</button>
        </div>
      </div>
      <div>
        $${format(it.price * it.qty)}
        <button class="remove" data-action="remove" data-idx="${idx}">Quitar</button>
      </div>
    `;
    cartItemsEl.appendChild(li);
  });
  cartTotalEl.textContent = format(total);
  cartCountEl.textContent = cartState.items.reduce((a,b)=>a+b.qty,0);
}

function addToCart(item) {
  const found = cartState.items.find((it) => it.name === item.name);
  if (found) found.qty += 1; else cartState.items.push({ ...item, qty: 1 });
  renderCart();
}

cartItemsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  const action = btn.dataset.action;
  const it = cartState.items[idx];
  if (!it) return;
  if (action === 'inc') it.qty += 1;
  if (action === 'dec') it.qty = Math.max(1, it.qty - 1);
  if (action === 'remove') cartState.items.splice(idx, 1);
  renderCart();
});

// Botones agregar al carrito
const addBtns = document.querySelectorAll('.add-to-cart');
addBtns.forEach((btn) => btn.addEventListener('click', () => {
  const name = btn.dataset.name;
  const price = Number(btn.dataset.price || 0);
  const img = btn.dataset.img;
  addToCart({ name, price, img });
  openCart();
}));

// Búsqueda simulada
const searchForm = document.querySelector('.search');
searchForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = searchForm.querySelector('input')?.value.toLowerCase().trim();
  if (!q) return;
  // resaltar tarjetas que coincidan
  document.querySelectorAll('.product').forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.outline = text.includes(q) ? '2px solid var(--accent)' : 'none';
  });
});

// Formulario contacto (simulado)
const form = document.querySelector('.form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nombre = data.get('nombre');
  form.reset();
  alert(`Gracias ${nombre}, recibimos tu mensaje.`);
});

// Año dinámico footer
const yearEl = document.getElementById('year');
yearEl && (yearEl.textContent = new Date().getFullYear());
