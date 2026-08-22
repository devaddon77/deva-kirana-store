const products = [
  {
    name: "चावल",
    category: "राशन",
    emoji: "🍚",
    prices: {
      "250 g": 14,
      "500 g": 28,
      "1 kg": 60
    }
  },

  {
    name: "आटा",
    category: "राशन",
    emoji: "🌾",
    prices: {
      "250 g": 11,
      "500 g": 23,
      "1 kg": 50
    }
  },

  {
    name: "दाल",
    category: "राशन",
    emoji: "🫘",
    prices: {
      "250 g": 25,
      "500 g": 50,
      "1 kg": 100
    }
  },

  {
    name: "तेल",
    category: "राशन",
    emoji: "🫗",
    prices: {
      "250 ml": 33,
      "500 ml": 65,
      "1 L": 130
    }
  },

  {
    name: "चीनी",
    category: "राशन",
    emoji: "🧂",
    prices: {
      "250 g": 13,
      "500 g": 25,
      "1 kg": 50
    }
  },

  {
    name: "नमक",
    category: "राशन",
    emoji: "🧂",
    prices: {
      "250 g": 6,
      "500 g": 13,
      "1 kg": 25
    }
  },

  {
    name: "मसाला",
    category: "राशन",
    emoji: "🌶️",
    prices: {
      "100 g": 45
    }
  },

  {
    name: "आलू",
    category: "सब्जी",
    emoji: "🥔",
    prices: {
      "250 g": 8,
      "500 g": 15,
      "1 kg": 30
    }
  },

  {
    name: "प्याज",
    category: "सब्जी",
    emoji: "🧅",
    prices: {
      "250 g": 9,
      "500 g": 18,
      "1 kg": 35
    }
  },

  {
    name: "लहसुन",
    category: "सब्जी",
    emoji: "🧄",
    prices: {
      "250 g": 80
    }
  },

  {
    name: "मिक्स सब्जी",
    category: "सब्जी",
    emoji: "🥕",
    prices: {
      "250 g": 11,
      "500 g": 23,
      "1 kg": 45
    }
  },

  {
    name: "बिस्कुट",
    category: "अन्य",
    emoji: "🍪",
    prices: {
      "पैक": 30
    }
  },

  {
    name: "चाय",
    category: "अन्य",
    emoji: "🍵",
    prices: {
      "पैक": 80
    }
  },

  {
    name: "साबुन",
    category: "अन्य",
    emoji: "🧼",
    prices: {
      "पीस": 35
    }
  }
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

  document.getElementById("productGrid").innerHTML = list.map((p, index) => {

    const weights = Object.keys(p.prices);

    const options = weights.map(weight =>
      `<option value="${weight}">
        ${weight} - ₹${p.prices[weight]}
      </option>`
    ).join("");

    return `
      <div class="product">

        <div class="emoji">${p.emoji}</div>

        <h3>${p.name}</h3>

        <select id="weight-${index}" class="weight-select">
          ${options}
        </select>

        <div class="price">
          ₹<span id="price-${index}">
            ${p.prices[weights[0]]}
          </span>
        </div>

        <button onclick="addSelectedProduct(${products.indexOf(p)}, ${index})">
          + कार्ट में जोड़ें
        </button>

      </div>
    `;
  }).join("");

  list.forEach((p, index) => {

    const select = document.getElementById(`weight-${index}`);
    const price = document.getElementById(`price-${index}`);

    select.addEventListener("change", function () {
      price.textContent = p.prices[this.value];
    });

  });
}

function addSelectedProduct(productIndex, cardIndex) {

  const product = products[productIndex];

  const select = document.getElementById(`weight-${cardIndex}`);

  const weight = select.value;

  const price = product.prices[weight];

  const existing = cart.find(
    x => x.name === product.name && x.weight === weight
  );

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      name: product.name,
      weight: weight,
      price: price,
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
      ? cart.map((item, index) => `
        <div class="cart-row">

          <div>
            <b>${item.name}</b><br>
            ${item.weight} × ₹${item.price}
          </div>

          <div class="qty">

            <button onclick="changeQty(${index}, -1)">
              −
            </button>

            ${item.qty}

            <button onclick="changeQty(${index}, 1)">
              +
            </button>

          </div>

        </div>
      `).join("")
      : "<p>कार्ट अभी खाली है।</p>";

  const total = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  document.getElementById("cartTotal").textContent = total;
}

function changeQty(index, change) {

  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
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

  const name =
    document.getElementById("customerName").value.trim();

  const phone =
    document.getElementById("customerPhone").value.trim();

  const address =
    document.getElementById("customerAddress").value.trim();

  const payment =
    document.getElementById("payment").value;

  if (!name || !phone || !address) {
    return alert("कृपया नाम, मोबाइल नंबर और पता भरें।");
  }

  const lines = cart.map(item =>
    `${item.name} - ${item.weight} × ${item.qty} = ₹${item.price * item.qty}`
  ).join("\n");

  const total =
    document.getElementById("cartTotal").textContent;

  const message =
`नमस्ते Deva Kirana Store,

मुझे ऑर्डर करना है:

${lines}

कुल: ₹${total}

नाम: ${name}
मोबाइल: ${phone}
पता: ${address}
भुगतान: ${payment}`;

  window.open(
    "https://wa.me/919970096337?text=" +
    encodeURIComponent(message),
    "_blank"
  );
}

renderProducts();
updateCart();
