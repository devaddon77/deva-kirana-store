const products = [
  { name: "चावल", category: "राशन", emoji: "🍚", price: 45, unit: "1 kg" },
  { name: "आटा", category: "राशन", emoji: "🌾", price: 45, unit: "1 kg" },
  { name: "दाल", category: "राशन", emoji: "🫘", price: 100, unit: "1 kg" },
  { name: "तेल", category: "राशन", emoji: "🫗", price: 130, unit: "1 L" },
  { name: "चीनी", category: "राशन", emoji: "🧂", price: 50, unit: "1 kg" },
  { name: "नमक", category: "राशन", emoji: "🧂", price: 25, unit: "1 kg" },
  { name: "मसाला", category: "राशन", emoji: "🌶️", price: 45, unit: "100 g" },

  { name: "आलू", category: "सब्जी", emoji: "🥔", price: 30, unit: "1 kg" },
  { name: "प्याज", category: "सब्जी", emoji: "🧅", price: 35, unit: "1 kg" },
  { name: "लहसुन", category: "सब्जी", emoji: "🧄", price: 80, unit: "250 g" },
  { name: "मिक्स सब्जी", category: "सब्जी", emoji: "🥕", price: 45, unit: "1 kg" },

  { name: "बिस्कुट", category: "अन्य", emoji: "🍪", price: 30, unit: "पैक" },
  { name: "चाय", category: "अन्य", emoji: "🍵", price: 80, unit: "पैक" },
  { name: "साबुन", category: "अन्य", emoji: "🧼", price: 35, unit: "पीस" }
];

let category = "सभी";
let cart = [];

const cats = ["सभी", "राशन", "सब्जी", "अन्य"];

document.getElementById("categories").innerHTML =
  cats.map((c, i) =>
    `<button class="${i === 0 ? "active" : ""}" onclick="setCategory('${c}',this)">${c}</button>`
  ).join("");

function setCategory(c, el) {
  category = c;

  document
    .querySelectorAll(".categories button")
    .forEach(b => b.classList.remove("active"));

  el.classList.add("active");

  renderProducts();
}

function renderProducts() {
  const q = document.getElementById("search").value.toLowerCase();

  const list = products.filter(p =>
    (category === "सभी" || p.category === category) &&
    p.name.toLowerCase().includes(q)
  );

  document.getElementById("productGrid").innerHTML = list.map(p => `
    <div class="product">
      <div class="emoji">${p.emoji}</div>
      <h3>${p.name}</h3>
      <div class="unit">${p.unit}</div>
      <div class="price">₹${p.price}</div>
      <button onclick="addToCart('${p.name}')">+ कार्ट में जोड़ें</button>
    </div>
  `).join("");
}

function addToCart(name) {
  const p = products.find(x => x.name === name);
  const item = cart.find(x => x.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      name: p.name,
      price: p.price,
      qty: 1
    });
  }

  updateCart();
  openCart();
}

function updateCart() {
  document.getElementById("cartCount").textContent =
    cart.reduce((a, x) => a + x.qty, 0);

  document.getElementById("cartItems").innerHTML =
    cart.length
      ? cart.map((x, i) => `
        <div class="cart-row">
          <div>
            <b>${x.name}</b><br>
            ₹${x.price} × ${x.qty}
          </div>

          <div class="qty">
            <button onclick="changeQty(${i},-1)">−</button>
            ${x.qty}
            <button onclick="changeQty(${i},1)">+</button>
          </div>
        </div>
      `).join("")
      : "<p>कार्ट अभी खाली है।</p>";

  document.getElementById("cartTotal").textContent =
    cart.reduce((a, x) => a + x.price * x.qty, 0);
}

function changeQty(i, d) {
  cart[i].qty += d;

  if (cart[i].qty <= 0) {
    cart.splice(i, 1);
  }

  updateCart();
}

function openCart() {
  document.getElementById("cart").classList.add("open");
  document.getElementById("overlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cart").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

function placeOrder() {
  if (!cart.length) {
    return alert("कृपया पहले सामान कार्ट में जोड़ें।");
  }

  const n = document.getElementById("customerName").value.trim();
  const ph = document.getElementById("customerPhone").value.trim();
  const ad = document.getElementById("customerAddress").value.trim();
  const pay = document.getElementById("payment").value;

  if (!n || !ph || !ad) {
    return alert("कृपया नाम, मोबाइल नंबर और पता भरें।");
  }

  const lines = cart
    .map(x => `${x.name} - ${x.qty} × ₹${x.price}`)
    .join("\n");

  const total = document.getElementById("cartTotal").textContent;

  const msg =
`नमस्ते Deva Kirana Store,
मुझे ऑर्डर करना है:

${lines}

कुल: ₹${total}
नाम: ${n}
मोबाइल: ${ph}
पता: ${ad}
भुगतान: ${pay}`;

  window.open(
    "https://wa.me/919970096337?text=" +
    encodeURIComponent(msg),
    "_blank"
  );
}

renderProducts();
updateCart();
