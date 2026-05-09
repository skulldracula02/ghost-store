// app.js - shared logic for Ghost Store
const DELIVERY_FEE = 150; // R150 delivery

// Sample product data (id, name, price in Rands, category, images array)
// Initialize function first
function shoeSVG(color = '#000'){
  return `<svg class="shoe-placeholder" style="background:${color};width:100%;height:150px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;">Shoe</svg>`;
}

const PRODUCTS = [ 
  {id: 's1', name: 'Nike Shox TL', price: 999, category:'sneakers', images: ['images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg']},
  {id: 's2', name:'AIR FORCE 1', price: 950, category:'sneakers', images: ['images/AIR FORCE 1-SIDE.jpeg', 'images/AIR FORCE 1- TOP.jpeg', 'images/AIR FORCE 1- BOTTOM.jpeg']},
  {id: 's3', name: 'NIKE PORTAL', price: 999, category:'casual', images: ['images/NIKE PORTAL- SIDE.jpeg', 'images/NIKE PORTAL- TOP.jpeg', 'images/NIKE PORTAL-BOTTOM.jpeg']},

  {id: 's4', name: 'Nike tempo', price: 950, category:'boots', images: ['images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg']},
  {id: 's5', name: 'Converse Chuck Taylor', price: 950, category:'sneakers', images: ['images/Converse Chuck Taylor-SIDE.jpeg', 'images/Converse Chuck Taylor-TOP.jpeg', 'images/Converse Chuck Taylor-BOTTOM.jpeg']},
  {id: 's6', name: 'Nike dunk', price: 899, category:'sneakers', images: ['images/NIKE DUNK- SIDE.jpeg', 'images/NIKE DUNK- TOP.jpeg', 'images/NIKE DUNK- BOTTOM.jpeg']},
  {id: 's7', name: 'Nike Calm', price: 750, category:'casual', images: ['images/NIKE CALM-SIDE.jpeg', 'images/NIKE CALM-TOP.jpeg', 'images/NIKE CALM-BOTTOM.jpeg']},
  {id: 's8', name: 'Adidas campus', price:899, category:'boots', images: ['images/ADIDAS CAMPUS-SIDE.jpeg', 'images/ADIDAS CAMOUS-TOP.jpeg', 'images/ADIDAS CAMPUS-BOTTOM.jpeg']},
  {id: 's9', name: 'Nike TN', price: 899, category:'sneakers', images: ['images/NIKE TN- SIDE.jpeg', 'images/NIKE TN- TOP.jpeg', 'images/NIKE TN- BOTTOM.jpeg']},
  {id: 's10', name: 'Nike AIR Max AM', price: 999.99, category:'casual', images: ['images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg']},
  {id: 's11', name: 'Nike Runner', price: 899, category:'casual', images: ['images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg']},
  {id: 's12', name: 'Jordan Spizike Low', price: 1099, category:'sneakers', images: ['images/JORDAN SPIZIKE LOW-SIDE.jpeg', 'images/JORDAN SPIZIKE-TOP.jpeg', 'images/JORDAN SPIZIKE-BOTTOM.jpeg']},
  {id: 's13', name: 'Jordan Spizike High', price: 1099, category:'boots', images: ['images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg']},
  {id: 's14', name: 'Nike Jordan 1 Mid', price: 999, category:'sneakers', images: ['images/NIKE JORDAN 1 MID-SIDE.jpeg', 'images/NIKE JORDAN 1 MID-TOP.jpeg', 'images/NIKE JORDAN 1 MID-BOTTOM.jpeg']},
  {id: 's15', name: 'Adidas Superstar', price: 899, category:'casual', images: ['images/ADIDAS SUPERSTAR-SIDE.jpeg', 'images/ADIDAS SUPERSTAR-TOP.jpeg', 'images/ADIDAS SUPERSTAR-BOTTOM.jpeg']},
  {id: 's16', name: 'Adidas Samba', price: 899, category:'sneakers', images: ['images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg', 'images/Nike Shox TL.jpeg']},
  {id: 's17', name: 'Nike Air Max', price: 1099, category:'boots', images: ['images/NIKE AIR MAX-SIDE.jpeg', 'images/NIKE AIR MAX-TOP.jpeg', 'images/NIKE AIR MAX-BOTTOM.jpeg']},
  {id: 's18', name: 'Lacoste Spinor', price: 1099, category:'sneakers', images: ['images/LACOSTE SPINOR-SIDE.jpeg', 'images/LACOSTE SPINOR-TOP.jpeg', 'images/LACOSTE SPINOR-BOTTOM.jpeg']},
  {id: 's19', name: 'Lacoste CourtCage', price: 999, category:'casual', images: ['images/LACOSTE COURTCAGE-SIDE.jpeg', 'images/LACOSTE COURTCAGE-TOP.jpeg', 'images/LACOSTE COURTCAGE-BOTTOM.jpeg']},
  {id: 's20', name: 'Lacoste Clip', price: 999, category:'sneakers', images: ['images/LACOSTE CLIP-SIDE.jpeg', 'images/LACOSTE CLIP-TOP.jpeg', 'images/LACOSTE CLIP-BOTTOM.jpeg']}
];

// Combo special: buy any 2 pairs for this fixed price (applies per pair)
const COMBO_PRICE_FOR_TWO = 1850; // R1850 for any 2 pairs

function shoeSVG(color = '#000'){
  return `<svg class="shoe-placeholder" style="background:${color};width:100%;height:150px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;">Shoe</svg>`;
}


// CART helpers (localStorage)
function getCart(){
  const raw = localStorage.getItem('ghostStoreCart');
  return raw ? JSON.parse(raw) : [];
}
function saveCart(cart){
  localStorage.setItem('ghostStoreCart', JSON.stringify(cart));
}
function addToCart(productId, qty=1){
  const cart = getCart();
  const existing = cart.find(i=>i.id===productId);
  if(existing) existing.qty += qty;
  else cart.push({id:productId, qty});
  saveCart(cart);
}
function updateQty(productId, qty){
  let cart = getCart();
  cart = cart.map(i=> i.id===productId ? {...i, qty: Math.max(0, qty)} : i).filter(i=>i.qty>0);
  saveCart(cart);
}
function clearCart(){ localStorage.removeItem('ghostStoreCart'); }

// calculate totals with combo logic
function calculateTotals(){
  const cart = getCart();
  // expand cart to list of product prices
  let items = [];
  cart.forEach(ci=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    for(let i=0;i<ci.qty;i++) items.push({id:ci.id, price:p.price});
  });
  // sort descending to maximize combo benefit (optional)
  items.sort((a,b)=>b.price-a.price);
  let comboPairs = Math.floor(items.length / 2);
  let comboTotal = comboPairs * COMBO_PRICE_FOR_TWO;
  let remainder = items.length - comboPairs*2;
  // sum remainder highest-priced items after pairing
  let remainderTotal = 0;
  // remove paired items from items list (2*comboPairs)
  const pairedCount = comboPairs*2;
  const remainderItems = items.slice(pairedCount);
  remainderItems.forEach(it=> remainderTotal += it.price);
  const subtotal = comboTotal + remainderTotal;
  const delivery = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;
  return {itemsCount: items.length, subtotal, delivery, total, comboPairs};
}

// helper to get product details by id
function getProduct(id){ return PRODUCTS.find(p=>p.id===id); }

// expose functions for pages
window.GS = {
  PRODUCTS, getCart, saveCart, addToCart, updateQty, clearCart, calculateTotals, getProduct, COMBO_PRICE_FOR_TWO, DELIVERY_FEE
};