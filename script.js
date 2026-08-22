const products=[
["चावल","राशन","🍚",55,"1 kg"],["आटा","राशन","🌾",45,"1 kg"],["दाल","राशन","🫘",100,"1 kg"],
["तेल","राशन","🫗",130,"1 L"],["चीनी","राशन","🧂",50,"1 kg"],["नमक","राशन","🧂",25,"1 kg"],
["मसाला","राशन","🌶️",45,"100 g"],["आलू","सब्जी","🥔",30,"1 kg"],["प्याज","सब्जी","🧅",35,"1 kg"],
["लहसुन","सब्जी","🧄",80,"250 g"],["मिक्स सब्जी","सब्जी","🥕",45,"1 kg"],["बिस्कुट","अन्य","🍪",30,"पैक"],
["चाय","अन्य","🍵",80,"पैक"],["साबुन","अन्य","🧼",35,"पीस"]
];
let category="सभी",cart=[];
const cats=["सभी","राशन","सब्जी","अन्य"];
document.getElementById("categories").innerHTML=cats.map((c,i)=>`<button class="${i===0?'active':''}" onclick="setCategory('${c}',this)">${c}</button>`).join("");
function setCategory(c,el){category=c;document.querySelectorAll(".categories button").forEach(b=>b.classList.remove("active"));el.classList.add("active");renderProducts()}
function renderProducts(){
 const q=document.getElementById("search").value.toLowerCase();
 const list=products.filter(p=>(category==="सभी"||p[1]===category)&&p[0].toLowerCase().includes(q));
 document.getElementById("productGrid").innerHTML=list.map((p)=>`<div class="product"><div class="emoji">${p[2]}</div><h3>${p[0]}</h3><div class="unit">${p[4]}</div><div class="price">₹${p[3]}</div><button onclick="addToCart('${p[0]}')">+ कार्ट में जोड़ें</button></div>`).join("");
}
function addToCart(name){const p=products.find(x=>x[0]===name),item=cart.find(x=>x[0]===name);item?item[2]++:cart.push([p[0],p[3],1]);updateCart();openCart()}
function updateCart(){
 document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x[2],0);
 document.getElementById("cartItems").innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-row"><div><b>${x[0]}</b><br>₹${x[1]} × ${x[2]}</div><div class="qty"><button onclick="changeQty(${i},-1)">−</button> ${x[2]} <button onclick="changeQty(${i},1)">+</button></div></div>`).join(""):"<p>कार्ट अभी खाली है।</p>";
 document.getElementById("cartTotal").textContent=cart.reduce((a,x)=>a+x[1]*x[2],0);
}
function changeQty(i,d){cart[i][2]+=d;if(cart[i][2]<=0)cart.splice(i,1);updateCart()}
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("open")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
function placeOrder(){
 if(!cart.length)return alert("कृपया पहले सामान कार्ट में जोड़ें।");
 const n=document.getElementById("customerName").value.trim(),ph=document.getElementById("customerPhone").value.trim(),ad=document.getElementById("customerAddress").value.trim(),pay=document.getElementById("payment").value;
 if(!n||!ph||!ad)return alert("कृपया नाम, मोबाइल नंबर और पता भरें।");
 const lines=cart.map(x=>`${x[0]} - ${x[2]} × ₹${x[1]}`).join("\n");
 const total=document.getElementById("cartTotal").textContent;
 const msg=`नमस्ते Deva Kirana Store,\nमुझे ऑर्डर करना है:\n${lines}\nकुल: ₹${total}\nनाम: ${n}\nमोबाइल: ${ph}\nपता: ${ad}\nभुगतान: ${pay}`;
 window.open("https://wa.me/919970096337?text="+encodeURIComponent(msg),"_blank");
}
renderProducts();updateCart();
