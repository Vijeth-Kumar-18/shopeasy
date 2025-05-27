document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    const product = products.find(p => p.id == productId);
    
    if (!product) {
        window.location.href = 'products.html';
        return;
    }
    
    // Display product details
    const productDetailsContainer = document.getElementById('product-details');
    productDetailsContainer.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h1>${product.name}</h1>
            <div class="rating">${generateStars(product.rating)}</div>
            <p class="price">₹${product.price.toFixed(2)}</p>
            <p class="description">${product.description}</p>
            
            <div class="quantity-controls">
                <button class="decrease-qty">-</button>
                <input type="number" value="1" min="1" id="product-quantity">
                <button class="increase-qty">+</button>
            </div>
            
            <button class="btn add-to-cart" data-id="${product.id}" style="padding: 1rem; font-size: 1.1rem;">
                Add to Cart
            </button>
        </div>
    `;
    
    // Update breadcrumb
    document.getElementById('product-category-breadcrumb').textContent = 
        product.category.charAt(0).toUpperCase() + product.category.slice(1);
    document.getElementById('product-name-breadcrumb').textContent = product.name;
    
    // Quantity controls
    const quantityInput = document.getElementById('product-quantity');
    document.querySelector('.decrease-qty').addEventListener('click', function() {
        if (quantityInput.value > 1) {
            quantityInput.value--;
        }
    });
    
    document.querySelector('.increase-qty').addEventListener('click', function() {
        quantityInput.value++;
    });
    
    // Add to cart with quantity
    document.querySelector('.add-to-cart').addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        addToCartWithQuantity(productId, quantity);
    });
    
    // Load related products (same category)
    const relatedProducts = products.filter(p => 
        p.category === product.category && p.id != product.id
    ).slice(0, 4);
    
    const relatedContainer = document.getElementById('related-products');
    if (relatedProducts.length > 0) {
        relatedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="rating">${generateStars(product.rating)}</div>
                    <p class="price">₹${product.price.toFixed(2)}</p>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <a href="product-details.html?id=${product.id}" class="btn view-details">View Details</a>
                </div>
            `;
            relatedContainer.appendChild(productCard);
        });
    } else {
        relatedContainer.innerHTML = '<p>No related products found.</p>';
    }
    
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
    
    function addToCartWithQuantity(productId, quantity) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = products.find(p => p.id == productId);
        
        if (!product) return;
        
        const existingItem = cart.find(item => item.id == productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show added to cart notification
        alert(`${quantity} ${product.name}(s) has been added to your cart!`);
    }
});