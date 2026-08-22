const products=[
{name:"चावल",price:40,unit:"1 kg",cat:"राशन",emoji:"🍚"},
{name:"आटा",price:30,unit:"1 kg",cat:"राशन",emoji:"🌾"},
{name:"दाल",price:60,unit:"1 kg",cat:"राशन",emoji:"🫘"},
{name:"तेल",price:120,unit:"1 L",cat:"राशन",emoji:"🫗"},
{name:"चीनी",price:45,unit:"1 kg",cat:"राशन",emoji:"🧂"},
{name:"नमक",price:25,unit:"1 kg",cat:"राशन",emoji:"🧂"},
{name:"मसाले",price:35,unit:"100 g",cat:"राशन",emoji:"🌶️"},
{name:"आलू",price:30,unit:"1 kg",cat:"फ्रूट/सब्जी",emoji:"🥔"},
{name:"प्याज",price:35,unit:"1 kg",cat:"फ्रूट/सब्जी",emoji:"🧅"},
{name:"लहसुन",price:50,unit:"250 g",cat:"फ्रूट/सब्जी",emoji:"🧄"},
{name:"हरी सब्जियां",price:40,unit:"1 kg",cat:"फ्रूट/सब्जी",emoji:"🥬"},
{name:"अंडे",price:70,unit:"10 pcs",cat:"रोजमर्रा",emoji:"🥚"},
{name:"साबुन",price:35,unit:"1 pcs",cat:"रोजमर्रा",emoji:"🧼"},
{name:"बिस्कुट",price:20,unit:"1 pack",cat:"रोजमर्रा",emoji:"🍪"}
];
let cart={},activeCat="सभी";
const cats=["सभी",...new Set(products.map(p=>p.cat))];
function renderCats(){document.getElementById("categories").innerHTML=cats.map(c=>`<button class="cat ${c===activeCat?"active":""}" onclick="activeCat='${c}';renderCats();renderProducts()">${c}</button>`).join("")}
function renderProducts(){
 const q=document.getElementById("search").value.toLowerCase();
 const list=products.filter(p=>(activeCat==="सभी"||p.cat===activeCat)&&p.name.toLowerCase().includes(q));
 document.getElementById("productsGrid").innerHTML=list.map((p,i)=>`<article class="product"><div class="emoji">${p.emoji}</div><h3>${p.name}</h3><p>${p.cat} • ${p.unit}</p><span class="price">₹${p.price}</span><button class="add" onclick="addToCart(${products.indexOf(p)})">+ Cart में जोड़ें</button></article>`).join("");
}
function addToCart(i){cart[i]=(cart[i]||0)+1;updateCart();openCart()}
function updateCart(){
 let subtotal=0,count=0;
 const rows=Object.entries(cart).filter(([,q])=>q>0).map(([i,q])=>{let p=products[i];subtotal+=p.price*q;count+=q;return `<div class="cart-row"><span>${p.emoji}</span><span class="name">${p.name}<small> × ${q}</small></span><b>₹${p.price*q}</b><span class="qty"><button onclick="changeQty(${i},-1)">−</button><button onclick="changeQty(${i},1)">+</button></span></div>`});
 document.getElementById("cartItems").innerHTML=rows.length?rows.join(""):"<p>Cart अभी खाली है। सामान चुनें।</p>";
 document.getElementById("cartCount").textContent=count;
 document.getElementById("subtotal").textContent="₹"+subtotal;
 const fees=[20,30,40],fee=rows.length?fees[Number(document.getElementById("distance").value)]:0;
 document.getElementById("grandTotal").textContent="₹"+(subtotal+fee);
}
function changeQty(i,n){cart[i]=(cart[i]||0)+n;if(cart[i]<=0)delete cart[i];updateCart()}
function openCart(){document.getElementById("cartModal").classList.add("show");updateCart()}
function closeCart(){document.getElementById("cartModal").classList.remove("show")}
function sendOrder(){
 if(!Object.keys(cart).length){alert("पहले सामान Cart में जोड़ें।");return}
 const name=document.getElementById("customerName").value.trim(),village=document.getElementById("customerVillage").value.trim(),address=document.getElementById("customerAddress").value.trim();
 if(!name||!village||!address){alert("कृपया नाम, गांव/क्षेत्र और पूरा पता भरें।");return}
 const items=Object.entries(cart).map(([i,q])=>`${products[i].name} (${products[i].unit}) x${q}`).join(", ");
 const total=document.getElementById("grandTotal").textContent;
 const msg=`नमस्ते Deva Kirana Store,%0Aमेरा ऑर्डर:%0A${items}%0Aकुल: ${total}%0Aनाम: ${name}%0Aगांव/क्षेत्र: ${village}%0Aपता: ${address}%0Aकृपया ऑर्डर कन्फर्म करें।`;
 window.open(`https://wa.me/919970096337?text=${msg}`,"_blank");
}
renderCats();renderProducts();updateCart();
