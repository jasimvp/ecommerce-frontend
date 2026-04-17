const btn = document.getElementById('hamburgerbtn');
const menu = document.getElementById('mobilemenu');

btn.addEventListener('click',()=> menu.classList.toggle('open'))

//cart counter

let cartCount = 0;
function updateCart(){
    document.getElementById('cart-count').textContent=cartCount;
}

//toast notification

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'),2000)
}

//render star rating
function renderStars(rating){
    const full = Math.round(rating);
    return '★'.repeat(full) + '★'.repeat(5-full);
}

//product card

function createCard(product){
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="card-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy"/>
        </div>
        <div class="card-body">
            <span class="card-category">${product.category}</span>
            <p class="card-title">${product.title}</p>
            <div class="card-rating">
                <span class="stars">${renderStars(product.rating.rate)}</span>
                <span>${product.rating.rate} (${product.rating.count}</span>
            </div>
            <div class="card-footer">
                <span class="card-price">$${product.price.toFixed(2)}</span>
                <button class="btn-cart" data-id="${product.id}"> Add to cart</button>
            </div>
        </div>       
    `;

    //add to cart click

    card.querySelector('.btn-cart').addEventListener('click',function(){
        cartCount++;
        updateCart();
        this.textContent = "Added ✓";
        this.classList.add('added');
        showToast(`"${product.title.slice(0, 30)}..." added to cart`);
        setTimeout(() => {
            this.textContent = "Add to cart";
            this.classList.remove('added')
        }, 1500);
    });

    return card;
}

//Render array of products into grid
function renderProducts(products){
    const grid = document.getElementById('productgrid');
    grid.innerHTML = '';
    if(products.length == 0){
        grid.innerHTML = '<p class="error-msg">No products found.</p>';
        return;
    }
    products.forEach(p => grid.appendChild(createCard(p)));
    document.getElementById('productcount').textContent = products.length + ' products ';
} 

//fetch from fakestore API

let allproducts = [];
async function fetchProducts() {
    try{
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Network error');
        allproducts = await res.json();
        console.log("Data received:", allproducts)
        renderProducts(allproducts);
    }
    catch (err){
        document.getElementById('productgrid').innerHTML = 
        '<p class="error-msg">Could not load products.Please check your internet connection and try again.</p>';
        document.getElementById('productcount').textContent='';
    }
}

//live seaarch filter
document.getElementById('searchinput').addEventListener('input',function(){
    const q = this.ariaValueMax.toLowerCase().trim();
    const filtered = allproducts.filter(p=>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
     );
     renderProducts(filtered);
});

//init
fetchProducts();