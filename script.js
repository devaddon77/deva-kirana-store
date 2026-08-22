const products = [
  {id:"chawal", name:"चावल", category:"राशन", emoji:"🍚", price:50, unit:"1 kg"},
  {id:"atta", name:"आटा", category:"राशन", emoji:"🌾", price:45, unit:"1 kg"},
  {id:"dal", name:"दाल", category:"राशन", emoji:"🫘", price:100, unit:"1 kg"},
  {id:"tel", name:"तेल", category:"राशन", emoji:"🫗", price:130, unit:"1 L"},
  {id:"chini", name:"चीनी", category:"राशन", emoji:"🧂", price:50, unit:"1 kg"},
  {id:"namak", name:"नमक", category:"राशन", emoji:"🧂", price:25, unit:"1 kg"},
  {id:"masala", name:"मसाला", category:"राशन", emoji:"🌶️", price:45, unit:"100 g"},

  {id:"aloo", name:"आलू", category:"सब्जी", emoji:"🥔", price:30, unit:"1 kg"},
  {id:"pyaj", name:"प्याज", category:"सब्जी", emoji:"🧅", price:35, unit:"1 kg"},
  {id:"lahsun", name:"लहसुन", category:"सब्जी", emoji:"🧄", price:80, unit:"250 g"},
  {id:"mix-sabji", name:"मिक्स सब्जी", category:"सब्जी", emoji:"🥕", price:45, unit:"1 kg"},

  {id:"biscuit", name:"बिस्कुट", category:"अन्य", emoji:"🍪", price:30, unit:"पैक"},
  {id:"chai", name:"चाय", category:"अन्य", emoji:"🍵", price:80, unit:"पैक"},
  {id:"sabun", name:"साबुन", category:"अन्य", emoji:"🧼", price:35, unit:"पीस"}
];

let category = "सभी";
let cart = [];

const cats = ["सभी", "राशन", "सब्जी", "अन्य"];

document.getElementById("categories").innerHTML =
  cats.map((c, i) =>
    `<button class="${i === 0 ? "active" : ""}"
      onclick="setCategory('${c}',this)">${c}</button>`
  ).join("");

function setCategory(c, el) {
  category = c;

  document.querySelectorAll(".categories button")
    .forEach(b => b.classList.remove("active"));

  el.classList.add("active");
  renderProducts();
}

function productLink(id) {
  return ${window.location.origin}${window.location.pathname}?product=${encodeURIComponent(id)};
}

function renderProducts() {

  const searchBox = document.getElementById("search");
  const q = searchBox ? searchBox.value.toLowerCase().trim() : "";

  const list = products.filter(p =>
    (category === "सभी" || p.category === category) &&
    p.name.toLowerCase().includes(q)
  );

  document.getElementById("productGrid").innerHTML = list.map(p => `

    <div class="product">

      <div class="emoji">${p.emoji}</div>

      <h3>${p.name}</h3>

      <div class="price">
        ₹${p.price}
      </div>

      <div class="unit">
        ${p.unit}
      </div>

      <button onclick="addToCart('${p.id}')">
        कार्ट में जोड़ें
      </button>

      <button onclick="copyProductLink('${p.id}')">
        🔗 लिंक कॉपी करें
      </button>

    </div>

  `).join("");
}

function addToCart(id) {

  const p = products.find(x => x.id === id);

  if (!p) return;

  const item = cart.find(x => x.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      id: p.id,
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
    cart.reduce((total, item) => total + item.qty, 0);

  document.getElementById("cartItems").innerHTML =
    cart.length
      ? cart.map((item, i) => `
          <div class="cart-row">

            <div>
              <b>${item.name}</b><br>
              ₹${item.price} × ${item.qty}
            </div>

            <div class="qty">

              <button onclick="changeQty(${i},-1)">
                −
              </button>

              ${item.qty}

              <button onclick="changeQty(${i},1)">
                +
              </button>

            </div>

          </div>
        `).join("")
      : "<p>कार्ट अभी खाली है।</p>";

  document.getElementById("cartTotal").textContent =
    cart.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
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

function copyProductLink(id) {

  const link = productLink(id);

  navigator.clipboard.writeText(link)
    .then(() => {
      alert("प्रोडक्ट का लिंक कॉपी हो गया।");
    })
    .catch(() => {
      prompt("इस लिंक को कॉपी करें:", link);
    });
}

function openProductFromURL() {

  const params = new URLSearchParams(window.location.search);
  const id = params.get("product");

  if (!id) return;

  const p = products.find(x => x.id === id);

  if (!p) return;

  const grid = document.getElementById("productGrid");

  grid.innerHTML = `

    <div class="product">

      <div class="emoji">${p.emoji}</div>

      <h2>${p.name}</h2>

      <div class="price">
        ₹${p.price}
      </div>

      <div class="unit">
        ${p.unit}
      </div>

      <button onclick="addToCart('${p.id}')">
        कार्ट में जोड़ें
      </button>

    </div>

  `;
}

function placeOrder() {

  if (!cart.length) {
    return alert("कृपया पहले सामान कार्ट में जोड़ें।");
  }

  const n =
    document.getElementById("customerName").value.trim();

  const ph =
    document.getElementById("customerPhone").value.trim();

  const ad =
    document.getElementById("customerAddress").value.trim();

  const pay =
    document.getElementById("payment").value;

  if (!n || !ph || !ad) {
    return alert("कृपया नाम, मोबाइल नंबर और पता भरें।");
  }

  const lines = cart
    .map(item =>
      ${item.name} - ${item.qty} × ₹${item.price}
    )
    .join("\n");

  const total =
    document.getElementById("cartTotal").textContent;

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
openProductFromURL();
