const ELECTRICAL_INSTALLATION = [
  { name: "Electrical Board Fitting / Repair (6 Module)", price: 50, unit: "Per Board" },
  { name: "Electrical Board Fitting (9-12 Module)", price: 120, unit: "Per Board" },
  { name: "Electrical Wiring In Concealed", price: 200, unit: "Per Point" },
  { name: "Electrical Wiring In Open", price: 60, unit: "Per Meter" },
  { name: "Fan Installation", price: 200, unit: "Per Fan" },
  { name: "Geaser Installation", price: 600, unit: "Per Geaser" },
  { name: "TV Installation", price: 499, unit: "Per TV" },
  { name: "Light Installation", price: 79, unit: "Per Light" },
  { name: "MCB Installation", price: 120, unit: "Per MCB" },
  { name: "Inverter Installation", price: 899, unit: "Per Inv" },
  { name: "Inverter Point", price: 100, unit: "Per Point" }
];

const VISIT_CHARGE = 300;
const WHATSAPP_NUMBER = "917011196579"; // without +/* FILE: script.js - A2z Power Solution

const PRODUCTS_KEY = 'az_products_demo_v1';
const DEFAULT_PRODUCTS = [
  {id:1,title:'Inverter 1000VA',specs:'1000VA, 12V battery, 1 year warranty',price:'₹6,000'},
  {id:2,title:'Diesel Generator 5kVA',specs:'Single-phase, 220V output',price:'₹45,000'},
  {id:3,title:'Split AC 1.5 Ton',specs:'Energy Star, R32 Refrigerant',price:'₹30,000'}
];

const SERVICES = [
  {id:'electrical',title:'Electrical Service',detail:'House wiring, switchboards, troubleshooting.'},
  {id:'generator',title:'Generator Service',detail:'Generator maintenance & overhauls.'},
  {id:'ac',title:'AC Service',detail:'AC servicing, gas top-up, installation.'},
  {id:'fridge',title:'Refrigerator Service',detail:'Repairs & compressor checks.'},
  {id:'carpenter',title:'Carpenter/Carpentry',detail:'Modular kitchen, carpentry works.'},
  {id:'pop',title:'POP Ceiling',detail:'Design & installation for POP ceilings.'},
  {id:'plumber',title:'Plumber',detail:'Water supply & drainage solutions.'},
  {id:'construction',title:'Construction Service',detail:'Small construction and finishing works.'}
];

// ADMIN CREDENTIALS (as requested)
const ADMIN_ID = 'Itszflame';
const ADMIN_PASS = 'Dkyadv22';

// Helpers
function qs(sel,ctx=document){return ctx.querySelector(sel)}
function qsa(sel,ctx=document){return [...ctx.querySelectorAll(sel)]}

// Products storage
function loadProducts(){
  let raw = localStorage.getItem(PRODUCTS_KEY);
  if(!raw) { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS)); return DEFAULT_PRODUCTS; }
  try{return JSON.parse(raw)}catch(e){localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));return DEFAULT_PRODUCTS}
}
function saveProducts(list){ localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list)); renderProducts(); }

// Render functions
function renderProducts(){
  const grid = qs('#products-grid'); grid.innerHTML='';
  const prods = loadProducts();
  prods.forEach(p=>{
    const card = document.createElement('article'); card.className='card';
    card.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center">
        <div style="width:64px;height:64px;border-radius:8px;background:rgba(255,255,255,0.02);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--muted)">IMG</div>
        <div style="flex:1">
          <div class="title">${escapeHtml(p.title)}</div>
          <div class="specs">${escapeHtml(p.specs)}</div>
        </div>
      </div>
      <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center">
        <div class="price">${p.price||''}</div>
        <button class="btn" onclick="addToCart(${p.id})">Enquire</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderServices(){
  const ul = qs('#services-list'); ul.innerHTML='';
  SERVICES.forEach(s=>{
    const li = document.createElement('li'); li.textContent = s.title; li.dataset.id = s.id;
    li.addEventListener('click',()=> showService(s.id));
    ul.appendChild(li);
  });
}

function showService(id){
  const detail = qs('#service-detail');
  const s = SERVICES.find(x=>x.id===id);
  detail.innerHTML = `<h4>${escapeHtml(s.title)}</h4><p>${escapeHtml(s.detail)}</p><button class='btn' onclick="requestQuote('${encodeURIComponent(s.title)}')">Request Quote</button>`;
  window.scrollTo({top:detail.getBoundingClientRect().top + window.scrollY - 100,behavior:'smooth'});
}

window.requestQuote = function(serviceTitleEncoded){
  const title = decodeURIComponent(serviceTitleEncoded);
  alert('Thanks — we will contact you about: '+ title);
}

window.addToCart = function(id){
  const p = loadProducts().find(x=>x.id===id);
  alert('Enquiry sent for: '+p.title+' (demo)');
}

// Admin logic
function openAdmin(){ qs('#admin-panel').classList.toggle('open'); }

function adminLogin(){
  const u = qs('#admin-user').value.trim();
  const p = qs('#admin-pass').value;
  if(u===ADMIN_ID && p===ADMIN_PASS){
    qs('#admin-login').classList.add('hidden');
    qs('#admin-ui').classList.remove('hidden');
    populateAdminProducts();
  } else { alert('Invalid credentials'); }
}

function populateAdminProducts(){
  const container = qs('#admin-products'); container.innerHTML='';
  const prods = loadProducts();
  prods.forEach(prod=>{
    const row = document.createElement('div'); row.className='card'; row.style.marginBottom='8px';
    row.innerHTML = `<strong>${escapeHtml(prod.title)}</strong><div class='specs'>${escapeHtml(prod.specs)}</div>
      <div style='margin-top:8px'>
        <button onclick="editProduct(${prod.id})" class='btn small'>Edit</button>
        <button onclick="deleteProduct(${prod.id})" class='btn ghost small'>Delete</button>
      </div>`;
    container.appendChild(row);
  });
}

window.editProduct = function(id){
  const prods = loadProducts(); const p = prods.find(x=>x.id===id);
  const newTitle = prompt('Title',p.title); if(newTitle==null) return;
  const newSpecs = prompt('Specifications',p.specs); if(newSpecs==null) return;
  const newPrice = prompt('Price',p.price||'')
  p.title=newTitle; p.specs=newSpecs; p.price=newPrice; saveProducts(prods); populateAdminProducts();
}

window.deleteProduct = function(id){
  if(!confirm('Delete this product?')) return;
  let prods = loadProducts(); prods = prods.filter(x=>x.id!==id); saveProducts(prods); populateAdminProducts();
}

function adminAddProduct(){
  const title = prompt('Product title'); if(!title) return; const specs = prompt('Specifications')||''; const price = prompt('Price')||'';
  const prods = loadProducts(); const id = Math.max(0,...prods.map(p=>p.id))+1; prods.push({id,title,specs,price}); saveProducts(prods); populateAdminProducts();
}

function adminLogout(){
  qs('#admin-ui').classList.add('hidden'); qs('#admin-login').classList.remove('hidden');
}

// Contact behaviour & utilities
function setupContactBehavior(){
  const callLink = qs('#call-link');
  const isMobile = /Mobi|Android/i.test(navigator.userAgent) || (typeof window.orientation !== 'undefined');
  if(isMobile){
    callLink.href = 'tel:7011196579';
  } else {
    callLink.removeAttribute('href');
    callLink.addEventListener('click', ()=>{
      navigator.clipboard?.writeText('7011196579');
      alert('Phone number copied: 7011196579');
    });
  }
}

function contactSubmit(e){
  e.preventDefault();
  alert('Thanks! Your message has been recorded (demo).');
  e.target.reset();
}

// Navigation
function showSection(id){
  qsa('.panel').forEach(el=>el.classList.remove('active'));
  qs(id).classList.add('active');
}

function wireUp(){
  renderProducts(); renderServices();
  qs('#btn-products').addEventListener('click', ()=> showSection('#products-section'));
  qs('#btn-services').addEventListener('click', ()=> showSection('#services-section'));
  qs('#btn-contact').addEventListener('click', ()=> showSection('#contact-section'));
  qs('#toggle-glass').addEventListener('click', ()=> document.body.classList.toggle('no-glass'));

  qs('#admin-open').addEventListener('click', ()=> qs('#admin-panel').classList.toggle('open'));
  qs('#admin-close').addEventListener('click', ()=> qs('#admin-panel').classList.remove('open'));
  qs('#admin-login-btn').addEventListener('click', adminLogin);
  qs('#admin-logout').addEventListener('click', adminLogout);
  qs('#admin-add-product').addEventListener('click', adminAddProduct);
  qs('#admin-panel').addEventListener('click', (e)=> e.stopPropagation());
  qs('#contact-form').addEventListener('submit', contactSubmit);

  setupContactBehavior();
}

// Small helper
function escapeHtml(unsafe){
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/\"/g, "&quot;")
       .replace(/'/g, "&#039;");
}

window.addEventListener('DOMContentLoaded', wireUp);
function renderInstallation() {
  const container = document.getElementById("install-list");
  container.innerHTML = "";

  ELECTRICAL_INSTALLATION.forEach(item => {
    container.innerHTML += `
      <div class="card">
        <h4>${item.name}</h4>
        <p>₹${item.price} (${item.unit})</p>

        <input type="number" min="1" value="1" id="qty-${item.name}" style="width:80px;padding:6px;">
        <br><br>
        <button class="btn" onclick="sendInstallWhatsapp('${item.name}', ${item.price})">
          Enquiry
        </button>
      </div>
    `;
  });
}

function sendInstallWhatsapp(name, price) {
  const qty = document.getElementById(`qty-${name}`).value || 1;
  const total = Math.round(price * qty);

  const msg = `Hi,
I am enquiry about installation of ${name}
Quantity: ${qty}
Total Price: ₹${total}

Thanks`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

function repairEnquiry() {
  const msg = `Hi,
I am enquiry about repair.
Visit Charge: ₹${VISIT_CHARGE}
(After inspection product damage will be checked)

Thanks`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}